"use strict";
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
// canvas.addEventListener('click', () => {console.log('klik')})
ctx.fillStyle = 'blue';
ctx.strokeStyle = 'white';
ctx.lineWidth = 100;
ctx.lineCap = 'round';
// ctx.arc(100, 100, 90, 0, Math.PI*2)
ctx.beginPath();
ctx.moveTo(100, 200);
ctx.lineTo(400, 500);
ctx.stroke();
// class Particle {
// }
class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
    }
    someMethod() {
        return 'multiplied = ' + this.width * this.height;
    }
}
const objectInstance = new Effect(5, 10);
console.log(objectInstance.someMethod());
// by default everything is PUBLIC
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}
//# sourceMappingURL=script.js.map