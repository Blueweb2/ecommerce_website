// "use client";

// import { useEffect } from "react";
// import api from "@/lib/api/axios";
// import { useAuthStore } from "@/store/auth/useAuthStore";

// export const useAuthInit = () => {
//   const { setUser, setLoading } = useAuthStore();

//   useEffect(() => {
//     const init = async () => {
//       const token = localStorage.getItem("accessToken");

//       // ❌ No token → skip API
//       if (!token) {
//         setUser(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         const res = await api.get("/auth/me");
//         setUser(res.data.user);
//       } catch {
//         setUser(null);
//       } finally {
//         setLoading(false);
//       }
//     };

//     init();
//   }, [setUser, setLoading]);
// };

"use client";

import { useEffect } from "react";
import api from "@/lib/api/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { setAccessToken } from "@/lib/auth";

export const useAuthInit = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);

        // 🔥 1. Always try refresh
        const res = await api.post("/auth/refresh-token");

        const accessToken = res.data.accessToken;

        setAccessToken(accessToken);

        // 🔥 2. Fetch user
        const userRes = await api.get("/auth/me");

        setUser(userRes.data.user);

      } catch (error) {
        console.log("❌ No valid session");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [setUser, setLoading]);
};