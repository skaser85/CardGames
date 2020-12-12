class Message {
    static type = {
        "normal": 0,
        "error": 1
    }

    constructor() {
        this.messageType = null;
        this.message = "";
        this.initialMessageAlpha = 400;
        this.messageAlpha = this.initialMessageAlpha;
    }

    set(msgType, msgText) {
        this.messageType = msgType;
        this.message = msgText;
        this.messageAlpha = this.initialMessageAlpha;
    }

    draw(opts) {
        push();
        if(this.message) {
            switch(this.messageType) {
                case Message.type.normal:
                    stroke(0, 0, 0, this.messageAlpha);
                    fill(255, 255, 255, this.messageAlpha);
                    break;
                case Message.type.error:
                    stroke(0, 0, 0, this.messageAlpha);
                    fill(255, 0, 175, this.messageAlpha);
                    break;
            }
            textSize(32);
            strokeWeight(2);
            let eTextW = textWidth(this.message);
            let eTextL = (eTextW / 2);
            let eTextT = height - (height / 4);
            if(opts) {
                if(opts.leftOffset) {
                    eTextL += opts.leftOffset
                }
                if(opts.top) {
                    eTextT = opts.top;
                }
            }
            text(this.message, eTextL, eTextT);
            if(this.messageAlpha > 0) {
                this.messageAlpha -= 1;
            } else {
                this.messageAlpha = this.initialMessageAlpha;
                this.message = "";
            }
        }
        pop();
    }
}