"use client";

import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import instance from "@/lib/axios-instance";
import { useRouter } from "next/navigation";

export default function AuthenticationPage() {
  const { toast } = useToast();

  const [registerData, setRegisterData] = useState({
    email: "",
    name: "",
    password: "",
    code: "",
  });

  const router = useRouter();

  const handleChange = (value, type) => {
    setRegisterData({ ...registerData, [type]: value });
  };

  const handleRegister = async () => {
    try {
      const { data } = await instance.post("/auth/register", registerData);
      toast({
        title: "Success!",
        description: "You have successfully registered!",
      });

      router.push("/");
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.response.data.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <Link
        href="/examples/authentication"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "absolute right-4 hidden top-4 md:right-8 md:top-8"
        )}
      >
        Login
      </Link>
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          Logo
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Create an account
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email below to create your account
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                value={registerData.email}
                onChange={(e) => handleChange(e.target.value, "email")}
                id="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input
                value={registerData.name}
                onChange={(e) => handleChange(e.target.value, "name")}
                id="name"
                placeholder="Enter your name"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                value={registerData.password}
                onChange={(e) => handleChange(e.target.value, "password")}
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="code">Code</Label>
              <Input
                value={registerData.code}
                onChange={(e) => handleChange(e.target.value, "code")}
                id="code"
                placeholder="Enter Invitation Code"
              />
            </div>

            <Button onClick={handleRegister}>Register</Button>
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary text-xs text-muted-foreground text-center"
            >
              I have an account
            </Link>
          </div>

          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
