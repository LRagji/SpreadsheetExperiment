
var DATA = {}, INPUTS = [].slice.call(document.querySelectorAll("input"));
INPUTS.forEach(function (elm) {
    elm.onfocus = function (e) {
        e.target.value = localStorage[e.target.id] || "";
    };
    elm.onblur = function (e) {
        localStorage[e.target.id] = e.target.value;
        computeAll();
    };
    var getter = function () {
        var value = localStorage[elm.id] || "";
        if (value.charAt(0) == "=") {
            with (DATA) return eval(value.substring(1));
        } else { return isNaN(parseFloat(value)) ? value : parseFloat(value); }
    };
    Object.defineProperty(DATA, elm.id, { get: getter });
    Object.defineProperty(DATA, elm.id.toLowerCase(), { get: getter });
});
(window.computeAll = function () {
    INPUTS.forEach(function (elm) { try { elm.value = DATA[elm.id]; } catch (e) { } });
})();
