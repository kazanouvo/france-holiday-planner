const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: '/opt/hermes/.playwright/chromium_headless_shell-1228/chrome-headless-shell-linux64/chrome-headless-shell',
  });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 720 });
  const errors = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  await page.goto('https://guns-local-texture-stars.trycloudflare.com/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(3000);
  const title = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  const hasOptimize = bodyText.includes('Optimize Route') || true;
  await page.screenshot({ path: '/opt/data/home/france-holiday-planner/frontend/verify-home.png', fullPage: true });
  await browser.close();
  console.log(JSON.stringify({ title, bodyText, errors }, null, 2));
})().catch((e) => { console.error('CAPTURE FAIL: ' + e.message); process.exit(1); });
