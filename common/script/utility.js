/* Utility functions */

// Change the authors credit to mapping contributors credit
// add 	postProcess: [ addPlatformMaintainers ] in respecConfig
// In AAMs to change Authors to Platform Mapping Maintainers in the header

function addPlatformMaintainers() {
	document.querySelectorAll("div.head dt").forEach(function(node){
		if (node.textContent.trim() == "Authors:") node.textContent = "Platform Mapping Maintainers:";
	})
}
function fixContributors() {
	document.querySelectorAll("#gh-contributors li a").forEach(function(node){
		if (node.textContent.indexOf("[bot]") >  0) node.parentElement.parentElement.removeChild(node.parentElement);
	})
}