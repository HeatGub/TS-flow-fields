// https://www.youtube.com/watch?v=MJNy2mdCt20&ab_channel=Frankslaboratory

const canvas = document.querySelector('#canvas1') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
canvas.width = window.innerWidth
canvas.height = window.innerHeight //height and width have to be divisible by cellSize without any rest (x%cellSize=0)
canvas.addEventListener('click', () => {console.log('klik')})
ctx.fillStyle = 'black'
ctx.strokeStyle = 'white'
ctx.lineWidth = 2

type lastCoordinates = [{x:number, y:number}]

class Particle {
    effect:Effect
    x:number
    y:number
    speedX:number
    speedY:number
    speedModifier:number
    history:lastCoordinates
    maxLength:number
    angle:number
    timer:number
    color:string
    
    constructor(effect:Effect){
        this.effect = effect
        this.x = Math.floor(Math.random()*this.effect.width)
        this.y = Math.floor(Math.random()*this.effect.height)
        this.speedX = 0 //but could be just initialized without value
        this.speedY = 0 //but could be just initialized without value
        // this.speedModifier = Math.floor(Math.random()*3 + 1)
        this.speedModifier = 1
        this.history = [{x: this.x, y: this.y}]
        this.maxLength = 10 + Math.random()* 50
        this.angle = 0
        this.timer = this.maxLength * 5
        // this.color = 'green'
        this.color = 'rgb('+Math.random()*50+','+Math.random()*150+','+100+Math.random()*150+')'

    }

    draw(context:CanvasRenderingContext2D){
        context.beginPath()
        context.moveTo(this.history[0].x, this.history[0].y)
        for (let i=0; i < this.history.length; i++){
            context.lineTo(this.history[i].x, this.history[i].y)
        }
        context.strokeStyle = this.color
        context.stroke()
    }

    updateFrame(){
        this.timer--
            if(this.timer >= 1) {
                let x = Math.floor(this.x / this.effect.cellSize)
                let y = Math.floor(this.y / this.effect.cellSize)
                let index =  y * this.effect.cols + x

                if (this.effect.flowField[index]){
                    this.angle = this.effect.flowField[index].colorAngle
                }

                this.speedX = Math.cos(this.angle)*10
                this.speedY = Math.sin(this.angle)*10
                this.x += this.speedX * this.speedModifier
                this.y += this.speedY * this.speedModifier

                this.history.push({x: this.x, y: this.y})

                if (this.history.length > this.maxLength){
                    //shift method removes first list's item
                    this.history.shift()
                }
            }
            else if (this.history.length > 1){
                this.history.shift()
            }
            else {
                this.reset()
            }
    }

    reset(){
        this.x = Math.floor(Math.random()*this.effect.width)
        this.y = Math.floor(Math.random()*this.effect.height)
        this.history = [{x: this.x, y: this.y}]
        this.timer = this.maxLength * 2
    }
}

type singleFieldCell = {x:number, y:number, colorAngle:number}

class Effect {
    canvas: HTMLCanvasElement
    context: CanvasRenderingContext2D
    width: number
    height: number
    //the type of particles is array of Particle objects
    particles: Particle[]
    numberOfParticles: number
    cellSize: number
    rows: number
    cols: number
    flowField: singleFieldCell[]
    curve: number
    zoom: number
    debug: boolean

    constructor(canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D){
        this.canvas = canvas
        this.context = ctx
        this.width = this.canvas.width
        this.height = this.canvas.height
        this.particles = []
        this.numberOfParticles = 300
        this.rows = 0 //any number, but this could be changed for 'let variable;'
        this.cols = 0
        this.flowField = []
        // this.flowField = singleFieldCell

        this.cellSize = 1
        this.curve = 100
        this.zoom = 100000

        this.debug = false
        this.init()

        window.addEventListener('keydown', event => {
            // console.log(event.key)
            if (event.key === 'd') this.debug = !this.debug
        })

        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight)
        })

    }

    drawText(){
        this.context.font = '600px Impact'
        this.context.textAlign = 'center'
        this.context.textBaseline = 'middle'
        this.context.fillStyle = "green";
        this.context.fillText('JS', this.width *0.5, this.height * 0.5);
    }

    init () {
        //create flow field
        this.rows = Math.ceil(this.height / this.cellSize)
        this.cols = Math.ceil(this.width / this.cellSize)
        this.flowField = []

        //draw text (just once)
        this.drawText()

        //scan pixel data
        const pixels = this.context.getImageData(0, 0, this.width, this.height).data
        console.log(pixels)
        for (let y=0; y<this.height; y+= this.cellSize){
            for (let x=0; x<this.width; x+= this.cellSize){
                const index = (y * this.width + x)*4 //because 4 vals represent one pixel
                const red = pixels[index]
                const green = pixels[index + 1]
                const blue = pixels[index + 2]
                // const alpha = pixels[index + 3]
                const grayscale = (red + green + blue) / 3
                const colorAngle = Number(((grayscale/255) * 6.28).toFixed(2))
                this.flowField.push({
                    x: x,
                    y: y,
                    colorAngle: colorAngle
                })
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
        this.particles = []
        for (let i=0; i< this.numberOfParticles; i++){
            this.particles.push(new Particle(this))
        }
    }

    drawGrid(){
        this.context.save()
        this.context.strokeStyle = 'gray'
        this.context.lineWidth = 2
        for(let c = 0; c< this.cols; c++){
            this.context.beginPath()
            this.context.moveTo(this.cellSize * c, 0)
            this.context.lineTo(this.cellSize * c, this.height)
            this.context.stroke()
        }
        for(let r = 0; r < this.rows; r++){
            this.context.beginPath()
            this.context.moveTo(0, this.cellSize * r)
            this.context.lineTo(this.width, this.cellSize * r)
            this.context.stroke()
        }
        this.context.restore()// to last save()
    }

    resize(width:number, height:number){
        this.width = width
        this.height = height
        this.canvas.width = width
        this.canvas.height = height
        this.init()
    }

    render() {
        if (this.debug) {
            this.drawGrid()
            this.drawText()
        }
        this.particles.forEach(particle  => {
            particle.draw(this.context)
            particle.updateFrame()
        })
    }
}

const effect = new Effect(canvas, ctx)

let frameCounter = 0
function animate(){
    frameCounter += 1
    ctx.clearRect(0,0,canvas.width, canvas.height)
    effect.render()
    requestAnimationFrame(animate)
}

animate()


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