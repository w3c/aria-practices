
Textarea = function(domNode){
    this.domNode = domNode;
    this.selectText = '';

    this.copyButton = null;
    this.cutButton = null;
};

Textarea.prototype.init = function (){
    this.copyButton = document.getElementsByClassName('copy')[0];
    this.cutButton = document.getElementsByClassName('cut')[0];

    this.domNode.addEventListener('mouseup', this.selectTextContent.bind(this));
};
Textarea.prototype.getSelectionText = function() {
    this.start = this.domNode.selectionStart;
    this.end = this.domNode.selectionEnd;
    return this.domNode.value.substring(this.start, this.end);
}

Textarea.prototype.selectTextContent = function() {
    
    var selected = this.getSelectionText();
    this.checkDisable(this.copyButton, selected.length>0);
    this.checkDisable(this.cutButton, selected.length>0);
}
Textarea.prototype.checkDisable = function (domNode, check) {
    if(check){
        domNode.setAttribute('aria-disabled', false);
        domNode.disabled = false;
    }
    else{
        domNode.setAttribute('aria-disabled', true);
        domNode.disabled = true;   
    }
}