function saveGame(){
    let saveData = {

        // --------------------
        // SAVE VERSION
        // --------------------

        saveVersion: 1,


        // --------------------
        // MAIN PROGRESS
        // --------------------

        score: score,

        rebirths: rebirths,
        fullRebirths: fullRebirths,


        // --------------------
        // UPGRADES
        // --------------------

        income: income,
        incomeCost: incomeCost,

        automoverTimer: automoverTimer,
        automoverUpgradeCost: automoverUpgradeCost,

        scoreMultiplier: scoreMultiplier,
        scoreMultiplierCost: scoreMultiplierCost,

        luckyUpgrade: luckyUpgrade,
        luckyCost: luckyCost,

        clickUpgrade: clickUpgrade,
        clickCost: clickCost,

        jackpot: jackpot,
        jackpotCost: jackpotCost,


        // --------------------
        // NORMAL BALL SHOP COSTS
        // --------------------

        standardBallScore: standardBallScore,
        bigBallScore: bigBallScore,
        redBallScore: redBallScore,
        automoverScore: automoverScore,
        goldenBallScore: goldenBallScore,
        tinyBallScore: tinyBallScore,
        luckyBallScore: luckyBallScore,


        // --------------------
        // BLACK HOLE
        // --------------------

        eaten: eaten,


        // --------------------
        // BALLS CURRENTLY ON BOARD
        // --------------------

        balls: balls.map(ball => ball.type)
    };


    localStorage.setItem(
        "ballGameSave",
        JSON.stringify(saveData)
    );
}

function loadGame(){

    let savedGame = localStorage.getItem("ballGameSave");


    // --------------------
    // NO SAVE EXISTS
    // --------------------

    if(savedGame == null){
        return;
    }


    let saveData = JSON.parse(savedGame);


    // --------------------
    // LOAD MAIN PROGRESS
    // --------------------

    score = saveData.score ?? 1;

    rebirths = saveData.rebirths ?? 0;
    fullRebirths = saveData.fullRebirths ?? 0;


    // --------------------
    // LOAD UPGRADES
    // --------------------

    income = saveData.income ?? 0;
    incomeCost = saveData.incomeCost ?? 25;

    automoverTimer = saveData.automoverTimer ?? 1000;
    automoverUpgradeCost =
        saveData.automoverUpgradeCost ?? 100;

    scoreMultiplier = saveData.scoreMultiplier ?? 1;
    scoreMultiplierCost =
        saveData.scoreMultiplierCost ?? 200;

    luckyUpgrade = saveData.luckyUpgrade ?? 0;
    luckyCost = saveData.luckyCost ?? 20000;

    clickUpgrade = saveData.clickUpgrade ?? 0;
    clickCost = saveData.clickCost ?? 10;

    jackpot = saveData.jackpot ?? 100;
    jackpotCost = saveData.jackpotCost ?? 10000;


    // --------------------
    // LOAD BALL SHOP COSTS
    // --------------------

    standardBallScore =
        saveData.standardBallScore ?? 1;

    bigBallScore =
        saveData.bigBallScore ?? 30;

    redBallScore =
        saveData.redBallScore ?? 40;

    automoverScore =
        saveData.automoverScore ?? 120;

    goldenBallScore =
        saveData.goldenBallScore ?? 1000;

    tinyBallScore =
        saveData.tinyBallScore ?? 50;

    luckyBallScore =
        saveData.luckyBallScore ?? 10000;


    // --------------------
    // LOAD BLACK HOLE PROGRESS
    // --------------------

    eaten = saveData.eaten ?? 0;


    // --------------------
    // CALCULATE FULL REBIRTH COST
    // --------------------

    fullRebirthCost =
        100000000 * Math.pow(5, fullRebirths);


    // --------------------
    // CLEAR CURRENT BALLS
    // PREVENT DUPLICATES IF LOADGAME
    // IS EVER CALLED MORE THAN ONCE
    // --------------------

    while(balls.length > 0){
        balls[0].remove();
    }


    // --------------------
    // RECREATE SAVED BALLS
    // --------------------

    let savedBalls = saveData.balls ?? [];

    for(let type of savedBalls){
        new Ball(type);
    }


    // --------------------
    // RECALCULATE BALL COUNTERS
    // FROM ACTUAL SAVED BALLS
    // --------------------

    noOfGoldenBalls = 0;
    noOfLuckyBall = 0;

    hasBlackHole = false;
    hasPersistentBall = false;
    hasPulseBall = false;

    for(let ball of balls){

        if(ball.type == "golden"){
            noOfGoldenBalls++;
        }

        if(ball.type == "lucky"){
            noOfLuckyBall++;
        }

        if(ball.type == "blackHole"){
            hasBlackHole = true;
        }

        if(ball.type == "persistent"){
            hasPersistentBall = true;
        }

        if(ball.type == "pulse"){
            hasPulseBall = true;
        }
    }


    // --------------------
    // UPDATE MAIN DISPLAY
    // --------------------

    document.getElementById("showScore").textContent =
        "Score: " + score;

    document.getElementById("rebirthShow").textContent =
        "Rebirths: " + rebirths;

    document.getElementById("rebithCostShow").textContent =
        "Cost: " +
        Math.pow(3, rebirths) * 1000000;

    document.getElementById("fullRebirthButton").textContent =
        "Cost: " +
        fullRebirthCost +
        " and 10 Rebirths";


    // --------------------
    // UPDATE NORMAL BALL SHOP
    // --------------------

    document.getElementById("standardButton").textContent =
        "Cost: " + standardBallScore;

    document.getElementById("bigButton").textContent =
        "Cost: " + bigBallScore;

    document.getElementById("redButton").textContent =
        "Cost: " + redBallScore;

    document.getElementById("automoverButton").textContent =
        "Cost: " + automoverScore;

    document.getElementById("tinyButton").textContent =
        "Cost: " + tinyBallScore;


    if(noOfGoldenBalls >= 10){
        document.getElementById("goldenButton").textContent =
            "MAX";
    }
    else{
        document.getElementById("goldenButton").textContent =
            "Cost: " + goldenBallScore;
    }


    if(noOfLuckyBall >= 5){
        document.getElementById("luckyButton").textContent =
            "MAX";
    }
    else{
        document.getElementById("luckyButton").textContent =
            "Cost: " + luckyBallScore;
    }


    if(hasBlackHole){
        document.getElementById("blackHoleButton").textContent =
            "MAX";
    }
    else{
        document.getElementById("blackHoleButton").textContent =
            "Cost: 100000000";
    }


    // --------------------
    // UPDATE UPGRADE SHOP
    // --------------------

    document.getElementById("upgradeClickButton").textContent =
        "Cost: " + clickCost;

    document.getElementById("upgradeIncomeButton").textContent =
        "Cost: " + incomeCost;

    document.getElementById("upgradeMultiplierButton").textContent =
        "Cost: " + scoreMultiplierCost;

    document.getElementById("showMultiplier").textContent =
        "Upgrade Multiplier x" + scoreMultiplier;


    if(automoverTimer <= 100){

        automoverTimer = 100;

        document.getElementById(
            "upgradeAutomoverButton"
        ).textContent = "MAX";
    }
    else{
        document.getElementById(
            "upgradeAutomoverButton"
        ).textContent =
            "Cost: " + automoverUpgradeCost;
    }


    if(luckyUpgrade >= 0.4){

        luckyUpgrade = 0.4;

        document.getElementById(
            "upgradeLuckyBallsButton"
        ).textContent = "MAX";
    }
    else{
        document.getElementById(
            "upgradeLuckyBallsButton"
        ).textContent =
            "Cost: " + luckyCost;
    }


    document.getElementById(
        "upgradeJackpotButton"
    ).textContent =
        "Cost: " + jackpotCost;


    // --------------------
    // RESTORE FULL REBIRTH SHOP
    // --------------------

    if(fullRebirths >= 1){

        document.getElementById(
            "fullRebirthDivider"
        ).classList.add("nowOnDisplay");

        document.getElementById(
            "fullRebirthShop"
        ).classList.add("nowOnDisplay");

        document.getElementById(
            "persistent"
        ).classList.add("nowOnDisplay");
    }


    if(fullRebirths >= 2){

        document.getElementById(
            "pulse"
        ).classList.add("nowOnDisplay");
    }


    // --------------------
    // UPDATE FULL REBIRTH BALL BUTTONS
    // --------------------

    if(hasPersistentBall){
        document.getElementById(
            "persistentBallButton"
        ).textContent = "MAX";
    }
    else{
        document.getElementById(
            "persistentBallButton"
        ).textContent =
            "Cost: 10000000";
    }


    if(hasPulseBall){
        document.getElementById(
            "pulseBallButton"
        ).textContent = "MAX";
    }
    else{
        document.getElementById(
            "pulseBallButton"
        ).textContent =
            "Cost: 100000000";
    }


    // --------------------
    // SHOW NEXT FULL REBIRTH BALL
    // --------------------

    if(fullRebirths < newBalls.length){

        let newBallName =
            newBalls[fullRebirths];

        let capitalisedBallName =
            newBallName.charAt(0).toUpperCase() +
            newBallName.slice(1);

        document.getElementById(
            "nextFullRebirth"
        ).textContent =
            "Next Full Rebirth Grants: " +
            capitalisedBallName +
            " Ball";
    }
    else{
        document.getElementById(
            "nextFullRebirth"
        ).textContent =
            "All Full Rebirth Balls Unlocked";
    }
}

loadGame();
setInterval(saveGame, 5000);

function manualSave(){
    saveGame();
}

function fullResetGame(){
    let background = document.createElement("div");
    background.id = "resetBackground";

    background.style.position = "fixed";
    background.style.top = "0";
    background.style.left = "0";
    background.style.width = "100%";
    background.style.height = "100%";
    background.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    background.style.display = "flex";
    background.style.justifyContent = "center";
    background.style.alignItems = "center";
    background.style.zIndex = "1000";


    let box = document.createElement("div");

    box.style.backgroundColor = "#1a1a1a";
    box.style.color = "white";
    box.style.padding = "25px";
    box.style.borderRadius = "12px";
    box.style.textAlign = "center";


    let text = document.createElement("p");
    text.textContent = "Are you sure you want to start over?";


    let yesButton = document.createElement("button");
    yesButton.textContent = "Yes";

    let noButton = document.createElement("button");
    noButton.textContent = "No";


    yesButton.onclick = () => {
        localStorage.removeItem("ballGameSave");
        location.reload();
    };


    noButton.onclick = () => {
        background.remove();
    };


    box.appendChild(text);
    box.appendChild(yesButton);
    box.appendChild(noButton);

    background.appendChild(box);

    document.body.appendChild(background);
}