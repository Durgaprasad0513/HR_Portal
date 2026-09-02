const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Need to log in first? Yes! The user is logged in.
  // We can just grab localStorage from their running browser if possible? No.
  // But wait, they get the error AFTER navigating to /recruitment.
  // If we just go there, we will be redirected to /login.
  
  console.log("Puppeteer checking...");
  await browser.close();
})();
