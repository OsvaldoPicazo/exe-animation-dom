// -------------- Basic game animation
// Description: avoid incomming obstacles, control with arrow keys
// Topics: OOP, CSS and DOM Canvas Animation - .getContext() .setInterval() .fillRect()



// ------------------------- Part 1: declare classes, objects, variables --------------------------------

// Object Game Are: does not require a class since there is only one Game area in this example

const myGameArea = {
    canvas: document.createElement('canvas'),
    frames: 0,     // it increments every canvas update, used to add obstacle

    // start the game, create canvas and update it every 20ms
    start: function () {
      this.canvas.width = 480;
      this.canvas.height = 270;
      this.context = this.canvas.getContext('2d');
      document.body.insertBefore(this.canvas, document.body.childNodes[0]); //insert a canvas tag in a specific position in the body of the html
      
    // call updateGameArea() every 20 milliseconds
      this.interval = setInterval(updateGameArea, 20);
    },
    
    // clear canvas before each new draw
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    // Stop game when players crashes: erases the setInterval and stops updating the game
    stop: function () {
        clearInterval(this.interval);
      },
    // keep the score. use the frame counter. the division by 5 is just a preference
    score: function () {
        const points = Math.floor(this.frames / 5);
        this.context.font = '18px serif';
        this.context.fillStyle = 'black';
        this.context.fillText(`Score: ${points}`, 350, 50);
      }
  };

// Class component to create players and obstacles
class Component {
    constructor(width, height, color, x, y) {
        this.width = width;
        this.height = height;
        this.color = color;
        this.x = x;
        this.y = y;
        // new speed properties
        this.speedX = 0;
        this.speedY = 0;    
    }

    // 
    update() {
        const ctx = myGameArea.context;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    // current player/obstacle position 
    newPos() {
        this.x += this.speedX;
        this.y += this.speedY;
    }

    // Check for a crash in a single obstacle: if position of the player is the same as the obstacle
    left() {
        return this.x;
    }
    
    right() {
        return this.x + this.width;
    }
    
    top() {
        return this.y;
    }
  
    bottom() {
        return this.y + this.height;
    }
 
    crashWith(obstacle) {
        return !(this.bottom() < obstacle.top() || this.top() > obstacle.bottom() || this.right() < obstacle.left() || this.left() > obstacle.right());
    }

}

// array of created obstacles, initialized empty
const myObstacles = [];     

// make a new player
const player = new Component(30, 30, 'red', 0, 110);


// ----------------------------  function declarations ---------------------------------------------------------

// update game status: clear canvas, get and update player position, update obstacles position, check if game stops (player crashes)
function updateGameArea() {
    myGameArea.clear();
    player.newPos();
    player.update();
    // update the obstacles array
    updateObstacles();
    // check if the game should stop
    checkGameOver();
    // update and draw the score
    myGameArea.score();
  }

// update obstacles: move them to the left and create new ones
function updateObstacles() {
    // loop the through the obstacles array and move them along the x axis
    for (i = 0; i < myObstacles.length; i++) {
        myObstacles[i].x += -1;
        myObstacles[i].update();
      }

    myGameArea.frames += 1;
    if (myGameArea.frames % 120 === 0) {
      let x = myGameArea.canvas.width;
      let minHeight = 20;
      let maxHeight = 200;
      let height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
      let minGap = 50;
      let maxGap = 200;
      let gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
      myObstacles.push(new Component(10, height, 'green', x, 0));
      myObstacles.push(new Component(10, x - height - gap, 'green', x, height + gap));
    }
  }

// check for a crash: if player positon is the same as any of the obstacles
function checkGameOver() {
    const crashed = myObstacles.some(function (obstacle) {
      return player.crashWith(obstacle);
    });
  
    if (crashed) {
      myGameArea.stop();
    }
}

// ------------------------------------ Part 3: Event listeners --------------------

// increase or decrease player speed when pressing the arrow keys = move
// add listener to the handler "keydown" in the whole document
// key down keeps invocking the callback function as long as the key kept down
document.addEventListener('keydown', (e) => {
    switch (e.keyCode) {
        case 38: // up arrow
        player.speedY -= 1;
        break;
        case 40: // down arrow
        player.speedY += 1;
        break;
        case 37: // left arrow
        player.speedX -= 1;
        break;
        case 39: // right arrow
        player.speedX += 1;
        break;
    }
    });
  
// event listener with handler "keyup" for when the key is realeased
// set speed back to zero, stop the motion
document.addEventListener('keyup', (e) => {
    player.speedX = 0;
    player.speedY = 0;
    });

// ----------------- Part 4: invoke function .start() and start the game ------------------
myGameArea.start();
