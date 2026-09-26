//upgrade varables
let income = 0;
let incomeCost = 25;

let automoverTimer = 1000;
let automoverUpgradeCost = 100;

let scoreMultiplier = 1;
let scoreMultiplierCost = 200;

let luckyUpgrade = 0; //will upgrade by 0.04 each time, up to 10 upgrades, getting 50% chance 
let luckyCost = 20000;

//variables for ball class
let balls = [];
let score = 1;
let gameArea = document.getElementById("gameArea");

class Ball{
    constructor(type){
        this.type = type;
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
        //Put element in the gameArea
        document.getElementById("gameArea").appendChild(this.element);
        balls.push(this);
        //Make it call addScore if not automover
        if(this.type != "automover"){
            this.element.onclick = () => {
                this.addScore();
                this.move();
            }
        }
        else{
            this.interval = setInterval(() => {
                this.move();
                this.addScore();
            }, automoverTimer);
            
        }

        //Move the ball so it shows
        this.move();
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
        if(this.type == "standard" || this.type == "big" || this.type == "automover"){
            addedScore++;
        }
        else if(this.type == "red"){
            addedScore += 2;
        }
        else if(this.type == "tiny"){
            addedScore += 3 + income; //Gives tiny ball x2 income bonus
        }
        else if(this.type == "golden"){
            addedScore +=  10;
        }
        else if(this.type == "lucky"){
            let luckyChance = 0.1 + luckyUpgrade;

            if(Math.random() < luckyChance){
                addedScore += 100;
            }
        }

        addedScore += income;
        addedScore = addedScore * scoreMultiplier;
        score += addedScore;
        document.getElementById("showScore").textContent = "Score: " + score;
    }

    checkCollision(otherBall){
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
})

//upgrade Buttons
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