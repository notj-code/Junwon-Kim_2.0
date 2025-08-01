export interface Env {
  __STATIC_CONTENT: KVNamespace<string>;
  __KV_SESSIONS: KVNamespace;
  SITE_CONFIGS: KVNamespace;

  SITE_HOST: string;
  STRAPI_API_URL: string;
  SESSION_SECRET: string;
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}
