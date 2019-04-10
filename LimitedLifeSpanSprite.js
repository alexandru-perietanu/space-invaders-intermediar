var LimitedLifeSpanSprite = (function() {
    function LimitedLifeSpanSprite(className, lifeSpan, width, height) {
        Sprite.call(this, className, width, height);
        this.lifeSpan = lifeSpan;      
    }
    

    LimitedLifeSpanSprite.prototype = Object.create(Sprite.prototype);
    Object.assign(LimitedLifeSpanSprite.prototype, {
        startDeath: function() {
            setTimeout(() => {
                this.getElement().remove();
            }, this.lifeSpan);
        }
    });

    return LimitedLifeSpanSprite;
})();