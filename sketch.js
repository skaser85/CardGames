let canvas;
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
let decks = [];
let globalDeck;
let deckJSON = ["original", "regular", "multicolored", "regular_sprite", "pixel"];

function loadDeck(d) {
    return new Promise((resolve, reject) => {
        loadJSON(`decks/${d}.json`, data => {
            resolve(data);
        });
    });
}

function loadDecks() {
    return new Promise(async (resolve, reject) => {
        for(let i = 0; i < deckJSON.length; i++) {
            let d = await loadDeck(deckJSON[i]);
            decks.push(d);
        }
        resolve();
    });
}

function loadImg(fldr, name) {
    return new Promise((resolve, reject) => {
        loadImage(`cards/${fldr}/${name}.png`, img => {
            resolve(img)
        });
    });
}

async function loadAssets() {
    return new Promise(async (resolve, reject) => {
        for(let i = 0; i < decks.length; i++) {
            let d = decks[i];
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
        for(let d = 0; d < decks.length; d++) {
            let dk = decks[d];
            if(!dk.cards) dk.cards = [];
            for(let s = 0; s < suits.length; s++) {
                let su = suits[s];
                for(let i = 1; i < 14; i++) {
                    let v = i > 10 || i === 1 ? honors[i] : i;
                    let c = `${v}${su}`;
                    if(dk.isSprite) {
                        let p = dk.cardInfo.find(t => t.name === c);
                        let sp = {
                            sprite: dk.spriteInfo.sprite,
                            x: p.c * dk.spriteInfo.cardW + dk.spriteInfo.startX,
                            y: p.r * dk.spriteInfo.cardH + dk.spriteInfo.startY,
                            w: dk.spriteInfo.cardW,
                            h: dk.spriteInfo.cardH
                        }
                        p.spriteInfo = sp;
                        dk.cards.push(new Card(c, null, cW, cH, 0, 0, sp, "sprite"));
                        for(let b = 0; b < dk.backs.length; b++) {
                            let bk = dk.backs[b];
                            let sp = {
                                sprite: dk.spriteInfo.sprite,
                                x: bk.c * dk.spriteInfo.cardW + dk.spriteInfo.startX,
                                y: bk.r * dk.spriteInfo.cardH + dk.spriteInfo.startY,
                                w: dk.spriteInfo.cardW,
                                h: dk.spriteInfo.cardH
                            }
                            bk.spriteInfo = sp;
                        }
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
    let canvas = createCanvas(1200, 960);
    canvas.elt.hidden = true;

    let t = createP("Loading assets . . . Please hold . . . ");
    t.position(100, 100);
    t.style("font-size", "64px");
    t.style("color", "black");
    
    await loadDecks();
    let assetsLoaded = await loadAssets();
    globalDeck = decks[0];

    if(assetsLoaded) {
        t.elt.remove();
        canvas.elt.hidden = false;
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
        decks.forEach(d => deckSel.option(d.name));
        deckSel.selected(globalDeck.name);
        deckSel.changed(async () => {
            globalDeck = decks.find(d => d.name === deckSel.value());
            deckColorSel.elt.options.length = 0;
            for(let c of globalDeck.backs) {
                deckColorSel.option(c.name);
            }
            deckColorSel.selected(globalDeck.backs[0].name);
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
        for(let c of globalDeck.backs) {
            deckColorSel.option(c.name);
        }
        deckColorSel.selected(globalDeck.backs[0].name);
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