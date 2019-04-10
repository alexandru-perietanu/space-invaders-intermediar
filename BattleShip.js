var BattleShip = (function () {
    function BattleShip(fireCallBack, limitLeft, limitRight) {
        Sprite.call(this, "battleShip", 39, 24);
        this.keyDownListener;
        this.keyUpListener;
        this.moveSpeed = 5;
        this.moveDirection = 1;
        this.limitLeft = limitLeft;
        this.limitRight = limitRight;
        this.fireCallBack = fireCallBack;
        this.leftIsDown = false;
        this.rightIsDown = false;
        this.spaceIsDown = false;


        this.animateMove();
        this.requestFire();
        this.addListeners();
    }


    BattleShip.prototype = Object.create(Sprite.prototype);
    Object.assign(BattleShip.prototype, {
        addListeners: function () {
            this.keyDownListener = this.keyDown.bind(this);
            this.keyUpListener = this.keyUp.bind(this);
            window.addEventListener("keydown", this.keyDownListener);
            window.addEventListener("keyup", this.keyUpListener);
        },

        requestFire: function() {
            this.fireFrameReference = requestAnimationFrame(() => {
                if (this.spaceIsDown) {
                    this.fireCallBack();
                }
                this.requestFire();
            });
        },

        keyDown: function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    this.moveDirection = -1;
                    this.leftIsDown = true;
                    break;
                case "ArrowRight":
                    this.moveDirection = 1;
                    this.rightIsDown = true;
                    break;
                case "Space":
                    this.spaceIsDown = true;
                break;
            }
        },

        keyUp: function (e) {
            switch (e.code) {
                case "ArrowLeft":
                    this.leftIsDown = false;
                    break;
                case "ArrowRight":
                    this.rightIsDown = false;
                    break;
                case "Space":
                    this.spaceIsDown = false;
                break;
            }
        },

        animateMove: function() {
            var x = this.x;
            this.frameReference = requestAnimationFrame(() => {
                x += this.moveSpeed * this.moveDirection;
                if (this.leftIsDown || this.rightIsDown) {
                    this.move(x);
                }
                this.animateMove();
            })
        },

        move: function (newX) {
            if (newX <= this.limitLeft) {
                newX = this.limitLeft;
            }
            if (newX + this.getBoundingBox().width >= this.limitRight) {
                newX = this.limitRight - this.getBoundingBox().width;
            }
            this.position({
                x: newX
            });
        }


    });

    return BattleShip;
})();