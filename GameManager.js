var GameManager = (function () {
    function GameManager() {
        this.invaders = [];
        this.boardWidth = 750;
        this.boardHeight = 800;
        this.element = document.createElement("div");
        this.element.className = "board";

        this.alienColumns = 11;
        this.alienRows = 5;

        this.distanceX = 50;
        this.distanceY = 50;

        this.alienMoveIntervalRef = undefined;
        this.stepTime = 500;
        this.currentStep = 0;
        this.direction = 1;
        this.stepSize = 10;

        this.battleShip;
        this.firing = false;
        this.fireSprite;
        this.fireFrame;
        this.fireSpeed = -13;

        this.shoot = new Audio("sounds/shoot.wav");

        this.createAliens();
        this.createBattleShip();
        this.startGame();
    }

    GameManager.prototype = {
        getElement: function () {
            return this.element;
        },

        startGame: function () {
            clearInterval(this.alienMoveIntervalRef);
            this.alienMoveIntervalRef = setInterval(this.moveAliens.bind(this), this.stepTime);
        },

        createBattleShip: function () {
            var body = document.body;
            this.battleShip = new BattleShip(this.fire.bind(this), 0, this.boardWidth);
            this.fireSprite = new Sprite("bullet", 1, 5);
            body.appendChild(this.battleShip.getElement());
            body.appendChild(this.fireSprite.getElement());
            this.battleShip.position({
                x: 750 / 2 - 40 / 2,
                y: 800 - 50
            });
            this.fireSprite.position({
                x: -1000,
                y: -1000
            });
        },

        fire: function () {
            if (!this.firing) {
                this.initateFire();
                this.firing = true;
                this.shoot.play();
            }
        },

        initateFire: function () {
            this.fireSprite.position({
                x: this.battleShip.getPosition().x + 19,
                y: 800 - 50
            });
            this.moveFire();
        },

        moveFire: function () {
            var fireY = this.fireSprite.getPosition().y;
            var hitInvader;
            if (fireY > -10) {
                fireY += this.fireSpeed;
                this.fireSprite.position({
                    x: this.fireSprite.getPosition().x,
                    y: fireY
                });
                this.fireFrame = requestAnimationFrame(() => {
                    this.moveFire();
                });


                hitInvader = this.hitTestAlien();
                if (hitInvader) {
                    this.invaderDie(hitInvader);

                    this.firing = false;
                    cancelAnimationFrame(this.fireFrame);
                    this.fireFrame = null;
                    this.fireSprite.position({
                        x: -1000,
                        y: -1000
                    });
                }
            } else {
                this.firing = false;
                cancelAnimationFrame(this.fireFrame);
                this.fireFrame = null;
                this.fireSprite.position({
                    x: -1000,
                    y: -1000
                });
            }
        },

        invaderDie: function(hitInvader) {
            var invaderBBox = hitInvader.getBoundingBox();
            var explosion = new LimitedLifeSpanSprite("explosion", 200, 39, 27);
            var explosionBBox = explosion.getBoundingBox();
            document.body.appendChild(explosion.getElement());
            explosion.position({
                x: invaderBBox.x - (explosionBBox.width - invaderBBox.width) / 2,
                y: invaderBBox.y
            });
            explosion.startDeath();

            hitInvader.position({
                x: -1000, 
                y: -1000
            });
        },

        hitTestAlien: function () {
            var alienBBox;
            var bulletBBox = this.fireSprite.getBoundingBox();
            for (var i = 0; i < this.alienRows; i++) {
                for (var j = 0; j < this.alienColumns; j++) {
                     alienBBox = this.invaders[i][j].getBoundingBox();
                     if (this.isHit(bulletBBox, alienBBox)) {
                         return this.invaders[i][j];
                     }
                }
            }
        },

        createAliens: function () {
            var invader;
            var invaders = this.invaders;
            var alien;
            var body = document.body;
            for (var i = 0; i < this.alienRows; i++) {
                invaders[i] = [];
                for (var j = 0; j < this.alienColumns; j++) {

                    alien = AlienFactory.getAlien(i);
                    invader = new MultiStateSprite(alien.class, alien.width, alien.height);
                    invader.position({
                        x: 1 + j * this.distanceX,
                        y: i * this.distanceY
                    });
                    invaders[i][j] = invader;
                    body.appendChild(invader.getElement());
                }
            }
        },

        moveAliens: function () {
            var invaders = this.invaders;
            var invader;
            this.currentStep += this.direction;

            if (this.exitRight()) {
                this.currentStep -= 2;
                this.direction *= -1;
            } else if (this.exitLeft()) {
                this.currentStep += 2;
                this.direction *= -1;
            }

            for (var i = 0; i < this.alienRows; i++) {
                for (var j = 0; j < this.alienColumns; j++) {
                    invader = invaders[i][j];
                    invader.position({
                        x: (j * this.distanceX) + this.currentStep * this.stepSize,
                        y: i * this.distanceY
                    });
                    invader.nextState();
                }
            }

        },

        isHit: function (box1, box2) {
            if (!(box1.x + box1.width < box2.x ||
                box1.x > box2.x + box2.width ||
                box1.y > box2.y + box2.height ||
                box1.y + box1.height < box2.y)) {
                return true;
            }
            return false;
        },

        exitRight: function () {
            var invaders = this.invaders;
            var invader;
            for (var i = 0; i < this.alienRows; i++) {
                for (var j = 0; j < this.alienColumns; j++) {
                    invader = invaders[i][j];
                    if (invader.getBoundingBox().x + invader.getBoundingBox().width >= this.boardWidth) {
                        return true;
                    }
                }
            }
            return false;
        },

        exitLeft: function () {
            var invaders = this.invaders;
            var invader;
            for (var i = 0; i < this.alienRows; i++) {
                for (var j = 0; j < this.alienColumns; j++) {
                    invader = invaders[i][j];
                    if (invader.getBoundingBox().x <= 0) {
                        return true;
                    }
                }
            }
            return false;
        }



    }


    return GameManager;
})();