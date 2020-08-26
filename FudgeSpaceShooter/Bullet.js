"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    class Bullet extends ƒ.Node {
        // constructor() {
        // }
        constructor(_name, _pos, _direction, _color) {
            super(_name);
            this.velocity = 30;
            this.kill = false;
            this.lifeTime = 5;
            this.currentLifeTime = 0;
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
            this.speed = ƒ.Vector3.ZERO();
            this.addComponent(new ƒ.ComponentTransform());
            let coat;
            if (_color != null)
                coat = new ƒ.CoatColored(_color);
            else
                coat = new ƒ.CoatColored(ƒ.Color.CSS("RED"));
            let material = new ƒ.Material("bullet", ƒ.ShaderUniColor, coat);
            let mesh = new ƒ.MeshSprite();
            this.cmpTransform.local.translation = _pos;
            this.cmpTransform.local.scaling = Bullet.size;
            this.addComponent(new ƒ.ComponentMaterial(material));
            let cmpMesh = new ƒ.ComponentMesh(mesh);
            this.addComponent(cmpMesh);
            if (_direction != null)
                this.direction = new ƒ.Vector3(_direction.x, _direction.y, _direction.z);
            else
                this.direction = new ƒ.Vector3(0, -1, 0);
            this.speed = this.direction;
            this.speed.scale(this.velocity);
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
        }
        setPosition(_pos) {
            this.cmpTransform.local.translation = _pos;
        }
        checkCollision() {
            if (!this.kill) {
                for (let child of FudgeSpaceShooter.enemies.getChildren()) {
                    if (child instanceof FudgeSpaceShooter.Enemy) {
                        let rect = FudgeSpaceShooter.getRectWorld(child);
                        let hit = rect.isInside(this.cmpTransform.local.translation.toVector2());
                        if (hit) {
                            child.onHit();
                            this.destroy();
                            this.kill = true;
                        }
                    }
                }
            }
        }
        destroy() {
            if (this.getParent() != null) {
                let parent = this.getParent();
                ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                parent.removeChild(this);
            }
        }
    }
    Bullet.size = new ƒ.Vector3(0.4, 0.4, 0.4);
    FudgeSpaceShooter.Bullet = Bullet;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Bullet.js.map