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
    function: generateDownloadButtons,
  });
});

function generateDownloadButtons() {
  chrome.storage.sync.get("imageClassname", ({ imageClassname }) => {
    switch (getPageFromUrl()) {
      case "FEED":
        addDownloadButtonsToFeed();
        break;
      case "PROFILE":
        break;
      case "POST":
        break;
      case "STORY":
        break;
      default:
        console.log("Invalid page");
    }
  });
}
