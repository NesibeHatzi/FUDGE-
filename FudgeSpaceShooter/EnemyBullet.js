"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    class EnemyBullet extends FudgeSpaceShooter.Bullet {
        constructor(_name, _pos, _direction, _color) {
            super(_name, _pos, _direction, _color);
            this.lifeTime = 1;
            this.shotTime = 0;
            this.velocity = 0.5;
            this.update = (_event) => {
                let timeDelta = ƒ.Loop.timeFrameGame / 1000;
                let distance = ƒ.Vector3.SCALE(this.speed, timeDelta);
                this.cmpTransform.local.translate(distance);
                this.currentLifeTime += timeDelta;
                if (this.kill != true && this.currentLifeTime > this.lifeTime) {
                    this.destroy();
                    this.kill = true;
                }
                this.checkCollision();
            };
            this.speed = this.direction;
            this.speed.scale(this.velocity);
        }
        checkCollision() {
            if (FudgeSpaceShooter.player != null && this.kill != true) {
                let rect = FudgeSpaceShooter.getRectWorld(FudgeSpaceShooter.player);
                let hit = rect.isInside(this.cmpTransform.local.translation.toVector2());
                if (hit) {
                    FudgeSpaceShooter.player.onHit();
                    this.destroy();
                }
            }
        }
    }
    FudgeSpaceShooter.EnemyBullet = EnemyBullet;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=EnemyBullet.js.map