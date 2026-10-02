function saveGame(){

    // --------------------
    // SAVE NUMBERS SAFELY
    // --------------------

    function saveNumber(value){

        if(value == Infinity){
            return "Infinity";
        }

        return value;
    }


    let saveData = {


        // --------------------
        // SAVE VERSION
        // --------------------

        saveVersion: 5,


        // --------------------
        // MAIN PROGRESS
        // --------------------

        score: saveNumber(score),

        rebirths: rebirths,
        fullRebirths: fullRebirths,


        // --------------------
        // UPGRADES
        // --------------------

        income: income,
        incomeCost: saveNumber(incomeCost),

        automoverTimer: automoverTimer,
        automoverUpgradeCost:
            saveNumber(automoverUpgradeCost),

        scoreMultiplier: scoreMultiplier,
        scoreMultiplierCost:
            saveNumber(scoreMultiplierCost),

        luckyUpgrade: luckyUpgrade,
        luckyCost: saveNumber(luckyCost),

        clickUpgrade: clickUpgrade,
        clickCost: saveNumber(clickCost),

        jackpot: saveNumber(jackpot),
        jackpotCost: saveNumber(jackpotCost),
        jackpotUpgrades: jackpotUpgrades,


        // --------------------
        // NORMAL BALL SHOP COSTS
        // --------------------

        standardBallScore:
            saveNumber(standardBallScore),

        bigBallScore:
            saveNumber(bigBallScore),

        redBallScore:
            saveNumber(redBallScore),

        automoverScore:
            saveNumber(automoverScore),

        goldenBallScore:
            saveNumber(goldenBallScore),

        tinyBallScore:
            saveNumber(tinyBallScore),

        luckyBallScore:
            saveNumber(luckyBallScore),


        // --------------------
        // BLACK HOLE
        // --------------------

        eaten: eaten,


        // --------------------
        // BALLS CURRENTLY ON BOARD
        // --------------------

        balls: balls.map(ball => ball.type),


        // --------------------
        // CHAIN BALL
        //
        // Chain is not stored in balls[],
        // so it must be saved separately.
        // --------------------

        chainBall: chain != null

    };


    localStorage.setItem(
        "ballGameSave",
        JSON.stringify(saveData)
    );
}

function loadGame(){

    let savedGame =
        localStorage.getItem("ballGameSave");


    // --------------------
    // NO SAVE EXISTS
    // --------------------

    if(savedGame == null){
        return;
    }


    let saveData;

    try{
        saveData = JSON.parse(savedGame);
    }

    catch{
        return;
    }


    // --------------------
    // LOAD NUMBERS SAFELY
    // --------------------

    function loadNumber(value, defaultValue){

        if(value === "Infinity"){
            return Infinity;
        }

        /*
            Old saves could turn Infinity
            into null through JSON.stringify().
        */

        if(value === null){
            return Infinity;
        }

        if(value === undefined){
            return defaultValue;
        }

        return value;
    }


    // --------------------
    // LOAD MAIN PROGRESS
    // --------------------

    score =
        loadNumber(saveData.score, 1);

    rebirths =
        saveData.rebirths ?? 0;

    fullRebirths =
        saveData.fullRebirths ?? 0;


    // --------------------
    // LOAD UPGRADES
    // --------------------

    income =
        saveData.income ?? 0;

    incomeCost =
        loadNumber(
            saveData.incomeCost,
            25
        );


    automoverTimer =
        saveData.automoverTimer ?? 1000;

    automoverUpgradeCost =
        loadNumber(
            saveData.automoverUpgradeCost,
            100
        );


    scoreMultiplier =
        saveData.scoreMultiplier ?? 1;

    scoreMultiplierCost =
        loadNumber(
            saveData.scoreMultiplierCost,
            200
        );


    luckyUpgrade =
        saveData.luckyUpgrade ?? 0;

    luckyCost =
        loadNumber(
            saveData.luckyCost,
            20000
        );


    clickUpgrade =
        saveData.clickUpgrade ?? 0;

    clickCost =
        loadNumber(
            saveData.clickCost,
            10
        );


    jackpot =
        loadNumber(
            saveData.jackpot,
            100
        );

    jackpotCost =
        loadNumber(
            saveData.jackpotCost,
            10000
        );

    /*
        Version 5 saves the number of
        Jackpot upgrades directly.

        Older saves did not have this value.
    */

    jackpotUpgrades =
        saveData.jackpotUpgrades ?? 0;


    // --------------------
    // LOAD BALL SHOP COSTS
    // --------------------

    standardBallScore =
        loadNumber(
            saveData.standardBallScore,
            1
        );

    bigBallScore =
        loadNumber(
            saveData.bigBallScore,
            30
        );

    redBallScore =
        loadNumber(
            saveData.redBallScore,
            40
        );

    automoverScore =
        loadNumber(
            saveData.automoverScore,
            120
        );

    goldenBallScore =
        loadNumber(
            saveData.goldenBallScore,
            1000
        );

    tinyBallScore =
        loadNumber(
            saveData.tinyBallScore,
            50
        );

    luckyBallScore =
        loadNumber(
            saveData.luckyBallScore,
            10000
        );


    // --------------------
    // LOAD BLACK HOLE
    // --------------------

    eaten =
        saveData.eaten ?? 0;


    // --------------------
    // CALCULATE PRESTIGE COST
    // --------------------

    fullRebirthCost =
        500000000000 *
        Math.pow(5, fullRebirths);


    // --------------------
    // CLEAR CURRENT CHAIN
    // --------------------

    if(chain != null){
        chain.remove();
    }


    // --------------------
    // CLEAR CURRENT BALLS
    // --------------------

    while(balls.length > 0){
        balls[0].remove();
    }


    // --------------------
    // RESET BALL COUNTERS
    // --------------------

    noOfGoldenBalls = 0;
    noOfLuckyBall = 0;
    noOfCornerBalls = 0;

    hasBlackHole = false;

    hasPersistentBall = false;
    hasPulseBall = false;
    hasOrbiterBall = false;
    hasChainBall = false;


    // --------------------
    // SAVED BALLS
    // --------------------

    let savedBalls =
        saveData.balls ?? [];


    /*
        Version 4+ saves Chain separately.

        This also supports a save where Chain
        happened to be inside balls[].

        hasChainBall is included as another
        fallback in case an older experimental
        save ever stored that value directly.
    */

    let savedChain =
        saveData.chainBall ??
        saveData.hasChainBall ??
        savedBalls.includes("chain");


    // --------------------
    // RECREATE SAVED BALLS
    // --------------------

    for(let type of savedBalls){

        /*
            Corner needs its counter increased
            BEFORE the constructor is called.
        */

        if(type == "corner"){
            noOfCornerBalls++;
        }


        /*
            Chain is handled separately because
            it does not live inside balls[].
        */

        if(
            type == "standard" ||
            type == "big" ||
            type == "red" ||
            type == "automover" ||
            type == "golden" ||
            type == "tiny" ||
            type == "lucky" ||
            type == "blackHole" ||
            type == "persistent" ||
            type == "pulse" ||
            type == "corner" ||
            type == "smallCorner" ||
            type == "orbiter"
        ){
            new Ball(type);
        }
    }


    // --------------------
    // RECREATE CHAIN
    // --------------------

    if(savedChain){
        new Ball("chain");
        hasChainBall = true;
    }


    // --------------------
    // RECALCULATE COUNTERS
    // --------------------

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

        if(ball.type == "orbiter"){
            hasOrbiterBall = true;
        }
    }


    // --------------------
    // UPDATE MAIN DISPLAY
    // --------------------

    document.getElementById(
        "showScore"
    ).textContent =
        "Score: " + showValue(score);


    document.getElementById(
        "rebirthShow"
    ).textContent =
        "Rebirths: " + rebirths;


    document.getElementById(
        "rebithCostShow"
    ).textContent =
        "Cost: " +
        showValue(
            Math.pow(4, rebirths) *
            1000000
        );


    document.getElementById(
        "fullRebirthButton"
    ).textContent =
        "Cost: " +
        showValue(fullRebirthCost);


    // --------------------
    // NORMAL BALL SHOP
    // --------------------

    document.getElementById(
        "standardButton"
    ).textContent =
        "Cost: " +
        showValue(standardBallScore);


    document.getElementById(
        "bigButton"
    ).textContent =
        "Cost: " +
        showValue(bigBallScore);


    document.getElementById(
        "redButton"
    ).textContent =
        "Cost: " +
        showValue(redBallScore);


    document.getElementById(
        "automoverButton"
    ).textContent =
        "Cost: " +
        showValue(automoverScore);


    document.getElementById(
        "tinyButton"
    ).textContent =
        "Cost: " +
        showValue(tinyBallScore);


    // --------------------
    // GOLDEN BALL
    // --------------------

    if(noOfGoldenBalls >= 10){

        document.getElementById(
            "goldenButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "goldenButton"
        ).textContent =
            "Cost: " +
            showValue(goldenBallScore);

    }


    // --------------------
    // LUCKY BALL
    // --------------------

    if(noOfLuckyBall >= 5){

        document.getElementById(
            "luckyButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "luckyButton"
        ).textContent =
            "Cost: " +
            showValue(luckyBallScore);

    }


    // --------------------
    // BLACK HOLE
    // --------------------

    if(hasBlackHole){

        document.getElementById(
            "blackHoleButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "blackHoleButton"
        ).textContent =
            "Cost: " +
            showValue(100000000);

    }


    // --------------------
    // UPGRADE SHOP
    // --------------------

    document.getElementById(
        "upgradeClickButton"
    ).textContent =
        "Cost: " +
        showValue(clickCost);


    document.getElementById(
        "upgradeIncomeButton"
    ).textContent =
        "Cost: " +
        showValue(incomeCost);


    document.getElementById(
        "upgradeMultiplierButton"
    ).textContent =
        "Cost: " +
        showValue(scoreMultiplierCost);


    document.getElementById(
        "showMultiplier"
    ).textContent =
        "Upgrade Multiplier x" +
        showValue(scoreMultiplier);


    // --------------------
    // AUTOMOVER UPGRADE
    // --------------------

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
            "Cost: " +
            showValue(
                automoverUpgradeCost
            );

    }


    // --------------------
    // LUCKY UPGRADE
    // --------------------

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
            "Cost: " +
            showValue(luckyCost);

    }


    // --------------------
    // JACKPOT UPGRADE
    // --------------------

    if(jackpotUpgrades >= 10){

        jackpotUpgrades = 10;

        document.getElementById(
            "upgradeJackpotButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "upgradeJackpotButton"
        ).textContent =
            "Cost: " +
            showValue(jackpotCost);

    }


    // --------------------
    // RESTORE PRESTIGE SHOP
    // --------------------

    if(fullRebirths >= 1){

        document.getElementById(
            "fullRebirthDivider"
        ).classList.add(
            "nowOnDisplay"
        );

        document.getElementById(
            "fullRebirthShop"
        ).classList.add(
            "nowOnDisplay"
        );

        document.getElementById(
            "persistent"
        ).classList.add(
            "nowOnDisplay"
        );
    }


    if(fullRebirths >= 2){

        document.getElementById(
            "pulse"
        ).classList.add(
            "nowOnDisplay"
        );
    }


    if(fullRebirths >= 3){

        document.getElementById(
            "corner"
        ).classList.add(
            "nowOnDisplay"
        );
    }


    if(fullRebirths >= 4){

        document.getElementById(
            "orbiter"
        ).classList.add(
            "nowOnDisplay"
        );
    }


    if(fullRebirths >= 5){

        document.getElementById(
            "chain"
        ).classList.add(
            "nowOnDisplay"
        );
    }


    // --------------------
    // PERSISTENT BALL
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
            "Cost: " +
            showValue(10000000);

    }


    // --------------------
    // PULSE BALL
    // --------------------

    if(hasPulseBall){

        document.getElementById(
            "pulseBallButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "pulseBallButton"
        ).textContent =
            "Cost: " +
            showValue(100000000);

    }


    // --------------------
    // CORNER BALL
    // --------------------

    if(noOfCornerBalls >= 4){

        document.getElementById(
            "cornerBallButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "cornerBallButton"
        ).textContent =
            "Cost: " +
            showValue(
                75000000 +
                (
                    noOfCornerBalls *
                    25000000
                )
            );

    }


    // --------------------
    // ORBITER BALL
    // --------------------

    if(hasOrbiterBall){

        document.getElementById(
            "orbiterBallButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "orbiterBallButton"
        ).textContent =
            "Cost: " +
            showValue(120000000);

    }


    // --------------------
    // CHAIN BALL
    // --------------------

    if(hasChainBall){

        document.getElementById(
            "chainBallButton"
        ).textContent = "MAX";

    }

    else{

        document.getElementById(
            "chainBallButton"
        ).textContent =
            "Cost: " +
            showValue(150000000);

    }


    // --------------------
    // NEXT PRESTIGE BALL
    // --------------------

    if(fullRebirths < newBalls.length){

        let newBallName =
            newBalls[fullRebirths];

        let capitalisedBallName =
            newBallName
                .charAt(0)
                .toUpperCase() +
            newBallName.slice(1);

        document.getElementById(
            "nextFullRebirth"
        ).textContent =
            "Next Prestige Grants: " +
            capitalisedBallName +
            " Ball";

    }

    else{

        document.getElementById(
            "nextFullRebirth"
        ).textContent =
            "All Prestige Balls Unlocked";

    }

    //--------------------
    // GIVE CORRECT STYLE
    //--------------------
    if(fullRebirths != 0){
        let hue = (fullRebirths * 137.5) % 360;
        document.getElementById("gameArea").style.backgroundColor = "hsl(" + hue + ", 30%, 20%)";
    }
    checkScores();

    if(fullRebirths == newBalls.length){
        document.getElementById("fullRebirthButton").textContent = "MAX";
    }

}

loadGame();
setInterval(saveGame, 5000);
checkScores();

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

function getCode(){
    //Make sure the newest game state is saved
    saveGame();

    //Get the JSON save
    let save = localStorage.getItem("ballGameSave");

    //Turn it into a code
    let code = btoa(save);

    //Put the code in the box
    document.getElementById("codeInput").value = code;
}

function loadCode(){

    let code =
        document.getElementById("codeInput").value;

    try{

        //Turn the code back into JSON
        let save = atob(code);

        //Check that it is actually valid JSON
        JSON.parse(save);

        //Replace the current save
        localStorage.setItem(
            "ballGameSave",
            save
        );

        //Reload the page so loadGame() uses it
        location.reload();
    }

    catch{
        document.getElementById("codeInput").value =
            "Invalid Code";
    }
}