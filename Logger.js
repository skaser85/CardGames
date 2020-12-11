class Logger {
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
}