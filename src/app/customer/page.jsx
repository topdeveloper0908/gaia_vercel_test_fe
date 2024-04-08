"use client";
import Dashboard from "@/components/Dashboard";
import React, { Suspense } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

export default function Customer() {
  // const searchParams = useSearchParams();
  // const token = searchParams.get("token");

  // if (token) {
  //   Cookies.set("token", token);
  // }
  return <Dashboard isCustomer />;
}
