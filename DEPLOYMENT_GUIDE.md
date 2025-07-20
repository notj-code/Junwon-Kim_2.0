# Blog Deployment and Configuration Guide

This guide provides the final steps needed to fully configure your deployed blog on Cloudflare Pages.

## 1. Configure Secrets for GitHub Login

For the GitHub login functionality to work, you must configure three secret environment variables in your Cloudflare project.

### Step 1: Generate a Session Secret

The `SESSION_SECRET` is a random string used to secure user sessions.

1.  Generate a long, random string (at least 32 characters is recommended). You can use a password generator for this.
2.  Keep this secret safe and do not share it publicly.

### Step 2: Create a GitHub OAuth Application

This will give you the client ID and secret needed to authenticate users with their GitHub accounts.

1.  Go to your GitHub **Settings**.
2.  Navigate to **Developer settings** > **OAuth Apps**.
3.  Click **"New OAuth App"**.
4.  Fill in the form with the following details:
    *   **Application name:** You can choose any name, for example: `junwon-kim-blog`.
    *   **Homepage URL:** `https://junwon-kim.pages.dev`
    *   **Authorization callback URL:** `https://junwon-kim.pages.dev/auth/github/callback`
5.  Click **"Register application"**.
6.  On the application page, you will find your **`GITHUB_CLIENT_ID`**.
7.  Click the **"Generate a new client secret"** button to create and reveal your **`GITHUB_CLIENT_SECRET`**. Copy this secret immediately, as you will not be able to see it again.

### Step 3: Add Secrets to Cloudflare Pages

1.  Go to your [Cloudflare Dashboard](https://dash.cloudflare.com).
2.  Select your `junwon-kim` Pages project.
3.  Navigate to **Settings** > **Environment variables**.
4.  Under the **Production** section, click **"Add variable"** for each of the following secrets:

| Variable Name          | Value                                       |
| ---------------------- | ------------------------------------------- |
| `SESSION_SECRET`       | The random string you generated in Step 1.  |
| `GITHUB_CLIENT_ID`     | The Client ID from your GitHub OAuth App.   |
| `GITHUB_CLIENT_SECRET` | The Client Secret from your GitHub OAuth App. |

**Important:** Ensure you check the "Encrypt" option for each secret to keep it secure.

## 2. Redeploy the Application

After you have added these three secrets, you must redeploy your project for the new environment variables to be applied.

You can do this by running the following command from your project directory:

```bash
pnpm run deploy
```

Once the deployment is complete, the login functionality on your blog should work correctly.
