let columns = [
    {
        name: "#",
        type: "serial"
    },
    {
        name: "LHS",
        type: "text"
    },
    {
        name: "RHS",
        type: "option",
        options: [["One", 1], ["Two", 2], ["Three", 3]]
    },
    {
        name: "Sum",
        type: "formulae",
        priority: 0,
        formulae: `parseFloat(getV("LHS"))+parseFloat(getV("RHS"))`
    },
    {
        name: "SumSquared",
        type: "formulae",
        priority: 1,
        formulae: `parseFloat(getV("Sum"))*parseFloat(getV("Sum"))`
    }
];