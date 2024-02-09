const clockTemplate = document.createElement("template")
clockTemplate.innerHTML = `
<style>
:host{
    display: block;
    width: fit-content;
    color: var(--text-color, black);
    font-weight: bold;
    background-color: var(--bg-color, whitesmoke);
    padding: 1em;
    margin: 1em 0;
    border: 0px #000 solid;
    border-radius: 0.5rem;
}
</style>
<slot></slot>
`
class Clock extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({mode:"open"})
        this.time = "0:00";
        this.updateTime(); // Call the updateTime method to initialize the time
        this._color = ""
        this._bgColor = ""
        // this._active = this.hasAttribute("alive")
        shadow.append(clockTemplate.content.cloneNode(true))
        // if (this._active){
        //     this.shadowRoot.host.style.display = "block"
        // }
    }
    
    static observedAttributes =  ["color", "bg-color"]

    getTime() {
        var now = new Date();
        var hours = now.getHours();
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();
    
        var ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12;
        hours = hours ? hours : 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        var formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
        return formattedTime;
    }

    setTime(){
        this.time = this.getTime();
        this.textContent = this.time; // Update the text content of the element with the current time
    }

    render(){
        console.log("Color changed to:", this._color)
    }

    // Method to update the time
    updateTime() {
        this.setTime()
        // console.log("Color changed to:", this._color)
        setTimeout(() => this.updateTime(), 1000);
    }

    updateColor(value){
        this._color = value
        this.shadowRoot.host.style.setProperty("--text-color", this._color)
    }
    updateBackgroundColor(value){
        this._bgColor = value
        this.shadowRoot.host.style.setProperty("--bg-color", this._bgColor)
    }

    updateAliveStatus(){
        // this.shadowRoot.host.style.display = "block"
        console.log("ALIVE")
    }

    connectedCallback() {
        this.updateTime(); // Call updateTime when the element is connected to the DOM
    }

    attributeChangedCallback(attr , oldVal, newVal){
        if (attr == "color" && oldVal !== newVal){
            this.updateColor(newVal)
            console.log("Color changed to:", this._color)
        }
        if (attr == "bg-color" && oldVal !== newVal){
            this.updateBackgroundColor(newVal)
            console.log("Background Color changed to:", this._bgColor)
        }
        if (attr == "alive"){
            this.updateAliveStatus()
        }
    }
}

customElements.define("clock-wc", Clock)