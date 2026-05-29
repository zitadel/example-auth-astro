import { defineConfig } from '@zitadel/astro-auth';
import { createAuthOptions } from './src/lib/auth.js';

// noinspection JSUnusedGlobalSymbols
// Wrap with defineConfig so the SDK fills in prefix/basePath/trustHost
// defaults — matches how the other 7 examples rely on their SDK's
// implicit defaults instead of restating them in the auth config.
export default defineConfig(createAuthOptions());
