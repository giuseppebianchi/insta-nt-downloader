const filter = {
  url: [
    {
      urlMatches: "https://www.instagram.com/",
    },
  ],
};

chrome.webNavigation.onCompleted.addListener(() => {
  // CHECK URL: FEED, PROFILE, POST, GALLERY, STORY
  
  // FEED
  //https://i.instagram.com/api/v1/feed/timeline/

  console.info("on Completed");

}, filter);
