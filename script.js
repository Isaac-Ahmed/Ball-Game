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
let jackpotUpgrades = 0;

let eaten = 0;

//Chain variable to remove it
let chain;

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
        if(this.type == "chain"){
            this.element.className = "chainBall";
            chain = this;
        }
        //Put element in the gameArea
        document.getElementById("gameArea").appendChild(this.element);
        if(this.type != "chain"){
            balls.push(this);
        }
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
                    score += (clickUpgrade * scoreMultiplier * Math.pow(1.5, rebirths));
                    this.clicked = true;
                    this.addScore();

                    //Move to new position first
                    this.move();

                    //Grow
                    this.element.style.transform = "scale(4)";

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
        else if(this.type == "chain"){
            this.element.onclick = () => {
                this.moves = 0;
                this.startChain();
            }
            this.move()
        }
        else{
            this.element.onclick = () => {
                score += (clickUpgrade * scoreMultiplier * Math.pow(1.5, rebirths));
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
            showScoreAdded += clickUpgrade * scoreMultiplier * Math.pow(1.5, rebirths);
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
            if(this.clicked){
                addedScore += (20 + clickUpgrade);
            }
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
                addedScore += (clickUpgrade * scoreMultiplier);
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
        else if(this.type == "chain"){
            addedScore += 250 + ((income + clickUpgrade) * 3);
            addedScore *= scoreMultiplier;
        }

        // --------------------
        // GENERAL SCORE MULTIPLIERS
        // WORKS FOR ALL BALL TYPES
        // --------------------

        addedScore += income;
        if(this.type != "lucky"){
            addedScore *= scoreMultiplier;
        }
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
        checkScores();
    }

    checkCollision(otherBall){

    // --------------------
    // NORMAL COLLISIONS
    // --------------------

    if(
        otherBall.type != "blackHole" &&
        otherBall.type != "corner"
    ){

        let thisRadius = this.element.offsetWidth / 2;
        let otherRadius = otherBall.element.offsetWidth / 2;

        let thisCentreX = this.xPos + thisRadius;
        let thisCentreY = this.yPos + thisRadius;

        let otherCentreX = otherBall.xPos + otherRadius;
        let otherCentreY = otherBall.yPos + otherRadius;

        let dx = thisCentreX - otherCentreX;
        let dy = thisCentreY - otherCentreY;

        let distance =
            Math.sqrt((dx * dx) + (dy * dy));


        if(distance <= thisRadius + otherRadius){


            // --------------------
            // PULSE BALL
            // --------------------

            if(otherBall.type == "pulse"){

                //Only activate if Pulse is not already active
                if(!otherBall.justMoved){

                    otherBall.justMoved = true;


                    //Treat collision as activating the Pulse
                    score += (
                        clickUpgrade *
                        scoreMultiplier *
                        Math.pow(1.5, rebirths)
                    );

                    otherBall.clicked = true;
                    otherBall.addScore();


                    //Move Pulse
                    otherBall.move();


                    //Grow
                    otherBall.element.style.transform =
                        "scale(4)";


                    //Check collisions while enlarged
                    setTimeout(() => {

                        for(let x of balls){

                            //Do not check collision with itself
                            if(x != otherBall){

                                otherBall.checkCollision(x);

                            }

                        }


                        //Shrink
                        otherBall.element.style.transform =
                            "scale(1)";

                    }, 500);


                    //Allow Pulse to activate again
                    setTimeout(() => {

                        otherBall.justMoved = false;

                    }, 1000);

                }

            }


            // --------------------
            // OTHER BALLS
            // --------------------

            else{

                otherBall.addScore();
                otherBall.move();

            }


            return true;
        }


        return false;
    }


    // --------------------
    // CORNER BALL
    // --------------------

    else if(otherBall.type == "corner"){

        return false;

    }


    // --------------------
    // BLACK HOLE
    // --------------------

    else{

        /*
            These balls cannot be affected
            by the Black Hole.
        */

        if(
            this.type == "persistent" ||
            this.type == "pulse" ||
            this.type == "corner" ||
            this.type == "smallCorner" ||
            this.type == "orbiter" ||
            this.type == "chain"
        ){

            return false;

        }


        // --------------------
        // BLACK HOLE COLLISION
        // --------------------

        let thisRadius = this.element.offsetWidth / 2;
        let otherRadius = otherBall.element.offsetWidth / 2;

        let thisCentreX = this.xPos + thisRadius;
        let thisCentreY = this.yPos + thisRadius;

        let otherCentreX = otherBall.xPos + otherRadius;
        let otherCentreY = otherBall.yPos + otherRadius;

        let dx = thisCentreX - otherCentreX;
        let dy = thisCentreY - otherCentreY;

        let distance =
            Math.sqrt((dx * dx) + (dy * dy));


        if(distance <= thisRadius + otherRadius){


            //Score multiple times based on Black Hole strength
            for(let i = 0; i < (eaten + 10); i++){

                this.addScore();

            }


            //10% chance for Black Hole to eat the ball
            let x = Math.random();


            if(x <= 0.1){


                //Lucky Ball counter
                if(this.type == "lucky"){

                    noOfLuckyBall--;

                    document.getElementById(
                        "luckyButton"
                    ).textContent =
                        "Cost: " +
                        showValue(luckyBallScore);

                }


                //Golden Ball counter
                if(this.type == "golden"){

                    noOfGoldenBalls--;

                    document.getElementById(
                        "goldenButton"
                    ).textContent =
                        "Cost: " +
                        showValue(goldenBallScore);

                }


                //Increase Black Hole strength
                eaten++;


                //Remove eaten ball
                this.remove();

            }


            return true;
        }


        return false;
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
        if(this.type == "automover" || this.type == "smallCorner" || this.type == "orbiter" || this.type == "chain"){
            clearInterval(this.interval);
        }
        if(this.type == "chain"){
            chain = null;
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
    
    startChain(){
        this.move();
        this.addScore();
        this.moves = 0;
        this.element.onclick = () => {};
        this.interval = setInterval(() => {
            this.move();
            this.addScore();
            this.moves++;
            if(this.moves == 9){
                clearInterval(this.interval);
                this.element.onclick = () => {
                    this.startChain();
                };
            }
        }, 1000)
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
    checkScores();
}

function addBigBall(){
    if(score >= bigBallScore){
        score -= bigBallScore;
        new Ball("big");
        bigBallScore = bigBallScore * 3;
    }
    document.getElementById("bigButton").textContent = "Cost: " + showValue(bigBallScore);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
    checkScores();
}

function addRedBall(){
    if(score >= redBallScore){
        score -= redBallScore;
        new Ball("red");
        redBallScore = redBallScore * 3;
        document.getElementById("redButton").textContent = "Cost: " + showValue(redBallScore);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        checkScores();
    }
}

function addAutomover(){
    if(score >= automoverScore){
        score -= automoverScore;
        new Ball("automover");
        automoverScore = automoverScore * 2;
        document.getElementById("automoverButton").textContent = "Cost: " + showValue(automoverScore);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        checkScores();
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
    checkScores();
}

function addTinyBall(){
    if(score >= tinyBallScore){
        score -= tinyBallScore;
        new Ball("tiny");
        tinyBallScore *= 3;
    }
    document.getElementById("tinyButton").textContent = "Cost: " + showValue(tinyBallScore);
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
    checkScores();
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
    checkScores();
}

function addBlackHole(){
    if(!hasBlackHole && score >= 100000000){
        score -= 100000000;
        document.getElementById("blackHoleButton").textContent = "MAX";
        new Ball("blackHole");
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        hasBlackHole = true;
        checkScores();
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
    checkScores();
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
        checkScores();
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
    checkScores();
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
    checkScores();
}

function upgradeMultiplier(){
    if(score >= scoreMultiplierCost){
        scoreMultiplier++;
        score -= scoreMultiplierCost;
        scoreMultiplierCost = scoreMultiplierCost * 3;
    }
    document.getElementById("showScore").textContent = "Score: " + showValue(score);
    document.getElementById("upgradeMultiplierButton").textContent = "Cost: " + showValue(scoreMultiplierCost);
    document.getElementById("showMultiplier").textContent = "Upgrade Multiplier x" + showValue(scoreMultiplier);
    checkScores();
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
    checkScores();
}

function increaseJackpot(){
    if(score >= jackpotCost && jackpotUpgrades != 10){
        jackpot *= 3;
        score -= jackpotCost;
        jackpotCost  = Math.floor(jackpotCost * 6.5);
        jackpotUpgrades++;
        document.getElementById("upgradeJackpotButton").textContent = "Cost: " + showValue(jackpotCost);
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        if(jackpotUpgrades == 10){document.getElementById("upgradeJackpotButton").textContent = "MAX";}
    }
    checkScores();
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
        hasChainBall = false;

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
        jackpotUpgrades = 0;


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
        document.getElementById("chainBallButton").textContent = 
            "Cost: 150m";


        // --------------------
        // REMOVE NORMAL BALLS
        // KEEP PERSISTENT BALL
        // --------------------

        if(chain != null){chain.remove();}

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

        checkScores();
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
    hasChainBall = false;

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
    jackpotUpgrades = 0;


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
    document.getElementById("chainBallButton").textContent = 
            "Cost: 150m";

    // --------------------
    // REMOVE NORMAL BALLS
    // KEEP PERSISTENT BALL
    // --------------------

    if(chain != null){chain.remove();}


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

    checkScores();
}

function fullRebirth(){

    if(score >= fullRebirthCost && fullRebirths < newBalls.length){

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
        hasChainBall = false;

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
        jackpotUpgrades = 0;


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
        document.getElementById("chainBallButton").textContent =
            "Cost: 150m";

        // --------------------
        // REMOVE ALL BALLS
        // --------------------

        if(chain != null){chain.remove();}

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
            showValue(fullRebirthCost);


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
        else if(fullRebirths == 5){
            document.getElementById("chain")
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

        //--------------------
        // CHANGE COLOUR
        //--------------------

        let hue = (fullRebirths * 137.5) % 360;
        document.getElementById("gameArea").style.backgroundColor = "hsl(" + hue + ", 30%, 20%)";

        checkScores();

        if(fullRebirths == newBalls.length){
            document.getElementById("fullRebirthButton").textContent = "MAX";
        }
    }
}

//new Ball methods
let hasPersistentBall = false;
let hasPulseBall = false;
let noOfCornerBalls = 0;
let hasOrbiterBall = false;
let hasChainBall = false;

function addPersistentBall(){
    if(score >= 10000000 && !hasPersistentBall){
        score -= 10000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("persistent");
        document.getElementById("persistentBallButton").textContent = "MAX";
        hasPersistentBall = true;
    }
    checkScores();
}

function addPulseBall(){
    if(score >= 100000000 && !hasPulseBall){
        score -= 100000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("pulse");
        document.getElementById("pulseBallButton").textContent = "MAX";
        hasPulseBall = true;
    }
    checkScores();
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
    checkScores();
}

function addOrbiterBall(){
    if(score >= 120000000 && !hasOrbiterBall){
        score -=120000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("orbiter");
        hasOrbiterBall = true;
        document.getElementById("orbiterBallButton").textContent = "MAX";
    }
    checkScores();
}

function addChainBall(){
    if(score >= 150000000 && !hasChainBall){
        score -= 150000000;
        document.getElementById("showScore").textContent = "Score: " + showValue(score);
        new Ball("chain");
        hasChainBall = true;
        document.getElementById("chainBallButton").textContent = "MAX";
    }
    checkScores();
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

    if(action == rebirth){
        if(score < Math.pow(4, rebirths) * 1000000){
            return;
        }
    }

    if(action == fullRebirth){
        if(
            score < fullRebirthCost ||
            fullRebirths >= newBalls.length
        ){
            return;
        }
    }


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

    /*
        Lucky Ball begins at a 10% chance.

        Each upgrade adds 4%.

        Maximum:
        10% + (10 x 4%) = 50%
    */

    let luckyChance =
        Math.round((0.1 + luckyUpgrade) * 100);


    let nextLuckyChance;

    if(luckyUpgrade >= 0.4){
        nextLuckyChance = "MAX";
    }

    else{

        nextLuckyChance =
            Math.min(
                50,
                Math.round(
                    (0.1 + luckyUpgrade + 0.04) * 100
                )
            ) + "%";

    }


    let nextAutomover;

    if(automoverTimer <= 100){
        nextAutomover = "MAX";
    }

    else{

        nextAutomover =
            (automoverTimer - 100) + " ms";

    }


    let nextJackpot;

    if(jackpotUpgrades >= 10){
        nextJackpot = "MAX";
    }

    else{
        nextJackpot = showValue(jackpot * 3);
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
                <td>
                    Larger than a Standard Ball, making collisions more likely
                </td>
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
                    When manually clicked, gains an additional
                    20 + Click Upgrade score.
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
                <td>0</td>
                <td>Normal</td>
                <td>Not Applied</td>
                <td>
                    ${luckyChance}% chance to activate the
                    ${showValue(jackpot)} Jackpot.
                    Jackpot still benefits from Rebirths.
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
                    Current Strength: x${eaten + 10}  
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
                    activating the Jackpot.
                    Maximum chance is 50%
                </td>
            </tr>


            <tr>
                <td>Jackpot</td>
                <td>${showValue(jackpot)}</td>
                <td>${nextJackpot}</td>
                <td>
                    Triples the Jackpot value.
                    Maximum of 10 upgrades.
                    The Upgrade Multiplier does not affect
                    the Jackpot, but Rebirths do
                </td>
            </tr>

        </table>


        <!-- -------------------- -->
        <!-- REBIRTH -->
        <!-- -------------------- -->

        <h3>Rebirth</h3>

        <p>
            Rebirth resets your current score, upgrades and most balls,
            but permanently increases score gained by x1.5 per Rebirth.
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
                <td>${ballCount("orbiter")} / 1</td>
            </tr>


            <tr>
                <td>Chain</td>
                <td>250</td>
                <td>Quadrupled</td>
                <td>Applied Twice</td>
                <td>
                    When activated, moves and scores ten times.
                    Cannot be activated by collisions with other balls.
                </td>
                <td>${hasChainBall ? "1 / 1" : "0 / 1"}</td>
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

//Method and array for allowing the buttons to change colour if you cannot afford then
let shopChecks = [

    //Normal Balls
    {button: "standardButton", cost: () => standardBallScore},
    {button: "bigButton", cost: () => bigBallScore},
    {button: "redButton", cost: () => redBallScore},
    {button: "automoverButton", cost: () => automoverScore},
    {button: "goldenButton", cost: () => goldenBallScore, max: () => noOfGoldenBalls >= 10},
    {button: "tinyButton", cost: () => tinyBallScore},
    {button: "luckyButton", cost: () => luckyBallScore, max: () => noOfLuckyBall >= 5},
    {button: "blackHoleButton", cost: () => 100000000, max: () => hasBlackHole},

    //Upgrades
    {button: "upgradeClickButton", cost: () => clickCost},
    {button: "upgradeIncomeButton", cost: () => incomeCost},
    {button: "upgradeAutomoverButton", cost: () => automoverUpgradeCost, max: () => automoverTimer == 100},
    {button: "upgradeMultiplierButton", cost: () => scoreMultiplierCost},
    {button: "upgradeLuckyBallsButton", cost: () => luckyCost, max: () => luckyUpgrade >= 0.4},
    {button: "upgradeJackpotButton", cost: () => jackpotCost, max: () => jackpotUpgrades >= 10},

    //Prestige Balls
    {button: "persistentBallButton", cost: () => 10000000, max: () => hasPersistentBall},
    {button: "pulseBallButton", cost: () => 100000000, max: () => hasPulseBall},
    {button: "cornerBallButton", cost: () => 75000000 + (noOfCornerBalls * 25000000), max: () => noOfCornerBalls >= 4},
    {button: "orbiterBallButton", cost: () => 120000000, max: () => hasOrbiterBall},
    {button: "chainBallButton", cost: () => 150000000, max: () => hasChainBall},

    //Prestiege and Rebirths
    {button: "fullRebirthButton", cost: () => fullRebirthCost, max: () => (fullRebirths == newBalls.length)},
    {button: "rebirthButton", cost: () => (Math.pow(4, rebirths) * 1000000)}

];


function checkScores(){

    for(let item of shopChecks){

        let button = document.getElementById(item.button);

        button.classList.remove("canAfford");
        button.classList.remove("cannotAfford");

        //If item is MAX, leave default button colour
        if(item.max && item.max()){
            continue;
        }

        if(score >= item.cost()){
            button.classList.add("canAfford");
        }
        else{
            button.classList.add("cannotAfford");
        }
    }
}