import puppeteer from 'puppeteer';

const mainActual = async () => {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    const URL = 'https://www.amazon.com/live';
    await page.setViewport({
      width: 1280,
      height: 800,
      deviceScaleFactor: 1,
    });
    await page.goto(URL, { waitUntil: 'networkidle2' });
    return page;
  } catch (error: any) {
    console.log('err mainActual', error.message);
    return false;
  }
};

const getLiveBadge = async (page: puppeteer.Page) => {
  // $x(`//div[@data-testid="BaseBadge"]`)
  // $x(`//div[@data-id="thumbnail"]/a/div[2][@data-testid="BaseBadge"]`)
  const urls = [];
  try {
    const thumbnails = await page.$x(`//div[@data-id="thumbnail"]/a`);
    if (thumbnails.length > 0) {
      for (let i = 0; i < thumbnails.length; i++) {
        const liveBadge = await page.$x(
          `//div[@data-id="thumbnail"][${i + 1}]/a/div[@data-testid="BaseBadge"]/span`
        );
        if (liveBadge.length > 0) {
          // const innerText = (await page.evaluate((el) => el.innerText, hasBadge[i])) as string; // should be 'LIVE'
          const url = await thumbnails[i].getProperty('href');
          urls.push(await url.jsonValue());
        }
      }
    }
  } catch (error: any) {
    console.log('err getLiveBadge', error.message);
  }
  return urls;
};

const main = async () => {
  const page = await mainActual();
  if (!page) process.exit();

  const urls = await getLiveBadge(page);
  console.log({ urls });
  process.exit();
};

main();
