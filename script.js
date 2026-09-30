//rebirth variables
let rebirths = 0;
let newBalls = ["persistent", "pulse", "corner", "orbiter", "chain"];
let fullRebirths = 0;
let fullRebirthCost = 500000000000;
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
        if(this.type == "corner"){
            this.element.className = "cornerBall";
        }
        if(this.type == "smallCorner"){
            this.element.className = "smallCornerBall";
        }
        if(this.type == "orbiter"){
            this.element.className = "orbiterBall";
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
        else if(this.type == "smallCorner"){
            this.interval = setInterval(() => {
                this.move();
                this.addScore();
            }, 5000);

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
        else if(this.type == "corner"){
            if(noOfCornerBalls == 1){
                this.xPos = 0;
                this.yPos = 0;
            }
            else if(noOfCornerBalls == 2){
                this.xPos = gameArea.clientWidth - this.element.offsetWidth;
                this.yPos = 0;
            }
            else if(noOfCornerBalls == 3){
                this.xPos = 0;
                this.yPos = gameArea.clientHeight - this.element.offsetHeight;
            }
            else{
                this.xPos = gameArea.clientWidth - this.element.offsetWidth;
                this.yPos = gameArea.clientHeight - this.element.offsetHeight;
            }
            this.element.style.left = this.xPos + "px";
            this.element.style.top = this.yPos + "px";
        }
        else if(this.type == "orbiter"){

            this.angle = -Math.PI / 2;

            this.orbitRadius =
                Math.min(gameArea.clientWidth, gameArea.clientHeight) * 0.25;

            this.interval = setInterval(() => {

                let centreX =
                    (gameArea.clientWidth - this.element.offsetWidth) / 2;

                let centreY =
                    (gameArea.clientHeight - this.element.offsetHeight) / 2;

                this.xPos =
                    centreX + Math.cos(this.angle) * this.orbitRadius;

                this.yPos =
                    centreY + Math.sin(this.angle) * this.orbitRadius;

                this.element.style.left = this.xPos + "px";
                this.element.style.top = this.yPos + "px";

                this.angle += 0.03;

                for(let x of balls){
                    if(x != this){
                        if(this.checkCollision(x)){
                            this.addScore();
                        }
                    }
                }
            }, 16);
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
            addedScore += 4;
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
            addedScore += 50 + (income * 5);
        }
        else if(this.type == "smallCorner"){
            addedScore += 5 + income;
            addedScore *= Math.round(Math.pow(scoreMultiplier, 1.5));
        }
        else if(this.type == "orbiter"){
            addedScore += 50 + (income * 3);
        }

        // --------------------
        // GENERAL SCORE MULTIPLIERS
        // WORKS FOR ALL BALL TYPES
        // --------------------

        addedScore += income;
        addedScore *= scoreMultiplier;
        addedScore *= Math.pow(1.5, rebirths);


        // --------------------
        // ADD SCORE
        // --------------------

        score += addedScore;

        showScoreAdded += addedScore;

        this.showScoreGain(showScoreAdded);

        this.clicked = false;

        document.getElementById("showScore").textContent =
            "Score: " + showValue(score);
    }

    checkCollision(otherBall){
        if(otherBall.type != "blackHole" && otherBall.type != "corner"){
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

                return true;
            }
            return false;
        }
        else if(otherBall.type == "corner"){}
        else{
            if(this.type != "persistent" && this.type != "pulse" && this.type != "corner" && this.type != "smallCorner"){
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
                                "Cost: " + showValue(luckyBallScore);
                        }

                        if(this.type == "golden"){
                            noOfGoldenBalls--;
                            document.getElementById("goldenButton").textContent =
                                "Cost: " + showValue(goldenBallScore);
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
        if(this.type == "automover" || this.type == "smallCorner" || this.type == "orbiter"){
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
        gainText.textContent = "+" + showValue(amount);

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
    document.getElementById("standardButton").textContent = "Cost: " + showValue(standardBallScore);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
}

function addBigBall(){
    if(score >= bigBallScore){
        score -= bigBallScore;
        new Ball("big");
        bigBallScore = bigBallScore * 3;
    }
    document.getElementById("bigButton").textContent = "Cost: " + showValue(bigBallScore);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
}

function addRedBall(){
    if(score >= redBallScore){
        score -= redBallScore;
        new Ball("red");
        redBallScore = redBallScore * 3;
        document.getElementById("redButton").textContent = "Cost: " + showValue(redBallScore);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
    }
}

function addAutomover(){
    if(score >= automoverScore){
        score -= automoverScore;
        new Ball("automover");
        automoverScore = automoverScore * 2;
        document.getElementById("automoverButton").textContent = "Cost: " + showValue(automoverScore);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
    }
}

function addGoldenBall(){
    if(score >= goldenBallScore && noOfGoldenBalls <= 9){
        noOfGoldenBalls++;
        score -= goldenBallScore;
        new Ball("golden");
        goldenBallScore = goldenBallScore * 3;
        if(noOfGoldenBalls == 10){document.getElementById("goldenButton").textContent = "MAX";}
        else{document.getElementById("goldenButton").textContent = "Cost: " + showValue(goldenBallScore);}
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
    }
}

function addTinyBall(){
    if(score >= tinyBallScore){
        score -= tinyBallScore;
        new Ball("tiny");
        tinyBallScore *= 3;
    }
    document.getElementById("tinyButton").textContent = "Cost: " + showValue(tinyBallScore);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
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
        document.getElementById("luckyButton").textContent = "Cost: " + showValue(luckyBallScore);
    }
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
}

function addBlackHole(){
    if(!hasBlackHole && score >= 100000000){
        score -= 100000000;
        document.getElementById("blackHoleButton").textContent = "MAX";
        new Ball("blackHole");
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
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
            "Cost: " + showValue(Math.pow(4, rebirths) * 1000000);
    }
    if(key == "p"){
        rebirths += 10;
        score = Infinity;
        fullRebirth();
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
        document.getElementById("upgradeClickButton").textContent = "Cost: " + showValue(clickCost);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
    }
}

function upgradeIncome(){
    if(score >= incomeCost){
        income++;
        score -= incomeCost;
        incomeCost = incomeCost * 2;
    }
    document.getElementById("upgradeIncomeButton").textContent = "Cost: " + showValue(incomeCost);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
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
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
    if(automoverTimer == 100){
        document.getElementById("upgradeAutomoverButton").textContent = "MAX";
    }
    else{
        document.getElementById("upgradeAutomoverButton").textContent = "Cost: " + showValue(automoverUpgradeCost);
    }
}

function upgradeMultiplier(){
    if(score >= scoreMultiplierCost){
        scoreMultiplier++;
        score -= scoreMultiplierCost;
        scoreMultiplierCost = scoreMultiplierCost * 2;
    }
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
    document.getElementById("upgradeMultiplierButton").textContent = "Cost: " + showValue(scoreMultiplierCost);
    document.getElementById("showMultiplier").textContent = "Upgrade Multiplier x" + showValue(scoreMultiplier);
}

function upgradeLuckyBalls(){
    if(score >= luckyCost && luckyUpgrade < 0.4){
        luckyUpgrade += 0.04;
        score -= luckyCost;
        luckyCost = Math.floor(luckyCost * 1.5);
    }

    document.getElementById("showScore").textContent = "Score: " + showValue(score);

    if(luckyUpgrade >= 0.4){
        luckyUpgrade = 0.4;
        document.getElementById("upgradeLuckyBallsButton").textContent = "MAX";
    }
    else{
        document.getElementById("upgradeLuckyBallsButton").textContent = "Cost: " + showValue(luckyCost);
    }
}

function increaseJackpot(){
    if(score >= jackpotCost){
        jackpot *= 4;
        score -= jackpotCost;
        jackpotCost *= 5;
        document.getElementById("upgradeJackpotButton").textContent = "Cost: " + showValue(jackpotCost);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
    }
}

//Rebirth

function rebirth(){

    if(score >= (Math.pow(4, rebirths) * 1000000)){

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
        noOfCornerBalls = 0;
        hasOrbiterBall = false;

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
            "Cost: " + showValue(100000000);

        document.getElementById("upgradeClickButton").textContent =
            "Cost: " + showValue(clickCost);

        document.getElementById("upgradeLuckyBallsButton").textContent =
            "Cost: " + showValue(luckyCost);

        document.getElementById("upgradeMultiplierButton").textContent =
            "Cost: " + showValue(scoreMultiplierCost);

        document.getElementById("showMultiplier").textContent =
            "Upgrade Multiplier x" + scoreMultiplier;

        document.getElementById("upgradeAutomoverButton").textContent =
            "Cost: " + showValue(automoverUpgradeCost);

        document.getElementById("upgradeIncomeButton").textContent =
            "Cost: " + showValue(incomeCost);

        document.getElementById("luckyButton").textContent =
            "Cost: " + showValue(luckyBallScore);

        document.getElementById("goldenButton").textContent =
            "Cost: " + showValue(goldenBallScore);

        document.getElementById("tinyButton").textContent =
            "Cost: " + showValue(tinyBallScore);

        document.getElementById("automoverButton").textContent =
            "Cost: " + showValue(automoverScore);

        document.getElementById("redButton").textContent =
            "Cost: " + showValue(redBallScore);

        document.getElementById("bigButton").textContent =
            "Cost: " + showValue(bigBallScore);

        document.getElementById("standardButton").textContent =
            "Cost: " + showValue(standardBallScore);

        document.getElementById("upgradeJackpotButton").textContent =
            "Cost: " + showValue(jackpotCost);

        document.getElementById("showScore").textContent =
            "Score: " + showValue(score);

        document.getElementById("pulseBallButton").textContent =
            "Cost: " + showValue(100000000);
        document.getElementById("cornerBallButton").textContent = 
            "Cost: " + showValue(75000000);
        document.getElementById("orbiterBallButton").textContent = 
            "Cost: 120m";


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
            "Cost: " + showValue(
                Math.pow(4, rebirths) * 1000000
            );
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
    noOfCornerBalls = 0;
    hasOrbiterBall = false;


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
        "Cost: " + showValue(100000000);

    document.getElementById("upgradeClickButton").textContent =
        "Cost: " + showValue(clickCost);

    document.getElementById("upgradeLuckyBallsButton").textContent =
        "Cost: " + showValue(luckyCost);

    document.getElementById("upgradeMultiplierButton").textContent =
        "Cost: " + showValue(scoreMultiplierCost);

    document.getElementById("showMultiplier").textContent =
        "Upgrade Multiplier x" + scoreMultiplier;

    document.getElementById("upgradeAutomoverButton").textContent =
        "Cost: " + showValue(automoverUpgradeCost);

    document.getElementById("upgradeIncomeButton").textContent =
        "Cost: " + showValue(incomeCost);

    document.getElementById("luckyButton").textContent =
        "Cost: " + showValue(luckyBallScore);

    document.getElementById("goldenButton").textContent =
        "Cost: " + showValue(goldenBallScore);

    document.getElementById("tinyButton").textContent =
        "Cost: " + showValue(tinyBallScore);

    document.getElementById("automoverButton").textContent =
        "Cost: " + showValue(automoverScore);

    document.getElementById("redButton").textContent =
        "Cost: " + showValue(redBallScore);

    document.getElementById("bigButton").textContent =
        "Cost: " + showValue(bigBallScore);

    document.getElementById("standardButton").textContent =
        "Cost: " + showValue(standardBallScore);

    document.getElementById("upgradeJackpotButton").textContent =
        "Cost: " + showValue(jackpotCost);

    document.getElementById("showScore").textContent =
        "Score: " + showValue(score);

    document.getElementById("pulseBallButton").textContent =
        "Cost: " + showValue(100000000);
    document.getElementById("cornerBallButton").textContent = 
            "Cost: " + showValue(75000000);
    document.getElementById("orbiterBallButton").textContent = 
            "Cost: 120m";

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
        "Cost: " + showValue(
            Math.pow(4, rebirths) * 1000000
        );
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
        noOfCornerBalls = 0;
        hasOrbiterBall = false;


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
            "Cost: " + showValue(100000000);

        document.getElementById("persistentBallButton").textContent =
            "Cost: " + showValue(10000000);

        document.getElementById("upgradeClickButton").textContent =
            "Cost: " + showValue(clickCost);

        document.getElementById("upgradeLuckyBallsButton").textContent =
            "Cost: " + showValue(luckyCost);

        document.getElementById("upgradeMultiplierButton").textContent =
            "Cost: " + showValue(scoreMultiplierCost);

        document.getElementById("showMultiplier").textContent =
            "Upgrade Multiplier x" + scoreMultiplier;

        document.getElementById("upgradeAutomoverButton").textContent =
            "Cost: " + showValue(automoverUpgradeCost);

        document.getElementById("upgradeIncomeButton").textContent =
            "Cost: " + showValue(incomeCost);

        document.getElementById("luckyButton").textContent =
            "Cost: " + showValue(luckyBallScore);

        document.getElementById("goldenButton").textContent =
            "Cost: " + showValue(goldenBallScore);

        document.getElementById("tinyButton").textContent =
            "Cost: " + showValue(tinyBallScore);

        document.getElementById("automoverButton").textContent =
            "Cost: " + showValue(automoverScore);

        document.getElementById("redButton").textContent =
            "Cost: " + showValue(redBallScore);

        document.getElementById("bigButton").textContent =
            "Cost: " + showValue(bigBallScore);

        document.getElementById("standardButton").textContent =
            "Cost: " + showValue(standardBallScore);

        document.getElementById("upgradeJackpotButton").textContent =
            "Cost: " + showValue(jackpotCost);

        document.getElementById("showScore").textContent =
            "Score: " + showValue(score);

        document.getElementById("pulseBallButton").textContent =
            "Cost: " + showValue(100000000);
        document.getElementById("cornerBallButton").textContent = 
            "Cost: " + showValue(75000000);
        document.getElementById("orbiterBallButton").textContent = 
            "Cost: 120m";

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
            "Cost: " + showValue(
                Math.pow(4, rebirths) * 1000000
            );


        // --------------------
        // INCREASE PRESTIGE
        // --------------------

        fullRebirths++;

        fullRebirthCost *= 5;

        document.getElementById("fullRebirthButton").textContent =
            "Cost: " +
            showValue(fullRebirthCost) +
            " and 10 Rebirths";


        // --------------------
        // UNLOCK PRESTIGE SHOP
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
        else if(fullRebirths == 3){
            document.getElementById("corner")
                .classList.add("nowOnDisplay");
        }
        else if(fullRebirths == 4){
            document.getElementById("orbiter")
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
                "Next Prestige Grants: " +
                capitalisedBallName +
                " Ball";
        }

        else{

            document.getElementById("nextFullRebirth").textContent =
                "All Prestige Balls Unlocked";
        }
    }
}

//new Ball methods
let hasPersistentBall = false;
let hasPulseBall = false;
let noOfCornerBalls = 0;
let hasOrbiterBall = false;

function addPersistentBall(){
    if(score >= 10000000 && !hasPersistentBall){
        score -= 10000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("persistent");
        document.getElementById("persistentBallButton").textContent = "MAX";
        hasPersistentBall = true;
    }
}

function addPulseBall(){
    if(score >= 100000000 && !hasPulseBall){
        score -= 100000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("pulse");
        document.getElementById("pulseBallButton").textContent = "MAX";
        hasPulseBall = true;
    }
}

function addCornerBall(){
    if(score >= 75000000 + (noOfCornerBalls * 25000000) && noOfCornerBalls != 4){
        score -= (75000000 + noOfCornerBalls * 25000000);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        noOfCornerBalls++;
        new Ball("corner");
        new Ball("smallCorner");
        if(noOfCornerBalls == 4){document.getElementById("cornerBallButton").textContent = "MAX"}
        else{document.getElementById("cornerBallButton").textContent = "Cost: " + showValue(75000000 + (noOfCornerBalls * 25000000));}
    }
}

function addOrbiterBall(){
    if(score >= 120000000 && !hasOrbiterBall){
        score -=120000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("orbiter");
        hasOrbiterBall = true;
        document.getElementById("orbiterBallButton").textContent = "MAX";
    }
}

//method for showing the numbers on the HTML
function showValue(value){
    let x;

    if(value == Infinity){
        return value;
    }

    if(value >= 1000000000000000000){
        let index = Math.floor(Math.log10(value) / 3);
        x = value / Math.pow(1000, index);
        x = Math.round(x * 100) / 100;
        return x + getSuffix(value);
    }

    if(value >= 1000000000000000){
        x = value / 1000000000000000;
        x = Math.round(x * 100) / 100;
        return x + "q";
    }

    else if(value >= 1000000000000){
        x = value / 1000000000000;
        x = Math.round(x * 100) / 100;
        return x + "t";
    }

    else if(value >= 1000000000){
        x = value / 1000000000;
        x = Math.round(x * 100) / 100;
        return x + "b";
    }

    else if(value >= 1000000){
        x = value / 1000000;
        x = Math.round(x * 100) / 100;
        return x + "m";
    }

    else if(value >= 1000){
        x = value / 1000;
        x = Math.round(x * 100) / 100;
        return x + "k";
    }
    value = Math.round(value * 10) / 10;
    return value;
}

function getSuffix(value){
    let index = Math.floor(Math.log10(value) / 3);
    let suffixIndex = index - 6;
    let firstLetter =
        String.fromCharCode(97 + Math.floor(suffixIndex / 26));
    let secondLetter =
        String.fromCharCode(97 + (suffixIndex % 26));
    return firstLetter + secondLetter;
}

//Method for making rebirthing, prestieging and reseting better
function confirmAction(message, action){

    let background = document.createElement("div");
    background.className = "popupBackground";


    let box = document.createElement("div");
    box.className = "popup";


    let text = document.createElement("p");
    text.textContent = message;


    let yesButton = document.createElement("button");
    yesButton.textContent = "Yes";


    let noButton = document.createElement("button");
    noButton.textContent = "No";


    yesButton.onclick = () => {
        action();
        background.remove();
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

function information(){

    //Stop the page behind the popup from scrolling
    let oldOverflow = document.documentElement.style.overflowY;
    document.documentElement.style.overflowY = "hidden";


    // --------------------
    // BACKGROUND
    // --------------------

    let background = document.createElement("div");
    background.className = "popupBackground";


    // --------------------
    // POPUP
    // --------------------

    let box = document.createElement("div");
    box.className = "popup informationPopup";


    // --------------------
    // COUNT BALLS
    // --------------------

    function ballCount(type){

        let count = 0;

        for(let ball of balls){

            if(ball.type == type){
                count++;
            }

        }

        return count;
    }


    // --------------------
    // CURRENT VALUES
    // --------------------

    let luckyChance =
        Math.round((0.1 + luckyUpgrade) * 100);


    let nextLuckyChance;

    if(luckyUpgrade >= 0.4){
        nextLuckyChance = "MAX";
    }

    else{
        nextLuckyChance =
            Math.round((0.1 + luckyUpgrade + 0.04) * 100) + "%";
    }


    let nextAutomover;

    if(automoverTimer <= 100){
        nextAutomover = "MAX";
    }

    else{
        nextAutomover =
            (automoverTimer - 100) + " ms";
    }


    // --------------------
    // INFORMATION
    // --------------------

    box.innerHTML = `

        <h2>Game Information</h2>


        <!-- -------------------- -->
        <!-- BALLS -->
        <!-- -------------------- -->

        <h3>Balls</h3>

        <table class="infoTable">

            <tr>
                <th>Ball Type</th>
                <th>Base Score</th>
                <th>Income Effect</th>
                <th>Multiplier Effect</th>
                <th>Special</th>
                <th>Number</th>
            </tr>


            <tr>
                <td>Standard</td>
                <td>1</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>None</td>
                <td>${ballCount("standard")}</td>
            </tr>


            <tr>
                <td>Big</td>
                <td>1</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>Larger than a Standard Ball, making collisions more likely</td>
                <td>${ballCount("big")}</td>
            </tr>


            <tr>
                <td>Red</td>
                <td>4</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>Higher base score</td>
                <td>${ballCount("red")}</td>
            </tr>


            <tr>
                <td>Automover</td>
                <td>1</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>
                    Automatically moves and scores every
                    ${automoverTimer} ms
                </td>
                <td>${ballCount("automover")}</td>
            </tr>


            <tr>
                <td>Golden</td>
                <td>10</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>
                    High base score.
                    Maximum of 10
                </td>
                <td>${noOfGoldenBalls} / 10</td>
            </tr>


            <tr>
                <td>Tiny</td>
                <td>3</td>
                <td>Double</td>
                <td>Normal</td>
                <td>
                    Much smaller than a normal ball
                </td>
                <td>${ballCount("tiny")}</td>
            </tr>


            <tr>
                <td>Lucky</td>
                <td>Jackpot</td>
                <td>Normal</td>
                <td>Normal</td>
                <td>
                    ${luckyChance}% chance to activate the jackpot.
                    Maximum of 5
                </td>
                <td>${noOfLuckyBall} / 5</td>
            </tr>


            <tr>
                <td>Black Hole</td>
                <td>-</td>
                <td>Indirect</td>
                <td>Indirect</td>
                <td>
                    Causes a ball that collides with it to score
                    multiple times. Has a 10% chance to eat the ball.
                    Each ball eaten increases the number of times
                    future collisions score.
                </td>
                <td>${hasBlackHole ? "1 / 1" : "0 / 1"}</td>
            </tr>

        </table>


        <!-- -------------------- -->
        <!-- UPGRADES -->
        <!-- -------------------- -->

        <h3>Upgrades</h3>

        <table class="infoTable">

            <tr>
                <th>Upgrade</th>
                <th>Current Level Gives</th>
                <th>Next Level Gives</th>
                <th>Effect</th>
            </tr>


            <tr>
                <td>Clicks</td>
                <td>+${clickUpgrade}</td>
                <td>+${clickUpgrade + 1}</td>
                <td>
                    Adds additional score when manually
                    clicking a ball
                </td>
            </tr>


            <tr>
                <td>Income</td>
                <td>+${income}</td>
                <td>+${income + 1}</td>
                <td>
                    Adds score whenever a ball scores
                </td>
            </tr>


            <tr>
                <td>Multiplier</td>
                <td>x${scoreMultiplier}</td>
                <td>x${scoreMultiplier + 1}</td>
                <td>
                    Multiplies score gained
                </td>
            </tr>


            <tr>
                <td>Automover Speed</td>
                <td>${automoverTimer} ms</td>
                <td>${nextAutomover}</td>
                <td>
                    Reduces the time between
                    Automover activations
                </td>
            </tr>


            <tr>
                <td>Lucky Chance</td>
                <td>${luckyChance}%</td>
                <td>${nextLuckyChance}</td>
                <td>
                    Increases the chance of a Lucky Ball
                    activating the jackpot
                </td>
            </tr>


            <tr>
                <td>Jackpot</td>
                <td>${showValue(jackpot)}</td>
                <td>${showValue(jackpot * 4)}</td>
                <td>
                    Increases the score given when
                    a Lucky Ball succeeds
                </td>
            </tr>

        </table>


        <!-- -------------------- -->
        <!-- REBIRTH -->
        <!-- -------------------- -->

        <h3>Rebirth</h3>

        <p>
            Rebirth resets your current score, upgrades and most balls,
            but permanently increases all score gained.
        </p>

        <table class="infoTable">

            <tr>
                <th>Rebirths</th>
                <th>Score Multiplier</th>
            </tr>


            <tr>
                <td>1</td>
                <td>x${showValue(Math.pow(1.5, 1))}</td>
            </tr>

            <tr>
                <td>2</td>
                <td>x${showValue(Math.pow(1.5, 2))}</td>
            </tr>

            <tr>
                <td>3</td>
                <td>x${showValue(Math.pow(1.5, 3))}</td>
            </tr>

            <tr>
                <td>4</td>
                <td>x${showValue(Math.pow(1.5, 4))}</td>
            </tr>

            <tr>
                <td>5</td>
                <td>x${showValue(Math.pow(1.5, 5))}</td>
            </tr>


            <tr>
                <td>...</td>
                <td>...</td>
            </tr>


            <tr>
                <td>10</td>
                <td>x${showValue(Math.pow(1.5, 10))}</td>
            </tr>


            <tr>
                <td>15</td>
                <td>x${showValue(Math.pow(1.5, 15))}</td>
            </tr>


            <tr>
                <td>20</td>
                <td>x${showValue(Math.pow(1.5, 20))}</td>
            </tr>

        </table>


        <!-- -------------------- -->
        <!-- PRESTIGE -->
        <!-- -------------------- -->

        <h3>Prestige</h3>

        <p>
            Prestige resets your current run and your Rebirths,
            but permanently unlocks new Prestige Balls.
        </p>

        <table class="infoTable">

            <tr>
                <th>Prestige Ball</th>
                <th>Base Score</th>
                <th>Income Effect</th>
                <th>Multiplier Effect</th>
                <th>Special</th>
                <th>Number</th>
            </tr>


            <tr>
                <td>Persistent</td>
                <td>1</td>
                <td>Double</td>
                <td>Applied Twice</td>
                <td>
                    Survives normal Rebirths and Free Resets.
                    Removed when you Prestige.
                </td>
                <td>${ballCount("persistent")} / 1</td>
            </tr>


            <tr>
                <td>Pulse</td>
                <td>50</td>
                <td>Sextupled</td>
                <td>Normal</td>
                <td>
                    When clicked, moves to a new position,
                    expands and checks for collisions with
                    surrounding balls.
                </td>
                <td>${ballCount("pulse")} / 1</td>
            </tr>


            <tr>
                <td>Corner</td>
                <td>-</td>
                <td>Indirect</td>
                <td>Indirect</td>
                <td>
                    Remains fixed in one of the four corners.
                    Each Corner Ball creates a Small Corner Ball.
                    Maximum of 4.
                </td>
                <td>${noOfCornerBalls} / 4</td>
            </tr>


            <tr>
                <td>Small Corner</td>
                <td>5</td>
                <td>Double</td>
                <td>Applied Twice</td>
                <td>
                    Automatically moves and scores every 5 seconds.
                    One is created for every Corner Ball.
                </td>
                <td>${ballCount("smallCorner")}</td>
            </tr>

            <tr>
                <td>Orbiter</td>
                <td>50</td>
                <td>Quadrupled</td>
                <td>Normal</td>
                <td>
                    Orbits around the centre of the game area.
                    When it collides with another ball, both balls score
                    and the other ball moves. Cannot be clicked.
                </td>
                <td>${ballCount("orbiter")}</td>
            </tr>
        </table>

    `;


    // --------------------
    // CLOSE BUTTON
    // --------------------

    let closeButton = document.createElement("button");
    closeButton.textContent = "Close";


    closeButton.onclick = () => {

        background.remove();

        document.documentElement.style.overflowY =
            oldOverflow;

    };


    box.appendChild(closeButton);

    background.appendChild(box);

    document.body.appendChild(background);
}