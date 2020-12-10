let cardWidth = 75;
let cardHeight = 100;
let game;
let cardsList = ["2C","3C","4C","5C","6C","7C","8C","9C","10C","JC","QC","KC","AC","2H","3H","4H","5H","6H","7H","8H","9H","10H","JH","QH","KH","AH","2S","3S","4S","5S","6S","7S","8S","9S","10S","JS","QS","KS","AS","2D","3D","4D","5D","6D","7D","8D","9D","10D","JD","QD","KD","AD"];
let cards = [];
let button;
let restart;
let logger;
let undoBtn;
let redoBtn;
let colors = {};

function preload() {
    cardsList.forEach(c => {
        loadImage(`cards/${c}.png`, img => {
            cards.push(new Card(c, img, cardWidth, cardHeight, 0, 0));
        });
    });
}

function setup() {
    createCanvas(960, 960);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);
    textAlign(CENTER, CENTER);

    colors.yellow = color(255, 255, 100);
    colors.yellowA = color(255, 255, 100, 125);
    colors.blue = color(0, 255, 255);
    colors.blueA = color(0, 255, 255, 125);
    colors.salmon = color(200, 100, 0);
    colors.salmonA = color(200, 100, 0, 125);

    logger = new Logger();

    game = new Solitaire(7, cardWidth, cardHeight, cards, colors, logger);
    game.dealCards();

    // game = new KC(4, cardWidth, cardHeight, cards, colors, logger);
    // game.dealCards();

    restart = createButton("Restart Game");
    restart.position(15, 15);
    restart.mousePressed(() => {
        game.restartGame(cards);
    });

    undoBtn = createButton("Undo");
    undoBtn.position(15, restart.y + restart.height + 5);
    undoBtn.mousePressed(() => {
        game.undo();
    });

    redoBtn = createButton("Redo");
    redoBtn.position(undoBtn.x + undoBtn.width + 5, restart.y + restart.height + 5);
    redoBtn.mousePressed(() => {
        game.redo();
    });
}

function draw() {
    background(0, 100, 0);

    game.update();
    game.draw();
}

function mouseClicked() {
    game.handleClick();
    return false; // safety precaution for browser weirdness
}