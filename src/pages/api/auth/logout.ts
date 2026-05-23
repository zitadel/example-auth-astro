import type { APIRoute } from 'astro';
import { getSession } from '@zitadel/astro-auth/server';
import { buildLogoutUrl } from '../../../lib/auth.ts';
import authConfig from '../../../../auth.config.ts';

// noinspection JSUnusedGlobalSymbols
/**
 * Initiates the logout process by redirecting the user to the external Identity
 * Provider's (IdP) logout endpoint. This endpoint validates that the user has an
 * active session with a valid ID token, generates a cryptographically secure state
 * parameter for CSRF protection, and stores it in a secure HTTP-only cookie.
 *
 * The state parameter will be validated upon the user's return from the IdP to
 * ensure the logout callback is legitimate and not a forged request.
 *
 * @returns A redirect response to the IdP's logout URL on success, or a 400-error
 * response if no valid session exists. The response includes a secure state cookie
 * that will be validated in the logout callback.
 */
export const POST: APIRoute = async ({ request, cookies }) => {
  const session = await getSession(request, authConfig);

  if (!session?.idToken) {
    return new Response(
      JSON.stringify({ error: 'No valid session or ID token found' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
  } else {
    const { url, state } = await buildLogoutUrl(
      session.idToken,
      (key: string) => import.meta.env[key],
    );

    // Set the logout state cookie for CSRF validation in the callback.
    // Using Astro's cookies.set() helper (rather than a manual Set-Cookie
    // header) so the Secure flag is emitted correctly per RFC 6265 §5.2.5
    // — Secure is a flag, not a key=value pair. Manually concatenating
    // `Secure=true/false` causes browsers to treat the cookie as Secure
    // regardless of value and drop it in dev (HTTP).
    cookies.set('logout_state', state, {
      httpOnly: true,
      secure: import.meta.env.PROD,
      sameSite: 'lax',
      path: '/api/auth/logout/callback',
    });

    return new Response(null, {
      status: 302,
      headers: {
        Location: url,
      },
    });
  }
};
