export interface CheckoutNavLink {
  step: string;
  path: string;
}

export type CheckoutStepStatus = "complete" | "current" | "upcoming";

export interface CheckoutNavStep {
  step: string;
  label: string;
  path: string;
  status: CheckoutStepStatus;
}

export interface CheckoutNavigation {
  current_step: string;
  previous: CheckoutNavLink | null;
  next: CheckoutNavLink | null;
  furthest_step: string;
  steps: CheckoutNavStep[];
}

export interface CheckoutNavigationParams {
  step: string;
  cart_id: number;
  cart_token?: string;
}
