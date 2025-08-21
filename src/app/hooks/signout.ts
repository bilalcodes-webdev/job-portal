"use client";

import { toast } from "sonner";
import { signOut } from "next-auth/react"; // ya "./auth" agar wrapper banaya hai
import { useRouter } from "next/navigation";

export function useLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully ✅");
    router.push("/login"); // client-side navigation
  };

  return { handleLogout };
}
