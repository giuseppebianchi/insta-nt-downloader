console.info("content-script");
const FEED_POST_SELECTOR = "article";
const POST_DOWNLOAD_POSITION_SELECTOR = "._aatk";
const POST_SINGLE_IMAGE_SELECTOR = "._aagt";
const POST_VIDEO_SELECTOR = "._ab1d";
const POST_GALLERY_SELECTOR = "ul._acay";
const POST_ACTIVE_GALLERY_ITEM_SELECTOR = "._aamh";
const POST_GALLERY_VIDEO_ITEM_SELECTOR = "._ab1d";
const POST_GALLERY_ITEM_IMAGE_SELECTOR = "._aagt";
const POST_GALLERY_BUTTON_RIGHT_SELECTOR = "._aahi";
const POST_USERNAME_SELECTOR = "._acan._acao._acat._acaw._a6hd";
const POST_SELECTOR = "";
const STORY_SELECTOR = "";

const downloadHidden = document.createElement("a");
downloadHidden.target = "_blank";

function getPageFromUrl() {
  const pathnames = location.pathname.split("/");
  //if pathname.length == 2 -> feed
  if (pathnames.length === 2) {
    return "FEED";
  }
  // if pathname.length === 3 -> profile -> user = pathnames[1]

  // if pathname.length === 4 -> post -> post = pathnames[2]

  // if pathname.length === 5 -> story -> story = pathnames[3]

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

const newDownloadButton = (article) => {
  const downloadButton = document.createElement("div");
  //downloadButton.style.backgroundImage = `url(${iconImgURL})`;
  downloadButton.className = "download-button";
  //downloadButton.innerText = "Download";
  const downloadHandler = getDownloadHandlerByType(article);
  downloadButton.addEventListener("click", downloadHandler);
  return downloadButton;
};

function addDownloadButtonsToFeed() {
  const articles = document.querySelectorAll(FEED_POST_SELECTOR);
  articles.forEach((a) => {
    a.querySelector(POST_DOWNLOAD_POSITION_SELECTOR).append(
      newDownloadButton(a)
    );
  });
}

function getDownloadHandlerByType(article) {
  if (checkIfVideo(article)) return videoHandler(article);
  if (checkIfGallery(article)) return activeGalleryImageHandler(article);
  return singleImageHandler(article);
}

function checkIfVideo(article) {
  const video = article.querySelector(POST_VIDEO_SELECTOR);
  return !!video;
}

function checkIfGallery(article) {
  const gallery = article.querySelector(POST_GALLERY_SELECTOR);
  return !!gallery;
  //_aamh _aa1z _aa1_
  // active itema doesn'e have class _aa1_
}

// download video

function singleImageHandler(article) {
  return (e) => {
    const src = article.querySelector(POST_SINGLE_IMAGE_SELECTOR).src;
    const user = article.querySelector(POST_USERNAME_SELECTOR).text;
    downloadMedia({ url: src, user, button: e.target });
  };
}

function activeGalleryImageHandler(article) {
  return (e) => {
    const items = article.querySelectorAll(POST_ACTIVE_GALLERY_ITEM_SELECTOR);
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
      alert("mobile mode required");
    } else {
      const user = article.querySelector(POST_USERNAME_SELECTOR).text;
      e.target.classList.add("loading");
      downloadMedia({ url: videoUrl, user, button: e.target });
    }
  };
}

async function downloadMedia({ button, url, user = "" }) {
  const filename = url.substring(
    url.lastIndexOf("/") + 1,
    url.lastIndexOf("?")
  );
  /*open(
    link,
    "_blank"
  );*/
  downloadHidden.href = await toDataURL(url);
  if (button) {
    button.classList.add("downloaded");
    setTimeout(() => button.className = 'download-button', 3000)
  }
  downloadHidden.download =
    user + "_" + (filename ? filename : new Date().getTime() + ".jpg");
  downloadHidden.click();
}
