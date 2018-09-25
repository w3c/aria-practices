
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
    this.selection = this.domNode.value.substring(this.start, this.end);

    console.log(this.selection);
    return this.selection;
}

Textarea.prototype.selectTextContent = function() {
    
    var selected = this.getSelectionText();
    console.log(selected);
    if(selected.length > 0) {
        this.copyButton.setAttribute('aria-disabled', false);
        this.copyButton.disabled = false;
        this.cutButton.setAttribute('aria-disabled', false);
        this.cutButton.disabled = false;
    }
    else {
        this.copyButton.setAttribute('aria-disabled', true);
        this.copyButton.disabled = true;
        this.cutButton.setAttribute('aria-disabled', true);
        this.cutButton.disabled = true;

    }
}
