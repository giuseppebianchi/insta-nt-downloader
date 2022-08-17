console.info("content-script");
let POST_IMAGE_SELECTOR = "._aagt";
let USERNAME_SELECTOR = "._acan._acao._acat._acaw._a6hd";

const downloadHidden = document.createElement("a");
downloadHidden.target = "_blank";

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
  downloadButton.innerText = "Download";
  downloadButton.addEventListener("click", async (e) => {
    const link = e.target.parentNode.querySelector(POST_IMAGE_SELECTOR).src;
    const user = article.querySelector(USERNAME_SELECTOR).text;
    const filename = link.substring(
      link.lastIndexOf("/") + 1,
      link.lastIndexOf("?")
    );
    /*open(
      link,
      "_blank"
    );*/
    downloadHidden.href = await toDataURL(link);
    downloadHidden.download =
      user + "_" + (filename ? filename : new Date().getTime() + ".jpg");
    downloadHidden.click();
  });
  return downloadButton;
};
