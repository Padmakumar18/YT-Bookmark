chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getTimestamp") {
        const timestamp = Math.floor(document.querySelector("video").currentTime);
        sendResponse({ timestamp });
    }
});
