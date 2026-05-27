declare module '@auth/core/types' {
  // eslint-disable-next-line
  interface Session {
    idToken?: string;
    accessToken?: string;
    error?: string;
  }
}

declare module '@auth/core/jwt' {
  // eslint-disable-next-line
  interface JWT {
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: number;
    error?: string;
  }
}

// Astro's astro/client.d.ts already declares ImportMetaEnv with the
// correct shape (PROD/DEV typed as boolean, BASE_URL as string, etc.).
// Redefining it here as a permissive string-indexed map would erase
// those types and break code that depends on the boolean shape of PROD
// (e.g. cookies.set({ secure: import.meta.env.PROD })).
