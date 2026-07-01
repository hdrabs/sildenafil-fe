"use client";

import { use } from "react";
import { MagicLinkPage } from "@/features/auth/components/MagicLinkPage";

const MagicLinkRoute = ({ params }: { params: Promise<{ token: string }> }) => {
  const { token } = use(params);
  return <MagicLinkPage token={token} />;
};

export default MagicLinkRoute;
