let canvas = document.getElementById('game_canvas');
let ctx = canvas.getContext('2d');

canvas.width =  250;
canvas.height = 400;
// Previously   400
//              600

let game = {};
game.bgImage = new Image();
game.bgImage.src = 'images/background2.png';
game.floorImage = new Image();
game.floorImage.src = 'images/floor.png';
game.menuImage = new Image();
game.menuImage.src = 'images/menu.png';

game.gravity = 1.5;
game.speed = 1.25;
game.score = 0;
game.start = true;

game.bg1x = 0;
game.bg2x = canvas.height;
game.floor1x = 0;
game.floor2x = 1149;

game.mousePos = {x: 0, y: 0};
game.updateMousePos = function(e) {
    let rect = canvas.getBoundingClientRect();
    game.mousePos = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

game.clicking = false;
game.mouseDown = function(e) {
    game.clicking = true;
}
game.mouseUp = function(e) {
    game.clicking = false;
}

game.drawBackground = function() {
    // Draw background
    game.bg1x -= game.speed;
    game.bg2x -= game.speed;
    if(game.bg1x <= -canvas.height) {
        game.bg1x = canvas.height;
    }
    if(game.bg2x <= -canvas.height) {
        game.bg2x = canvas.height;
    }

    ctx.drawImage(game.bgImage, game.bg1x, 0, canvas.height, canvas.height);
    ctx.drawImage(game.bgImage, game.bg2x, 0, canvas.height, canvas.height);    
}
game.drawFloor = function() {
    // Draw floor
    game.floor1x -= game.speed;
    game.floor2x -= game.speed;
    if(game.floor1x <= -1149) {
        game.floor1x = 1149;
    }
    if(game.floor2x <= -1149) {
        game.floor2x = 1149;
    }

    ctx.drawImage(game.floorImage, game.floor1x, 550, 1149, 50);
    ctx.drawImage(game.floorImage, game.floor2x, 550, 1149, 50);
}
game.drawDeadMenu = function(score) {
    ctx.drawImage(game.menuImage, 25, 100, 200, 200);
    write('Game Over', 'black', '45px FlappyBirdy', canvas.width/2, 125);
    write(score, 'black', '60px DisposableDroidBB', canvas.width/2, 175);

    game.playButton.draw();
    game.quitButton.draw();
}
game.jump = function() {
    game.gravity = -4;
    game.start = false;
} 

function keyDownHandler(event) {
    if(event.key == ' ') {
        game.jump();
        console.log('up');
    }
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min)
}
function write(text, colour, font, x, y) {
    ctx.font = font;
    ctx.fillStyle = colour;
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(text, x, y);
}

class Button {
    constructor(x, y, width, height, text) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.text = text;

        this.image = new Image();
        this.image.src = 'images/button(1).png';
        this.activeImage = new Image();
        this.activeImage.src = 'images/button(active).png';

        this.currentImage = this.image;
    }
    hovering() {
        return game.mousePos["x"] > this.x && game.mousePos["x"] < this.x + this.width && game.mousePos["y"] > this.y && game.mousePos["y"] < this.y + this.height;
    }
    updateImage() {
        if(this.hovering()) {
            this.currentImage = this.activeImage;
        } else {
            this.currentImage = this.image;
        }
    }
    draw() {
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
        write(this.text, 'black', '20px DisposableDroidBB', this.x + 31, this.y + 7);
    }
}

class Pipe {
    constructor() {
        this.x = canvas.width;
        this.y = randInt(-250, -75);
        this.width = 41;
        this.onePipeHeight = 300;
        this.gap = 150;

        this.imageUp = new Image();
        this.imageUp.src = 'images/pipe-up.png';
        this.imageDown = new Image();
        this.imageDown.src = 'images/pipe-down.png';

        this.passed150 = false;
        this.passed = false;
    }
    draw(rect=true) {
        ctx.drawImage(this.imageDown, this.x, this.y, this.width, this.onePipeHeight);
        ctx.drawImage(this.imageUp, this.x, this.y + this.onePipeHeight + this.gap, this.width, this.onePipeHeight);
        if(rect) {
            ctx.beginPath();
            ctx.rect(this.x + this.onePipeHeight, this.y, this.width, this.gap);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        }
    }
}

class Player {
    constructor() {
        this.width = 37;
        this.height = 25;
        this.x = 20;
        this.y = canvas.height/2 - this.height/2;

        this.wingupImage = new Image();
        this.wingupImage.src = 'images/flappy_bird_wingup.png'
        this.wingmiddleImage = new Image();
        this.wingmiddleImage.src = 'images/flappy_bird_wingmiddle.png'
        this.wingdownImage = new Image();
        this.wingdownImage.src = 'images/flappy_bird_wingdown.png'

        this.currentImage = this.wingmiddleImage;
        this.frameCount = 0;
        this.currentFrame = 1;

        this.fallRotation = - Math.PI / 6;

        this.dead = false;
    }
    draw(rect=false) {
        ctx.drawImage(this.currentImage, this.x, this.y, this.width, this.height);
        if(rect) {
            ctx.beginPath();
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.strokeStyle = 'red';
            ctx.stroke();
            ctx.closePath();
        }
    }
    changeFrame() {
        if(this.frameCount === 10) {
            switch(this.currentFrame) {
                case 1:
                    this.currentImage = this.wingmiddleImage;
                    break;
                case 2:
                    this.currentImage = this.wingupImage;
                    break;
                case 3:
                    this.currentImage = this.wingmiddleImage;
                    break;
                case 4:
                    this.currentImage = this.wingdownImage;
                    break;
            }
            if(this.currentFrame === 4) {
                this.currentFrame = 1;
            } else {
                this.currentFrame += 1;
            }

            this.frameCount = 0;
        } else {
            this.frameCount += 1;
        }
    }
    onFloorOrCeiling() {
        return this.y + this.height >= canvas.height-50 || this.y <= 0;
    }
    collidingWithPipe(pipe) {
        return (pipe.x <= this.x + player.width && pipe.x + pipe.width >= this.x) && (player.y <= pipe.y + pipe.onePipeHeight || player.y + player.height >= pipe.y + pipe.onePipeHeight + pipe.gap)
    }
    onDeath() {
        console.log('dead');
        this.dead = true;
    }
}

let player = new Player();
let pipes = [new Pipe()];

game.playButton = new Button(55, 235, 60, 35, 'Play');
game.quitButton = new Button(135, 235, 60, 35, 'Quit');

function mainLoop() {
    if(game.start) {
        game.drawBackground();
        game.drawFloor();
        player.draw();

        write('Flappy Bird', 'white', '45px FlappyBirdy', canvas.width/2, 120);
        write('Press SPACE to start', 'white', '25px FlappyBirdy', canvas.width/2, 220);
    }
    if(player.dead) {
        player.draw();
        game.drawDeadMenu(game.score);
        
        game.playButton.updateImage();
        game.quitButton.updateImage();
        game.playButton.draw();
        game.quitButton.draw();

        if(game.playButton.hovering() && game.clicking) {
            location.reload();
        }
        if(game.quitButton.hovering() && game.clicking) {
            window.close();
        }
    }

    if(! game.start && ! player.dead) {
        game.gravity += 0.13;

        player.y += game.gravity;

        game.drawBackground();

        for(let i = 0; i < pipes.length; i++) {
            pipes[i].x -= game.speed;
            pipes[i].draw();
            if(pipes[i].x <= 100 && ! pipes[i].passed150) {
                pipes.push(new Pipe());
                pipes[i].passed150 = true;
            }

            if(player.onFloorOrCeiling() || player.collidingWithPipe(pipes[i])) {
                player.onDeath();
            }

            if(player.x > pipes[i].x + pipes[i].width && ! pipes[i].passed) {
                game.score++;
                pipes[i].passed = true;

                if(game.score % 10 === 0) {
                    game.speed += 0.25;
                }
                console.log(game.speed);
            }

            if(pipes[i].x < -200) {
                pipes.splice(i, 1);
            }
        }

        game.drawFloor();

        player.changeFrame();
        player.draw(rect=false);
        // console.log(pipes);

        write(game.score, 'white', '90px DisposableDroidBB', canvas.width/2, 30);
    }
}

setInterval(mainLoop, 12);
document.addEventListener('keypress', keyDownHandler);
document.addEventListener('mousemove', game.updateMousePos);
document.addEventListener('mouseup', game.mouseUp);
document.addEventListener('mousedown', game.mouseDown);
