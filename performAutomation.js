import { loadCookiesFromEnv } from "./cookieHelper.js";
import { preloadCookies } from "./cookiePreloader.js";
import Steel from "steel-sdk";
import { chromium } from "playwright";
import { steelConfig } from "./steelConfig.js";

export async function performAutomation({ url, propertyValue, city }) {
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
    //"FOLLOWUPBOSS_LOGIN_COOKIE",
    "YLOPO_LOGIN_COOKIE"
    // "ZILLOW_LOGIN_COOKIE"
  ]);

  // You're logged into all sites instantly
  const page = await context.newPage();
  
  await page.goto(`${url}/saved-search/`, { waitUntil: 'networkidle' });

  await page.getByRole('textbox', { name: 'Label' }).fill('Form Submission');

  await page.getByRole('textbox', { name: 'Enter Neighborhood, City,' }).fill(city);
  await page.getByRole('heading', { name: 'CITY' }).waitFor({ state: 'visible' });

  const firstLocation = page.locator('.grouped-location-autocomplete-suggestion').first();
  await firstLocation.click();

  const propertyValueCalculated = propertyValue / 1000 + 50;
  const propertyValueFormatted = propertyValueCalculated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const minPropertyValueCalculated = propertyValue / 1000 - 50;
  const minPropertyValueFormatted = minPropertyValueCalculated.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  await page.getByRole('textbox', { name: 'Price Min' }).fill(minPropertyValueFormatted);

  await page.getByRole('textbox', { name: 'Price Max' }).fill(propertyValueFormatted);

  await page.getByRole('button', { name: 'Submit and Save' }).click();

  await page.waitForURL((currentUrl) => currentUrl.href !== url, {
    timeout: 30000
  });

  await browser.close();
  await client.sessions.release(session.id);

  return { done: true };
}
