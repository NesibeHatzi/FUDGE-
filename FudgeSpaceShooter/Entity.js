"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    // import ƒ = FudgeCore;
    let DIRECTION;
    (function (DIRECTION) {
        DIRECTION[DIRECTION["UP"] = 0] = "UP";
        DIRECTION[DIRECTION["DOWN"] = 1] = "DOWN";
        DIRECTION[DIRECTION["LEFT"] = 2] = "LEFT";
        DIRECTION[DIRECTION["RIGHT"] = 3] = "RIGHT";
        DIRECTION[DIRECTION["NEUTRAL"] = 4] = "NEUTRAL";
    })(DIRECTION = FudgeSpaceShooter.DIRECTION || (FudgeSpaceShooter.DIRECTION = {}));
    class Entity extends ƒ.Node {
        constructor(_name) {
            super(_name);
            this.maxSpeed = 5;
            this.hitboxSize = new ƒ.Vector2(0.5, 0.5);
            this.speed = ƒ.Vector3.ZERO();
        }
        destroy() {
            let parent = this.getParent();
            parent.removeChild(this);
        }
    }
    FudgeSpaceShooter.Entity = Entity;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Entity.js.map