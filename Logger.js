// i guess the idea here is that you pass in the current state after a move, then
// when "undo" is called, you remove the last state that got pushed, and then you 
// get the previous state returned that you can use to reset everything...i guess...maybe?

class Logger {
    constructor() {
        this.log = [];
        this.undoState = null;
        this.redoPointer = 0;
        // this.lastCardPulledFromDeck = null;
    }

    addTo(state) {
        if(this.redoPointer) {
            this.log.splice(this.log.length - this.redoPointer, this.redoPointer);
        }
        this.log.push(state);
        this.redoPointer = 0;
        // if(state.type === "pulled from deck") {
        //     this.lastCardPulledFromDeck = state.card;
        // }
    }

    getUndoState() {
        return this.log[this.log.length - 1 - this.redoPointer];
    }

    getRedoState() {
        return this.log[this.log.length - this.redoPointer];
    }
}