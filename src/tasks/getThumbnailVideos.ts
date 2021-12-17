import puppeteer from 'puppeteer';
import { autoScroll, newPage } from '../utils';

export const getThumbnailVideos = async (browser: puppeteer.Browser) => {
  try {
    const URL = 'https://www.amazon.com/live';
    const page = await newPage(browser, URL);

    await autoScroll(page);

    const results = [];
    const thumbnails = await page.$x(`//div[@data-id="thumbnail"]/a`);
    if (thumbnails.length > 0) {
      for (let i = 0; i < thumbnails.length; i++) {
        const result = {
          live: false,
          videoTitle: '',
          videoUrl: '',
          imgUrl: '',
          channelName: '',
          channelUrl: '',
        };

        // video url
        const videoUrl = await thumbnails[i].getProperty('href');
        result.videoUrl = await videoUrl.jsonValue();

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
    return results;
  } catch (error: any) {
    console.log('failed getThumbnailVideos:', error.message);
    throw error;
  }
};
