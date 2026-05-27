import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', error => console.log('BROWSER ERROR:', error.message));
  page.on('requestfailed', request => console.log('BROWSER REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:5173/playground', { waitUntil: 'networkidle0' });
  console.log('Page loaded');
  
  // Try to type in CodeMirror
  await page.waitForSelector('.cm-content');
  await page.click('.cm-content');
  await page.keyboard.type('// hello');
  
  // Wait a bit
  await new Promise(r => setTimeout(r, 1000));
  
  // Click on Roadmap link
  await page.click('a[href="/roadmap"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Navigated to roadmap');
  
  // Click back to Playground link
  await page.click('a[href="/playground"]');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });
  console.log('Navigated back to playground');
  
  // Wait to see if it loads
  await page.waitForSelector('.cm-content', { timeout: 2000 }).catch(e => console.log("Timeout waiting for cm-content!"));

  await browser.close();
})();
