const base = require('@playwright/test');
const { takeFailureScreenshot } = require('../utils/screenshot');

exports.test = base.test.extend({});
exports.expect = base.expect;

base.test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await takeFailureScreenshot(page, testInfo.title);
  }
});
