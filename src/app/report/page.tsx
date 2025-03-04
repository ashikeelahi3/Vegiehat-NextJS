"use client";

import { useUser } from "@clerk/nextjs";

export default function Report() {
  const { user, isLoaded } = useUser();
  
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view this page</div>;
  }

  const userEmail = user.primaryEmailAddress?.emailAddress;

  return (
    <div>
      <h1>Report Page</h1>
      <p>Email: {userEmail}</p>
    </div>
  );
}