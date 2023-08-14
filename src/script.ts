const canvas = document.querySelector('#canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.addEventListener('click', () => {console.log('klik')})
ctx.fillStyle = 'white'

class Particle {
    effect:object
    x:number
    y:number

    constructor(effect:object){
        this.effect = effect
        this.x = Math.random()*500
        this.y = Math.random()*500
    }

    draw(context:CanvasRenderingContext2D){
        context.fillRect(this.x, this.y, 50, 50)
    }
}

class Effect {
    width: number
    height: number
    //the type of particles is array of Particle objects
    particles: Particle[]
    numberOfParticles: number

    constructor(width: number, height: number){
        this.width = width
        this.height = height
        this.particles = []
        this.numberOfParticles = 50
        this.init()
    }

    init () {
        //create particles
        for (let i=0; i< this.numberOfParticles; i++){
            this.particles.push(new Particle(this))
        }
    }

    render(context: CanvasRenderingContext2D) {
        this.particles.forEach(particle  => {
            particle.draw(context)
        })
    }
}

const effect = new Effect(canvas.width, canvas.height)

effect.render(ctx)
console.log(effect.particles)


// by default everything is PUBLIC it TS
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}