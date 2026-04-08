import type { APIRoute } from 'astro';
import { parse } from 'cookie';

// noinspection JSUnusedGlobalSymbols
/**
 * Handles the callback from an external Identity Provider (IdP) after a user
 * signs out. This endpoint is responsible for validating the logout request to
 * prevent Cross-Site Request Forgery (CSRF) attacks by comparing a `state`
 * parameter from the URL with a value stored in a secure, server-side cookie.
 * If validation is successful, it clears the user's session cookies and
 * redirects to a success page. Otherwise, it redirects to an error page.
 *
 * @param cookies - The Astro cookies API used to delete the session cookies.
 * @param request - The incoming Astro request object, used to read the
 * incoming `Cookie` header.
 * @param url - The URL object containing search parameters, including the
 * `state` from the IdP.
 * @returns A redirect response that either redirects the user to a success
 * or error page. Upon success, it includes headers to delete session cookies.
 */
export const GET: APIRoute = async ({ cookies, request, url }) => {
  const state = url.searchParams.get('state');
  const logoutStateCookie = cookies.get('logout_state')?.value;

  if (state && logoutStateCookie && state === logoutStateCookie) {
    const successUrl = new URL('/logout/success', request.url);
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: successUrl.toString(),
        'Clear-Site-Data': '"cookies"',
      },
    });
    const cookieHeader = request.headers.get('cookie') ?? '';
    for (const name of Object.keys(parse(cookieHeader))) {
      if (name.includes('authjs.')) {
        cookies.delete(name, { path: '/' });
      }
    }
    cookies.delete('logout_state', { path: '/api/auth/logout/callback' });
    return response;
  } else {
    const errorUrl = new URL('/logout/error', request.url);
    errorUrl.searchParams.set('reason', 'Invalid or missing state parameter.');
    return new Response(null, {
      status: 302,
      headers: {
        Location: errorUrl.toString(),
      },
    });
  }
};
