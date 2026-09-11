/* =====================================
   SVG CALCULATOR
   STABLE TREBEDIT VERSION
===================================== */


/* =====================================
   VARIABLES
===================================== */

var current = "0";

var stored = null;

var currentOperator = null;

var newNumber = false;

var historyData = [];


/* =====================================
   ELEMENTS
===================================== */

var screen =
document.getElementById("screen");

var previous =
document.getElementById("previous");


/* =====================================
   DISPLAY
===================================== */

function display(){

    if(screen){

        screen.textContent =
        current;

    }

}


/* =====================================
   FEEDBACK
===================================== */

function feedback(){

    var vibration =
    document.getElementById("vibration");

    if(
        vibration &&
        vibration.checked &&
        navigator.vibrate
    ){

        navigator.vibrate(8);

    }

}


/* =====================================
   NUMBER
===================================== */

function numberPress(number){

    feedback();


    if(current == "Error"){

        current = "0";

        stored = null;

        currentOperator = null;

        newNumber = false;

    }


    if(newNumber){

        current = number;

        newNumber = false;

    }
    else{

        if(current == "0"){

            current = number;

        }
        else{

            current =
            current + number;

        }

    }


    display();

}


/* =====================================
   DECIMAL
===================================== */

function decimalPress(){

    feedback();


    if(current == "Error"){

        current = "0";

    }


    if(newNumber){

        current = "0.";

        newNumber = false;

        display();

        return;

    }


    if(current.indexOf(".") == -1){

        current =
        current + ".";

    }


    display();

}


/* =====================================
   CLEAR
===================================== */

function clearCalculator(){

    feedback();

    current = "0";

    stored = null;

    currentOperator = null;

    newNumber = false;

    previous.textContent = "";

    display();

}


/* =====================================
   DELETE
===================================== */

function deleteNumber(){

    feedback();


    if(
        current == "Error" ||
        newNumber
    ){

        current = "0";

        newNumber = false;

        display();

        return;

    }


    if(current.length <= 1){

        current = "0";

    }
    else{

        current =
        current.substring(
            0,
            current.length - 1
        );

    }


    display();

}


/* =====================================
   PERCENT
===================================== */

function percent(){

    feedback();


    var n =
    parseFloat(current);


    if(isNaN(n)){

        return;

    }


    n =
    n / 100;


    current =
    String(n);

    display();

}


/* =====================================
   OPERATOR
===================================== */

function operatorPress(op){

    feedback();


    if(current == "Error"){

        return;

    }


    /*
       If user already entered:
       6 - 2 and presses +
       calculate 4 first.
    */

    if(
        stored !== null &&
        currentOperator !== null &&
        newNumber == false
    ){

        calculateResult(false);

    }


    stored =
    parseFloat(current);

    currentOperator =
    op;

    newNumber = true;


    previous.textContent =
    current +
    " " +
    symbol(op);

}


/* =====================================
   SYMBOL
===================================== */

function symbol(op){

    if(op == "*"){

        return "×";

    }


    if(op == "/"){

        return "÷";

    }


    if(op == "-"){

        return "−";

    }


    return op;

}


/* =====================================
   CALCULATE
===================================== */

function calculateResult(saveHistory){

    if(
        stored === null ||
        currentOperator === null
    ){

        return;

    }


    var second =
    parseFloat(current);


    var answer;


    if(isNaN(second)){

        return;

    }


    if(currentOperator == "+"){

        answer =
        stored + second;

    }
    else if(currentOperator == "-"){

        answer =
        stored - second;

    }
    else if(currentOperator == "*"){

        answer =
        stored * second;

    }
    else if(currentOperator == "/"){

        if(second == 0){

            current = "Error";

            previous.textContent =
            "Cannot divide by zero";

            stored = null;

            currentOperator = null;

            newNumber = true;

            display();

            return;

        }

        answer =
        stored / second;

    }


    /*
       Remove ugly floating point tails
       such as 0.30000000000000004
    */

    if(
        typeof answer == "number" &&
        isFinite(answer)
    ){

        answer =
        Math.round(
            answer * 10000000000
        ) / 10000000000;

    }


    var expression =
    stored +
    " " +
    symbol(currentOperator) +
    " " +
    second +
    " =";


    current =
    String(answer);


    previous.textContent =
    expression;


    if(saveHistory){

        historyData.unshift(

            expression +
            " " +
            current

        );


        if(historyData.length > 30){

            historyData.pop();

        }

    }


    stored = null;

    currentOperator = null;

    newNumber = true;


    display();

}


/* =====================================
   MAIN BUTTON ROUTER
===================================== */

function calculate(key){

    /*
       This function is kept extremely simple
       for maximum TrebEdit compatibility.
    */


    if(
        key == "0" ||
        key == "1" ||
        key == "2" ||
        key == "3" ||
        key == "4" ||
        key == "5" ||
        key == "6" ||
        key == "7" ||
        key == "8" ||
        key == "9"
    ){

        numberPress(key);

        return;

    }


    if(key == "."){

        decimalPress();

        return;

    }


    if(key == "AC"){

        clearCalculator();

        return;

    }


    if(key == "DEL"){

        deleteNumber();

        return;

    }


    if(key == "%"){

        percent();

        return;

    }


    if(
        key == "+" ||
        key == "-" ||
        key == "*" ||
        key == "/"
    ){

        operatorPress(key);

        return;

    }


    if(key == "="){

        feedback();

        calculateResult(true);

        return;

    }

}


/* =====================================
   CONNECT BUTTONS
===================================== */

function connectButtons(){

    var buttons =
    document.getElementsByClassName("key");

    var i;


    for(
        i = 0;
        i < buttons.length;
        i++
    ){

        buttons[i].onclick =
        function(){

            var key =
            this.getAttribute("data-key");

            calculate(key);

        };

    }

}


/* =====================================
   HISTORY
===================================== */

function openHistory(){

    document.getElementById(
        "historyPanel"
    ).className =
    "panel show";

    showHistory();

}


function closeHistory(){

    document.getElementById(
        "historyPanel"
    ).className =
    "panel";

}


function showHistory(){

    var list =
    document.getElementById(
        "historyList"
    );


    if(historyData.length == 0){

        list.textContent =
        "No calculations yet.";

        return;

    }


    list.innerHTML = "";


    var i;


    for(
        i = 0;
        i < historyData.length;
        i++
    ){

        var item =
        document.createElement(
            "div"
        );

        item.className =
        "historyItem";

        item.textContent =
        historyData[i];

        list.appendChild(item);

    }

}


function clearHistory(){

    historyData = [];

    showHistory();

}


/* =====================================
   SETTINGS
===================================== */

function openSettings(){

    document.getElementById(
        "settingsPanel"
    ).className =
    "panel show";

}


function closeSettings(){

    document.getElementById(
        "settingsPanel"
    ).className =
    "panel";

}


/* =====================================
   THEME
===================================== */

function changeTheme(){

    var theme =
    document.getElementById(
        "theme"
    ).value;


    if(theme == "light"){

        document.body.style.background =
        "#edf5ff";

    }
    else{

        document.body.style.background =
        "radial-gradient(circle at 10% 10%,#075aa9,transparent 30%)," +
        "radial-gradient(circle at 90% 90%,#541a8d,transparent 30%)," +
        "linear-gradient(135deg,#020611,#071a35,#020611)";

    }

}


/* =====================================
   KEYBOARD
===================================== */

document.onkeydown =
function(event){

    var key =
    event.key;


    if(
        key >= "0" &&
        key <= "9"
    ){

        calculate(key);

        return;

    }


    if(
        key == "+" ||
        key == "-" ||
        key == "*" ||
        key == "/"
    ){

        calculate(key);

        return;

    }


    if(key == "."){

        calculate(".");

        return;

    }


    if(key == "Enter"){

        calculate("=");

        return;

    }


    if(key == "Backspace"){

        calculate("DEL");

        return;

    }


    if(key == "Escape"){

        calculate("AC");

        return;

    }

};


/* =====================================
   LOADING
===================================== */

var loadingNumber = 0;

var percent =
document.getElementById(
    "loadingPercent"
);

var bar =
document.getElementById(
    "progressBar"
);

var loadingText =
document.getElementById(
    "loadingText"
);


var loadingTimer =
setInterval(

    function(){

        loadingNumber++;


        if(loadingNumber > 100){

            loadingNumber = 100;

        }


        if(percent){

            percent.textContent =
            loadingNumber + "%";

        }


        if(bar){

            bar.style.width =
            loadingNumber + "%";

        }


        if(loadingNumber < 30){

            loadingText.textContent =
            "STARTING...";

        }
        else if(loadingNumber < 65){

            loadingText.textContent =
            "LOADING CALCULATOR...";

        }
        else if(loadingNumber < 100){

            loadingText.textContent =
            "PREPARING APP...";

        }
        else{

            loadingText.textContent =
            "READY";

            clearInterval(
                loadingTimer
            );


            setTimeout(

                function(){

                    var loadingScreen =
                    document.getElementById(
                        "loadingScreen"
                    );

                    var app =
                    document.getElementById(
                        "app"
                    );


                    if(loadingScreen){

                        loadingScreen.className =
                        "hide";

                    }


                    if(app){

                        app.className =
                        "ready";

                    }


                    /*
                       Try fullscreen automatically.
                       Browsers may reject this because
                       startup is not a user gesture.
                    */

                    try{

                        if(
                            document.documentElement.requestFullscreen
                        ){

                            document.documentElement
                            .requestFullscreen()
                            .catch(
                                function(){}
                            );

                        }

                    }
                    catch(error){

                    }

                },

                200

            );

        }

    },

    30

);


/* =====================================
   CONNECT EVERYTHING
===================================== */

connectButtons();


document.getElementById(
    "historyButton"
).onclick =
function(){

    openHistory();

};


document.getElementById(
    "settingsButton"
).onclick =
function(){

    openSettings();

};


document.getElementById(
    "historyClose"
).onclick =
function(){

    closeHistory();

};


document.getElementById(
    "settingsClose"
).onclick =
function(){

    closeSettings();

};


document.getElementById(
    "clearHistory"
).onclick =
function(){

    clearHistory();

};


document.getElementById(
    "theme"
).onchange =
function(){

    changeTheme();

};


/* INITIAL DISPLAY */

display();

showHistory();