"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    class Enemy extends FudgeSpaceShooter.Entity {
        constructor(_name) {
            super(_name);
            this.maxSpeed = 10;
            this.lifePoints = 1;
            this.shotTime = 0.2;
            this.shotCountdown = this.shotTime;
            this.update = (_event) => {
                this.move();
                this.attack();
                if (this.cmpTransform.local.translation.y < FudgeSpaceShooter.screenBottomRight.y - 3) {
                    let parent = this.getParent();
                    ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                    parent.removeChild(this);
                }
            };
            let mesh = new ƒ.MeshSprite();
            let material = new ƒ.Material("Hitbox", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("blue", 0.5)));
            this.addComponent(new ƒ.ComponentMaterial(material));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentTransform);
            let spawnX = FudgeSpaceShooter.rand.getRange(FudgeSpaceShooter.screenTopLeft.x, FudgeSpaceShooter.screenBottomRight.x);
            let spawnY = FudgeSpaceShooter.screenTopLeft.y + 2;
            let spawn = new ƒ.Vector3(spawnX, spawnY, 0);
            this.cmpTransform.local.translation = spawn;
            this.shotDirection = ƒ.Vector3.ZERO();
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        move() {
            let timeDelta = ƒ.Loop.timeFrameGame / 1000;
            this.speed.y += -this.maxSpeed * timeDelta;
            if (this.speed.y < -this.maxSpeed) {
                this.speed.y = -this.maxSpeed;
            }
            this.cmpTransform.local.translateY(this.speed.y * timeDelta);
        }
        attack() {
            //It doesn't directly attack
        }
        onHit() {
            this.lifePoints -= 1;
            FudgeSpaceShooter.score(100 * this.lifePoints);
            if (this.lifePoints <= 0) {
                this.destroy();
                FudgeSpaceShooter.score(1000 * this.lifePoints);
            }
        }
        destroy() {
            let parent = this.getParent();
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
            parent.removeChild(this);
        }
    }
    FudgeSpaceShooter.Enemy = Enemy;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Enemy.js.map