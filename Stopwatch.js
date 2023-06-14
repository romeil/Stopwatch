export default class Stopwatch {
    constructor(root) {
        root.innerHTML = Stopwatch.getHTML()

        this.el = {
            minutes: root.querySelector(".stopwatch-elements-minutes"),
            seconds: root.querySelector(".stopwatch-elements-seconds"),
            centi_seconds: root.querySelector(".stopwatch-elements-centi_seconds"),
            laps: root.querySelector(".laps"),
            control_div: document.getElementById("start/stop"),
            control: root.querySelector(".stopwatch-btn-start"),
            manipulate: root.querySelector(".stopwatch-btn-lap")
        }

        this.interval = null
        this.stopWatchSeconds = 0
        this.lapSeconds = 0
        this.laps = this.el.laps.children.length

        this.el.control.addEventListener("click", () => {
            if (this.interval === null) {
                this.start()
            } else {
                this.stop()
            }
        })

        this.el.manipulate.addEventListener("click", () => {
            if(this.interval === null && this.stopWatchSeconds === 0){
                return
            }
            else if(this.interval === null && this.stopWatchSeconds > 0){
                this.reset()
            }
            else{
                this.lap()
            }
        })
    }

    updateInterfaceTime() {
        const centi_seconds = this.stopWatchSeconds % 99
        const seconds = Math.floor((this.stopWatchSeconds / 99) % 60)
        const minutes = Math.floor((this.stopWatchSeconds / 5940) % 60)

        const lap_centi_seconds = this.lapSeconds % 99
        const lap_seconds = Math.floor((this.lapSeconds / 99) % 60)
        const lap_minutes = Math.floor((this.lapSeconds / 5940) % 60)

        this.el.minutes.textContent = minutes.toString().padStart(2, "0")
        this.el.seconds.textContent = seconds.toString().padStart(2, "0")
        this.el.centi_seconds.textContent = centi_seconds.toString().padStart(2, "0")
        
        document.querySelector(`.lap-elements-minutes-${this.laps}`).textContent = lap_minutes.toString().padStart(2, "0")
        document.querySelector(`.lap-elements-seconds-${this.laps}`).textContent = lap_seconds.toString().padStart(2, "0")
        document.querySelector(`.lap-elements-centi_seconds-${this.laps}`).textContent = lap_centi_seconds.toString().padStart(2, "0")
    }

    updateInterfaceControls() {
        if (this.interval === null && this.stopWatchSeconds === 0){
            this.el.control.innerHTML = `<span>Start</span>`
            this.el.control.classList.add("stopwatch-btn-start")
            this.el.control.classList.remove("stopwatch-btn-stop")

            this.el.manipulate.innerHTML = `<span>Lap</span>`
            this.el.manipulate.classList.add("stopwatch-btn-lap")
            this.el.manipulate.classList.remove("stopwatch-btn-reset")
            
            this.el.control_div.classList.add("start")
            this.el.control_div.classList.remove("stop")

        } else if (this.interval === null && this.stopWatchSeconds > 0){
            this.el.control.innerHTML = `<span>Start</span>`
            this.el.control.classList.add("stopwatch-btn-start")
            this.el.control.classList.remove("stopwatch-btn-stop")

            this.el.manipulate.innerHTML = `<span>Reset</span>` 
            this.el.manipulate.classList.add("stopwatch-btn-reset")
            this.el.manipulate.classList.remove("stopwatch-btn-lap")
            this.el.manipulate.classList.remove("lap-running")

            this.el.control_div.classList.add("start")
            this.el.control_div.classList.remove("stop")

        } else {
            this.el.control.innerHTML = `<span>Stop</span>`
            this.el.control.classList.add("stopwatch-btn-stop")
            this.el.control.classList.remove("stopwatch-btn-start")

            this.el.control_div.classList.add("stop")
            this.el.control_div.classList.remove("start")

            this.el.manipulate.innerHTML = `<span>Lap</span>`
            this.el.manipulate.classList.add("stopwatch-btn-lap")
            this.el.manipulate.classList.add("lap-running")
            this.el.manipulate.classList.remove("stopwatch-btn-reset")
        }
    }

    start() {
        this.interval = setInterval(() => {
            this.stopWatchSeconds++
            this.lapSeconds++
            this.updateInterfaceTime()
        }, 1)
        this.updateInterfaceControls()
        if(this.laps == 0){
            this.lap()
        }
    }

    stop() {
        clearInterval(this.interval)
        this.interval = null
        this.updateInterfaceControls()
    }

    reset() {
        for (let i = 0; i < this.laps; i++){
            document.querySelector(".lap-intervals").remove()
        }
        this.stopWatchSeconds = 0
        this.lapSeconds = 0
        this.laps = 0
        this.el.minutes.innerHTML = "00"
        this.el.seconds.innerHTML = "00"
        this.el.centi_seconds.innerHTML = "00"
        this.updateInterfaceControls()
    }

    lap() {
        this.lapSeconds = 0
        const lap_count = this.laps + 1
        this.laps = this.laps + 1
        console.log(this.laps)
        console.log(this.lapSeconds)

        const lap_div = document.createElement("div")
        lap_div.classList.add("lap-intervals",`${lap_count}`)

        lap_div.innerHTML = `
        <span class="lap-${lap_count}" id="${this.stopWatchSeconds}">Lap ${lap_count}</span>
        <div class="lap-time">
            <span class="lap-elements lap-elements-minutes-${lap_count}">00</span>
            <span class="lap-elements lap-elements">:</span>
            <span class="lap-elements lap-elements-seconds-${lap_count}">00</span>
            <span class="lap-elements lap-elements">.</span>
            <span class="lap-elements lap-elements-centi_seconds-${lap_count}">00</span>
        </div>
        `
        
        if (this.laps === 0){
            this.el.laps.append(lap_div)
        } else{
            this.el.laps.insertBefore(lap_div, this.el.laps.firstChild)
        }
    }

    static getHTML() {
        return `
        <div class="border-line">
            <div class="stopwatch-main">
                <span class="stopwatch-elements stopwatch-elements-minutes">00</span>
                <span class="stopwatch-elements">:</span>
                <span class="stopwatch-elements stopwatch-elements-seconds">00</span>
                <span class="stopwatch-elements">.</span>
                <span class="stopwatch-elements stopwatch-elements-centi_seconds">00</span>               
                <button type="button" class="stopwatch-btn stopwatch-btn-lap">
                    <span>Lap</span>
                </button>
                <div class="start" id="start/stop">
                    <button type="button" class="stopwatch-btn stopwatch-btn-start">
                        <span>Start</span>
                    </button>
                </div>    
            </div>
        </div>  
        <div class="stopwatch-container">
            <div class="laps">        
            </div>
        </div>
        `
    }
}


