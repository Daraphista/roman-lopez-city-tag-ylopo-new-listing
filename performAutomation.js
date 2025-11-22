import { loadCookiesFromEnv } from "./cookieHelper.js";
import { preloadCookies } from "./cookiePreloader.js";
import Steel from "steel-sdk";
import { chromium } from "playwright";
import { steelConfig } from "./steelConfig.js";

export async function performAutomation({ url }) {
  const STEEL_API_KEY = process.env.STEEL_API_KEY;
  if (!STEEL_API_KEY) throw new Error("Missing STEEL_API_KEY");

  // Create Steel session
  const client = new Steel({ steelAPIKey: STEEL_API_KEY });
  const session = await client.sessions.create({ config: steelConfig });

  const wsUrl = session.websocketUrl.includes("apiKey=")
    ? session.websocketUrl
    : `${session.websocketUrl}&apiKey=${encodeURIComponent(STEEL_API_KEY)}`;

  const browser = await chromium.connectOverCDP(wsUrl);

  // Create ONE unified context
  const context = await browser.newContext();

  // 🚀 Load ALL cookies into this context, uncomment needed cookies and comment unneeded cookies
  await preloadCookies(context, [
    // "FOLLOWUPBOSS_LOGIN_COOKIE",
    "YLOPO_LOGIN_COOKIE",
    // "ZILLOW_LOGIN_COOKIE"
  ]);

  // You're logged into all sites instantly
  const page = await context.newPage();
  
  await page.goto("https://example.com/");
  
  await page.waitForTimeout(2000);

  // Example: get page title
  const title = await page.title();

  await page.waitForTimeout(2000);

  await browser.close();
  await client.sessions.release(session.id);

  return { done: true, pageTitle: title };
}
