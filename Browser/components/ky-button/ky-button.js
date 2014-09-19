Polymer("ky-button", {

    ready: function() {
        this.ripple = this.$.ripple;

        this.downAction = this.downAction.bind(this);
        this.upAction = this.upAction.bind(this);

        this.addEventListener("mousedown", this.downAction);
        this.addEventListener("mouseup", this.upAction);
    },
    downAction: function(ev) {
        this.ripple.downAction(ev);
    },
    upAction: function(ev) {
        this.ripple.upAction(ev);
    }
});
