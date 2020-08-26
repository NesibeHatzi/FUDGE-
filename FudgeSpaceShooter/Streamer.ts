namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;

    export class Streamer extends Enemy {
        protected lifePoints:number = 1;
        private shotNumber:number = 2
        constructor(_name:string) {
            super(_name);
            this.shotDirection.y = 1
            this.shotDirection.x = -1
        }

        protected attack() {
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

}