class Clock extends HTMLElement{
    constructor(){
        super()
        this.time = "0:00"
    }
}

customElements.define("clock-wc", Clock)