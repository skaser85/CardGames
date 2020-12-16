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
        isSprite: false
    },
    // "regular": {
    //     folder: "regular",
    //     backColors: ["blue", "red"],
    //     isSprite: false
    // },
    "multicolored": {
        folder: "multicolored",
        backColors: ["blue", "red"],
        isSprite: false
    },
    "test": {
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
    }
}
let initialDeck = "pixel";
let globalDeck = decks[initialDeck];
let testImg = {};
let testCard;

function loadSprite(fldr, name) {
    return new Promise((resolve, reject) => {
        loadImage(`cards/${fldr}/${name}.png`, img => {
            resolve(img)
        });
    });
}

async function loadAssets() {
    return new Promise(async (resolve, reject) => {
        let spriteInfo;
        let spriteSheet;
        if(!globalDeck.isSprite) {
            spriteInfo = {
                sprite: "",
                x: 0,
                y: 0,
                w: 0,
                h: 0
            }
        } else {
            spriteSheet = await loadSprite(globalDeck.folder, globalDeck.spriteInfo.name);
            globalDeck.spriteInfo.sprite = spriteSheet;
            spriteInfo = {
                sprite: spriteSheet,
                x: globalDeck.spriteInfo.x,
                y: globalDeck.spriteInfo.y,
                w: globalDeck.spriteInfo.w,
                h: globalDeck.spriteInfo.h
            }
        }
        Object.keys(decks).forEach(async dk => {
            let d = decks[dk];
            if(d.isSprite) {
                d.spriteInfo.sprite = await loadSprite(d.folder, d.spriteInfo.name);
            }
        });
        if(globalDeck.folder === "pixel") {
            await getPixelCards(spriteSheet);
        } else {
            await getCards(spriteSheet, spriteInfo);
        }
        resolve(true);
    });
}

function getCards(spriteSheet, spriteInfo) {
    return new Promise((resolve, reject) => {
        suits.forEach((s, sIdx) => {
            for(let i = 1; i < 14; i++) {
                let v = i > 10 || i === 1 ? honors[i] : i
                if(globalDeck.isSprite) {
                    let sp = {
                        sprite: spriteSheet,
                        x: (i - 1) * globalDeck.spriteInfo.w + globalDeck.spriteInfo.xPad,
                        y: sIdx * globalDeck.spriteInfo.h + globalDeck.spriteInfo.yPad,
                        w: globalDeck.spriteInfo.w,
                        h: globalDeck.spriteInfo.h
                    }
                    cards.push(new Card(`${v}${s}`, null, cW, cH, 0, 0, sp, "sprite"));
                } else {
                    loadImage(`cards/${globalDeck.folder}/${v}${s}.png`, img => {
                        cards.push(new Card(`${v}${s}`, img, cW, cH, 0, 0, spriteInfo, "img"));
                    });
                }
            }
            if(sIdx === suits.length - 1) resolve(true);
        });
    });
}

async function getPixelCards(spriteSheet) {
    return new Promise((resolve, reject) => {
        let px = {
            "AS":  { r: 0, c: 0  },
            "2S":  { r: 1, c: 0  },
            "3S":  { r: 2, c: 0  },
            "4S":  { r: 0, c: 4  },
            "5S":  { r: 1, c: 4  },
            "6S":  { r: 2, c: 4  },
            "7S":  { r: 0, c: 8  },
            "8S":  { r: 1, c: 8  },
            "9S":  { r: 2, c: 8  },
            "10S": { r: 0, c: 12 },
            "JS":  { r: 1, c: 12 },
            "QS":  { r: 2, c: 12 },
            "KS":  { r: 0, c: 16 },

            "AD":  { r: 0, c: 1  },
            "2D":  { r: 1, c: 1  },
            "3D":  { r: 2, c: 1  },
            "4D":  { r: 0, c: 5  },
            "5D":  { r: 1, c: 5  },
            "6D":  { r: 2, c: 5  },
            "7D":  { r: 0, c: 9  },
            "8D":  { r: 1, c: 9  },
            "9D":  { r: 2, c: 9  },
            "10D": { r: 0, c: 13 },
            "JD":  { r: 1, c: 13 },
            "QD":  { r: 2, c: 13 },
            "KD":  { r: 0, c: 17 },

            "AC":  { r: 0, c: 2  },
            "2C":  { r: 1, c: 2  },
            "3C":  { r: 2, c: 2  },
            "4C":  { r: 0, c: 6  },
            "5C":  { r: 1, c: 6  },
            "6C":  { r: 2, c: 6  },
            "7C":  { r: 0, c: 10 },
            "8C":  { r: 1, c: 10 },
            "9C":  { r: 2, c: 10 },
            "10C": { r: 0, c: 14 },
            "JC":  { r: 1, c: 14 },
            "QC":  { r: 2, c: 14 },
            "KC":  { r: 0, c: 18 },

            "AH":  { r: 0, c: 3  },
            "2H":  { r: 1, c: 3  },
            "3H":  { r: 2, c: 3  },
            "4H":  { r: 0, c: 7  },
            "5H":  { r: 1, c: 7  },
            "6H":  { r: 2, c: 7  },
            "7H":  { r: 0, c: 11 },
            "8H":  { r: 1, c: 11 },
            "9H":  { r: 2, c: 11 },
            "10H": { r: 0, c: 15 },
            "JH":  { r: 1, c: 15 },
            "QH":  { r: 2, c: 15 },
            "KH":  { r: 0, c: 19 },
        };
        
        let pxBacks = [
            {
                name: "pink-dotted",
                r: 5,
                c: 0
            },
            {
                name: "silver-dotted",
                r: 5,
                c: 1
            },
            {
                name: "silver-solid",
                r: 5,
                c: 2
            },
            {
                name: "red",
                r: 5,
                c: 3
            },
        ];
        suits.forEach((s, sIdx) => {
            for(let i = 1; i < 14; i++) {
                let v = i > 10 || i === 1 ? honors[i] : i;
                let c = `${v}${s}`;
                let p = px[Object.keys(px).find(it => it === c)];
                let sp = {
                    sprite: spriteSheet,
                    x: p.c * globalDeck.spriteInfo.w + globalDeck.spriteInfo.xPad,
                    y: p.r * globalDeck.spriteInfo.h + globalDeck.spriteInfo.yPad,
                    w: globalDeck.spriteInfo.w,
                    h: globalDeck.spriteInfo.h
                }
                cards.push(new Card(c, null, cW, cH, 0, 0, sp, "sprite"));
            }
            if(sIdx === suits.length - 1) resolve(true);
        });
    });
}

async function setup() {
    let assetsLoaded = await loadAssets();

    if(assetsLoaded) {
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
                    game = new Solitaire(7, cW, cH, cards, colors, logger);
                    game.dealCards();
                    break;
                case "FreeCell":
                    if(kcBtn) kcBtn = null;
                    game = new FreeCell(cW, cH, cards, colors, logger);
                    game.dealCards();
                    break;
                case "Kings Corner":
                    game = new KC(4, cW, cH, cards, colors, logger);
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

        // testCard = cards.find(c => c.name === "KH");
        // testCard.setCoords(200, 200);
    }

}

function draw() {
    background(0, 100, 0);

    if(testCard) testCard.draw();

    if(game) {
        game.update();
        game.draw();
    }
}

function mouseClicked() {
    if(game) game.handleClick();
    return false; // safety precaution for browser weirdness
}