"use client";

import { postData, setAuthToken } from "@/utils/api/api";

type GoogleUser = {
  email: string;
  name: string;
  picture?: string;
};

export const googleLogin = async (googleUser: GoogleUser) => {
  const res = await postData<{
    token: string;
    user: any;
  }>("/auth/google", googleUser);

  // ✅ save JWT
  localStorage.setItem("token", res.token);
  setAuthToken(res.token);

  return res.user;
};
