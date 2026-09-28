//rebirth variables
let rebirths = 0;
let newBalls = ["persistent", "pulse", "corner", "orbiter", "chain"];
let fullRebirths = 0;
let fullRebirthCost = 100000000;
let justFullRebirthed = false;

//upgrade varables
let income = 0;
let incomeCost = 25;

let automoverTimer = 1000;
let automoverUpgradeCost = 100;

let scoreMultiplier = 1;
let scoreMultiplierCost = 200;

let luckyUpgrade = 0; //will upgrade by 0.04 each time, up to 10 upgrades, getting 50% chance 
let luckyCost = 20000;

let clickUpgrade = 0;
let clickCost = 10;

let jackpotCost = 10000;
let jackpot = 100;

let eaten = 0;

//variables for ball class
let balls = [];
let score = 1;
let gameArea = document.getElementById("gameArea");

class Ball{
    constructor(type){
        this.type = type;
        this.clicked = false;
        this.xPos = Math.random() * 100;
        this.yPos = Math.random() * 100;
        if(this.type == "standard"){
            this.size = 1;
        }
        else if(this.type == "big"){
            this.size = 2;
        }
        else{
            this.size = 1;
        }

        //Create the HTML element
        this.element = document.createElement("div");
        //Put it in the CSS class name based on type
        if(this.type == "standard"){
            this.element.className = "standardBall";
        }
        if(this.type == "big"){
            this.element.className = "bigBall";
        }
        if(this.type == "red"){
            this.element.className = "redBall";
        }
        if(this.type == "automover"){
            this.element.className = "automoverBall";
        }
        if(this.type == "golden"){
            this.element.className = "goldenBall";
        }
        if(this.type == "tiny"){
            this.element.className = "tinyBall";
        }
        if(this.type == "lucky"){
            this.element.className = "luckyBall";
            this.element.textContent = "?";
        }
        if(this.type == "blackHole"){
            this.element.className = "blackHole";
        }
        if(this.type == "persistent"){
            this.element.className = "persistentBall";
        }
        if(this.type == "pulse"){
            this.element.className = "pulseBall";
            this.justMoved = false;
        }
        //Put element in the gameArea
        document.getElementById("gameArea").appendChild(this.element);
        balls.push(this);
        //Make it call addScore if not automover
        if(this.type == "automover"){
            this.interval = setInterval(() => {
                this.move();
                this.addScore();
            }, automoverTimer);

            this.move();
        }
        else if(this.type == "blackHole"){
            this.xPos = (gameArea.clientWidth - this.element.offsetWidth) / 2;
            this.yPos = (gameArea.clientHeight - this.element.offsetHeight) / 2;

            this.element.style.left = this.xPos + "px";
            this.element.style.top = this.yPos + "px";
        }
        else if(this.type == "pulse"){
            this.element.onclick = () => {

                if(!this.justMoved){

                    //Stop it being clicked again
                    this.justMoved = true;

                    //Give click score
                    score += (clickUpgrade * scoreMultiplier);
                    this.clicked = true;
                    this.addScore();

                    //Move to new position first
                    this.move();

                    //Grow
                    this.element.style.transform = "scale(2.5)";

                    //Check collisions while it is large
                    setTimeout(() => {

                        for(let x of balls){
                            if(x != this){
                                this.checkCollision(x);
                            }
                        }

                        //Shrink
                        this.element.style.transform = "scale(1)";

                    }, 500);

                    //Allow it to be clicked again after shrinking
                    setTimeout(() => {
                        this.justMoved = false;
                    }, 1000);
                }
            }

            this.move();
        }
        else{
            this.element.onclick = () => {
                score += (clickUpgrade * scoreMultiplier);
                this.clicked = true;
                this.addScore();
                this.move();
            }

            this.move();
        }
    }

    move(){
        //These define the maximum value the balls can be before they 
        let maxX = gameArea.clientWidth - this.element.offsetWidth;
        let maxY = gameArea.clientHeight - this.element.offsetHeight;

        this.xPos = Math.random() * maxX;
        this.yPos = Math.random() * maxY;

        //Move the element around the gameArea
        this.element.style.left = this.xPos + "px";
        this.element.style.top = this.yPos + "px";

        //Check all balls if they hit another ball
        for(let x of balls){
            if(x != this){
                this.checkCollision(x);
            }
        }
    }

    addScore(){
        let addedScore = 0;
        let showScoreAdded = 0;


        // --------------------
        // GENERAL CLICK SCORE
        // WORKS FOR ALL BALL TYPES
        // --------------------

        if(this.clicked){
            showScoreAdded += clickUpgrade * scoreMultiplier;
        }


        // --------------------
        // BALL-SPECIFIC SCORE
        // --------------------

        if(this.type == "standard" || this.type == "big" || this.type == "automover"){
            addedScore++;
        }
        else if(this.type == "red"){
            addedScore += 2;
        }
        else if(this.type == "tiny"){
            addedScore += 3 + income;
        }
        else if(this.type == "golden"){
            addedScore += 10;
        }
        else if(this.type == "lucky"){
            let luckyChance = 0.1 + luckyUpgrade;

            if(Math.random() < luckyChance){
                addedScore += jackpot;
            }
        }
        else if(this.type == "persistent"){
            addedScore += (1 + income) * scoreMultiplier;

            if(this.clicked){
                addedScore += clickUpgrade;
            }
        }
        else if(this.type == "pulse"){
            addedScore += 50;
        }


        // --------------------
        // GENERAL SCORE MULTIPLIERS
        // WORKS FOR ALL BALL TYPES
        // --------------------

        addedScore += income;
        addedScore *= scoreMultiplier;
        addedScore *= Math.pow(2, rebirths);


        // --------------------
        // ADD SCORE
        // --------------------

        score += addedScore;

        showScoreAdded += addedScore;

        this.showScoreGain(showScoreAdded);

        this.clicked = false;

        document.getElementById("showScore").textContent =
            "Score: " + score;
    }

    checkCollision(otherBall){
        if(otherBall.type != "blackHole"){
            let thisRadius = this.element.offsetWidth / 2;
            let otherRadius = otherBall.element.offsetWidth / 2;

            let thisCentreX = this.xPos + thisRadius;
            let thisCentreY = this.yPos + thisRadius;

            let otherCentreX = otherBall.xPos + otherRadius;
            let otherCentreY = otherBall.yPos + otherRadius;

            let dx = thisCentreX - otherCentreX;
            let dy = thisCentreY - otherCentreY;

            let distance = Math.sqrt((dx * dx) + (dy * dy));

            if(distance <= thisRadius + otherRadius){
                otherBall.addScore();
                otherBall.move();
            }
        }
        else{
            if(this.type != "persistent" && this.type != "pulse"){
                let thisRadius = this.element.offsetWidth / 2;
                let otherRadius = otherBall.element.offsetWidth / 2;

                let thisCentreX = this.xPos + thisRadius;
                let thisCentreY = this.yPos + thisRadius;

                let otherCentreX = otherBall.xPos + otherRadius;
                let otherCentreY = otherBall.yPos + otherRadius;

                let dx = thisCentreX - otherCentreX;
                let dy = thisCentreY - otherCentreY;

                let distance = Math.sqrt((dx * dx) + (dy * dy));

                if(distance <= thisRadius + otherRadius){

                    for(let i = 0; i < (eaten + 10); i++){
                        this.addScore();
                    }

                    let x = Math.random();

                    if(x <= 0.1){

                        if(this.type == "lucky"){
                            noOfLuckyBall--;
                            document.getElementById("luckyButton").textContent =
                                "Cost: " + luckyBallScore;
                        }

                        if(this.type == "golden"){
                            noOfGoldenBalls--;
                            document.getElementById("goldenButton").textContent =
                                "Cost: " + goldenBallScore;
                        }

                        eaten++;
                        this.remove();
                    }
                }
            }
        }
    }

    getXPos(){
        return this.xPos;
    }

    getYPos(){
        return this.yPos;
    }

    getSize(){
        return this.size;
    }

    updateAutomoverTimer(){
        if(this.type == "automover"){
            clearInterval(this.interval);
            this.interval = setInterval(() => {
                this.move();
                this.addScore();
            }, automoverTimer);
        }
    }

    remove(){
        if(this.type == "automover"){
            clearInterval(this.interval);
        }

        this.element.remove();

        let index = balls.indexOf(this);

        if(index != -1){
            balls.splice(index, 1);
        }
    }

    showScoreGain(amount){
        let minimum = 1;

        if(score >= 10000){
            minimum = Math.pow(10, Math.floor(Math.log10(score)) - 3);
        }

        if(amount < minimum){
            return;
        }

        let gainText = document.createElement("div");

        gainText.className = "gainText";
        gainText.textContent = "+" + amount;

        gameArea.appendChild(gainText);

        gainText.style.left =
            (this.xPos + this.element.offsetWidth / 2) + "px";

        gainText.style.top =
            (this.yPos - 10) + "px";

        setTimeout(() => {
            gainText.remove();
        }, 1000);
            }
}

//values for the shop
let standardBallScore = 1;
let bigBallScore = 30;
let redBallScore = 40;
let automoverScore = 120;
let goldenBallScore = 1000;
let noOfGoldenBalls = 0;
let tinyBallScore = 50;
let luckyBallScore = 10000;
let noOfLuckyBall = 0;
let hasBlackHole = false;

function addStandardBall(){
    if(score >= standardBallScore){
        score -= standardBallScore;
        new Ball("standard");
        if(standardBallScore == 1){
            standardBallScore = 10;
        }
        else{
            standardBallScore = Math.floor(standardBallScore * 1.5);
        }
    }
    document.getElementById("standardButton").textContent = "Cost: " + standardBallScore;
    document.getElementById("showScore").textContent = "Score: " + score;
}

function addBigBall(){
    if(score >= bigBallScore){
        score -= bigBallScore;
        new Ball("big");
        bigBallScore = bigBallScore * 3;
    }
    document.getElementById("bigButton").textContent = "Cost: " + bigBallScore;
    document.getElementById("showScore").textContent = "Score: " + score;
}

function addRedBall(){
    if(score >= redBallScore){
        score -= redBallScore;
        new Ball("red");
        redBallScore = redBallScore * 3;
        document.getElementById("redButton").textContent = "Cost: " + redBallScore;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
}

function addAutomover(){
    if(score >= automoverScore){
        score -= automoverScore;
        new Ball("automover");
        automoverScore = automoverScore * 2;
        document.getElementById("automoverButton").textContent = "Cost: " + automoverScore;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
}

function addGoldenBall(){
    if(score >= goldenBallScore && noOfGoldenBalls <= 9){
        noOfGoldenBalls++;
        score -= goldenBallScore;
        new Ball("golden");
        goldenBallScore = goldenBallScore * 3;
        if(noOfGoldenBalls == 10){document.getElementById("goldenButton").textContent = "MAX";}
        else{document.getElementById("goldenButton").textContent = "Cost: " + goldenBallScore;}
        document.getElementById("showScore").textContent = "Score: " + score;
    }
}

function addTinyBall(){
    if(score >= tinyBallScore){
        score -= tinyBallScore;
        new Ball("tiny");
        tinyBallScore *= 3;
    }
    document.getElementById("tinyButton").textContent = "Cost: " + tinyBallScore;
    document.getElementById("showScore").textContent = "Score: " + score;
}

function addLuckyBall(){
    if(noOfLuckyBall < 5 && score >= luckyBallScore){
        score -= luckyBallScore;
        luckyBallScore *= 10;
        new Ball("lucky");
        noOfLuckyBall++;
    }
    if(noOfLuckyBall == 5){
        document.getElementById("luckyButton").textContent = "MAX";
    }
    else{
        document.getElementById("luckyButton").textContent = "Cost: " + luckyBallScore;
    }
    document.getElementById("showScore").textContent = "Score: " + score;
}

function addBlackHole(){
    if(!hasBlackHole && score >= 100000000){
        score -= 100000000;
        document.getElementById("blackHoleButton").textContent = "MAX";
        new Ball("blackHole");
        document.getElementById("showScore").textContent = "Score: " + score;
        hasBlackHole = true;
    }
}

//cheat button
addEventListener("keydown", function(ev){
    let key = ev.key;

    if(key == "c"){
        score = score + 19000000000000000;
        score = Math.pow(score, 100);
        document.getElementById("showScore").textContent = "Score: " + score;
    }
    if(key == "0"){
        score = 0;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
    if(key == "r"){
        rebirths++;
        document.getElementById("rebirthShow").textContent =
            "Rebirths: " + rebirths;

        document.getElementById("rebithCostShow").textContent =
            "Cost: " + Math.pow(3, rebirths) * 1000000;
    }
})

//upgrade Buttons
function upgradeClick(){
    if(score >= clickCost){
        clickUpgrade++;
        score -= clickCost;
        if(clickCost <= 100){clickCost += 20;}
        else if(clickCost <= 500){clickCost += 50;}
        else if(clickCost <= 1000){clickCost += 150;}
        else{clickCost = Math.floor(clickCost * 1.5);}
        document.getElementById("upgradeClickButton").textContent = "Cost: " + clickCost;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
}

function upgradeIncome(){
    if(score >= incomeCost){
        income++;
        score -= incomeCost;
        incomeCost = incomeCost * 2;
    }
    document.getElementById("upgradeIncomeButton").textContent = "Cost: " + incomeCost;
    document.getElementById("showScore").textContent = "Score: " + score;
}

function upgradeAutomover(){
    if(score >= automoverUpgradeCost && automoverTimer != 100){
        automoverTimer -= 100;
        score -= automoverUpgradeCost;
        automoverUpgradeCost = automoverUpgradeCost * 2;

        for(let x of balls){
            x.updateAutomoverTimer();
        }
    }
    document.getElementById("showScore").textContent = "Score: " + score;
    if(automoverTimer == 100){
        document.getElementById("upgradeAutomoverButton").textContent = "MAX";
    }
    else{
        document.getElementById("upgradeAutomoverButton").textContent = "Cost: " + automoverUpgradeCost;
    }
}

function upgradeMultiplier(){
    if(score >= scoreMultiplierCost){
        scoreMultiplier++;
        score -= scoreMultiplierCost;
        scoreMultiplierCost = scoreMultiplierCost * 2;
    }
    document.getElementById("showScore").textContent = "Score: " + score;
    document.getElementById("upgradeMultiplierButton").textContent = "Cost: " + scoreMultiplierCost;
    document.getElementById("showMultiplier").textContent = "Upgrade Multiplier x" + scoreMultiplier;
}

function upgradeLuckyBalls(){
    if(score >= luckyCost && luckyUpgrade < 0.4){
        luckyUpgrade += 0.04;
        score -= luckyCost;
        luckyCost = Math.floor(luckyCost * 1.5);
    }

    document.getElementById("showScore").textContent = "Score: " + score;

    if(luckyUpgrade >= 0.4){
        luckyUpgrade = 0.4;
        document.getElementById("upgradeLuckyBallsButton").textContent = "MAX";
    }
    else{
        document.getElementById("upgradeLuckyBallsButton").textContent = "Cost: " + luckyCost;
    }
}

function increaseJackpot(){
    if(score >= jackpotCost){
        jackpot *= 4;
        score -= jackpotCost;
        jackpotCost *= 5;
        document.getElementById("upgradeJackpotButton").textContent = "Cost: " + jackpotCost;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
}

//Rebirth

function rebirth(){
    if(score >= (Math.pow(3, rebirths) * 1000000)){

        // --------------------
        // RESET BALL SHOP
        // --------------------

        standardBallScore = 1;
        bigBallScore = 30;
        redBallScore = 40;
        automoverScore = 120;

        goldenBallScore = 1000;
        noOfGoldenBalls = 0;

        tinyBallScore = 50;

        luckyBallScore = 10000;
        noOfLuckyBall = 0;

        hasBlackHole = false;
        eaten = 0;

        hasPulseBall = false;

        // --------------------
        // RESET UPGRADES
        // --------------------

        income = 0;
        incomeCost = 25;

        automoverTimer = 1000;
        automoverUpgradeCost = 100;

        scoreMultiplier = 1;
        scoreMultiplierCost = 200;

        luckyUpgrade = 0;
        luckyCost = 20000;

        clickUpgrade = 0;
        clickCost = 10;

        jackpotCost = 10000;
        jackpot = 100;


        // --------------------
        // RESET SCORE
        // --------------------

        score = 1;


        // --------------------
        // RESET SHOP DISPLAY
        // --------------------

        document.getElementById("blackHoleButton").textContent =
            "Cost: 100000000";

        document.getElementById("upgradeClickButton").textContent =
            "Cost: " + clickCost;

        document.getElementById("upgradeLuckyBallsButton").textContent =
            "Cost: " + luckyCost;

        document.getElementById("upgradeMultiplierButton").textContent =
            "Cost: " + scoreMultiplierCost;

        document.getElementById("showMultiplier").textContent =
            "Upgrade Multiplier x" + scoreMultiplier;

        document.getElementById("upgradeAutomoverButton").textContent =
            "Cost: " + automoverUpgradeCost;

        document.getElementById("upgradeIncomeButton").textContent =
            "Cost: " + incomeCost;

        document.getElementById("luckyButton").textContent =
            "Cost: " + luckyBallScore;

        document.getElementById("goldenButton").textContent =
            "Cost: " + goldenBallScore;

        document.getElementById("tinyButton").textContent =
            "Cost: " + tinyBallScore;

        document.getElementById("automoverButton").textContent =
            "Cost: " + automoverScore;

        document.getElementById("redButton").textContent =
            "Cost: " + redBallScore;

        document.getElementById("bigButton").textContent =
            "Cost: " + bigBallScore;

        document.getElementById("standardButton").textContent =
            "Cost: " + standardBallScore;

        document.getElementById("upgradeJackpotButton").textContent =
            "Cost: " + jackpotCost;

        document.getElementById("showScore").textContent =
            "Score: " + score;
        document.getElementById("pulseBallButton").textContent = "Cost: 100000000";


        // --------------------
        // REMOVE NORMAL BALLS
        // KEEP PERSISTENT BALL
        // --------------------

        for(let i = balls.length - 1; i >= 0; i--){
            if(balls[i].type != "persistent"){
                balls[i].remove();
            }
        }


        // --------------------
        // INCREASE REBIRTH
        // --------------------

        rebirths++;

        document.getElementById("rebirthShow").textContent =
            "Rebirths: " + rebirths;

        document.getElementById("rebithCostShow").textContent =
            "Cost: " + Math.pow(3, rebirths) * 1000000;
    }
}

function resetGame(){

    // --------------------
    // RESET BALL SHOP
    // --------------------

    standardBallScore = 1;
    bigBallScore = 30;
    redBallScore = 40;
    automoverScore = 120;

    goldenBallScore = 1000;
    noOfGoldenBalls = 0;

    tinyBallScore = 50;

    luckyBallScore = 10000;
    noOfLuckyBall = 0;

    hasBlackHole = false;
    eaten = 0;

    hasPulseBall = false;


    // --------------------
    // RESET UPGRADES
    // --------------------

    income = 0;
    incomeCost = 25;

    automoverTimer = 1000;
    automoverUpgradeCost = 100;

    scoreMultiplier = 1;
    scoreMultiplierCost = 200;

    luckyUpgrade = 0;
    luckyCost = 20000;

    clickUpgrade = 0;
    clickCost = 10;

    jackpotCost = 10000;
    jackpot = 100;


    // --------------------
    // RESET SCORE
    // --------------------

    score = 1;


    // --------------------
    // RESET SHOP DISPLAY
    // --------------------

    document.getElementById("blackHoleButton").textContent =
        "Cost: 100000000";

    document.getElementById("upgradeClickButton").textContent =
        "Cost: " + clickCost;

    document.getElementById("upgradeLuckyBallsButton").textContent =
        "Cost: " + luckyCost;

    document.getElementById("upgradeMultiplierButton").textContent =
        "Cost: " + scoreMultiplierCost;

    document.getElementById("showMultiplier").textContent =
        "Upgrade Multiplier x" + scoreMultiplier;

    document.getElementById("upgradeAutomoverButton").textContent =
        "Cost: " + automoverUpgradeCost;

    document.getElementById("upgradeIncomeButton").textContent =
        "Cost: " + incomeCost;

    document.getElementById("luckyButton").textContent =
        "Cost: " + luckyBallScore;

    document.getElementById("goldenButton").textContent =
        "Cost: " + goldenBallScore;

    document.getElementById("tinyButton").textContent =
        "Cost: " + tinyBallScore;

    document.getElementById("automoverButton").textContent =
        "Cost: " + automoverScore;

    document.getElementById("redButton").textContent =
        "Cost: " + redBallScore;

    document.getElementById("bigButton").textContent =
        "Cost: " + bigBallScore;

    document.getElementById("standardButton").textContent =
        "Cost: " + standardBallScore;

    document.getElementById("upgradeJackpotButton").textContent =
        "Cost: " + jackpotCost;

    document.getElementById("showScore").textContent =
        "Score: " + score;
    document.getElementById("pulseBallButton").textContent =
        "Cost: 100000000";


    // --------------------
    // REMOVE NORMAL BALLS
    // KEEP PERSISTENT BALL
    // --------------------

    for(let i = balls.length - 1; i >= 0; i--){
        if(balls[i].type != "persistent"){
            balls[i].remove();
        }
    }


    // --------------------
    // KEEP CURRENT REBIRTH
    // --------------------

    document.getElementById("rebirthShow").textContent =
        "Rebirths: " + rebirths;

    document.getElementById("rebithCostShow").textContent =
        "Cost: " + Math.pow(3, rebirths) * 1000000;
    
}

function fullRebirth(){

    if(rebirths >= 10 && score >= fullRebirthCost){

        // --------------------
        // RESET BALL SHOP
        // --------------------

        standardBallScore = 1;
        bigBallScore = 30;
        redBallScore = 40;
        automoverScore = 120;

        goldenBallScore = 1000;
        noOfGoldenBalls = 0;

        tinyBallScore = 50;

        luckyBallScore = 10000;
        noOfLuckyBall = 0;

        hasBlackHole = false;
        eaten = 0;

        hasPersistentBall = false;
        hasPulseBall = false;


        // --------------------
        // RESET UPGRADES
        // --------------------

        income = 0;
        incomeCost = 25;

        automoverTimer = 1000;
        automoverUpgradeCost = 100;

        scoreMultiplier = 1;
        scoreMultiplierCost = 200;

        luckyUpgrade = 0;
        luckyCost = 20000;

        clickUpgrade = 0;
        clickCost = 10;

        jackpotCost = 10000;
        jackpot = 100;


        // --------------------
        // RESET SCORE
        // --------------------

        score = 1;


        // --------------------
        // RESET SHOP DISPLAY
        // --------------------

        document.getElementById("blackHoleButton").textContent =
            "Cost: 100000000";

        document.getElementById("persistentBallButton").textContent =
            "Cost: 10000000";

        document.getElementById("upgradeClickButton").textContent =
            "Cost: " + clickCost;

        document.getElementById("upgradeLuckyBallsButton").textContent =
            "Cost: " + luckyCost;

        document.getElementById("upgradeMultiplierButton").textContent =
            "Cost: " + scoreMultiplierCost;

        document.getElementById("showMultiplier").textContent =
            "Upgrade Multiplier x" + scoreMultiplier;

        document.getElementById("upgradeAutomoverButton").textContent =
            "Cost: " + automoverUpgradeCost;

        document.getElementById("upgradeIncomeButton").textContent =
            "Cost: " + incomeCost;

        document.getElementById("luckyButton").textContent =
            "Cost: " + luckyBallScore;

        document.getElementById("goldenButton").textContent =
            "Cost: " + goldenBallScore;

        document.getElementById("tinyButton").textContent =
            "Cost: " + tinyBallScore;

        document.getElementById("automoverButton").textContent =
            "Cost: " + automoverScore;

        document.getElementById("redButton").textContent =
            "Cost: " + redBallScore;

        document.getElementById("bigButton").textContent =
            "Cost: " + bigBallScore;

        document.getElementById("standardButton").textContent =
            "Cost: " + standardBallScore;

        document.getElementById("upgradeJackpotButton").textContent =
            "Cost: " + jackpotCost;

        document.getElementById("showScore").textContent =
            "Score: " + score;
        document.getElementById("pulseBallButton").textContent =
            "Cost: 100000000";


        // --------------------
        // REMOVE ALL BALLS
        // --------------------

        while(balls.length > 0){
            balls[0].remove();
        }


        // --------------------
        // RESET NORMAL REBIRTHS
        // --------------------

        rebirths = 0;

        document.getElementById("rebirthShow").textContent =
            "Rebirths: " + rebirths;

        document.getElementById("rebithCostShow").textContent =
            "Cost: " + Math.pow(3, rebirths) * 1000000;


        // --------------------
        // INCREASE FULL REBIRTH
        // --------------------

        fullRebirths++;

        fullRebirthCost *= 5;

        document.getElementById("fullRebirthButton").textContent =
            "Cost: " + fullRebirthCost + " and 10 Rebirths";


        // --------------------
        // UNLOCK FULL REBIRTH SHOP
        // --------------------

        if(fullRebirths == 1){
            document.getElementById("fullRebirthDivider")
                .classList.add("nowOnDisplay");

            document.getElementById("fullRebirthShop")
                .classList.add("nowOnDisplay");

            document.getElementById("persistent")
                .classList.add("nowOnDisplay");
        }
        else if(fullRebirths == 2){
            document.getElementById("pulse")
                .classList.add("nowOnDisplay");
        }

        // --------------------
        // SHOW NEXT BALL UNLOCK
        // --------------------

        if(fullRebirths < newBalls.length){

            let newBallName = newBalls[fullRebirths];

            let capitalisedBallName =
                newBallName.charAt(0).toUpperCase() +
                newBallName.slice(1);

            document.getElementById("nextFullRebirth").textContent =
                "Next Full Rebirth Grants: " +
                capitalisedBallName +
                " Ball";
        }
        else{
            document.getElementById("nextFullRebirth").textContent =
                "All Full Rebirth Balls Unlocked";
        }
    }
}

//new Ball methods
let hasPersistentBall = false;
let hasPulseBall = false;

function addPersistentBall(){
    if(score >= 10000000 && !hasPersistentBall){
        score -= 10000000;
        document.getElementById("showScore").textContent = "Score: " + score;
        new Ball("persistent");
        document.getElementById("persistentBallButton").textContent = "MAX";
        hasPersistentBall = true;
    }
}

function addPulseBall(){
    if(score >= 100000000 && !hasPulseBall){
        score -= 100000000;
        document.getElementById("showScore").textContent = "Score: " + score;
        new Ball("pulse");
        document.getElementById("pulseBallButton").textContent = "MAX";
        hasPulseBall = true;
    }
}