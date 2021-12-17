import { launch } from './utils';
import { getThumbnailVideos } from './tasks';

const main = async () => {
  try {
    const browser = await launch(false);

    const thumbnailVideos = await getThumbnailVideos(browser);
    console.log({ thumbnailVideos });

    process.exit(); //close browser and exit
  } catch (error: any) {
    console.log('failed on main:', error?.message);
    process.exit(); //close browser and exit
  }
};

main();
