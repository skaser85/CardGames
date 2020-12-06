let cardWidth = 75;
let cardHeight = 100;
let game;

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);

    game = new KC(1, cardWidth, cardHeight);
    game.dealCards();
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