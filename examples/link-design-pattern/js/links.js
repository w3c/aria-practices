function fetchResource(event)
{
	window.location.href = 'http://w3.org/';
}

// Check if the enter (key code 13) has been pressed
function handleLinkKeyUp(event)
{
	event = event || window.event;
	
	if (event.keyCode === 13)
	{
		fetchResource(event);
	}
}

window.onload = init;