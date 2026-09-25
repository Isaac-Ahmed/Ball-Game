let balls = [];
let score = 1;

class Ball{
    constructor(type){
        this.type = type;
        this.xPos = Math.random() * 100;
        this.yPos = Math.random() * 100;
        if(this.type == "standard"){
            this.size = 1;
        }
        else{
            this.size = 1;
        }

        //Create the HTML element
        this.element = document.createElement("div");
        //Put it in the CSS class name ball
        this.element.className = "ball";
        //Put element in the gameArea
        document.getElementById("gameArea").appendChild(this.element);
        balls.push(this);
        //Make it call addScore
        this.element.onclick = () => {
            this.addScore();
            this.move();
        }

        //Move the ball so it shows
        this.move();
    }

    move(){
        this.xPos = Math.random() * 100;
        this.yPos = Math.random() * 100;

        //Move the element around the gameArea
        this.element.style.left = this.xPos + "%";
        this.element.style.top = this.yPos + "%";
    }

    addScore(){
        if(this.type == "standard"){
            score++;
        }
        document.getElementById("showScore").textContent = "Score: " + score;
    }

    checkCollision(){

    }

    collisionEffect(){

    }
}

//values for the shop
standardBallScore = 1;

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