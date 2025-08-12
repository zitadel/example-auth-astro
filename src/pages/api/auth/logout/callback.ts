import type { APIRoute } from 'astro';

// noinspection JSUnusedGlobalSymbols
/**
 * Handles the callback from an external Identity Provider (IdP) after a user
 * signs out. This endpoint is responsible for validating the logout request to
 * prevent Cross-Site Request Forgery (CSRF) attacks by comparing a `state`
 * parameter from the URL with a value stored in a secure, server-side cookie.
 * If validation is successful, it clears the user's session cookies and
 * redirects to a success page. Otherwise, it redirects to an error page.
 *
 * @param request - The incoming Astro request object, which contains the
 * headers and cookies for validation.
 * @param url - The URL object containing search parameters, including the `state` from the IdP.
 * @returns A Response object that either redirects the user to a success
 * or error page. Upon success, it includes headers to delete session cookies.
 */
export const GET: APIRoute = async ({ request, url }) => {
  const state = url.searchParams.get('state');
  const cookieHeader = request.headers.get('cookie');

  let logoutStateCookie: string | undefined;
  if (cookieHeader) {
    const cookies = cookieHeader
      .split(';')
      .map((cookie) => cookie.trim().split('='));
    const logoutStateEntry = cookies.find(([name]) => name === 'logout_state');
    logoutStateCookie = logoutStateEntry ? logoutStateEntry[1] : undefined;
  }

  if (state && logoutStateCookie && state === logoutStateCookie) {
    const successUrl = new URL('/logout/success', request.url);
    const response = new Response(null, {
      status: 302,
      headers: {
        Location: successUrl.toString(),
      },
    });

    response.headers.set('Clear-Site-Data', '"cookies"');
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
