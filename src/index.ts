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
  const results = [];
  try {
    const thumbnails = await page.$x(`//div[@data-id="thumbnail"]/a`);
    if (thumbnails.length > 0) {
      for (let i = 0; i < thumbnails.length; i++) {
        const result: { [x: string]: any } = {};

        // getting video url
        const videoUrl = await thumbnails[i].getProperty('href');
        result.videoUrl = await videoUrl.jsonValue();

        result.live = false;
        const liveBadgeEls = await page.$x(
          `//div[@data-id="thumbnail"][${i + 1}]/a/div[@data-testid="BaseBadge"]/span`
        );
        if (liveBadgeEls.length > 0) {
          result.live = true;
        }

        result.imgUrl = '';
        const imgEls = await page.$x(`//div[@data-id="thumbnail"][${i + 1}]/a/div/div/img`);
        if (imgEls.length > 0) {
          const imgUrl = await imgEls[0].getProperty('src');
          result.imgUrl = await imgUrl.jsonValue();
        }

        // channel info
        const channelLinkEls = await page.$x(`//div[@data-id="thumbnail"][${i + 1}]/div/div/a`);
        const channelUrl = await channelLinkEls[0].getProperty('href');
        result.channelUrl = await channelUrl.jsonValue();

        const channelNameEls = await page.$x(
          `//div[@data-id="thumbnail"][${i + 1}]/div/div/a/div/div[2]`
        );
        if (channelNameEls.length > 0) {
          const channelName = (await page.evaluate(
            (el) => el.innerText,
            channelNameEls[0]
          )) as string;
          result.channelName = channelName;
        }

        const videoTitleEls = await page.$x(
          `//div[@data-id="thumbnail"][${i + 1}]/div/div/a/div/div[1]`
        );
        if (videoTitleEls.length > 0) {
          const videoTitle = (await page.evaluate(
            (el) => el.innerText,
            videoTitleEls[0]
          )) as string;
          result.videoTitle = videoTitle;
        }

        results.push(result);
      }
    }
  } catch (error: any) {
    console.log('err getLiveBadge', error.message);
  }
  return results;
};

const autoScroll = async (page: puppeteer.Page) => {
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

const main = async () => {
  const page = await mainActual();
  if (!page) process.exit();

  await autoScroll(page);
  const results = await getLiveBadge(page);
  console.log({ results });

  process.exit(); //close browser and exit
};

main();
