function generateHeaderCell(columnDefinition) {
    let cell = this.insertCell(-1);
    cell.innerHTML = columnDefinition.name;
}

function generateDataCell(columnDefinition, columnIndex) {
    let cell = this.insertCell(-1);
    let elementId = `e_${this.rowIndex}_${columnIndex}`;
    switch (columnDefinition.type) {
        case "serial":
            cell.innerHTML = this.rowIndex;
            break;
        case "text":
            let input = document.createElement("input");
            input.type = "text";
            input.id = elementId;
            input.onblur = () => { window.appVariables.set(input.id, input.value); window.formulaes.map(f => f()); };
            cell.appendChild(input);
            break;
        case "formulae":
            let label = document.createElement("Label");
            label.id = elementId;
            let jsFunc = () => compute(label.id, columnDefinition.formulae, window.appVariables, this.rowIndex, window.formulaesMap);
            let priority = (this.rowIndex * 100) + columnDefinition.priority
            window.formulaes.splice((priority || 0), 0, jsFunc);
            appVariables.set(label.id, () => document.getElementById(label.id).innerText);
            cell.appendChild(label);
            break;
        default:
            cell.innerHTML = `${columnDefinition.type}`
            break;
    }
    window.columnToIndexMap.set(columnDefinition.name, columnIndex);
}

function newRowClickHandler() {
    let dataRow = document.querySelector("table").insertRow(-1);
    columns.forEach(generateDataCell.bind(dataRow));
}

function compute(labelId, formulae, variables, rowIndex) {
    let labelText = "Init";
    try {
        //This is line is just to make the eval context with the required variables
        const getV = (columnName) => {
            const variableName = `e_${rowIndex}_${window.columnToIndexMap.get(columnName)}`;
            let value = variables.get(variableName);
            if (typeof (value) === 'function') {
                value = value();
            }
            return value;
        };
        labelText = eval(formulae);//This can be JSONATA later if needed
    }
    catch (err) {
        console.error(err);
        labelText = 'Err!';
    }
    finally {
        let label = document.getElementById(labelId);
        label.innerText = labelText;
    }
}

window.appVariables = new Map();
window.formulaes = [];
window.columnToIndexMap = new Map();
let headerRow = document.querySelector("table").insertRow(-1);
columns.forEach(generateHeaderCell.bind(headerRow));

newRowClickHandler();