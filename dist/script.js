"use strict";
// https://www.youtube.com/watch?v=MJNy2mdCt20&ab_channel=Frankslaboratory
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; //height and width have to be divisible by cellSize without any rest (x%cellSize=0)
canvas.addEventListener('click', () => { console.log('klik'); });
ctx.fillStyle = 'black';
ctx.strokeStyle = 'white';
ctx.lineWidth = 2;
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX = 0; //but could be just initialized without value
        this.speedY = 0; //but could be just initialized without value
        // this.speedModifier = Math.floor(Math.random()*3 + 1)
        this.speedModifier = 1;
        this.history = [{ x: this.x, y: this.y }];
        this.maxLength = 10 + Math.random() * 10;
        this.angle = 0;
        this.newAngle = 0;
        this.angleCorrector = 0.5;
        this.timer = this.maxLength * 5;
        // this.color = 'green'
        this.color = 'rgb(' + Math.random() * 50 + ',' + Math.random() * 150 + ',' + 100 + Math.random() * 150 + ')';
    }
    draw(context) {
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y);
        }
        context.strokeStyle = this.color;
        context.stroke();
    }
    updateFrame() {
        this.timer--;
        if (this.timer >= 1) {
            let x = Math.floor(this.x / this.effect.cellSize);
            let y = Math.floor(this.y / this.effect.cellSize);
            let index = y * this.effect.cols + x;
            if (this.effect.flowField[index]) {
                // this.angle += this.effect.flowField[index].colorAngle
                // this.angle = this.effect.flowField[index].colorAngle
                this.newAngle = this.effect.flowField[index].colorAngle;
                if (this.angle > this.newAngle) {
                    this.angle -= this.angleCorrector;
                }
                else if (this.angle > this.newAngle) {
                    this.angle += this.angleCorrector;
                }
                else {
                    this.angle = this.newAngle;
                }
            }
            this.speedX = Math.cos(this.angle) * 10;
            this.speedY = Math.sin(this.angle) * 10;
            this.x += this.speedX * this.speedModifier;
            this.y += this.speedY * this.speedModifier;
            this.history.push({ x: this.x, y: this.y });
            if (this.history.length > this.maxLength) {
                //shift method removes first list's item
                this.history.shift();
            }
        }
        else if (this.history.length > 1) {
            this.history.shift();
        }
        else {
            this.reset();
        }
    }
    reset() {
        let attempts = 0;
        let resetSuccess = false;
        let testIndex = 0;
        //attempt 50 times to spawn inside letters
        while (attempts < 50 && !resetSuccess) {
            attempts++;
            testIndex = Math.floor(Math.floor(Math.random() * this.effect.flowField.length));
            //spawn particles from the letters
            if (this.effect.flowField[testIndex].alpha > 0) {
                this.x = this.effect.flowField[testIndex].x;
                this.y = this.effect.flowField[testIndex].y;
                this.history = [{ x: this.x, y: this.y }];
                this.timer = this.maxLength * 2;
                resetSuccess = true;
            }
        }
        if (!resetSuccess) {
            this.x = Math.floor(Math.random() * this.effect.width);
            this.y = Math.floor(Math.random() * this.effect.height);
            this.history = [{ x: this.x, y: this.y }];
            this.timer = this.maxLength * 2;
        }
    }
}
class Effect {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.context = ctx;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.particles = [];
        this.numberOfParticles = 600;
        this.rows = 0; //any number, but this could be changed for 'let variable;'
        this.cols = 0;
        this.flowField = [];
        // this.flowField = singleFieldCell
        this.cellSize = 20;
        this.curve = 100;
        this.zoom = 100000;
        this.debug = false;
        this.init();
        window.addEventListener('keydown', event => {
            // console.log(event.key)
            if (event.key === 'd')
                this.debug = !this.debug;
        });
        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight);
        });
    }
    drawText() {
        this.context.font = '600px Bold';
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        const gradient1 = this.context.createLinearGradient(0, 0, this.width, this.height);
        gradient1.addColorStop(0.2, 'yellow');
        gradient1.addColorStop(0.5, 'green');
        gradient1.addColorStop(0.8, 'blue');
        this.context.fillStyle = gradient1;
        this.context.fillText('JS', this.width * 0.5, this.height * 0.5, this.width); //last arg = max width
    }
    init() {
        //create flow field
        this.rows = Math.ceil(this.height / this.cellSize);
        this.cols = Math.ceil(this.width / this.cellSize);
        this.flowField = [];
        //draw text (just once)
        this.drawText();
        //scan pixel data
        const pixels = this.context.getImageData(0, 0, this.width, this.height).data;
        console.log(pixels);
        for (let y = 0; y < this.height; y += this.cellSize) {
            for (let x = 0; x < this.width; x += this.cellSize) {
                const index = (y * this.width + x) * 4; //because 4 vals represent one pixel
                const red = pixels[index];
                const green = pixels[index + 1];
                const blue = pixels[index + 2];
                const alpha = pixels[index + 3];
                const grayscale = (red + green + blue) / 3;
                const colorAngle = Number(((grayscale / 255) * 6.28).toFixed(2));
                this.flowField.push({
                    x: x,
                    y: y,
                    alpha: alpha,
                    colorAngle: colorAngle
                });
            }
        }
        // // GRID - FLOW FIELD
        // for (let y=0; y< this.rows; y++) {
        //     for (let x=0; x< this.cols; x++){
        //         let angle = (Math.cos(x / this.zoom) + Math.sin(y / this.zoom)) * this.curve
        //         this.flowField.push(angle)
        //     }
        // }
        //create particles
        this.particles = [];
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
        //forse spawning from the letters in init
        this.particles.forEach(particle => particle.reset());
    }
    drawGrid() {
        this.context.save();
        this.context.strokeStyle = 'gray';
        this.context.lineWidth = 2;
        for (let c = 0; c < this.cols; c++) {
            this.context.beginPath();
            this.context.moveTo(this.cellSize * c, 0);
            this.context.lineTo(this.cellSize * c, this.height);
            this.context.stroke();
        }
        for (let r = 0; r < this.rows; r++) {
            this.context.beginPath();
            this.context.moveTo(0, this.cellSize * r);
            this.context.lineTo(this.width, this.cellSize * r);
            this.context.stroke();
        }
        this.context.restore(); // to last save()
    }
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
        this.init();
    }
    render() {
        if (this.debug) {
            this.drawGrid();
            this.drawText();
        }
        this.particles.forEach(particle => {
            particle.draw(this.context);
            particle.updateFrame();
        });
    }
}
const effect = new Effect(canvas, ctx);
let frameCounter = 0;
function animate() {
    frameCounter += 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render();
    requestAnimationFrame(animate);
}
animate();
//______________________________ FPS METER ______________________________
// CALL FUNCTION EVERY timeInterval  AND CALCULATE FramesPerSecond
const fpsValue = document.getElementById('fpsValue');
let lastframeCounter = frameCounter;
const timeInterval = 250;
const calculateCurrentFps = () => {
    const framesDifference = frameCounter - lastframeCounter;
    lastframeCounter = frameCounter;
    const fps = framesDifference * (1000 / timeInterval);
    fpsValue.textContent = String(fps);
};
const runFpsChecks = setInterval(calculateCurrentFps, timeInterval);
//______________________________ FPS METER ______________________________
// by default everything is PUBLIC it TS
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}
//# sourceMappingURL=script.js.map