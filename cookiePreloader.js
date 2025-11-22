// cookiePreloader.js
import { loadCookiesFromEnv } from "./cookieHelper.js";

/**
 * Automatically loads multiple cookie secrets into a single Playwright context.
 *
 * @param {BrowserContext} context
 * @param {string[]} envVars - array of env var names to load cookies from
 */
export async function preloadCookies(context, envVars = []) {
  const allCookies = [];

  for (const name of envVars) {
    try {
      const cookies = loadCookiesFromEnv(name);

      // Append all cookies from this secret
      allCookies.push(...cookies);

      console.log(`✓ Preloaded ${cookies.length} cookies from ${name}`);
    } catch (err) {
      console.warn(`⚠️ Skipped cookie secret "${name}": ${err.message}`);
    }
  }

  if (allCookies.length === 0) {
    console.warn("⚠️ No cookies loaded into context.");
    return;
  }

  await context.addCookies(allCookies);
  console.log(`🔥 Loaded total ${allCookies.length} cookies into context.`);
}
