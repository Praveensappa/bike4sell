const fs = require('fs');
const path = require('path');

async function takeFailureScreenshot(page, title) {
  const dir = path.join(process.cwd(), 'artifacts');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const safe = title.replace(/[^a-z0-9]+/gi, '_').toLowerCase();
  await page.screenshot({ path: path.join(dir, safe + '.png'), fullPage: true });
}

module.exports = { takeFailureScreenshot };
