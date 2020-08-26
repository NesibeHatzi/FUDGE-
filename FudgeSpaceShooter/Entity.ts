namespace FudgeSpaceShooter {
    // import ƒ = FudgeCore;

    export enum DIRECTION {
        UP,
        DOWN,
        LEFT,
        RIGHT,
        NEUTRAL
    }

    export class Entity extends ƒ.Node {
        protected maxSpeed: number = 5;
        protected speed: ƒ.Vector3;
        protected hitbox: ƒ.Mesh;
        protected hitboxNode: ƒ.Node;
        protected hitboxSize: ƒ.Vector2 = new ƒ.Vector2(0.5, 0.5);

        constructor(_name: string) {
            super(_name);
            this.speed = ƒ.Vector3.ZERO();
        }

        public destroy() {
            let parent: ƒ.Node = this.getParent();
            
            parent.removeChild(this);
        }
    }
}
