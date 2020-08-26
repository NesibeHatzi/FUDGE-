namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;

    export class Enemy extends Entity {
        protected maxSpeed: number = 10;
        protected lifePoints: number = 1;
        protected shotTime: number = 0.2;
        protected shotCountdown: number = this.shotTime;
        protected shotDirection: ƒ.Vector3;

        constructor(_name: string) {
            super(_name);

            let mesh = new ƒ.MeshSprite();

            let material = new ƒ.Material("Hitbox", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("blue", 0.5)));
            this.addComponent(new ƒ.ComponentMaterial(material));
            this.addComponent(new ƒ.ComponentMesh(mesh));
            this.addComponent(new ƒ.ComponentTransform);

            let spawnX: number = rand.getRange(screenTopLeft.x, screenBottomRight.x);
            let spawnY: number = screenTopLeft.y + 2;
            let spawn: ƒ.Vector3 = new ƒ.Vector3(spawnX, spawnY, 0);
            this.cmpTransform.local.translation = spawn;

            this.shotDirection = ƒ.Vector3.ZERO();
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);

        }

        protected update = (_event: Event): void => {
            this.move();
            this.attack();
            if (this.cmpTransform.local.translation.y < screenBottomRight.y - 3) {
                let parent: ƒ.Node = this.getParent();
                ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                parent.removeChild(this);
            }
        }

        protected move(): void {
            let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
            this.speed.y += -this.maxSpeed * timeDelta;
            if (this.speed.y < -this.maxSpeed) {
                this.speed.y = -this.maxSpeed;
            }
            this.cmpTransform.local.translateY(this.speed.y * timeDelta);
        }

        protected attack(): void {
            //It doesn't directly attack
        }

        public onHit() {
            this.lifePoints -= 1;
            score(100 * this.lifePoints);
            if (this.lifePoints <= 0) {
                this.destroy()
                score(1000 * this.lifePoints)
            }
        }

        public destroy() {
            let parent: ƒ.Node = this.getParent();
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            parent.removeChild(this);
        }
    }
}