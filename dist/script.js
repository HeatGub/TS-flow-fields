"use strict";
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.addEventListener('click', () => { console.log('klik'); });
ctx.fillStyle = 'white';
class Particle {
    constructor(effect) {
        this.effect = effect;
        this.x = Math.random() * 500;
        this.y = Math.random() * 500;
    }
    draw(context) {
        context.fillRect(this.x, this.y, 50, 50);
    }
}
class Effect {
    constructor(width, height) {
        this.particles = [];
        this.width = width;
        this.height = height;
        this.particles = [];
    }
    init() {
        this.particles.push(new Particle(this));
    }
    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
        });
    }
}
const effect = new Effect(canvas.width, canvas.height);
effect.init();
effect.render(ctx);
console.log(effect.particles);
// by default everything is PUBLIC
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}
//# sourceMappingURL=script.js.map