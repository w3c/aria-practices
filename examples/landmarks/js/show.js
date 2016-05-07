function showLandmarks(event) {
    if (typeof window[initLandmarks] !== 'function') 
        window[initLandmarks] = initLandmarks();

    if (window[initLandmarks].run())
        event.target.innerHTML = "Hide Landmarks";
    else 
        event.target.innerHTML = "Show Landmarks";
}

function showHeadings(event) {
    if (typeof window[initHeadings] !== 'function')
        window[initHeadings] = initHeadings();

    if (window[initHeadings].run())
        event.target.innerHTML = "Hide Headings";
    else 
        event.target.innerHTML = "Show Headings";
}