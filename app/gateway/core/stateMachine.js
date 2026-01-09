export const PaymentStates = {
    CREATED: "created",
    AUTHORIZED: "authorized",
    CAPTURED: "captured",
    FAILED: "failed"
  };
  
  const transitions = {
    created: ["authorized", "failed"],
    authorized: ["captured"],
    captured: [],
    failed: []
  };
  
  export function canTransition(from, to) {
    return transitions[from]?.includes(to);
  }
  