import { ForgotPasswordForm } from "./ForgotPasswordForm";

export const ForgotPasswordPage = () => (
  <div className="flex flex-col gap-6">
    <div className="text-center">
      <h1 className="text-2xl font-bold text-text-primary">Forgot password?</h1>
      <p className="mt-1 text-sm text-text-muted">
        No worries, we&apos;ll send you reset instructions
      </p>
    </div>
    <ForgotPasswordForm />
  </div>
);
