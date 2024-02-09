const fileDropTemplate = document.createElement("template")
fileDropTemplate.innerHTML = `
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
.fileContainer {
    margin: 0.5em 0;
}
.header {
    display: flex;
    align-items: center;
}

label {
    margin-bottom: 1rem ;
}
button {
    padding: 0.5em 1em;
    border: 1px #000 solid;
    border-radius: 4px;
    margin-left: auto;
}
.placeholder {
    font-weight: normal;
    color: gray;
    text-align: center;
}
.previewContainer {
    margin-top: 1em;
    border-top: 1px solid #ccc;
    padding-top: 0.5em;
}
</style>
<div class="fileContainer">
    <div class="header">
        <label for="myfile"></label>
        <button>Submit</button>
    </div>
    <div class="placeholder"><p>Drop files here</p></div>
    <input type="file" hidden multiple></input>
    <div class="previewContainer"></div>
</div>
`
class DragNDrop extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" })
        // this.updateDate()
        this._color = ""
        this._bgColor = ""
        this._title = ""
        this._name = ""
        this._height = ""
        this._width = "fit-content"
        this._url = ""
        shadow.append(fileDropTemplate.content.cloneNode(true))
        
        
    }

    static observedAttributes = [
        "color",
        "bg-color",
        "name",
        "title",
        "height",
        "width",
        "url"
    ]

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    };

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const inputElement = this.shadowRoot.querySelector('input')
        const files = e.dataTransfer.files;
        inputElement.files = files;
        this.displayFilePreviews(files);
    };

    displayFilePreviews(files) {
        const previewContainer = this.shadowRoot.querySelector(".previewContainer");
        previewContainer.innerHTML = ""; // Clear previous previews

        Array.from(files).forEach(file => {
            const preview = document.createElement("div");
            preview.textContent = `${file.name} (${this.formatBytes(file.size)})`;
            previewContainer.appendChild(preview);
        });
    }

    setColor(value) {
        this._color = value
        this.shadowRoot.host.style.setProperty("--text-color", this._color)
    }
    setBackgroundColor(value) {
        this._bgColor = value
        this.shadowRoot.host.style.setProperty("--bg-color", this._bgColor)
    }
    setName(value) {
        this._name = value
        this.shadowRoot.querySelector("input").setAttribute("name", value)
    }
    setTitle(value) {
        this._title = value
        this.shadowRoot.querySelector("label").innerHTML = value
    }

    setWidth(value) {
        this._width = value
        this.shadowRoot.host.style.width = value
    }

    setHeight(value) {
        this._height = value
        this.shadowRoot.host.style.height = value
    }

    setURL(value) {
        this._url = value
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    connectedCallback() {
        this.shadowRoot.addEventListener('click', () => { 
            var input = this.shadowRoot.querySelector("input")
            input.click() 
        });
        // this.shadowRoot.addEventListener('dragstart', handleDragStart);
        this.shadowRoot.host.addEventListener('dragover', this.handleDragOver);
        this.shadowRoot.host.addEventListener('drop', this.handleDrop);
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr == "color" && oldVal !== newVal) {
            this.setColor(newVal)
            console.log("Color changed to:", this._color)
        }
        if (attr == "bg-color" && oldVal !== newVal) {
            this.setBackgroundColor(newVal)
            console.log("BG Color changed to:", this._bgColor)
        }
        if (attr == "name" && oldVal !== newVal) {
            this.setName(newVal)
            console.log("Name changed to:", this._name)
        }
        if (attr == "title" && oldVal !== newVal) {
            this.setTitle(newVal)
            console.log("Title changed to:", this._title)
        }
        if (attr == "width" && oldVal !== newVal) {
            this.setWidth(newVal)
            console.log("Width changed to:", this._title)
        }
        if (attr == "height" && oldVal !== newVal) {
            this.setHeight(newVal)
            console.log("Height changed to:", this._title)
        }
        if (attr == "url" && oldVal !== newVal) {
            this.setHeight(newVal)
            console.log("Height changed to:", this._title)
        }
        // if (attr == "id" && oldVal !== newVal) {
        //     this.shadowRoot.querySelector("input").setAttribute("id", newVal)
        //     console.log("ID changed to:", newVal)
        // }
    }
}

customElements.define("filedrop-wc", DragNDrop)