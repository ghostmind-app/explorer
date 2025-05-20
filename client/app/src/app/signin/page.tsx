"use client";

import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import SignInPage from "./login";

export default function Login() {
  const { data: session } = useSession();

  if (session && session.user) {
    redirect("/");
  }

  function signInRequest() {
    signIn("google", { callbackUrl: "/" });
  }

  return (
    <>
      {!session?.user && session !== undefined && (
        <div>
          <SignInPage onSignIn={signInRequest} />
        </div>
      )}
    </>
  );
}
