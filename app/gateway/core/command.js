import { PaymentStates, canTransition } from "./stateMachine";

export function authorizePayment(payment) {
  if (!canTransition(payment.status, PaymentStates.AUTHORIZED)) {
    throw new Error("Invalid state transition");
  }

  return {
    ...payment,
    status: PaymentStates.AUTHORIZED,
    created_at: new Date().toISOString()
  };
}

export function capturePayment(payment) {
  if (!canTransition(payment.status, PaymentStates.CAPTURED)) {
    throw new Error("Invalid state transition");
  }

  return {
    ...payment,
    status: PaymentStates.CAPTURED,
    created_at: new Date().toISOString()
  };
}

