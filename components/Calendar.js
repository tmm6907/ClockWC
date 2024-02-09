const calendarTemplate = document.createElement("template")
calendarTemplate.innerHTML = `
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
time {
    font-size: 1.15rem;
}
.monthYear {
    margin: 0.5em 0;
}

table {
    border-collapse: collapse;
    border-spacing: 0;
}
tr, th {
    padding:0;
}

td {
    background-color: var(--bg-color, red);
    color: white;
    width: 2rem;
    height: 2rem;
    text-align: center;
    vertical-align: middle;
    padding: 1em;
}
.cell-border {
    border: 1px whitesmoke solid;
}
</style>
<div class="monthYear"><time id="monthYear" datetime=""></time></div>
<table>
    <thead>
        <tr>
            <th>Sun</th>
            <th>Mon</th>
            <th>Tue</th>
            <th>Wed</th>
            <th>Thu</th>
            <th>Fri</th>
            <th>Sat</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
        <tr>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
            <td class="cell-border"></td>
        </tr>
    </tbody>
</table>
`
class Calendar extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" })
        // this.updateDate()
        this._color = ""
        this._bgColor = ""
        this._active = this.hasAttribute("alive")
        shadow.append(calendarTemplate.content.cloneNode(true))
    }

    static observedAttributes = ["color", "bg-color"]

    updateDate() {
        var currentDate = new Date();
        const monthYear = this.shadowRoot.querySelector("time");
        // console.log(monthYear)
        const currentMonth = currentDate.toLocaleString("default", { month: "long" });
        const currentYear = currentDate.getFullYear()
        monthYear.textContent = `${currentMonth} ${currentYear}`
        monthYear.setAttribute("datetime", `${currentYear}-${currentDate.getMonth()}`)

    }

    populateCalendar() {
        // Get the current date
        const currentDate = new Date();
    
        // Set the date to the first day of the month
        currentDate.setDate(1);
    
        // Get the day of the week for the first day of the month (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
        const firstDayOfWeek = currentDate.getDay();
    
        // Initialize the day counter
        let day = 1;
    
        // Populate the calendar cells with the numbers representing the days of the month
        const rows = this.shadowRoot.querySelectorAll('table tr');
        for (let i = 1; i < rows.length; i++) { // Start from the second row (index 1), as the first row contains the header
            const cells = rows[i].querySelectorAll('td');
            for (let j = (i === 1 ? firstDayOfWeek : 0); j < cells.length; j++) {
                if (day <= this.getMonthDays(currentDate.getMonth(), currentDate.getFullYear())) {
                    cells[j].textContent = day++;
                }
            }
        }
    }
    
    // Helper function to get the number of days in a month for a given year
    getMonthDays(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }    

    updateColor(value) {
        this._color = value
        this.shadowRoot.host.style.setProperty("--text-color", this._color)
    }
    updateBackgroundColor(value) {
        this._bgColor = value
        this.shadowRoot.host.style.setProperty("--bg-color", this._bgColor)
    }

    connectedCallback() {
        // Call updateTime when the element is connected to the DOM
        this.updateDate();
        this.populateCalendar();
    }

    attributeChangedCallback(attr, oldVal, newVal) {
        if (attr == "color" && oldVal !== newVal) {
            this.updateColor(newVal)
            console.log("Color changed to:", this._color)
        }
    }
}

customElements.define("calendar-wc", Calendar)