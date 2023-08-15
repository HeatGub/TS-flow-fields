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
    angle:number
    
    constructor(effect:Effect){
        this.effect = effect
        this.x = Math.random()*1000
        this.y = Math.random()*1000
        this.speedX = Math.random()*10 - 5
        this.speedY = Math.random()*10 - 5
        this.history = [{x: this.x, y: this.y}]
        this.maxLength = 10 + Math.random()* 200
        this.angle = 0
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
        let x = Math.floor(this.x / this.effect.cellSize)
        let y = Math.floor(this.y / this.effect.cellSize)
        let index =  y * this.effect.cols + x
        this.angle = this.effect.flowField[index]

        this.speedX = Math.cos(this.angle)*2
        this.speedY = Math.sin(this.angle)*2
        this.x += this.speedX
        this.y += this.speedY

        this.history.push({x: this.x, y: this.y})
        if (this.history.length > this.maxLength){
            //shift method removes first list's item
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
    cellSize: number
    rows: number
    cols: number
    flowField: number[]

    constructor(width: number, height: number){
        this.width = width
        this.height = height
        this.particles = []
        this.numberOfParticles = 1000
        this.cellSize = 20
        this.rows = 0 //any number, but this could be changed for 'let variable;'
        this.cols = 0
        this.flowField = []
        this.init()
    }

    init () {
        //create flow field
        this.rows = Math.floor(this.height / this.cellSize)
        this.cols = Math.floor(this.width / this.cellSize)
        this.flowField = []
        // GRID - FLOW FIELD
        for (let y=0; y< this.rows; y++) {
            for (let x=0; x< this.cols; x++){
                let angle = (Math.cos(x) + Math.sin(y))*0.5
                this.flowField.push(angle)
            }
        }
        // console.log(this.flowField)
        
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

let frameCounter = 0
function animate(){
    frameCounter += 1
    ctx.clearRect(0,0,canvas.width, canvas.height)
    effect.render(ctx)
    requestAnimationFrame(animate)
}

animate()
// console.log(effect.particles)







//______________________________ FPS METER ______________________________
// CALL FUNCTION EVERY timeInterval  AND CALCULATE FramesPerSecond
const fpsValue = document.getElementById('fpsValue') as HTMLElement
let lastframeCounter = frameCounter
const timeInterval = 250

const calculateCurrentFps = () => {
    const framesDifference = frameCounter - lastframeCounter
    lastframeCounter = frameCounter
    const fps = framesDifference * (1000/timeInterval)
    fpsValue.textContent = String(fps)
};
const runFpsChecks = setInterval(calculateCurrentFps, timeInterval)
//______________________________ FPS METER ______________________________




// by default everything is PUBLIC it TS
// private variable/method can only be used inside the class
// readonly is good for constants inside classes
// for inheritance: class X extends Y {}