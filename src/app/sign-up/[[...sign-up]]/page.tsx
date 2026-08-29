"use client";

import { useEffect } from "react";
import { useAuth, SignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/dashboard");
    }
  }, [isSignedIn, router]);

  if (isSignedIn) return null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <SignUp />
    </div>
  );
}
