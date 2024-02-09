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
header {
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
    padding: 1em;
    font-weight: normal;
    color: gray;
    text-align: center;
}
.previewContainer {
    border-top: 1px solid #ccc;
    padding-top: 0.5em;
}

.filePreview {
    display: flex;
    align-items: center;
}
.filePreview button {
    margin-left: 1em;
    cursor: pointer;
}
</style>
<div class="fileContainer">
    <header>
        <label for="myfile"></label>
        <button type="submit">Submit</button>
    </header>
    <section  class="placeholder">
        <p>Drop files here</p>
    </section >
    <input type="file" hidden multiple></input>
    <section class="previewContainer"></section>
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
        this._files = []
        this.open = false;
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
        this._files = e.dataTransfer.files;
        inputElement.files = this.files;
        this.displayFilePreviews();
    };

    displayFilePreviews() {
        const previewContainer = this.shadowRoot.querySelector(".previewContainer");
        previewContainer.innerHTML = ""; // Clear previous previews

        Array.from(this._files).forEach(file => {
            const preview = document.createElement("div");
            preview.classList.add("filePreview");
            const fileInfo = document.createElement("span");
            fileInfo.textContent = `${file.name} (${this.formatBytes(file.size)})`;
            const removeButton = document.createElement("button");
            removeButton.textContent = "Remove";
            removeButton.addEventListener("click", () => {
                preview.remove();
                // Optionally, you can also remove the file from the list of uploaded files or perform any other necessary cleanup
            });
            preview.appendChild(fileInfo);
            preview.appendChild(removeButton);
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

    uploadFiles() {
        console.log("clicked")
        const formData = new FormData();
        if (this._files.length === 0) console.error()
        for (let i = 0; i < this._files.length; i++) {
            formData.append('files', this._files[i]);
        }

        const xhr = new XMLHttpRequest();
        xhr.open('POST', this._url, true); // Update the endpoint URL as needed
        xhr.onload = function () {
            if (xhr.status === 200) {
                console.log('Files uploaded successfully');
            } else {
                console.error('Error uploading files:', xhr.statusText);
            }
        };
        xhr.send(formData);
    }

    connectedCallback() {
        var dropArea = this.shadowRoot.querySelector("section.placeholder")
        dropArea.addEventListener('click', () => { 
            var input = this.shadowRoot.querySelector("input")
            input.click()
             
        });
        var submitBtn = this.shadowRoot.querySelector("header button")
        submitBtn.addEventListener('click', () => { 
            this.uploadFiles()
        });
        if (this._url == "") console.error("filedrop-wc url attribute not set", this._url)
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
            console.log("Width changed to:", this._width)
        }
        if (attr == "height" && oldVal !== newVal) {
            this.setHeight(newVal)
            console.log("Height changed to:", this._height)
        }
        if (attr == "url" && oldVal !== newVal) {
            this.setURL(newVal)
            console.log("Height changed to:", this._url)
        }
        // if (attr == "id" && oldVal !== newVal) {
        //     this.shadowRoot.querySelector("input").setAttribute("id", newVal)
        //     console.log("ID changed to:", newVal)
        // }
    }
}

customElements.define("filedrop-wc", DragNDrop)