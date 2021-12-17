import puppeteer from 'puppeteer';

export const launch = async (headless: boolean): Promise<puppeteer.Browser> => {
  try {
    const browser = await puppeteer.launch({
      headless,
    });
    return browser;
  } catch (error: any) {
    console.log('failed to launch browser:', error?.message);
    throw error;
  }
};

export const newPage = async (browser: puppeteer.Browser, url: string): Promise<puppeteer.Page> => {
  try {
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);

    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    await page.goto(url);
    return page;
  } catch (error: any) {
    console.log('failed to open new page:', error?.message);
    throw error;
  }
};

export const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export const autoScroll = async (page: puppeteer.Page): Promise<void> => {
  await page.evaluate(async () => {
    await new Promise<void>((resolve, _reject) => {
      var totalHeight = 0;
      var distance = 100;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 100);
    });
  });
};
