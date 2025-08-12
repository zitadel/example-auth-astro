import { AstroAuth } from 'auth-astro/server';
import { authOptions } from '../../../lib/auth.ts';

// noinspection JSUnusedGlobalSymbols
export const prerender = false;

// noinspection JSUnusedGlobalSymbols
export const { GET, POST } = AstroAuth(authOptions);
