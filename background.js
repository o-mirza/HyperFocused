chrome.runtime.onInstalled.addListener(() => {
    // Initialize whitelist if not already done
    chrome.storage.local.get(['whitelist'], (result) => {
        if (!result.whitelist) {
            chrome.storage.local.set({ whitelist: [] });
        }
    });
});
