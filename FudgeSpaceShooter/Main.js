"use strict";
var FudgeSpaceShooter;
(function (FudgeSpaceShooter) {
    var ƒ = FudgeCore;
    // import ƒAid = FudgeAid;
    let GAME_STATE;
    (function (GAME_STATE) {
        GAME_STATE[GAME_STATE["INIT"] = 0] = "INIT";
        GAME_STATE[GAME_STATE["START"] = 1] = "START";
        GAME_STATE[GAME_STATE["MENU"] = 2] = "MENU";
        GAME_STATE[GAME_STATE["PLAY"] = 3] = "PLAY";
        GAME_STATE[GAME_STATE["OVER"] = 4] = "OVER";
    })(GAME_STATE || (GAME_STATE = {}));
    let keysPressed = {};
    // let canvas: HTMLCanvasElement;
    // let crc2: CanvasRenderingContext2D;
    let camera;
    let viewport;
    FudgeSpaceShooter.screenTopLeft = new ƒ.Vector3(-7, 4.5);
    FudgeSpaceShooter.screenBottomRight = new ƒ.Vector3(7, -4.5);
    FudgeSpaceShooter.rand = new ƒ.Random();
    let spawntime = 3;
    let spawnCountdown = spawntime;
    let maxEnemyCount = 5;
    let playerLife = 5;
    let points = 0;
    let dispayScore = 0;
    let highscore = 0;
    window.addEventListener("load", initGame);
    function initGame(_event) {
        FudgeSpaceShooter.gameState = GAME_STATE.INIT;
        const canvas = document.querySelector("canvas");
        FudgeSpaceShooter.game = new ƒ.Node("Game");
        let cam = new ƒ.ComponentCamera();
        cam.pivot.translateZ(15);
        cam.pivot.rotateY(180);
        camera = new ƒ.Node("Camera");
        camera.addComponent(cam);
        camera.addComponent(new ƒ.ComponentTransform());
        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", FudgeSpaceShooter.game, cam, canvas);
        viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 60);
        FudgeSpaceShooter.bgm = document.querySelector("#bgm");
        initMenu();
    }
    function initMenu() {
        FudgeSpaceShooter.bgm.load();
        FudgeSpaceShooter.bgm.pause();
        //Start Button
        let divButtonContainer = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "<h1>Main Menu</h1>";
        let btnStart = document.createElement("button");
        btnStart.innerHTML = "New Game";
        btnStart.addEventListener("click", startGame);
        divButtonContainer.appendChild(btnStart);
        //Difficulty Settings
        let divDifficultyContainer = document.querySelector("#DifficultyContainer");
        let difficulty = document.createElement("select");
        difficulty.id = "Difficulty";
        let easy = document.createElement("option");
        easy.textContent = "Easy";
        easy.value = "easy";
        difficulty.appendChild(easy);
        let normal = document.createElement("option");
        normal.textContent = "Normal";
        normal.value = "normal";
        difficulty.appendChild(normal);
        let hard = document.createElement("option");
        hard.textContent = "Hard";
        hard.value = "hard";
        difficulty.appendChild(hard);
        let controls = document.createElement("div");
        controls.textContent = "Controls - WASD to move, Space to shoot";
        let difficultyDesc = document.createElement("div");
        difficultyDesc.id = "DifficultyDesc";
        difficultyDesc.innerHTML = "Difficulty: Easy - You have 10 Hearts";
        difficulty.addEventListener("input", setDifficulty);
        divButtonContainer.appendChild(difficulty);
        divDifficultyContainer.appendChild(difficultyDesc);
        FudgeSpaceShooter.gameState = GAME_STATE.MENU;
    }
    function setDifficulty(_event) {
        let difficulty = document.querySelector("#Difficulty");
        let difficultyDesc = document.querySelector("#DifficultyDesc");
        switch (difficulty.selectedOptions[0].value) {
            case "easy":
                difficultyDesc.innerHTML = "Difficulty: Easy - You have 10 Hearts and there are less enemies";
                playerLife = 10;
                maxEnemyCount = 3;
                break;
            case "normal":
                difficultyDesc.innerHTML = "Difficulty: Normal - You have 5 Hearts";
                playerLife = 5;
                maxEnemyCount = 5;
                break;
            case "hard":
                difficultyDesc.innerHTML = "Difficulty: Hard - You have 3 Hearts and there are more enemies";
                playerLife = 3;
                maxEnemyCount = 7;
                break;
        }
    }
    function startGame() {
        FudgeSpaceShooter.gameState = GAME_STATE.START;
        let divButtonContainer = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "";
        let divDifficultyContainer = document.querySelector("#DifficultyContainer");
        divDifficultyContainer.innerHTML = "";
        initLevel();
        FudgeSpaceShooter.bgm.loop = true;
        FudgeSpaceShooter.bgm.play();
        FudgeSpaceShooter.gameState = GAME_STATE.PLAY;
    }
    function restartGame() {
        destroyLevel();
        startGame();
    }
    function backToMenu() {
        let divButtonContainer = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "";
        destroyLevel();
        initMenu();
    }
    function gameOver() {
        highscore = dispayScore;
        points = 0;
        dispayScore = 0;
        let divButtonContainer = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "<h1>GAME OVER</h1>";
        let btnStart = document.createElement("button");
        btnStart.innerHTML = "Try Again";
        btnStart.addEventListener("click", restartGame);
        divButtonContainer.appendChild(btnStart);
        let btnMenu = document.createElement("button");
        btnMenu.innerHTML = "Back to Menu";
        btnMenu.addEventListener("click", backToMenu);
        divButtonContainer.appendChild(btnMenu);
    }
    function initLevel() {
        FudgeSpaceShooter.player = new FudgeSpaceShooter.Ship("Player");
        FudgeSpaceShooter.player.setLife(playerLife);
        FudgeSpaceShooter.game.appendChild(FudgeSpaceShooter.player);
        FudgeSpaceShooter.enemies = new ƒ.Node("Enemies");
        FudgeSpaceShooter.game.appendChild(FudgeSpaceShooter.enemies);
        FudgeSpaceShooter.bullets = new ƒ.Node("Bullets");
        FudgeSpaceShooter.game.appendChild(FudgeSpaceShooter.bullets);
    }
    function destroyLevel() {
        for (let child of FudgeSpaceShooter.enemies.getChildren()) {
            child.destroy();
        }
        for (let child of FudgeSpaceShooter.bullets.getChildren()) {
            FudgeSpaceShooter.bullets.removeChild(child);
        }
        FudgeSpaceShooter.game.removeChild(FudgeSpaceShooter.enemies);
        FudgeSpaceShooter.game.removeChild(FudgeSpaceShooter.bullets);
        FudgeSpaceShooter.game.removeChild(FudgeSpaceShooter.player);
    }
    function handleKeyboard(_event) {
        keysPressed[_event.code] = (_event.type == "keydown");
    }
    function score(_n) {
        points += _n;
        console.log("New Score: " + points);
    }
    FudgeSpaceShooter.score = score;
    function processInput() {
        if (keysPressed[ƒ.KEYBOARD_CODE.A]) {
            FudgeSpaceShooter.player.move(FudgeSpaceShooter.DIRECTION.LEFT);
        }
        else if (keysPressed[ƒ.KEYBOARD_CODE.D]) {
            FudgeSpaceShooter.player.move(FudgeSpaceShooter.DIRECTION.RIGHT);
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.W]) {
            FudgeSpaceShooter.player.move(FudgeSpaceShooter.DIRECTION.UP);
        }
        else if (keysPressed[ƒ.KEYBOARD_CODE.S]) {
            FudgeSpaceShooter.player.move(FudgeSpaceShooter.DIRECTION.DOWN);
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.SPACE]) {
            // console.log(player.cmpTransform.local.translation.toString());
            FudgeSpaceShooter.player.shoot();
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.F]) {
            let enemy = new FudgeSpaceShooter.Streamer("Enemy");
            FudgeSpaceShooter.enemies.addChild(enemy);
        }
        if (!keysPressed[ƒ.KEYBOARD_CODE.A] && !keysPressed[ƒ.KEYBOARD_CODE.D] && !keysPressed[ƒ.KEYBOARD_CODE.W] && !keysPressed[ƒ.KEYBOARD_CODE.S]) {
            FudgeSpaceShooter.player.move(FudgeSpaceShooter.DIRECTION.NEUTRAL);
        }
        if ((FudgeSpaceShooter.player.cmpTransform.local.translation.x >= FudgeSpaceShooter.screenBottomRight.x))
            FudgeSpaceShooter.player.cmpTransform.local.translation = new ƒ.Vector3(FudgeSpaceShooter.screenBottomRight.x - 0.05, FudgeSpaceShooter.player.cmpTransform.local.translation.y, FudgeSpaceShooter.player.cmpTransform.local.translation.z);
        if ((FudgeSpaceShooter.player.cmpTransform.local.translation.x <= FudgeSpaceShooter.screenTopLeft.x))
            FudgeSpaceShooter.player.cmpTransform.local.translation = new ƒ.Vector3(FudgeSpaceShooter.screenTopLeft.x + 0.05, FudgeSpaceShooter.player.cmpTransform.local.translation.y, FudgeSpaceShooter.player.cmpTransform.local.translation.z);
        if ((FudgeSpaceShooter.player.cmpTransform.local.translation.y >= FudgeSpaceShooter.screenTopLeft.y))
            FudgeSpaceShooter.player.cmpTransform.local.translation = new ƒ.Vector3(FudgeSpaceShooter.player.cmpTransform.local.translation.x, FudgeSpaceShooter.screenTopLeft.y - 0.05, FudgeSpaceShooter.player.cmpTransform.local.translation.z);
        if ((FudgeSpaceShooter.player.cmpTransform.local.translation.y <= FudgeSpaceShooter.screenBottomRight.y))
            FudgeSpaceShooter.player.cmpTransform.local.translation = new ƒ.Vector3(FudgeSpaceShooter.player.cmpTransform.local.translation.x, FudgeSpaceShooter.screenBottomRight.y + 0.05, FudgeSpaceShooter.player.cmpTransform.local.translation.z);
    }
    function processLevel() {
        let timeDelta = ƒ.Loop.timeFrameGame / 1000;
        if (spawnCountdown >= spawntime) {
            if (FudgeSpaceShooter.enemies.nChildren < maxEnemyCount) {
                let i = FudgeSpaceShooter.rand.getRange(0, 5);
                switch (Math.round(i)) {
                    case 0:
                        for (let i = 0; i < 4; i++) {
                            let enemy = new FudgeSpaceShooter.Enemy("streaker");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        break;
                    case 1:
                        for (let i = 0; i < 3; i++) {
                            let enemy = new FudgeSpaceShooter.Streamer("streamer");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        break;
                    case 2:
                        let streamer = new FudgeSpaceShooter.Streamer("streamer");
                        for (let i = 0; i < 3; i++) {
                            let enemy = new FudgeSpaceShooter.Enemy("streaker");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        FudgeSpaceShooter.enemies.appendChild(streamer);
                        break;
                    case 3:
                        for (let i = 0; i < 2; i++) {
                            let enemy = new FudgeSpaceShooter.Station("station");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        break;
                    case 4:
                        for (let i = 0; i < 4; i++) {
                            let enemy = new FudgeSpaceShooter.Enemy("streaker");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        for (let i = 0; i < 2; i++) {
                            let enemy = new FudgeSpaceShooter.Station("station");
                            FudgeSpaceShooter.enemies.appendChild(enemy);
                        }
                        break;
                    case 5:
                        break;
                }
            }
            spawnCountdown = 0;
        }
        if (FudgeSpaceShooter.player.getLife() <= 0) {
            FudgeSpaceShooter.gameState = GAME_STATE.OVER;
            gameOver();
        }
        spawnCountdown += timeDelta;
    }
    function ProcessUI() {
        let timeDelta = ƒ.Loop.timeFrameGame / 1000;
        let spanScoreContainer = document.querySelector("#ScoreContainer");
        let HeartContainer = document.querySelector("#HeartContainer");
        if (dispayScore > points) {
            dispayScore = points;
            if (points > highscore) {
                highscore = points;
            }
        }
        else if (dispayScore < points) {
            dispayScore += 1000 * timeDelta;
            if (points > dispayScore && points > highscore) {
                highscore = dispayScore;
            }
            else if (points > highscore) {
                highscore = points;
            }
        }
        console.clear();
        console.log("Display Score: " + dispayScore + " highscore: " + highscore + " actual score: " + points);
        spanScoreContainer.innerHTML = "Score: " + Math.round(dispayScore) + " Highscore: " + Math.round(highscore);
        HeartContainer.innerHTML = "";
        if (FudgeSpaceShooter.player.getLife() > 0) {
            for (let i = 0; i < FudgeSpaceShooter.player.getLife(); i++) {
                HeartContainer.innerHTML += "❤";
            }
        }
    }
    function update(_event) {
        if (FudgeSpaceShooter.gameState == GAME_STATE.PLAY) {
            processInput();
            processLevel();
            ProcessUI();
        }
        viewport.draw();
    }
    function getRectWorld(_node) {
        let trans = _node.getComponent(ƒ.ComponentTransform);
        let rect = ƒ.Rectangle.GET(0, 0, 100, 100);
        let pos = trans.local.translation;
        let scl = trans.local.scaling;
        let topleft = new ƒ.Vector3((pos.x - scl.x / 2), (pos.y + scl.y), (pos.z));
        let bottomright = new ƒ.Vector3((pos.x + scl.x / 2), (pos.y), (pos.z));
        let size = new ƒ.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
        rect.size = size;
        return rect;
    }
    FudgeSpaceShooter.getRectWorld = getRectWorld;
})(FudgeSpaceShooter || (FudgeSpaceShooter = {}));
//# sourceMappingURL=Main.js.map