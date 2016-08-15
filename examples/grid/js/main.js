function setupAriaGrids () {
  var gridNodes = document.querySelectorAll('[role="grid"]');
  var ariaGrids = [];

  Array.prototype.forEach.call(
    gridNodes,
    function (gridNode) {
      ariaGrids.push(new aria.Grid(gridNode));
    }
  );

  console.log(ariaGrids);
}

window.onload = function() {
  setupAriaGrids();
}
