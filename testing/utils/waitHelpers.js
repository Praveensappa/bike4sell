async function waitForPageReady(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(300);
}

module.exports = { waitForPageReady };
