class Logger {
    static type = {
        "gameStarted": 0,
        "gameRestarted": 1,
        "cardMoved": 2,
        "cardsMoved": 3,
        "pulledFromDeck": 4,
        "gameWon": 5,
        "turnStarted": 6,
        "turnEnded": 7,
        "cardFlipped": 8
    }

    constructor() {
        this.log = [];
        this.undoState = null;
        this.redoPointer = 0;
    }

    addTo(state) {
        if(this.redoPointer) this.log.splice(this.log.length - this.redoPointer, this.redoPointer);
        this.redoPointer = 0;
        this.log.push(state);
    }

    getUndoState() {
        return this.log[this.log.length - 1 - this.redoPointer];
    }

    getRedoState() {
        return this.log[this.log.length - this.redoPointer];
    }

    draw() {
        if(this.redoPointer) {
            push();
            let textS = 16;
            textSize(textS);
            fill(255, 255, 255);
            stroke(0, 0, 0);
            strokeWeight(1);
            let redoText = `Available: ${this.redoPointer}`
            let textW = textWidth(redoText);
            let textL = (textW / 2) + redoBtn.x + redoBtn.width;
            let textT = redoBtn.y + 4;
            text(redoText, textL, textT);
            pop();
        }
    }
}