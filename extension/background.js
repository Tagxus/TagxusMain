// A generic onclick callback function.
function genericOnClick(info, tab) {
	console.log("item " + info.menuItemId + " was clicked");
	console.log("info: " + JSON.stringify(info));
	console.log("tab: " + JSON.stringify(tab));
	var selectionText = info.selectionText;
	if(!selectionText)
		selectionText = "Tag";
	
	//Add all you functional Logic here
	chrome.tabs.query({
		"active": true,
		"currentWindow": true
	}, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, {
			"selectionText": selectionText
		});
	});
}

var title = "Add Tag!";
chrome.contextMenus.create({"title": title, "contexts":["all"], "onclick": genericOnClick});