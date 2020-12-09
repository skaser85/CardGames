// i guess the idea here is that you pass in the current state after a move, then
// when "undo" is called, you remove the last state that got pushed, and then you 
// get the previous state returned that you can use to reset everything...i guess...maybe?

class Logger {
    constructor() {
        this.log = [];
        this.undoState = null;
    }

    addTo(state) {
        this.log.push(state);
        this.undoState = null;
        console.log("state added to logger: ", this.log);
    }

    removeLast() {
        this.undoState = this.log[this.log.length - 1];
        if(this.undoState.name.includes("pulled")) {
            this.undoState.deckCardsInPlay[this.undoState.deckCardsInPlay.length - 1].pile = null;
        }
        this.log.splice(this.log.length - 1, 1);
        return this.log[this.log.length - 1];
    }
}