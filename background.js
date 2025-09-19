chrome.action.onClicked.addListener(async (tab) => {
  if (!tab || !tab.url) return;

  const submitUrl = "https://archive.is/submit/?url=" + encodeURIComponent(tab.url);

  try {
    // Fetch with redirect disabled, so we can capture the Location header
    const response = await fetch(submitUrl, { redirect: "manual" });
    if (response.status === 302) {
      const archiveLocation = response.headers.get("Location");
      if (archiveLocation) {
        chrome.tabs.create({ url: archiveLocation });
      } else {
        chrome.tabs.create({ url: submitUrl }); // fallback
      }
    } else {
      chrome.tabs.create({ url: submitUrl }); // fallback
    }
  } catch (e) {
    console.error("Archive.is request failed", e);
    chrome.tabs.create({ url: submitUrl }); // fallback
  }
});
