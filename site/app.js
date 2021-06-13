function generateHeaderCell(columnDefinition) {
    let cell = this.insertCell(-1);
    cell.innerHTML = columnDefinition.name;
}

function generateDataCell(columnDefinition, columnIndex) {
    let cell = this.insertCell(-1);
    switch (columnDefinition.type) {
        case "serial":
            cell.innerHTML = this.rowIndex;
            break;
        case "option":
            let selectList = document.createElement("select");
            selectList.id = generateElementId("O", this.rowIndex, columnIndex);
            cell.appendChild(selectList);
            for (let i = 0; i < columnDefinition.options.length; i++) {
                let option = document.createElement("option");
                option.value = columnDefinition.options[i][1];
                option.text = columnDefinition.options[i][0];
                selectList.appendChild(option);
            }
            selectList.onchange = () => { window.appVariables.set(selectList.id, selectList.value); window.formulaes.map(f => f()); };
            window.columnToDefMap.set(columnDefinition.name, { type: 'O', index: columnIndex });
            break;
        case "text":
            let input = document.createElement("input");
            input.type = "text";
            input.id = generateElementId("T", this.rowIndex, columnIndex);
            input.onblur = () => { window.appVariables.set(input.id, input.value); window.formulaes.map(f => f()); };
            cell.appendChild(input);
            window.columnToDefMap.set(columnDefinition.name, { type: 'T', index: columnIndex });
            break;
        case "formulae":
            let label = document.createElement("Label");
            label.id = generateElementId("F", this.rowIndex, columnIndex);
            let jsFunc = () => compute(label.id, columnDefinition.formulae, window.appVariables, this.rowIndex, window.formulaesMap);
            let priority = (this.rowIndex * 100) + columnDefinition.priority
            window.formulaes.splice((priority || 0), 0, jsFunc);
            appVariables.set(label.id, () => document.getElementById(label.id).innerText);
            cell.appendChild(label);
            window.columnToDefMap.set(columnDefinition.name, { type: 'F', index: columnIndex });
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

function compute(labelId, formulae, variables, rowIndex) {
    let labelText = "Init";
    try {
        //This is line is just to make the eval context with the required variables
        const getV = (columnName) => {
            const columnDef = window.columnToDefMap.get(columnName);
            const variableName = generateElementId(columnDef.type, rowIndex, columnDef.index);
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

function save() {
    const entries = [];
    appVariables.forEach((value, key) => {
        if (typeof (value) !== 'function') {
            entries.push([key, value]);
        }
    });
    let table = document.querySelector("table")
    document.getElementById("txtDB").value = JSON.stringify({ r: table.rows.length, d: entries, v: 1 });
}

function generateElementId(typeChar, rowIndex, columnIndex) {
    return `${typeChar}_${rowIndex}_${columnIndex}`;
}

function load() {
    resetAppState();
    const databaseData = JSON.parse(document.getElementById("txtDB").value);
    window.appVariables = new Map([...window.appVariables, ...databaseData.d]);
    let table = document.querySelector("table")
    while (table.rows.length < databaseData.r) {
        newRowClickHandler();
    }
    appVariables.forEach((value, key) => {
        if (typeof (value) !== 'function') {
            let element = document.getElementById(key);
            if (element != null) {
                switch (key[0]) {
                    case "O":
                    case "T":
                        element.value = value;
                        break;
                    case "F"://Dont touch formulae labels
                        break;
                    default:
                        console.error("Unknkown element type encountered:" + key[0]);
                }
            }
            else {
                console.error("Cannot find element:" + key);
            }
        }
    });
    window.formulaes.map(f => f());
}

function resetAppState() {
    let table = document.querySelector("table")
    while (table.rows.length > 0) {
        table.deleteRow(0);
    }
    window.appVariables = new Map();
    window.formulaes = [];
    window.columnToDefMap = new Map();
    let headerRow = table.insertRow(-1);
    columns.forEach(generateHeaderCell.bind(headerRow));
}

resetAppState();
newRowClickHandler();