/**
 * On extension installation, set initial state as off
 */
chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "OFF" });
});

/**
 * Only run the extension on Dev.to posts, the below regex will be used to check if a URL belongs to post or not
 */
const devto =
  /https:\/\/dev\.to\/[A-Za-z0-9]+\/([A-Za-z0-9]+(-[A-Za-z0-9]+)+)/i;

chrome.action.onClicked.addListener(async (tab) => {
  console.log(tab);
  if (devto.test(tab.url)) {
    // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
    const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
    // Next state will always be the opposite
    const nextState = prevState === "ON" ? "OFF" : "ON";

    // Set the action badge to the next state
    await chrome.action.setBadgeText({
      tabId: tab.id,
      text: nextState,
    });

    if (nextState === "ON") {
      // Insert the CSS file when the user turns the extension on
      await chrome.scripting.insertCSS({
        files: ["css/focus.css"],
        target: { tabId: tab.id },
      });
    } else if (nextState === "OFF") {
      // Remove the CSS file when the user turns the extension off
      await chrome.scripting.removeCSS({
        files: ["css/focus.css"],
        target: { tabId: tab.id },
      });
    }
  }
});
