"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    class Ship extends ƒ.Node {
        constructor(_name = "PlayerShip") {
            super(_name);
            this.maxSpeed = 5;
            this.hitboxSize = new ƒ.Vector2(0.5, 0.5);
            this.shotTime = 0.2;
            this.shotCountdown = this.shotTime;
            this.invulTime = 2;
            this.invulCountdown = this.invulTime;
            this.lifePoints = 5;
            this.update = (_event) => {
                if (this.lifePoints > 0) {
                    let timeDelta = ƒ.Loop.timeFrameGame / 1000;
                    this.cmpTransform.local.translateX(this.maxSpeed * this.speed.x * timeDelta);
                    this.cmpTransform.local.translateY(this.maxSpeed * this.speed.y * timeDelta);
                    if (this.shotCountdown < this.shotTime) {
                        this.shotCountdown += timeDelta;
                    }
                    if (this.shotCountdown >= this.shotTime)
                        this.shotCountdown = this.shotTime;
                    if (this.invulCountdown < this.invulTime) {
                        this.invulCountdown += timeDelta;
                    }
                    if (this.invulCountdown >= this.invulTime) {
                        this.invulCountdown = this.invulTime;
                    }
                    this.checkCollision();
                }
            };
            this.speed = ƒ.Vector3.ZERO();
            this.hitboxNode = new ƒ.Node("Hitbox");
            let material = new ƒ.Material("Hitbox", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("blue", 0.5)));
            this.hitbox = new ƒ.MeshSprite();
            this.hitboxNode.addComponent(new ƒ.ComponentMaterial(material));
            let cmpHitboxMesh = new ƒ.ComponentMesh(this.hitbox);
            this.hitboxNode.addComponent(cmpHitboxMesh);
            this.hitboxNode.addComponent(new ƒ.ComponentTransform());
            this.hitboxNode.cmpTransform.local.scaleY(this.hitboxSize.y);
            this.hitboxNode.cmpTransform.local.scaleX(this.hitboxSize.x);
            this.appendChild(this.hitboxNode);
            let mesh = new ƒ.MeshQuad();
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            this.addComponent(cmpMesh);
            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            let image = document.querySelector("img");
            coat.texture.image = image;
            let playerShipMaterial = new ƒ.Material("PlayerShipMat", ƒ.ShaderTexture, coat);
            let playerCmpMaterial = new ƒ.ComponentMaterial(playerShipMaterial);
            this.addComponent(playerCmpMaterial);
            this.addComponent(new ƒ.ComponentTransform());
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        move(_direction) {
            switch (_direction) {
                case FudgeSpaceShooter.DIRECTION.LEFT:
                    this.speed.x = -1;
                    break;
                case FudgeSpaceShooter.DIRECTION.RIGHT:
                    this.speed.x = 1;
                    break;
                case FudgeSpaceShooter.DIRECTION.UP:
                    this.speed.y = 1;
                    break;
                case FudgeSpaceShooter.DIRECTION.DOWN:
                    this.speed.y = -1;
                    break;
                default:
                case FudgeSpaceShooter.DIRECTION.NEUTRAL:
                    this.speed.x = 0;
                    this.speed.y = 0;
                    break;
            }
        }
        shoot() {
            if (this.shotCountdown >= this.shotTime) {
                let zap = document.querySelector("#zap");
                zap.play();
                let direction = new ƒ.Vector3(0, 1, 0);
                let bullet = new FudgeSpaceShooter.Bullet("PlayerBullet", this.cmpTransform.local.translation, direction);
                FudgeSpaceShooter.bullets.addChild(bullet);
                this.shotCountdown = 0;
            }
        }
        getLife() {
            return this.lifePoints;
        }
        setLife(_n) {
            this.lifePoints = _n;
        }
        getHitbox() {
            return FudgeSpaceShooter.getRectWorld(this.hitboxNode);
        }
        checkCollision() {
            for (let child of FudgeSpaceShooter.enemies.getChildren()) {
                if (child instanceof FudgeSpaceShooter.Enemy) {
                    let rect = FudgeSpaceShooter.getRectWorld(child);
                    let hit = rect.isInside(this.cmpTransform.local.translation.toVector2());
                    if (hit) {
                        child.onHit();
                        this.onHit();
                    }
                }
            }
        }
        onHit() {
            if (this.invulCountdown >= this.invulTime) {
                this.invulCountdown = 0;
                if (this.lifePoints > 0) {
                    this.lifePoints -= 1;
                    if (this.lifePoints <= 0) {
                        for (let child of this.getChildren()) {
                            this.removeChild(child);
                        }
                        this.destroy();
                    }
                }
            }
        }
        destroy() {
            let parent = this.getParent();
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            parent.removeChild(this);
        }
    }
    FudgeSpaceShooter.Ship = Ship;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Ship.js.map