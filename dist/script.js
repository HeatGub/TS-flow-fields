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
        this.x = Math.random() * 1000;
        this.y = Math.random() * 1000;
        this.speedX = Math.random() * 10;
        this.speedY = Math.random() * 100;
    }
    draw(context) {
        context.fillRect(this.x, this.y, 50, 50);
    }
    updateFrame() {
        this.x = this.x + this.speedX;
        this.y = this.y + this.speedY;
    }
}
class Effect {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numberOfParticles = 2000;
        this.init();
    }
    init() {
        //create particles
        for (let i = 0; i < this.numberOfParticles; i++) {
            this.particles.push(new Particle(this));
        }
    }
    render(context) {
        this.particles.forEach(particle => {
            particle.draw(context);
            particle.updateFrame();
        });
    }
}
const effect = new Effect(canvas.width, canvas.height);
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();
// console.log(effect.particles)
// by default everything is PUBLIC it TS
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}
//# sourceMappingURL=script.js.map