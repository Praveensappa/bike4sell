class HomePage {
  constructor(page) { this.page = page; }
  async goto() { await this.page.goto('/'); }
  async filterBrand(brand) {
    await this.page.getByPlaceholder('Brand').fill(brand);
  }
  async openFirstBike() {
    await this.page.locator('.card').first().click();
  }
}
module.exports = { HomePage };
