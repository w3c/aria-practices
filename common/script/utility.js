/* Utility functions */

// Change the authors credit to mapping contributors credit
// Right now this will run on any author credit, not scoped to AAMs
require(["core/pubsubhub"], function(respecEvents) {
    "use strict";
    respecEvents.sub('end', function(message) {
    	if (message === 'core/link-to-dfn') {
    		document.querySelectorAll("div.head dt").forEach(function(node){
                       if (node.textContent.trim() == "Authors:") node.textContent = "Platform Mapping Maintainers:";
    		});
    	}
	})
})

