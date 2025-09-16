"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";

export default function Page() {
  const data = useQuery(api.users.getMany);

  return (
    <>
      <Authenticated>
        <div className="flex items-center justify-center min-h-svh">
          <div className="flex flex-col items-center justify-center gap-4">
            <UserButton />
            <h1 className="text-2xl font-bold">Hello apps/web</h1>
            {JSON.stringify(data, null, 2)}
          </div>
        </div>
      </Authenticated>
      <Unauthenticated>
        <p>Not signed in!</p>
        <SignInButton />
      </Unauthenticated>
    </>
  );
}
