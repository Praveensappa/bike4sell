class CartPage {
  constructor(page) { this.page = page; }
  async goto() { await this.page.goto('/cart'); }
  async proceedToCheckout() {
    await this.page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  }
}
module.exports = { CartPage };
