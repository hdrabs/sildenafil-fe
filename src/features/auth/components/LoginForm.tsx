"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { loginSchema, LoginFormValues } from "../schemas/loginSchema";
import { useLoginUser } from "../hooks/useLoginUser";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";

export const LoginForm = () => {
  const { login, isPending } = useLoginUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(login)} className="flex flex-col gap-4">
      <Input
        label="Email or Phone Number"
        type="text"
        autoComplete="username"
        placeholder="you@example.com or 3175082237"
        error={errors.identifier?.message}
        {...register("identifier")}
      />
      <div className="flex flex-col gap-1">
        <Input
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Link
          href={ROUTES.FORGOT_PASSWORD}
          className="self-end text-xs text-text-link hover:underline"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" loading={isPending} fullWidth>
        Sign in
      </Button>
      <p className="text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.SIGNUP} className="text-text-link hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
};
