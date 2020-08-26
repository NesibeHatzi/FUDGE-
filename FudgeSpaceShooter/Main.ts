namespace FudgeSpaceShooter {
    import ƒ = FudgeCore;
    // import ƒAid = FudgeAid;

    enum GAME_STATE {
        INIT, START, MENU, PLAY, OVER
    }
    interface KeyPressed {
        [code: string]: boolean;
    }
    let keysPressed: KeyPressed = {};

    // let canvas: HTMLCanvasElement;
    // let crc2: CanvasRenderingContext2D;

    let camera: ƒ.Node;
    let viewport: ƒ.Viewport;
    export let player: Ship;
    export let enemies: ƒ.Node;
    export let bullets: ƒ.Node;
    export let game: ƒ.Node;
    export let screenTopLeft: ƒ.Vector3 = new ƒ.Vector3(-7, 4.5);
    export let screenBottomRight: ƒ.Vector3 = new ƒ.Vector3(7, -4.5);
    export let gameState:GAME_STATE;

    export let rand: ƒ.Random = new ƒ.Random();

    export let bgm: HTMLAudioElement; 

    let spawntime:number = 3;
    let spawnCountdown: number = spawntime;
    let maxEnemyCount:number = 5;
    let playerLife: number = 5;

    let points:number = 0;
    let dispayScore: number = 0;
    let highscore: number = 0;



    window.addEventListener("load", initGame);

    function initGame(_event: Event) {
        gameState = GAME_STATE.INIT;
        const canvas = document.querySelector("canvas");
        game = new ƒ.Node("Game");


        let cam = new ƒ.ComponentCamera();
        cam.pivot.translateZ(15);
        cam.pivot.rotateY(180);

        camera = new ƒ.Node("Camera");
        camera.addComponent(cam);
        camera.addComponent(new ƒ.ComponentTransform());

        viewport = new ƒ.Viewport();
        viewport.initialize("Viewport", game, cam, canvas);

        viewport.draw();
        document.addEventListener("keydown", handleKeyboard);
        document.addEventListener("keyup", handleKeyboard);
        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        ƒ.Loop.start(ƒ.LOOP_MODE.TIME_GAME, 60);

        bgm = document.querySelector("#bgm");
        initMenu()
    }

    function initMenu() {
        bgm.load();
        bgm.pause();

        //Start Button
        let divButtonContainer:HTMLDivElement = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "<h1>Main Menu</h1>"
        let btnStart:HTMLButtonElement = document.createElement("button");
        btnStart.innerHTML = "New Game";
        btnStart.addEventListener("click", startGame);
        divButtonContainer.appendChild(btnStart);

        //Difficulty Settings
        let divDifficultyContainer:HTMLDivElement = document.querySelector("#DifficultyContainer");
        let difficulty: HTMLSelectElement = document.createElement("select");
        difficulty.id = "Difficulty";
        let easy: HTMLOptionElement = document.createElement("option");
        easy.textContent = "Easy";
        easy.value = "easy";
        difficulty.appendChild(easy);
        let normal: HTMLOptionElement = document.createElement("option");
        normal.textContent = "Normal";
        normal.value = "normal";
        difficulty.appendChild(normal);
        let hard: HTMLOptionElement = document.createElement("option");
        hard.textContent = "Hard";
        hard.value = "hard";
        difficulty.appendChild(hard);
        let controls: HTMLDivElement = document.createElement("div");
        controls.textContent = "Controls - WASD to move, Space to shoot";
        let difficultyDesc: HTMLDivElement = document.createElement("div");
        difficultyDesc.id = "DifficultyDesc";
        difficultyDesc.innerHTML = "Difficulty: Easy - You have 10 Hearts";
        difficulty.addEventListener("input", setDifficulty);

        divButtonContainer.appendChild(difficulty);
        divDifficultyContainer.appendChild(difficultyDesc);
        gameState = GAME_STATE.MENU;
    }

    function setDifficulty(_event: Event) {
        let difficulty:HTMLSelectElement = document.querySelector("#Difficulty")
        let difficultyDesc: HTMLDivElement = document.querySelector("#DifficultyDesc")

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
        gameState = GAME_STATE.START;
        let divButtonContainer:HTMLDivElement = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "";
        let divDifficultyContainer:HTMLDivElement = document.querySelector("#DifficultyContainer");
        divDifficultyContainer.innerHTML = "";
        initLevel();
        bgm.loop = true;
        bgm.play();
        gameState = GAME_STATE.PLAY
    }
    function restartGame() {
        destroyLevel();
        startGame();
    }
    function backToMenu() {
        let divButtonContainer:HTMLDivElement = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "";
        destroyLevel();
        initMenu();
    }

    function gameOver() {
        highscore = dispayScore;
        points = 0;
        dispayScore = 0;
        let divButtonContainer:HTMLDivElement = document.querySelector("#ButtonContainer");
        divButtonContainer.innerHTML = "<h1>GAME OVER</h1>";
        let btnStart:HTMLButtonElement = document.createElement("button");
        btnStart.innerHTML = "Try Again";
        btnStart.addEventListener("click", restartGame);
        divButtonContainer.appendChild(btnStart);
        let btnMenu:HTMLButtonElement = document.createElement("button");
        btnMenu.innerHTML = "Back to Menu";
        btnMenu.addEventListener("click", backToMenu);
        divButtonContainer.appendChild(btnMenu);

    }

    function initLevel() {
        player = new Ship("Player");
        player.setLife(playerLife);
        game.appendChild(player);
        enemies = new ƒ.Node("Enemies");
        game.appendChild(enemies);
        bullets = new ƒ.Node("Bullets");
        game.appendChild(bullets);
    }
    function destroyLevel() {
        for (let child of enemies.getChildren()) {
            (<Enemy>child).destroy();
        }
        for (let child of bullets.getChildren()) {
            bullets.removeChild(child);
        }
        game.removeChild(enemies);
        game.removeChild(bullets);
        game.removeChild(player);
    }
    function handleKeyboard(_event: KeyboardEvent): void {
        keysPressed[_event.code] = (_event.type == "keydown");
    }

    export function score(_n:number) {
        points += _n;
        console.log("New Score: " + points)
    }

    function processInput(): void {
        if (keysPressed[ƒ.KEYBOARD_CODE.A]) {
            player.move(DIRECTION.LEFT);
        }
        else if (keysPressed[ƒ.KEYBOARD_CODE.D]) {
            player.move(DIRECTION.RIGHT);
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.W]) {
            player.move(DIRECTION.UP);
        }
        else if (keysPressed[ƒ.KEYBOARD_CODE.S]) {
            player.move(DIRECTION.DOWN);
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.SPACE]) {
            // console.log(player.cmpTransform.local.translation.toString());
            player.shoot();
        }
        if (keysPressed[ƒ.KEYBOARD_CODE.F]) {
            let enemy:Streamer = new Streamer("Enemy");
            enemies.addChild(enemy);
        }
        if (!keysPressed[ƒ.KEYBOARD_CODE.A] && !keysPressed[ƒ.KEYBOARD_CODE.D] && !keysPressed[ƒ.KEYBOARD_CODE.W] && !keysPressed[ƒ.KEYBOARD_CODE.S]) {
            player.move(DIRECTION.NEUTRAL);
        }
        if ((player.cmpTransform.local.translation.x >= screenBottomRight.x))
            player.cmpTransform.local.translation = new ƒ.Vector3(screenBottomRight.x - 0.05, player.cmpTransform.local.translation.y, player.cmpTransform.local.translation.z);
        if ((player.cmpTransform.local.translation.x <= screenTopLeft.x))
            player.cmpTransform.local.translation = new ƒ.Vector3(screenTopLeft.x + 0.05, player.cmpTransform.local.translation.y, player.cmpTransform.local.translation.z);
        if ((player.cmpTransform.local.translation.y >= screenTopLeft.y))
            player.cmpTransform.local.translation = new ƒ.Vector3(player.cmpTransform.local.translation.x, screenTopLeft.y - 0.05, player.cmpTransform.local.translation.z);
        if ((player.cmpTransform.local.translation.y <= screenBottomRight.y))
            player.cmpTransform.local.translation = new ƒ.Vector3(player.cmpTransform.local.translation.x, screenBottomRight.y + 0.05, player.cmpTransform.local.translation.z);
    }
    
    function processLevel() {
        let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
        if(spawnCountdown >= spawntime) {
            if(enemies.nChildren < maxEnemyCount) {
                let i:number = rand.getRange(0, 5);
                switch (Math.round(i)) {
                    case 0:
                        for(let i: number = 0; i < 4; i++){
                            let enemy:Enemy = new Enemy("streaker");
                            enemies.appendChild(enemy);
                        }
                        break;
                    case 1: 
                    for(let i: number = 0; i < 3; i++){
                        let enemy:Enemy = new Streamer("streamer");
                        enemies.appendChild(enemy);
                    }
                        break;
                    case 2:
                        let streamer: Streamer = new Streamer("streamer");
                        for(let i: number = 0; i < 3; i++){
                            let enemy:Enemy = new Enemy("streaker");
                            enemies.appendChild(enemy);
                        }
                        enemies.appendChild(streamer);
                        break;
                    case 3:
                        for(let i: number = 0; i < 2; i++){
                            let enemy:Station = new Station("station");
                            enemies.appendChild(enemy);
                        }
                        break;
                    case 4:
                        for(let i: number = 0; i < 4; i++){
                            let enemy:Enemy = new Enemy("streaker");
                            enemies.appendChild(enemy);
                        }
                        for(let i: number = 0; i < 2; i++){
                            let enemy:Station = new Station("station");
                            enemies.appendChild(enemy);
                        }
                        break;
                    case 5:
                        break;
                }
            }
            spawnCountdown = 0;
        }
        if(player.getLife() <= 0) {
            gameState = GAME_STATE.OVER;
            gameOver();
        }
        spawnCountdown += timeDelta;
    }

    function ProcessUI() {
        let timeDelta: number = ƒ.Loop.timeFrameGame / 1000;
        let spanScoreContainer:HTMLDivElement = document.querySelector("#ScoreContainer");
        let HeartContainer:HTMLDivElement = document.querySelector("#HeartContainer");
        if(dispayScore > points) {
            dispayScore = points;
            if(points > highscore) {
                highscore = points;
            }
        }
        else if (dispayScore < points){
            dispayScore += 1000 * timeDelta;
            if(points > dispayScore && points > highscore) {
                highscore = dispayScore;
            }
            else if (points > highscore) {
                highscore = points;
            }
        }

        console.clear()
        console.log("Display Score: " + dispayScore + " highscore: " + highscore + " actual score: " + points);
        spanScoreContainer.innerHTML = "Score: "+ Math.round(dispayScore) + " Highscore: " + Math.round(highscore);
        HeartContainer.innerHTML = "";
        if(player.getLife() > 0) {
            for (let i: number = 0; i < player.getLife(); i++) {
                HeartContainer.innerHTML += "❤";
            }
        }
    }

    function update(_event: ƒ.Eventƒ): void {

        if(gameState == GAME_STATE.PLAY){
            processInput();
            processLevel();
            ProcessUI();
        }
        viewport.draw();
    }


    export function getRectWorld(_node: ƒ.Node): ƒ.Rectangle {
        let trans: ƒ.ComponentTransform = _node.getComponent(ƒ.ComponentTransform);

        let rect: ƒ.Rectangle = ƒ.Rectangle.GET(0, 0, 100, 100);
        let pos: ƒ.Vector3 = trans.local.translation;
        let scl: ƒ.Vector3 = trans.local.scaling;
        let topleft: ƒ.Vector3 = new ƒ.Vector3((pos.x - scl.x / 2), (pos.y + scl.y), (pos.z));
        let bottomright: ƒ.Vector3 = new ƒ.Vector3((pos.x + scl.x / 2), (pos.y), (pos.z));

        let size: ƒ.Vector2 = new ƒ.Vector2(bottomright.x - topleft.x, bottomright.y - topleft.y);
        rect.position = topleft.toVector2();
        rect.size = size;

        return rect;
    }
}

