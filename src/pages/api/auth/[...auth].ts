import Auth from 'auth-astro';
import { authOptions } from '../../../lib/auth.ts';

export const { GET, POST } = Auth(authOptions);
