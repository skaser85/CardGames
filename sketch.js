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
let deckSel;
let deckP;
let colors = {};

function preload() {
    suits.forEach(s => {
        for(let i = 1; i < 14; i++) {
            let v = i > 10 || i === 1 ? honors[i] : i;
            loadImage(`cards/two char/${v}${s}.png`, img => {
                cards.push(new Card(`${v}${s}`, img, cW, cH, 0, 0));
            });
        }
    });
}

function setup() {
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

    // "blue", "gray", "green", "purple", "red", "yellow"

    deckP = createP("Select Deck");
    // deckP.position(width / 2, height / 2);
    deckP.position(gameSel.x + gameSel.width * 5, - 5);
    deckP.style("color", "white");
    deckP.style("font-size", "18px");
    deckSel = createSelect()
    deckSel.style("padding", "2px");
    deckSel.position(gameSel.x + (gameSel.width * 5), restart.y + restart.height + 4);
    deckSel.option("blue");
    deckSel.option("gray");
    deckSel.option("green");
    deckSel.option("purple");
    deckSel.option("red");
    deckSel.option("yellow");
    deckSel.selected("blue");
    deckSel.changed(() => {
        if(game) {
            game.deck.changeDeckColor(deckSel.value());
        }
    });

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