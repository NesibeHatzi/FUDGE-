namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;
    export class Bullet extends ƒ.Node {
        protected speed: ƒ.Vector3;
        protected direction: ƒ.Vector3;
        protected velocity: number = 30;
        protected kill: boolean = false;
        protected lifeTime: number = 5;
        protected currentLifeTime: number = 0;
        static size: ƒ.Vector3 = new ƒ.Vector3(0.4, 0.4, 0.4);

        // constructor() {

        // }
        constructor(_name: string, _pos: ƒ.Vector3, _direction?: ƒ.Vector3, _color?: ƒ.Color) {
            super(_name);
            this.speed = ƒ.Vector3.ZERO();
            this.addComponent(new ƒ.ComponentTransform());
            let coat: ƒ.CoatColored;
            if (_color != null)
                coat = new ƒ.CoatColored(_color);
            else
                coat = new ƒ.CoatColored(ƒ.Color.CSS("RED"));
            let material: ƒ.Material = new ƒ.Material("bullet", ƒ.ShaderUniColor, coat);
            let mesh: ƒ.MeshSprite = new ƒ.MeshSprite();
            this.cmpTransform.local.translation = _pos;
            this.cmpTransform.local.scaling = Bullet.size;
            this.addComponent(new ƒ.ComponentMaterial(material));
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            this.addComponent(cmpMesh);
            if (_direction != null)
                this.direction = new ƒ.Vector3(_direction.x, _direction.y, _direction.z);
            else
                this.direction = new ƒ.Vector3(0, -1, 0)
            this.speed = this.direction;
            this.speed.scale(this.velocity)
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
        }
        public setPosition(_pos: ƒ.Vector3): void {
            this.cmpTransform.local.translation = _pos;
        }
        protected update = (_event: Event): void => {
            let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
            let distance: ƒ.Vector3 = ƒ.Vector3.SCALE(this.speed, timeDelta);
            this.cmpTransform.local.translate(distance);
            this.currentLifeTime += timeDelta;
            if (this.kill != true && this.currentLifeTime > this.lifeTime) {
                this.destroy();
                this.kill = true;
            }
            this.checkCollision();
        }

        protected checkCollision(): void {
            if (!this.kill) {
                for (let child of enemies.getChildren()) {
                    if (child instanceof Enemy) {
                        let rect: ƒ.Rectangle = getRectWorld((<Enemy>child));
                        let hit: boolean = rect.isInside(this.cmpTransform.local.translation.toVector2());
                        if (hit) {
                            child.onHit();
                            this.destroy();
                            this.kill = true;
                        }
                    }
                }
            }

        }
        protected destroy() {
            if(this.getParent() != null) {
                let parent: ƒ.Node = this.getParent();
                ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                parent.removeChild(this);
            }
        }
    }
}