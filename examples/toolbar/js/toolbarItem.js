var ToolbarItem = function (domNode, toolObj) {
    this.toolbar = toolObj; 
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

ToolbarItem.prototype.init = function () {
    console.log(this.domNode);
    this.domNode.tabIndex = -1;
    console.log(this);
    this.domNode.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.domNode.addEventListener('click', this.handleClick.bind(this));
};

ToolbarItem.prototype.handleKeyDown = function (event){
    var tgt = event.currenttarget, 
        char = event.key,
        flag = false,
        clickEvent; 
        function isPrintableCharacter (str) {
            return str.length === 1 && str.match(/\S/);
        }

        switch (event.keyCode) {
            case this.keyCode.SPACE:
            case this.keyCode.RETURN:
            
                break;

            case this.keyCode.LEFT: 
                this.toolbar.setFocusToNext(this);
                flag = true;
                break;

        }
};
ToolbarItem.prototype.handleClick = function () {

};
