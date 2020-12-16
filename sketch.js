let cW = 100;
let cH = 130;
let game;
let suits = ["C", "D", "H", "S"];
let honors = {1: "A", 11: "J", 12: "Q", 13: "K"};
let cards = [];
let kcBtn;
let restart;
let logger;
let undoBtn;
let redoBtn;
let gameSel;
let gameP;
let deckColorSel;
let deckColorP;
let deckSel;
let deckP;
let colors = {};
let decks = {
    "original": {
        folder: "two char",
        backColors: ["blue", "gray", "green", "purple", "red", "yellow"],
        backs: [
            {
                name: "blue",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "gray",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "green",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "purple",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "red",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "yellow",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            }
        ],
        isSprite: false,
        cards: []
    },
    "regular": {
        folder: "regular",
        backColors: ["blue", "red"],
        backs: [
            {
                name: "blue",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "red",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
        ],
        isSprite: false,
        cards: []
    },
    "multicolored": {
        folder: "multicolored",
        backColors: ["blue", "red"],
        backs: [
            {
                name: "blue",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
            {
                name: "red",
                r: 0,
                c: 0,
                xPad: 0,
                yPad: 0
            },
        ],
        isSprite: false,
        cards: []
    },
    "regular-sprite": {
        folder: "regular",
        backColors: ["blue", "red"],
        backs: [
            {
                name: "blue",
                r: 3,
                c: 13,
                xPad: 0,
                yPad: 0
            },
            {
                name: "red",
                r: 2,
                c: 13,
                xPad: 0,
                yPad: 0
            }
        ],
        isSprite: true,
        spriteInfo: {
            name: "sprite",
            sprite: null,
            w: 75,
            h: 112.5,
            x: 0,
            y: 0,
            xPad: 0,
            yPad: 0
        },
        cardInfo: {
            "AC":  { r: 0, c: 0, spriteInfo: null },
            "2C":  { r: 0, c: 1, spriteInfo: null },
            "3C":  { r: 0, c: 2, spriteInfo: null },
            "4C":  { r: 0, c: 3, spriteInfo: null },
            "5C":  { r: 0, c: 4, spriteInfo: null },
            "6C":  { r: 0, c: 5, spriteInfo: null },
            "7C":  { r: 0, c: 6, spriteInfo: null },
            "8C":  { r: 0, c: 7, spriteInfo: null },
            "9C":  { r: 0, c: 8, spriteInfo: null },
            "10C": { r: 0, c: 9, spriteInfo: null },
            "JC":  { r: 0, c: 10, spriteInfo: null },
            "QC":  { r: 0, c: 11, spriteInfo: null },
            "KC":  { r: 0, c: 12, spriteInfo: null },

            "AD":  { r: 1, c: 0, spriteInfo: null },
            "2D":  { r: 1, c: 1, spriteInfo: null },
            "3D":  { r: 1, c: 2, spriteInfo: null },
            "4D":  { r: 1, c: 3, spriteInfo: null },
            "5D":  { r: 1, c: 4, spriteInfo: null },
            "6D":  { r: 1, c: 5, spriteInfo: null },
            "7D":  { r: 1, c: 6, spriteInfo: null },
            "8D":  { r: 1, c: 7, spriteInfo: null },
            "9D":  { r: 1, c: 8, spriteInfo: null },
            "10D": { r: 1, c: 9, spriteInfo: null },
            "JD":  { r: 1, c: 10, spriteInfo: null },
            "QD":  { r: 1, c: 11, spriteInfo: null },
            "KD":  { r: 1, c: 12, spriteInfo: null },

            "AH":  { r: 2, c: 0, spriteInfo: null },
            "2H":  { r: 2, c: 1, spriteInfo: null },
            "3H":  { r: 2, c: 2, spriteInfo: null },
            "4H":  { r: 2, c: 3, spriteInfo: null },
            "5H":  { r: 2, c: 4, spriteInfo: null },
            "6H":  { r: 2, c: 5, spriteInfo: null },
            "7H":  { r: 2, c: 6, spriteInfo: null },
            "8H":  { r: 2, c: 7, spriteInfo: null },
            "9H":  { r: 2, c: 8, spriteInfo: null },
            "10H": { r: 2, c: 9, spriteInfo: null },
            "JH":  { r: 2, c: 10, spriteInfo: null },
            "QH":  { r: 2, c: 11, spriteInfo: null },
            "KH":  { r: 2, c: 12, spriteInfo: null },

            "AS":  { r: 3, c: 0, spriteInfo: null },
            "2S":  { r: 3, c: 1, spriteInfo: null },
            "3S":  { r: 3, c: 2, spriteInfo: null },
            "4S":  { r: 3, c: 3, spriteInfo: null },
            "5S":  { r: 3, c: 4, spriteInfo: null },
            "6S":  { r: 3, c: 5, spriteInfo: null },
            "7S":  { r: 3, c: 6, spriteInfo: null },
            "8S":  { r: 3, c: 7, spriteInfo: null },
            "9S":  { r: 3, c: 8, spriteInfo: null },
            "10S": { r: 3, c: 9, spriteInfo: null },
            "JS":  { r: 3, c: 10, spriteInfo: null },
            "QS":  { r: 3, c: 11, spriteInfo: null },
            "KS":  { r: 3, c: 12, spriteInfo: null },
        },
        cards: []
    },
    "pixel": {
        folder: "pixel",
        backColors: ["pink-dotted", "silver-dotted", "silver-solid", "red"],
        backs: [
            {
                name: "pink-dotted",
                r: 4,
                c: 0,
                xPad: 32,
                yPad: 32
            },
            {
                name: "silver-dotted",
                r: 4,
                c: 1,
                xPad: 32,
                yPad: 32
            },
            {
                name: "silver-solid",
                r: 4,
                c: 2,
                xPad: 32,
                yPad: 32
            },
            {
                name: "red",
                r: 4,
                c: 3,
                xPad: 32,
                yPad: 32
            },
        ],
        isSprite: true,
        spriteInfo: {
            name: "Pixel_Playing_Card_Set_YEWBI",
            sprite: null,
            w: 32,
            h: 48,
            x: 32,
            y: 32,
            xPad: 32,
            yPad: 32
        },
        cardInfo: {
            "AS":  { r: 0, c: 0, spriteInfo: null},
            "2S":  { r: 1, c: 0, spriteInfo: null},
            "3S":  { r: 2, c: 0, spriteInfo: null},
            "4S":  { r: 0, c: 4, spriteInfo: null},
            "5S":  { r: 1, c: 4, spriteInfo: null},
            "6S":  { r: 2, c: 4, spriteInfo: null},
            "7S":  { r: 0, c: 8, spriteInfo: null},
            "8S":  { r: 1, c: 8, spriteInfo: null},
            "9S":  { r: 2, c: 8, spriteInfo: null},
            "10S": { r: 0, c: 12, spriteInfo: null},
            "JS":  { r: 1, c: 12, spriteInfo: null},
            "QS":  { r: 2, c: 12, spriteInfo: null},
            "KS":  { r: 0, c: 16, spriteInfo: null},

            "AD":  { r: 0, c: 1, spriteInfo: null },
            "2D":  { r: 1, c: 1, spriteInfo: null },
            "3D":  { r: 2, c: 1, spriteInfo: null },
            "4D":  { r: 0, c: 5, spriteInfo: null },
            "5D":  { r: 1, c: 5, spriteInfo: null },
            "6D":  { r: 2, c: 5, spriteInfo: null },
            "7D":  { r: 0, c: 9, spriteInfo: null },
            "8D":  { r: 1, c: 9, spriteInfo: null },
            "9D":  { r: 2, c: 9, spriteInfo: null },
            "10D": { r: 0, c: 13, spriteInfo: null },
            "JD":  { r: 1, c: 13, spriteInfo: null },
            "QD":  { r: 2, c: 13, spriteInfo: null },
            "KD":  { r: 0, c: 17, spriteInfo: null },

            "AC":  { r: 0, c: 2, spriteInfo: null },
            "2C":  { r: 1, c: 2, spriteInfo: null },
            "3C":  { r: 2, c: 2, spriteInfo: null },
            "4C":  { r: 0, c: 6, spriteInfo: null },
            "5C":  { r: 1, c: 6, spriteInfo: null },
            "6C":  { r: 2, c: 6, spriteInfo: null },
            "7C":  { r: 0, c: 10, spriteInfo: null },
            "8C":  { r: 1, c: 10, spriteInfo: null },
            "9C":  { r: 2, c: 10, spriteInfo: null },
            "10C": { r: 0, c: 14, spriteInfo: null },
            "JC":  { r: 1, c: 14, spriteInfo: null },
            "QC":  { r: 2, c: 14, spriteInfo: null },
            "KC":  { r: 0, c: 18, spriteInfo: null },

            "AH":  { r: 0, c: 3, spriteInfo: null },
            "2H":  { r: 1, c: 3, spriteInfo: null },
            "3H":  { r: 2, c: 3, spriteInfo: null },
            "4H":  { r: 0, c: 7, spriteInfo: null },
            "5H":  { r: 1, c: 7, spriteInfo: null },
            "6H":  { r: 2, c: 7, spriteInfo: null },
            "7H":  { r: 0, c: 11, spriteInfo: null },
            "8H":  { r: 1, c: 11, spriteInfo: null },
            "9H":  { r: 2, c: 11, spriteInfo: null },
            "10H": { r: 0, c: 15, spriteInfo: null },
            "JH":  { r: 1, c: 15, spriteInfo: null },
            "QH":  { r: 2, c: 15, spriteInfo: null },
            "KH":  { r: 0, c: 19, spriteInfo: null },
        },
        cards: []
    }
}
let initialDeck = "original";
let globalDeck = decks[initialDeck];

function loadImg(fldr, name) {
    return new Promise((resolve, reject) => {
        loadImage(`cards/${fldr}/${name}.png`, img => {
            resolve(img)
        });
    });
}

async function loadAssets() {
    return new Promise(async (resolve, reject) => {
        for(let i = 0; i < Object.keys(decks).length; i++) {
            let d = decks[Object.keys(decks)[i]];
            if(d.isSprite) {
                d.spriteInfo.sprite = await loadImg(d.folder, d.spriteInfo.name);
            } else {
                for(let k = 0; k < d.backs.length; k++) {
                    d.backs[k].img = await loadImg(d.folder, `${d.backs[k].name}_back`);
                }
            }
        }
        await getCards();
        resolve(true);
    });
}

function getCards() {
    return new Promise(async (resolve, reject) => {
        for(let d = 0; d < Object.keys(decks).length; d++) {
            let dk = decks[Object.keys(decks)[d]];
            for(let s = 0; s < suits.length; s++) {
                let su = suits[s];
                for(let i = 1; i < 14; i++) {
                    let v = i > 10 || i === 1 ? honors[i] : i;
                    let c = `${v}${su}`;
                    if(dk.isSprite) {
                        let p = dk.cardInfo[c];
                        let sp = {
                            sprite: dk.spriteInfo.sprite,
                            x: p.c * dk.spriteInfo.w + dk.spriteInfo.xPad,
                            y: p.r * dk.spriteInfo.h + dk.spriteInfo.yPad,
                            w: dk.spriteInfo.w,
                            h: dk.spriteInfo.h
                        }
                        p.spriteInfo = sp;
                        dk.cards.push(new Card(c, null, cW, cH, 0, 0, sp, "sprite"));
                    } else {
                        let cImg = await loadImg(dk.folder, c);
                        dk.cards.push(new Card(`${c}`, cImg, cW, cH, 0, 0, null, "img"));
                    }
                }
            };
        };
        resolve(true);
    });
}

async function setup() {
    let t = createP("Loading assets . . . Please hold . . . ");
    t.position(100, 100);
    t.style("font-size", "64px");
    t.style("color", "black");
    
    let assetsLoaded = await loadAssets();

    if(assetsLoaded) {
        t.elt.remove();
        createCanvas(1200, 960);
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

        game = null;

        restart = createButton("Restart Game");
        restart.position(15, 15);
        restart.mousePressed(() => {
            game.restartGame(globalDeck.cards);
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

        gameP = createP("Select Game");
        gameP.position(restart.x + restart.width + 15, - 5);
        gameP.style("color", "white");
        gameP.style("font-size", "18px");
        gameSel = createSelect()
        gameSel.style("padding", "2px");
        gameSel.position(restart.x + restart.width + 15, restart.y + restart.height + 4);
        gameSel.option("");
        gameSel.option("Solitaire");
        gameSel.option("FreeCell");
        gameSel.option("Kings Corner");
        gameSel.selected("");
        gameSel.changed(() => {
            switch(gameSel.value()) {
                case "":
                    game = null;
                    if(kcBtn) kcBtn = null;
                    break;
                case "Solitaire":
                    if(kcBtn) kcBtn = null;
                    game = new Solitaire(7, cW, cH, globalDeck.cards, colors, logger);
                    game.dealCards();
                    break;
                case "FreeCell":
                    if(kcBtn) kcBtn = null;
                    game = new FreeCell(cW, cH, globalDeck.cards, colors, logger);
                    game.dealCards();
                    break;
                case "Kings Corner":
                    game = new KC(4, cW, cH, globalDeck.cards, colors, logger);
                    if(!kcBtn) {
                        kcBtn = createButton(game.btnText);
                        let p1 = game.players[0];
                        kcBtn.position(p1.textRight - 20, p1.top - p1.topOffset);
                        kcBtn.mousePressed(() => {
                            game.handleButtonPress();
                            kcBtn.elt.innerText = game.btnText;
                        });
                    }
                    game.dealCards();
                    break;
            }
        });

        deckP = createP("Select Deck");
        deckP.position(gameSel.x + gameSel.width * 5, - 5);
        deckP.style("color", "white");
        deckP.style("font-size", "18px");
        deckSel = createSelect()
        deckSel.style("padding", "2px");
        deckSel.position(gameSel.x + (gameSel.width * 5), restart.y + restart.height + 4);
        Object.keys(decks).forEach(d => deckSel.option(d));
        deckSel.selected(initialDeck);
        deckSel.changed(async () => {
            globalDeck = decks[deckSel.value()];
            deckColorSel.elt.options.length = 0;
            for(let c of globalDeck.backColors) {
                deckColorSel.option(c);
            }
            deckColorSel.selected(globalDeck.backColors[0]);
            if(game) {
                game.deck.changeDeck(deckColorSel.value());
                game.deck.changeDeckColor(deckColorSel.value());
            }
        });

        deckColorP = createP("Select Deck Color");
        deckColorP.position(gameSel.x + gameSel.width * 9.5 + 6, - 5);
        deckColorP.style("color", "white");
        deckColorP.style("font-size", "18px");
        deckColorSel = createSelect()
        deckColorSel.style("padding", "2px");
        deckColorSel.style("width", "100px");
        deckColorSel.position(gameSel.x + gameSel.width * 9.5 + 6, restart.y + restart.height + 4);
        for(let c of globalDeck.backColors) {
            deckColorSel.option(c);
        }
        deckColorSel.selected(globalDeck.backColors[0]);
        deckColorSel.changed(() => {
            if(game) {
                game.deck.changeDeckColor(deckColorSel.value());
            }
        });
    }

}

function draw() {
    background(0, 100, 0);

    if(game) {
        game.update();
        game.draw();
    }
}

function mouseClicked() {
    if(game) game.handleClick();
    return false; // safety precaution for browser weirdness
}