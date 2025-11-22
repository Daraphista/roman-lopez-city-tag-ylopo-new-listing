// cookieHelper.js

/**
 * Normalize cookies from any format into a Playwright-ready array.
 *
 * Accepts:
 * - [{...}, {...}]
 * - { cookies: [...] }
 * - { data: [...] }
 * - { anything: [...] }
 */

export function loadCookiesFromEnv(envName) {
  const raw = process.env[envName];

  if (!raw) {
    throw new Error(
      `Missing cookie environment variable: ${envName}. Make sure it is set in Cloud Run → Variables & Secrets.`
    );
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(
      `Cookie secret "${envName}" contains invalid JSON. Error: ${err.message}`
    );
  }

  const cookies = Array.isArray(parsed)
    ? parsed
    : parsed.cookies || parsed.data || Object.values(parsed)[0];

  if (!cookies || !Array.isArray(cookies)) {
    throw new Error(
      `Cookie secret "${envName}" did not normalize into an array. Expected format: JSON array or { cookies: [...] }.`
    );
  }

  console.log(`Loaded ${cookies.length} cookies from ${envName}`);
  return cookies;
}
