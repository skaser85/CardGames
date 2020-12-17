class Card {
    constructor(name, img, width, height, x, y, spriteInfo, drawType) {
        this.name = name;
        this.img = img;
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
        this.spriteInfo = spriteInfo || null;
        this.drawType = drawType;
        this.rotateDeg = 0;
        this.isActive = false;
        this.isSelected = false;
        this.borderColor = color(0, 255, 0);
        this.isDragging = false;
        this.pile = null;
        this.left = 0;
        this.right = 0;
        this.top = 0; 
        this.bottom = 0;
        this.visible = false;
        this.backShowing = false;
        this.backImg = null;
        this.backColor = "";
        this.backSpriteInfo = null;
        this.updateDirs();
    }

    setRotation(deg) {
        this.rotateDeg = deg;
        this.updateDirs();
    }

    setCoords(newX, newY) {
        this.x = newX;
        this.y = newY;
        this.updateDirs();
    }

    updateDirs() {
        if(this.rotateDeg === 0) {
            this.left = this.x - (this.width / 2);
            this.right = this.x + (this.width / 2);
            this.top = this.y - (this.height / 2);
            this.bottom = this.y + (this.height / 2);
        } else {
            // gross
            let rads = radians(this.rotateDeg);
            let rotX = this.x*cos(rads) - this.y*sin(rads);
            let rotY = this.x*sin(rads) + this.y*cos(rads);
            this.left = rotX - (this.width / 2);
            this.right = rotX + (this.width / 2);
            this.top = rotY - (this.height / 2);
            this.bottom = rotY + (this.height / 2);
        }    
    }

    mouseIsOver() {
        return (mouseX >= this.left) && 
               (mouseX <= this.right) &&
               (mouseY >= this.top) &&
               (mouseY <= this.bottom);
    }
    
    update() {
        this.isActive = this.visible && this.mouseIsOver();
    }

    draw() {
        push();
        noFill();
        if(this.isSelected) {
            let c = this.isActive ? color(255, 50, 0) : color(255, 50, 0, 175);
            stroke(c);
            strokeWeight(4);
        } else if(this.isActive) {
            stroke(this.borderColor);
            strokeWeight(4);
        } else {
            stroke(0, 0, 0);
            strokeWeight(1);
        }
        translate(this.x, this.y);
        rotate(this.rotateDeg);
        if(this.backShowing) {
            if(this.drawType === "sprite") {
                image(this.backSpriteInfo.sprite, 0, 0, this.width, this.height, this.backSpriteInfo.x, this.backSpriteInfo.y, this.backSpriteInfo.w, this.backSpriteInfo.h);
            } else {
                image(this.backImg, 0, 0, this.width, this.height);
            }
        } else {
            if(this.drawType === "sprite") {
                image(this.spriteInfo.sprite, 0, 0, this.width, this.height, this.spriteInfo.x, this.spriteInfo.y, this.spriteInfo.w, this.spriteInfo.h);
            } else {
                image(this.img, 0, 0, this.width, this.height);
            }
        }
        rect(0, 0, this.width, this.height);
        pop();
    }
}