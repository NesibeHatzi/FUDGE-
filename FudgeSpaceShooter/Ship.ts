namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;
    // import ƒAid = FudgeAid;



    export class Ship extends ƒ.Node {
        private maxSpeed: number = 5;
        private speed: ƒ.Vector3;
        private hitbox: ƒ.Mesh;
        private hitboxNode: ƒ.Node;
        private hitboxSize: ƒ.Vector2 = new ƒ.Vector2(0.5, 0.5);

        private shotTime: number = 0.2;
        private shotCountdown: number = this.shotTime;

        private invulTime: number = 2;
        private invulCountdown: number = this.invulTime;

        private lifePoints: number = 5;

        constructor(_name: string = "PlayerShip") {
            super(_name);
            this.speed = ƒ.Vector3.ZERO();

            this.hitboxNode = new ƒ.Node("Hitbox");
            let material = new ƒ.Material("Hitbox", ƒ.ShaderUniColor, new ƒ.CoatColored(ƒ.Color.CSS("blue", 0.5)));
            this.hitbox = new ƒ.MeshSprite();
            this.hitboxNode.addComponent(new ƒ.ComponentMaterial(material));
            let cmpHitboxMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(this.hitbox);
            this.hitboxNode.addComponent(cmpHitboxMesh);
            this.hitboxNode.addComponent(new ƒ.ComponentTransform());
            this.hitboxNode.cmpTransform.local.scaleY(this.hitboxSize.y);
            this.hitboxNode.cmpTransform.local.scaleX(this.hitboxSize.x);
            this.appendChild(this.hitboxNode);

            let mesh = new ƒ.MeshQuad();
            let cmpMesh: ƒ.ComponentMesh = new ƒ.ComponentMesh(mesh);
            this.addComponent(cmpMesh);

            let coat = new ƒ.CoatTextured();
            coat.texture = new ƒ.TextureImage();
            let image = document.querySelector("img")
            coat.texture.image = image;


            let playerShipMaterial = new ƒ.Material("PlayerShipMat", ƒ.ShaderTexture, coat);
            let playerCmpMaterial = new ƒ.ComponentMaterial(playerShipMaterial);
            this.addComponent(playerCmpMaterial);

            this.addComponent(new ƒ.ComponentTransform());
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);


        }

        private update = (_event: Event): void => {
            if (this.lifePoints > 0) {
                let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
                this.cmpTransform.local.translateX(this.maxSpeed * this.speed.x * timeDelta);
                this.cmpTransform.local.translateY(this.maxSpeed * this.speed.y * timeDelta)
                if (this.shotCountdown < this.shotTime) {

                    this.shotCountdown += timeDelta;
                }
                if (this.shotCountdown >= this.shotTime)
                    this.shotCountdown = this.shotTime;
                if (this.invulCountdown < this.invulTime) {
                    this.invulCountdown += timeDelta;
                }
                if (this.invulCountdown >= this.invulTime){
                    this.invulCountdown = this.invulTime;
                }

                    this.checkCollision();
                }
            }

        public move(_direction: DIRECTION) {
            switch (_direction) {
                case DIRECTION.LEFT:
                    this.speed.x = -1;
                    break;
                case DIRECTION.RIGHT:
                    this.speed.x = 1;
                    break;
                case DIRECTION.UP:
                    this.speed.y = 1;
                    break;
                case DIRECTION.DOWN:
                    this.speed.y = -1;
                    break;
                default:
                case DIRECTION.NEUTRAL:
                    this.speed.x = 0;
                    this.speed.y = 0;
                    break;
            }
        }

        public shoot() {
            if (this.shotCountdown >= this.shotTime) {
                let zap:HTMLAudioElement = document.querySelector("#zap");
                zap.play();
                let direction: ƒ.Vector3 = new ƒ.Vector3(0, 1, 0);
                let bullet: Bullet = new Bullet("PlayerBullet", this.cmpTransform.local.translation, direction);
                bullets.addChild(bullet);
                this.shotCountdown = 0;
            }
        }

        public getLife(): number {
            return this.lifePoints;
        }

        public setLife(_n: number): void {
            this.lifePoints = _n;
        }

        public getHitbox(): ƒ.Rectangle {
            return getRectWorld(this.hitboxNode);
        }

        protected checkCollision(): void {
            for (let child of enemies.getChildren()) {
                if (child instanceof Enemy) {
                    let rect: ƒ.Rectangle = getRectWorld((<Enemy>child));
                    let hit: boolean = rect.isInside(this.cmpTransform.local.translation.toVector2());
                    if (hit) {
                        child.onHit();
                        this.onHit();
                    }
                }
            }
        }

        public onHit() {
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
        public destroy() {
            let parent: ƒ.Node = this.getParent();
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
            parent.removeChild(this);
        }
    }



}