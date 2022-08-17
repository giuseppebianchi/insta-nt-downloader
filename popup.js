const DOWNLOAD_POSITION_SELECTOR = "._aatk";
let saveConfigButton = document.getElementById("save-config");
let generateDownloadButton = document.getElementById(
  "generate-download-buttons"
);

// Initialize inputs with saved user's config
let imageClassnameInput = document.getElementById("image-classname");

chrome.storage.sync.get("imageClassname", ({ imageClassname }) => {
  if (imageClassname) {
    imageClassnameInput.value = imageClassname;
    //SHOW BANNER
    // Reload page to see changes
  }
});

// When the button is clicked, save configuration settings into storage
saveConfigButton.addEventListener("click", () => {
  chrome.storage.sync.set({ imageClassname: imageClassnameInput.value });
});

// When the button is clicked, add download buttons to all visible posts
generateDownloadButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  console.log("here");
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: generateDownloadButtonsOnPosts,
  });
});

function generateDownloadButtonsOnPosts() {
  //var iconImgURL = chrome.runtime.getURL("images/download-icon.png");
  chrome.storage.sync.get("imageClassname", ({ imageClassname }) => {
    if (imageClassname) {
      const articles = document.querySelectorAll("article");
      articles.forEach((a) => {
      //CHECK URL
      checkUrl()
      //if feed
        // check if gallery
          // check if article contains "ul" or ._acay

      // if story

      // if profile

      // if single post
        // check if gallery

      //check if video
        //open instagram video saver

      //find buttons bar
    
      a.querySelector(DOWNLOAD_POSITION_SELECTOR).append(newDownloadButton(a))
      });

      //SHOW BANNER
      // Reload page to see changes
    }
  });
}

function checkUrl(){
    const pathnames = location.pathname.split("/")
    //if lenght == 1 -> feed
    console.log(pathnames)
}