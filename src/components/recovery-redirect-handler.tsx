"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/**
 * Supabase password-recovery links always redirect to the bare Site URL with
 * the session tokens in the URL fragment (not a `?code=`), regardless of the
 * `redirect_to` path we request — so the landing page has to catch that case
 * and hand the user off to /redefinir-senha itself.
 */
export function RecoveryRedirectHandler() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (!hash.includes("access_token") || !hash.includes("type=recovery")) return;

    const params = new URLSearchParams(hash.slice(1));
    const access_token = params.get("access_token");
    const refresh_token = params.get("refresh_token");
    if (!access_token || !refresh_token) return;

    const supabase = createClient();
    supabase.auth.setSession({ access_token, refresh_token }).then(() => {
      router.replace("/redefinir-senha");
    });
  }, [router]);

  return null;
}
