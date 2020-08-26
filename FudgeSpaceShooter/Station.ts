namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;
    //Stationary Enemy that comes from the top to a random y position on a random x position and starts shooting.
    export class Station extends Enemy {
        protected lifePoints:number = 3;
        protected maxSpeed:number = 5;
        private targetDestination: ƒ.Vector3;
        private offsetY: number = 4
        private offsetX: number = 2
        private destinationReached: boolean = false;
        private shotNumber:number = 1

        constructor(_name: string) {
            super(_name);
            this.shotDirection.y = -1
            this.targetDestination = ƒ.Vector3.ZERO();
            this.targetDestination.x = rand.getRange(screenBottomRight.x - this.offsetX, screenTopLeft.x + this.offsetX);
            this.targetDestination.y = rand.getRange(screenTopLeft.y - this.offsetY / 2, screenTopLeft.y - this.offsetY);
            let direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
            // let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
            direction.x = (this.cmpTransform.local.translation.x - this.targetDestination.x);
            direction.y = (this.cmpTransform.local.translation.y - this.targetDestination.y);
        }

        protected attack() {
            if (this.destinationReached) {
                let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;

            if(this.shotCountdown >= this.shotTime) {
                for(let i:number = 0; i < this.shotNumber; i++){
                    // let enemyZap:HTMLAudioElement = document.querySelector("#enemyzap");
                    // enemyZap.play();
                    let bullet:EnemyBullet = new EnemyBullet("EnemyBullet", this.cmpTransform.local.translation, this.shotDirection, ƒ.Color.CSS("GREEN"));
                    bullets.addChild(bullet);
                    this.shotDirection.x = rand.getRange(-1,1);;
                }

                this.shotCountdown = 0;
            }
            else if(this.shotCountdown < this.shotTime) {

                this.shotCountdown += timeDelta;
            }
            }
        }

        protected move() {
            if(this.destinationReached == false) {
                let currentPos: ƒ.Vector3 = this.cmpTransform.local.translation;
                let distance: ƒ.Vector3 = ƒ.Vector3.DIFFERENCE(currentPos, this.targetDestination);
                let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
                let direction: ƒ.Vector3 = ƒ.Vector3.ZERO();
                direction.x = distance.x < 0 ? 1 : -1
                direction.y = distance.y < 0 ? 1 : -1;
                // console.log(distance.magnitude);
                if(distance.magnitude > 0.5){
                    direction.scale(this.maxSpeed);
                }
                direction.scale(timeDelta);
                if(distance.magnitude < 0.1) 
                    this.destinationReached = true;
                // console.log(direction.toString());
                this.cmpTransform.local.translate(direction);
            }

            
        }
    }
}