document.addEventListener("DOMContentLoaded", () => {
    const bookmarkBtn = document.getElementById("bookmark");
    const bookmarksList = document.getElementById("bookmarks");
    const clearAllBtn = document.getElementById("clearAll");
    const errorMessage = document.getElementById("error-message");

    if (!bookmarkBtn || !bookmarksList || !clearAllBtn || !errorMessage) {
        console.error("Required elements not found in popup.html.");
        return;
    }

    chrome.storage.local.get("bookmarks", (data) => {
        if (data.bookmarks) {
            data.bookmarks.forEach(addBookmarkToUI);
        }
    });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (!tabs[0] || !tabs[0].url.includes("youtube.com/watch")) {
            showError("This extension only works on YouTube videos.");
            bookmarkBtn.disabled = true;
            bookmarkBtn.textContent = "Play YouTube Video";
            bookmarkBtn.style.backgroundColor = "#888";
            return;
        }
    });

    bookmarkBtn.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (!tabs[0] || !tabs[0].url.includes("youtube.com/watch")) {
                showError("Please open a YouTube video to bookmark.");
                return;
            }

            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: getCurrentTimestamp
            }, (results) => {
                if (results && results[0]) {
                    const timestamp = results[0].result;
                    const videoTitle = tabs[0].title.split(" - ")[0];
                    const formattedTime = formatTimestamp(timestamp);
                    const newBookmark = {
                        url: `${tabs[0].url}&t=${timestamp}s`,
                        display: `${formattedTime} - ${videoTitle}`
                    };

                    chrome.storage.local.get("bookmarks", (data) => {
                        const bookmarks = data.bookmarks || [];
                        bookmarks.push(newBookmark);
                        chrome.storage.local.set({ bookmarks });
                        addBookmarkToUI(newBookmark);
                    });
                }
            });
        });
    });

    function addBookmarkToUI(bookmark) {
        const li = document.createElement("li");
        li.className = "bookmark-item";
        li.textContent = bookmark.display;

        const deleteBtn = document.createElement("img");
        deleteBtn.src = "delete-icon.png";
        deleteBtn.alt = "Delete";
        deleteBtn.className = "delete-icon";
        
        deleteBtn.style.width = "16px";
        deleteBtn.style.height = "16px";
        deleteBtn.style.marginLeft = "10px";
        deleteBtn.style.cursor = "pointer";
        deleteBtn.style.verticalAlign = "middle";

        deleteBtn.addEventListener("click", (event) => {
            event.stopPropagation();
            removeBookmark(bookmark);
            li.remove();
        });

        li.appendChild(deleteBtn);
        bookmarksList.appendChild(li);
    }

    function removeBookmark(bookmark) {
        chrome.storage.local.get("bookmarks", (data) => {
            const bookmarks = data.bookmarks || [];
            const updatedBookmarks = bookmarks.filter(b => b.url !== bookmark.url);
            chrome.storage.local.set({ bookmarks: updatedBookmarks });
        });
    }

    clearAllBtn.addEventListener("click", () => {
        chrome.storage.local.set({ bookmarks: [] }, () => {
            bookmarksList.innerHTML = "";
        });
    });

    function getCurrentTimestamp() {
        const video = document.querySelector("video");
        return video ? Math.floor(video.currentTime) : 0;
    }

    function formatTimestamp(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = "block";
        // setTimeout(() => {
        //     errorMessage.style.display = "none";
        // }, 2000);
    }
});
