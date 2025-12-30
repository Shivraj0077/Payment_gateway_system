import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(req) {
  try {
    const { charge_id, customer_name} = await req.json();

    if (!charge_id || !customer_name) {
      return NextResponse.json(
        { error: 'charge_id and customer_name required' },
        { status: 400 }
      );
    }

    const { data: charge, error: chargeError } = await supabaseServer
      .from('gateway_charges')
      .select('*')
      .eq('id', charge_id)
      .single();

    if (chargeError || !charge) {
      return NextResponse.json({ error: 'Charge not found'},{ status: 404});
    }

    if (charge.customer_name !== customer_name) {
      return NextResponse.json(
        { error: 'Customer name not found'},
        { status: 403 }
      );
    }

    if (!['captured'].includes(charge.status)) {
      return NextResponse.json(
        { error: 'Charge not refundable' },
        { status: 400 }
      );
    }

    const refundId = randomUUID();
    const eventId = randomUUID();

    const { error: refundError } = await supabaseServer
      .from('refunds')
      .insert({
        id: refundId,
        charge_id: charge.id,
        order_id: charge.order_id,
        customer_name,
        amount: charge.amount,
        currency: charge.currency,
        status: 'processed',
        processed_at: new Date()
      });

    if (refundError) {
      console.error(refundError);
      return NextResponse.json(
        { error: 'Failed to create refund' },
        { status: 500 }
      );
    }

    //here we are putting money to customer's account from merchant_escrow or merchant bank based on status
    const ledgerEntries = [
      {
        event_id: eventId,
        aggregate_id: refundId,
        aggregate_type: 'refund',
        account_type: 'customer',
        account_ref: customer_name,
        debit: 0,
        credit: charge.amount,
        currency: charge.currency,
        description: 'Refund to customer'
      },
      // we take merchant's full money and give it to user
      //also merchant's balance will be store as "(-platform fees)" because platform fees are non refundable
      /*  Customer   = 0
          Merchant   = 97 - 100 = -3
          Platform   = +3
      */
     //when new payment is done platform will deduct the extra money which is in minus for merchant and then pay rest money to them
     //platform doesnt increase just merchant balance increases from minus to possibly positive
      {
        event_id: eventId,
        aggregate_id: refundId,
        aggregate_type: 'refund',
        account_type: 'merchant',
        account_ref: 'MERCHANT',
        debit: charge.amount,
        credit: 0,
        currency: charge.currency,
        description: 'Refund debited from merchant'
      }
    ];

    const { error: ledgerError } = await supabaseServer
      .from('ledger_entries')
      .insert(ledgerEntries);

    if (ledgerError) {
      console.error(ledgerError);
      return NextResponse.json(
        { error: 'Ledger write failed' },
        { status: 500 }
      );
    }

    await supabaseServer
      .from('gateway_charges')
      .update({ status: 'refunded' })
      .eq('id', charge_id);

    await supabaseServer.from('events').insert({
      id: eventId,
      aggregate_id: refundId,
      aggregate_type: 'refund',
      event_type: 'refund.processed',
      event_data: {
        charge_id,
        amount: charge.amount,
        customer_name
      }
    });

    return NextResponse.json({
      success: true,
      refund_id: refundId,
      message: 'Refund processed successfully'
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}


//to see merchant balance we can use this query and check how much money deducted as platform fees in transaction/refund 
/*
SELECT COALESCE(SUM(credit - debit), 0) AS merchant_balance
FROM ledger_entries
WHERE account_type = 'merchant'
  AND account_ref = 'MERCHANT';
*/