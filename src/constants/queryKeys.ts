export const userKeys = {
  all: ["users"] as const,
  current: () => [...userKeys.all, "current"] as const,
};

export const cartKeys = {
  all: ["carts"] as const,
  list: (params?: unknown) => [...cartKeys.all, "list", params] as const,
  detail: (id: number) => [...cartKeys.all, "detail", id] as const,
  eligibility: () => [...cartKeys.all, "eligibility"] as const,
};

export const orderKeys = {
  all: ["orders"] as const,
  list: (params?: unknown) => [...orderKeys.all, "list", params] as const,
  detail: (id: number) => [...orderKeys.all, "detail", id] as const,
};

export const prescriptionKeys = {
  all: ["prescriptions"] as const,
  list: () => [...prescriptionKeys.all, "list"] as const,
};

export const paymentKeys = {
  all: ["payments"] as const,
};

export const shippingAddressKeys = {
  all:  ["shippingAddresses"] as const,
  list: () => [...shippingAddressKeys.all, "list"] as const,
};

export const creditCardKeys = {
  all:  ["creditCards"] as const,
  list: () => [...creditCardKeys.all, "list"] as const,
};

export const catalogKeys = {
  all: ["catalog"] as const,
  list: (params?: unknown) => [...catalogKeys.all, "list", params] as const,
};
