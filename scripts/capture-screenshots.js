import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = 'C:/Users/wondr/AppData/Local/hermes/tools/chromium-1208/chrome-win64/chrome.exe';
const OUTPUT_DIR = path.resolve('docs/screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser at:', CHROME_PATH);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: { width: 1440, height: 900, deviceScaleFactor: 2 },
  });

  const page = await browser.newPage();

  // 1. Full Workspace Overview
  console.log('Navigating to http://localhost:3000...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

  // If tour modal opened automatically, close it for the clean workspace screenshot
  const closeBtn = await page.$('button[title*="Tutup"], button[title*="Lewati"]');
  if (closeBtn) {
    await page.evaluate(() => {
      localStorage.setItem('ai_handwriting_studio_tour_seen', 'true');
    });
    await closeBtn.click();
    await new Promise((r) => setTimeout(r, 600));
  }

  // Wait for canvas to draw
  await page.waitForSelector('canvas');
  await new Promise((r) => setTimeout(r, 1200));

  console.log('Capturing 01-workspace-overview.png...');
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01-workspace-overview.png') });

  // 2. Editor & Multi-Pen Toolbar
  console.log('Capturing 02-editor-tools.png...');
  const editorPane = await page.$('div.w-\\[380px\\], div.w-\\[440px\\]');
  if (editorPane) {
    await editorPane.screenshot({ path: path.join(OUTPUT_DIR, '02-editor-tools.png') });
  }

  // 3. Quick Paper Selection & Canvas
  console.log('Capturing 03-paper-preview.png...');
  // Click on "Double Folio" or "Buku SIDU"
  const paperBtns = await page.$$('div.bg-slate-50.border-b button');
  if (paperBtns.length > 2) {
    await paperBtns[1].click(); // Click Double Folio
    await new Promise((r) => setTimeout(r, 600));
  }
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03-paper-preview.png') });

  // 4. Quick Tour Modal
  console.log('Capturing 04-quick-tour.png...');
  const tourNavBtn = await page.$('button[title*="Panduan"]');
  if (tourNavBtn) {
    await tourNavBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '04-quick-tour.png') });
    // Close tour
    const tourClose = await page.$('button[title*="Tutup"]');
    if (tourClose) await tourClose.click();
    await new Promise((r) => setTimeout(r, 500));
  }

  // 5. AI Assistant Modal
  console.log('Capturing 05-ai-assistant.png...');
  const aiBtn = await page.$('header button:nth-child(3)');
  if (aiBtn) {
    await aiBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '05-ai-assistant.png') });
    // Close AI modal
    const aiClose = await page.$('div.fixed.inset-0 button');
    if (aiClose) await aiClose.click();
    await new Promise((r) => setTimeout(r, 500));
  }

  // 6. Export Modal
  console.log('Capturing 06-export-modal.png...');
  const exportBtn = await page.$('header button:last-child');
  if (exportBtn) {
    await exportBtn.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '06-export-modal.png') });
    // Close export modal
    const exportClose = await page.$('div.fixed.inset-0 button');
    if (exportClose) await exportClose.click();
    await new Promise((r) => setTimeout(r, 500));
  }

  // 7. Two-page spread (Buku Terbuka)
  console.log('Capturing 07-two-page-spread.png...');
  const doubleBtn = await page.$('button[title*="Dua Halaman"]');
  if (doubleBtn) {
    await doubleBtn.click();
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '07-two-page-spread.png') });
  }

  // 8. Mobile Viewport Responsive (iPhone 375x667)
  console.log('Capturing 08-mobile-responsive.png...');
  await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2 });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const mobileClose = await page.$('button[title*="Tutup"], button[title*="Lewati"]');
  if (mobileClose) await mobileClose.click();
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '08-mobile-responsive.png') });

  // 9. Mobile Preview Tab
  console.log('Capturing 09-mobile-preview.png...');
  const mobilePreviewTab = await page.$('div.lg\\:hidden button:nth-child(2)');
  if (mobilePreviewTab) {
    await mobilePreviewTab.click();
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(OUTPUT_DIR, '09-mobile-preview.png') });
  }

  await browser.close();
  console.log('Screenshots capture complete!');
}

capture().catch((err) => {
  console.error('Capture failed:', err);
  process.exit(1);
});
