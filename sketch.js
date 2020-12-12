let cardWidth = 100;
let cardHeight = 130;
let game;
let suits = ["C", "D", "H", "S"];
let honors = {1: "A", 11: "J", 12: "Q", 13: "K"};
let cards = [];
let button;
let restart;
let logger;
let undoBtn;
let redoBtn;
let colors = {};

function preload() {
    suits.forEach(s => {
        for(let i = 1; i < 14; i++) {
            let v = i > 10 || i === 1 ? honors[i] : i;
            loadImage(`cards/${v}${s}.png`, img => {
                cards.push(new Card(`${v}${s}`, img, cardWidth, cardHeight, 0, 0));
            });
        }
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

    // game = new Solitaire(7, cardWidth, cardHeight, cards, colors, logger);
    // game.dealCards();

    game = new KC(4, cardWidth, cardHeight, cards, colors, logger);
    game.dealCards();

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