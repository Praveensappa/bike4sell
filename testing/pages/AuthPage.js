class AuthPage {
  constructor(page) { this.page = page; }
  async goto() { await this.page.goto('/auth'); }
  async register(data) {
    await this.page.getByPlaceholder('Name').fill(data.name);
    await this.page.getByPlaceholder('Email').first().fill(data.email);
    await this.page.getByPlaceholder('Mobile').fill(data.mobile);
    await this.page.getByPlaceholder('Password').first().fill(data.password);
    await this.page.getByRole('button', { name: 'Register' }).click();
  }
  async verifyOtp(email, otp) {
    await this.page.getByPlaceholder('Email').nth(1).fill(email);
    await this.page.getByPlaceholder('OTP').fill(otp);
    await this.page.getByRole('button', { name: 'Verify OTP' }).click();
  }
  async login(email, password) {
    await this.page.getByPlaceholder('Email').nth(2).fill(email);
    await this.page.getByPlaceholder('Password').nth(1).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
module.exports = { AuthPage };
