"use client";

import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AuthenticatedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // Function to check if the token has expired
  const isTokenExpired = () => {
    const token = localStorage.getItem("token");
    if (!token) return true;

    try {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      if (!decodedToken || !decodedToken.exp) return true; // Check for decodedToken or its expiration time
      const expirationTime = decodedToken.exp * 1000;
      const currentTime = Date.now();
      return currentTime > expirationTime;
    } catch (error) {
      console.error("Error decoding or parsing token:", error);
      return true; // Handle error gracefully, consider token as expired
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    const tokenExpired = isTokenExpired();

    if (!token && tokenExpired) {
      router.push("/login");
    }
  }, [router]);

  return <>{children}</>;
};

export default AuthenticatedRoute;
