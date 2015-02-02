function init()
{
	document.getElementById("link").addEventListener("click", fetchResource);
	document.getElementById("link").addEventListener("keydown", fetchResource);
}

function fetchResource(event)
{
	var type = event.type;
	
	if (type === "keydown" && event.keyCode !== 13)
	{
		return true
	}

	window.location.href = 'http://w3.org/';
	event.preventDefault();
}

window.onload = init;