let cardWidth = 75;
let cardHeight = 100;
let curCard = null;
let curPile = null;
let selectedCard = null;
let selectedPile = null;
let pileWidth = cardWidth + 10;
let pileHeight = cardHeight + 10;
let northPile;
let northEastPile;
let eastPile;
let southEastPile;
let southPile;
let southWestPile;
let westPile;
let northWestPile;
let playAreas = [];
let yellow;
let blue;
let salmon;
let deck;
let cards = [
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
    cards.forEach(c => {
        c.img = loadImage(`cards/${c.name}.png`, () => {
            c.card = new Card(c.name, c.img, cardWidth, cardHeight, 0, 0);
        });
    });
}

function setup() {
    createCanvas(800, 800);
    rectMode(CENTER);
    imageMode(CENTER);
    angleMode(DEGREES);

    // colors
    yellow = color(255, 255, 100);
    blue = color(0, 255, 255);
    salmon = color(200, 100, 0);

    // setup Play Areas
    let vCenter = (width / 2 - pileWidth / 2);
    let hCenter = (height / 2 - pileHeight / 2);

    northPile = new PlayArea("northPile", vCenter, hCenter - pileHeight - 20, pileWidth, pileHeight, 0, yellow);
    southPile = new PlayArea("southPile", vCenter, hCenter + pileHeight + 20, pileWidth, pileHeight, 0, yellow)
    eastPile = new PlayArea("eastPile", vCenter + pileWidth + 30, hCenter, pileWidth, pileHeight, 90, yellow);
    westPile = new PlayArea("westPile", vCenter - pileWidth - 30, hCenter, pileWidth, pileHeight, 90, yellow);
    northEastPile = new PlayArea("northEastPile", vCenter + pileWidth + 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 45, blue);
    southEastPile = new PlayArea("southEastPile", vCenter + pileWidth + 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 135, blue);
    southWestPile = new PlayArea("southWestPile", vCenter - pileWidth - 50, hCenter + pileHeight + 25, pileWidth, pileHeight, 45, blue);
    northWestPile = new PlayArea("northWestPile", vCenter - pileWidth - 50, hCenter - pileHeight - 25, pileWidth, pileHeight, 135, blue);
    
    playAreas.push(northPile, northEastPile, eastPile, southEastPile, southPile, southWestPile, westPile, northWestPile);
    
    deck = new Deck(width / 2 - pileWidth / 2, height / 2 - pileHeight / 2, cardWidth, cardHeight, "purple", salmon);
    deck.cards = cards;

    dealCards();

    // displayAllCards();
}

function draw() {
    background(0, 100, 0);

    deck.update();
    deck.draw();

    // update & draw Play Areas
    for(let p of playAreas) {
        p.update();
        if(curPile === null) {
            if(p.isActive) {
                curPile = p;
            }
        } else {
            if(curPile === p) {
                if(!p.isActive) {
                    curPile = null;
                }
            }
        }
        p.draw();
    }

    // update cards
    for(let c of deck.cardsInPlay) {
        let card = c.card;
        card.update();
        if(curCard === null) {
            if(card.isActive) {
                curCard = c;
            }
        } else {
            if(curCard === c) {
                if(!card.isActive) {
                    curCard = null;
                }
            }
        }
    }
}

function mouseClicked() {
    if(deck.isActive) {
        for(let i = 0; i < playAreas.length; i++) {
            let p = playAreas[i];
            if(!["northEastPile", "southEastPile", "southWestPile", "northWestPile"].includes(p.name)) {
                if(p.cards.length === 0) {
                    let card = deck.getCard();
                    p.addTo(card);
                    break;
                }
            }
        }
    } else {
        if(!selectedCard && !selectedPile) {
            if(curCard) {
                curCard.card.isSelected = true;
                selectedCard = curCard;
            } else if(curCard && selectedCard) {
                if(curCard.card.isSelected) {
                    selectedCard.card.isSelected = false;
                    selectedCard = null;
                } else {
                    selectedCard.card.isSelected = false;
                    selectedCard = null;
                    curCard.card.isSelected = true;
                    selectedCard = curCard;
                }
            }
        } else if(selectedCard && !selectedPile) {
            if(curPile) {
                curPile.isSelected = true;
                selectedPile = curPile;
                
                let card = selectedCard.card;
                if(curPile.canPlace(selectedCard)) {
                    card.pile.removeFrom(selectedCard);
                    curPile.addTo(selectedCard);
                } else {
                    card.setCoords(card.pile.x, card.pile.y);
                }
                
                selectedCard.card.isSelected = false;
                selectedCard = null;
                selectedPile.isSelected = false;
                selectedPile = null;   
            } else if(curPile && selectedPile) {
                if(curPile.isSelected) {
                    selectedPile.isSelected = false;
                    selectedPile = null;
                } else {
                    selectedPile.isSelected = false;
                    selectedPile = null;   
                    curPile.isSelected = true;
                    selectedPile = curPile;             
                }
            }
        }
    }
    return false; // safety precaution for browser weirdness
}

function displayAllCards() {
    let gutter = 10;
    let cardsInRow = 0;
    let rowTop = (cardHeight / 2) + 5;
    let colStart = (cardWidth / 2) + 5
    deck.cards.forEach(c => {
        c.img = loadImage(`cards/${c.name}.png`, () => {
            c.card = new Card(c.name, c.img, cardWidth, cardHeight, colStart, rowTop);
            deck.cardsInPlay.push(c);
            cardsInRow++;
            if((cardWidth * cardsInRow) + (gutter * cardsInRow) + cardWidth > width) {
                rowTop += cardHeight + gutter;
                colStart = (cardWidth / 2) + 5;
                cardsInRow = 0;
            } else {
                colStart += (cardWidth + gutter);
            }
        });
    });
}

function dealCards() {
    let north = deck.getCard();
    northPile.addTo(north);
    let south = deck.getCard();
    southPile.addTo(south);
    let east = deck.getCard();
    eastPile.addTo(east);
    let west = deck.getCard();
    westPile.addTo(west);
}