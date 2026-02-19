import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import RootLayout from "./RootLayout";

const Auth = () => {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth) {
      router.replace("/profile"); // This performs a navigation without adding a new URL entry in the history stack
    }
  }, [auth, router]);

  return <RootLayout />;
};

export default Auth;
