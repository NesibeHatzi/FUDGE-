"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    class Streamer extends FudgeSpaceShooter.Enemy {
        constructor(_name) {
            super(_name);
            this.lifePoints = 1;
            this.shotNumber = 2;
            this.shotDirection.y = 1;
            this.shotDirection.x = -1;
        }
        attack() {
            let timeDelta = ƒ.Loop.timeFrameGame / 1000;
            if (this.shotCountdown >= this.shotTime) {
                for (let i = 0; i < this.shotNumber; i++) {
                    // let enemyZap:HTMLAudioElement = document.querySelector("#enemyzap");
                    // enemyZap.play();
                    let bullet = new FudgeSpaceShooter.EnemyBullet("EnemyBullet", this.cmpTransform.local.translation, this.shotDirection, ƒ.Color.CSS("GREEN"));
                    FudgeSpaceShooter.bullets.addChild(bullet);
                    this.shotDirection.x = FudgeSpaceShooter.rand.getRange(-1, 1);
                    ;
                }
                this.shotCountdown = 0;
            }
            else if (this.shotCountdown < this.shotTime) {
                this.shotCountdown += timeDelta;
            }
        }
    }
    FudgeSpaceShooter.Streamer = Streamer;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Streamer.js.map