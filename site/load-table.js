function generateHeaderCell(columnDefinition) {
    let cell = this.insertCell(-1);
    cell.innerHTML = columnDefinition.name;
}

function generateDataCell(columnDefinition, columnIndex) {
    let cell = this.insertCell(-1);
    switch (columnDefinition.type) {
        case "serial":
            cell.innerHTML = columnDefinition.row;
            columnDefinition.row++;
            break;
        case "text":
            cell.innerHTML = `<input id="${columnDefinition.name}_${columnIndex}"/>`;
            break;

        default:
            cell.innerHTML = `${columnDefinition.type}`
            break;
    }
}

function newRowClickHandler() {
    let dataRow = document.querySelector("table").insertRow(-1);
    columns.forEach(generateDataCell.bind(dataRow));
}

let columns = [
    {
        name: "#",
        type: "serial",
        row: 1
    },
    {
        name: "Col1",
        type: "text"
    },
    {
        name: "Col2",
        type: "text"
    },
    {
        name: "Col3",
        type: "text"
    }
];

let headerRow = document.querySelector("table").insertRow(-1);
columns.forEach(generateHeaderCell.bind(headerRow));

newRowClickHandler();