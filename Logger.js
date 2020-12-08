// i guess the idea here is that you pass in the current state after a move, then
// when "undo" is called, you remove the last state that got pushed, and then you 
// get the previous state returned that you can use to reset everything...i guess...maybe?

class Logger {
    constructor() {
        this.log = [];
    }

    addTo(state) {
        this.log.push(state);
        console.log("state added to logger: ", this.log);
    }

    undo() {
        let idx = this.log.length - 1;
        console.log("undo performed: ");
        console.log("removed: ", this.log(idx));
        
        this.log.slice(idx - 1, 1);

        console.log("new last: ", this.log(this.log.length - 1));
        return this.log.length - 1;
    }
}