let cardWidth = 75;
let cardHeight = 100;
let game;
let cards = [];
let cardsList = [
    {
        name: "2C",
        img: null,
        card: null
    },
    {
        name: "3C",
        img: null,
        card: null
    },
    {
        name: "4C",
        img: null,
        card: null
    },
    {
        name: "5C",
        img: null,
        card: null
    },
    {
        name: "6C",
        img: null,
        card: null
    },
    {
        name: "7C",
        img: null,
        card: null
    },
    {
        name: "8C",
        img: null,
        card: null
    },
    {
        name: "9C",
        img: null,
        card: null
    },
    {
        name: "10C",
        img: null,
        card: null
    },
    {
        name: "JC",
        img: null,
        card: null
    },
    {
        name: "QC",
        img: null,
        card: null
    },
    {
        name: "KC",
        img: null,
        card: null
    },
    {
        name: "AC",
        img: null,
        card: null
    },
    {
        name: "2H",
        img: null,
        card: null
    },
    {
        name: "3H",
        img: null,
        card: null
    },
    {
        name: "4H",
        img: null,
        card: null
    },
    {
        name: "5H",
        img: null,
        card: null
    },
    {
        name: "6H",
        img: null,
        card: null
    },
    {
        name: "7H",
        img: null,
        card: null
    },
    {
        name: "8H",
        img: null,
        card: null
    },
    {
        name: "9H",
        img: null,
        card: null
    },
    {
        name: "10H",
        img: null,
        card: null
    },
    {
        name: "JH",
        img: null,
        card: null
    },
    {
        name: "QH",
        img: null,
        card: null
    },
    {
        name: "KH",
        img: null,
        card: null
    },
    {
        name: "AH",
        img: null,
        card: null
    },
    {
        name: "2S",
        img: null,
        card: null
    },
    {
        name: "3S",
        img: null,
        card: null
    },
    {
        name: "4S",
        img: null,
        card: null
    },
    {
        name: "5S",
        img: null,
        card: null
    },
    {
        name: "6S",
        img: null,
        card: null
    },
    {
        name: "7S",
        img: null,
        card: null
    },
    {
        name: "8S",
        img: null,
        card: null
    },
    {
        name: "9S",
        img: null,
        card: null
    },
    {
        name: "10S",
        img: null,
        card: null
    },
    {
        name: "JS",
        img: null,
        card: null
    },
    {
        name: "QS",
        img: null,
        card: null
    },
    {
        name: "KS",
        img: null,
        card: null
    },
    {
        name: "AS",
        img: null,
        card: null
    },
    {
        name: "2D",
        img: null,
        card: null
    },
    {
        name: "3D",
        img: null,
        card: null
    },
    {
        name: "4D",
        img: null,
        card: null
    },
    {
        name: "5D",
        img: null,
        card: null
    },
    {
        name: "6D",
        img: null,
        card: null
    },
    {
        name: "7D",
        img: null,
        card: null
    },
    {
        name: "8D",
        img: null,
        card: null
    },
    {
        name: "9D",
        img: null,
        card: null
    },
    {
        name: "10D",
        img: null,
        card: null
    },
    {
        name: "JD",
        img: null,
        card: null
    },
    {
        name: "QD",
        img: null,
        card: null
    },
    {
        name: "KD",
        img: null,
        card: null
    },
    {
        name: "AD",
        img: null,
        card: null
    }
];

function preload() {
    cardsList.forEach(c => {
        loadImage(`cards/${c.name}.png`, img => {
            cards.push(new Card(c.name, img, cardWidth, cardHeight, 0, 0));
        });
    });
}

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);

    game = new KC(1, cardWidth, cardHeight);
    game.deck.cards = cards;
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