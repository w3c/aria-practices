var toolbarItem = function (domNode, toolObj) {
    this.toolObj = toolObj; 
    this.domNode = domNode; 


    this.keyCode = Object.freeze({
        'TAB': 9,
        'RETURN': 13,
        'ESC': 27,
        'SPACE': 32,
        'PAGEUP': 33,
        'PAGEDOWN': 34,
        'END': 35,
        'HOME': 36,
        'LEFT': 37,
        'UP': 38,
        'RIGHT': 39,
        'DOWN': 40
    });
}; 

toolbarItem.prototype.init = function () {
    this.domNode.tabIndex = -1;
    console.log(this.domNode);
    this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.domNode.addEventListener('click', this.handleClick.bind(this));
};

