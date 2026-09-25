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
            setInterval(() => {
                this.move();
                this.addScore();
            }, 1000);
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
        if(this.type == "standard" || this.type == "big"){
            score++;
        }
        else if(this.type == "red"){
            score += 2;
        }
        else if(this.type == "automover"){
            score +=  1;
        }
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
}

//values for the shop
standardBallScore = 1;
bigBallScore = 30;
redBallScore = 100;
automoverScore = 120;

function addStandardBall(){
    if(score >= standardBallScore){
        score -= standardBallScore;
        new Ball("standard");
        if(standardBallScore == 1){
            standardBallScore = 10;
        }
        else{
            standardBallScore = standardBallScore * 2;
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

//cheat button
addEventListener("keydown", function(ev){
    let key = ev.key;

    if(key == "c"){
        score = score + 19000000000000000;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
    if(key == "0"){
        score = 0;
        document.getElementById("showScore").textContent = "Score: " + score;
    }
})