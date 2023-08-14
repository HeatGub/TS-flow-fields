const canvas = document.querySelector('#canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
canvas.width = window.innerWidth
canvas.height = window.innerHeight
canvas.addEventListener('click', () => {console.log('klik')})
ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'

type lastCoordinates = [{x:number, y:number}]

class Particle {
    effect:Effect
    x:number
    y:number
    speedX:number
    speedY:number
    history:lastCoordinates
    maxLength:number
    
    constructor(effect:Effect){
        this.effect = effect
        this.x = Math.random()*100
        this.y = Math.random()*100
        this.speedX = Math.random()*10
        this.speedY = Math.random()*10
        this.history = [{x: this.x, y: this.y}]
        this.maxLength = 15
    }

    draw(context:CanvasRenderingContext2D){
        context.fillRect(this.x, this.y, 10, 10)
        context.beginPath()
        context.moveTo(this.history[0].x, this.history[0].y)
        for (let i=0; i < this.history.length; i++){
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.stroke()
    }

    updateFrame(){
        this.x = this.x + this.speedX + Math.random()*10 - 5
        this.y = this.y + this.speedY + Math.random()*10 - 5
        this.history.push({x: this.x, y: this.y})
        if (this.history.length > this.maxLength){
            this.history.shift()
        }
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
        this.numberOfParticles = 100
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
            particle.updateFrame()
        })
    }
}

const effect = new Effect(canvas.width, canvas.height)

function animate(){
    ctx.clearRect(0,0,canvas.width, canvas.height)
    effect.render(ctx)
    requestAnimationFrame(animate)
}

animate()

// console.log(effect.particles)


// by default everything is PUBLIC it TS
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}