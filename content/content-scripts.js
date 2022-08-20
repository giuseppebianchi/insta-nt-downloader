console.info("content-script");
const DEFAULT_PREFIX = "";
const STORY_PATH = "stories";
const SAVED_PATH = "saved";
const FEED_POST_SELECTOR = "article";
const FEED_POST_DOWNLOAD_POSITION_SELECTOR = "._aatk";

const POST_SINGLE_IMAGE_SELECTOR = "._aagt";
const POST_VIDEO_SELECTOR = "._ab1d";
const POST_GALLERY_SELECTOR = "ul._acay";

const POST_GALLERY_ITEM_SELECTOR = "._aamh";
const POST_ACTIVE_GALLERY_ITEM_SELECTOR = "._aamh";
const POST_GALLERY_VIDEO_ITEM_SELECTOR = "._ab1d";
const POST_GALLERY_ITEM_IMAGE_SELECTOR = "._aagt";
const POST_GALLERY_BUTTON_RIGHT_SELECTOR = "._aahi";

const POST_USERNAME_SELECTOR = "._acan._acao._acat._acaw._a6hd";

const POST_SELECTOR = "article._aatb";
const POST_DOWNLOAD_POSITION_SELECTOR = "._aatk";

const PROFILE_POST_SELECTOR = "._aabd._aa8k._aanf";
const PROFILE_POST_DOWNLOAD_POSITION_SELECTOR = "._aatk";

const STORIES_DOWNLOAD_POSITION_SELECTOR = "._a997._ac6a._ac0e";
const STORY_SELECTOR = "section._ac0a";
const STORY_IMAGE_SELECTOR = "._aa63._ac51";
const STORY_VIDEO_SELECTOR = "video._aa63._ac3u source";

const downloadHidden = document.createElement("a");
downloadHidden.target = "_blank";

function getPageFromUrl() {
  const pathnames = location.pathname.split("/");
  //if pathname.length == 2 -> feed
  if (pathnames.length === 2) {
    return "FEED";
  }
  if (pathnames.length === 3) {
    return "PROFILE"; //user = pathnames[1]
  }
  if (pathnames.length === 4) {
    return "POST";
  }
  if (pathnames.length === 5 && pathnames[1] === STORY_PATH) {
    return "STORY";
  }
  if (pathnames.length > 4 && pathnames[2] === SAVED_PATH) {
    return "SAVED";
  }
  return "";
}

function toDataURL(url) {
  return fetch(url)
    .then((response) => {
      return response.blob();
    })
    .then((blob) => {
      return URL.createObjectURL(blob);
    });
}

const createDownloadButton = (article, handler) => {
  const downloadButton = document.createElement("div");
  //downloadButton.style.backgroundImage = `url(${iconImgURL})`;
  downloadButton.className = "download-button";
  //downloadButton.innerText = "Download";
  const downloadHandler = handler || getDownloadHandlerByType(article);
  downloadButton.addEventListener("click", downloadHandler);
  return downloadButton;
};

function getDownloadHandlerByType(article) {
  if (checkIfGallery(article)) return activeGalleryImageHandler(article);
  if (checkIfVideo(article)) return videoHandler(article);
  return singleImageHandler(article);
}

function checkIfVideo(article) {
  const video = article.querySelector(POST_VIDEO_SELECTOR);
  return !!video;
}

function checkIfGallery(article) {
  const gallery = article.querySelector(POST_GALLERY_SELECTOR);
  return !!gallery;
}

function singleImageHandler(article) {
  return (e) => {
    const src = article.querySelector(POST_SINGLE_IMAGE_SELECTOR).src;
    const user =
      article.querySelector(POST_USERNAME_SELECTOR)?.text || DEFAULT_PREFIX;
    downloadMedia({ url: src, user, button: e.target });
  };
}

function activeGalleryImageHandler(article) {
  return (e) => {
    const items = article.querySelectorAll(POST_GALLERY_ITEM_SELECTOR);
    let activeItem;
    if (items.length === 2) {
      // Check first or last item
      const rightButton = article.querySelector(
        POST_GALLERY_BUTTON_RIGHT_SELECTOR
      );
      if (rightButton) {
        // active item is first
        activeItem = items[0];
      } else {
        // active item is second
        activeItem = items[1];
      }
    }
    if (items.length === 3) {
      // active item is in the middle
      activeItem = items[1];
    }
    //check if image or video
    const image = activeItem.querySelector(POST_GALLERY_ITEM_IMAGE_SELECTOR);
    const user = article.querySelector(POST_USERNAME_SELECTOR).text;
    if (image) {
      // it's an image
      downloadMedia({ url: image.src, user, button: e.target });
    } else {
      // it's a video
      const video = activeItem.querySelector(POST_GALLERY_VIDEO_ITEM_SELECTOR);
      if (video) {
        videoHandler(article)(e.target);
      }
    }
  };
}

function videoHandler(article) {
  return (e) => {
    const video = article.querySelector(POST_VIDEO_SELECTOR);
    //check blob url
    const videoUrl = video.src;
    if (videoUrl.substring(0, 4) === "blob") {
      alert("mobile mode required to download video");
    } else {
      const user = article.querySelector(POST_USERNAME_SELECTOR).text;
      downloadMedia({ url: videoUrl, user, button: e.target });
    }
  };
}

function profilePostHandler(article, user) {
  return (e) => {
    const src = article.querySelector(POST_SINGLE_IMAGE_SELECTOR).src;
    downloadMedia({ url: src, user, button: e.target });
  };
}

function storyHandler(story) {
  return (e) => {
    const user = location.pathname.split("/")[2];
    // check if video
    const video = story.querySelector(STORY_VIDEO_SELECTOR);
    if (video) {
      downloadMedia({ url: video.src, user, button: e.target });
    } else {
      const image = story.querySelector(STORY_IMAGE_SELECTOR).src;
      downloadMedia({ url: image, user, button: e.target });
    }
  };
}

async function downloadMedia({ url, user = "", button }) {
  if (button) {
    button.classList.add("loading");
  }
  const filename = url.substring(
    url.lastIndexOf("/") + 1,
    url.lastIndexOf("?")
  );
  // open(link, "_blank");
  downloadHidden.href = await toDataURL(url);
  if (button) {
    button.classList.add("downloaded");
    setTimeout(() => (button.className = "download-button"), 2000);
  }
  downloadHidden.download =
    user + "_" + (filename ? filename : new Date().getTime() + ".jpg");
  console.log(user, url);
  downloadHidden.click();
}

function addDownloadButtonsToFeed() {
  const articles = document.querySelectorAll(FEED_POST_SELECTOR);
  articles.forEach((a) => {
    a.querySelector(FEED_POST_DOWNLOAD_POSITION_SELECTOR).append(
      createDownloadButton(a)
    );
  });
}

function addDownloadButtonToPost() {
  const post = document.querySelector(POST_SELECTOR);
  post
    .querySelector(POST_DOWNLOAD_POSITION_SELECTOR)
    .append(createDownloadButton(post));
}

function addDownloadButtonsToProfile() {
  const articles = document.querySelectorAll(PROFILE_POST_SELECTOR);
  const user = location.pathname.split("/")[1];
  articles.forEach((a) => {
    a.append(createDownloadButton(a, profilePostHandler(a, user)));
  });
}

function addDownloadButtonsToSaved() {
  const articles = document.querySelectorAll(PROFILE_POST_SELECTOR);
  articles.forEach((a) => {
    a.append(createDownloadButton(a));
  });
}

function addDownloadButtonToStories() {
  const story = document.querySelector(STORY_SELECTOR);
  story.append(createDownloadButton(story, storyHandler(story)));
}
