"use client";

import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import instance from "@/lib/axios-instance";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }) {
  const router = useRouter();

  const [user, setUser] = useState(null);

  const getMe = async () => {
    try {
      const {
        data: { user },
      } = await instance.post("/auth/me");

      setUser(user);
    } catch (error) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  return (
    <>
      <Header user={user} />
      <div className="flex">
        <Sidebar />
        <main className="w-full mt-16 p-4 md:p-8 pt-6">{children}</main>
      </div>
    </>
  );
}
