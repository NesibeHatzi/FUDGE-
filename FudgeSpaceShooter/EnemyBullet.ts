namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;
    export class EnemyBullet extends Bullet {

        protected lifeTime: number = 1;
        protected shotTime: number = 0;
        protected velocity: number = 0.5;
        constructor(_name: string, _pos: ƒ.Vector3, _direction?: ƒ.Vector3, _color?: ƒ.Color) {
            super(_name, _pos, _direction, _color)
            this.speed = this.direction;
            this.speed.scale(this.velocity)
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
           
            if(player != null && this.kill != true) {
            let rect: ƒ.Rectangle = getRectWorld(player);
            let hit: boolean = rect.isInside(this.cmpTransform.local.translation.toVector2());
            if (hit) {
                player.onHit();
                this.destroy();
            }
           }
        }


    }
}