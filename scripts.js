let active = [];
let calculationItems = [];
let currentOperandDecimalFlag = false;
let operandCurrentlyInDisplay = "";
let activeLightBool = false;


let inputNumbers = document.querySelector("#input-numbers");
let calculatorButtonContainer = document.querySelector("#calculator-button-container");

calculatorButtonContainer.addEventListener( "click", (event) => {
  let selectedButton = event.target;
  selectionParser( selectedButton.id );
});



let operatorParser = {
  "+": function (x, y) { return  x + y },
  "-": function (x, y) { return  x - y },
  "*": function (x, y) { return  x * y },
  "/": function (x, y) { return  x / y }
};


function selectionParser( buttonInput ) {

  if( Number.isInteger( parseInt( buttonInput ) ) ) {
    numberInput( parseInt( buttonInput ) );
  } else {

    switch( buttonInput.toString() ) {
      case "AC":
        clearInput( "AC" );
        break;
      case "CE":
        clearInput( "CE" );
        break;
      case "multiplication":
        operatorInput( "*" )
        break;
      case "division":
        operatorInput( "/" );
        break;
      case "addition":
        operatorInput( "+" )
        break;
      case "subtraction":
        operatorInput( "-" );
        break;
      case "decimal":
        decimalInput();
        break;
      case "calculate":
        calculateInput( true );
        break;
      case "calculator-button-container":
        console.log( "That tickles! (you touched the button container)");
        break;
      default:
        alert( "There was an error!" );
        console.log( buttonInput );
        break;
    }

  }
}



function numberInput( numberInput ) {

  if ( Number.isInteger( parseInt( active[active.length - 1] ) )
    || [active.length - 1] === ".") {

    active.push( numberInput.toString() );

  } else if ( active.length === 0
    && typeof calculationItems[calculationItems.length - 1] === "number" ) {

    alert( "Expecting an operator" );

  } else if ( active[0] === "+" || active[0] === "-"
    || active[0] === "*" || active[0] === "/" ) {

    calculationItems.push(active[0]);
    active = [];
    active.push( numberInput.toString() );
    currentOperandDecimalFlag = false;

  } else  {

    active.push( numberInput.toString() );

  }

  calculatorStateUpdate();

}


function decimalInput() {

  console.log("decimal input run")
  if ( !currentOperandDecimalFlag ) {
    if ( Number.isInteger( parseInt( active[active.length - 1] ) ) ) {
      active.push( "." )
    }
    currentOperandDecimalFlag = true;
  } else {
    console.log( "already has a decimal" );
  }

  console.log(active);
  calculatorStateUpdate();

}


function operatorInput( operator ) {
  console.log( typeof operator );
  if ( Number.isInteger( parseInt( active[active.length - 1] ) ) ) {

    calculationItems.push( parseFloat( active.reduce( (prev, curr) => {
      return prev.concat(curr);
    }, "")));

    console.log(calculationItems);
    active = [operator];
    console.log(active);
    currentOperandDecimalFlag = false;

  } else if ( active.length === 0
    && typeof calculationItems[calculationItems.length - 1] === "number" ) {

    active.push( operator );

  } else if ( active[0] === "+" || active[0] === "-"
  || active[0] === "*" || active[0] === "/" || active[0] === "." ) {

    alert( "Expecting an operand" )
    return;

  } else {
    console.log( "operator input very broken" );
    return;
  }
  console.log(active);
  calculatorStateUpdate();

}


function clearInput( clearType ) {
  if ( clearType === "AC" )  {
    calculationItems = [];
    active = [];
    currentOperandDecimalFlag = false;
    if ( activeLightBool ) {
      let activeLight = document.querySelector(".active-light");
      activeLight.classList.remove("active-light");
    }
  } else if ( clearType === "CE" ) {

    if ( active[0] === "+" || active[0] === "-"
    || active[0] === "*" || active[0] === "/" ) {

      if ( activeLightBool ) {
        let activeLight = document.querySelector(".active-light");
        activeLight.classList.remove("active-light");
      }

    }

    active = [];
  }

  displayCurrentOperand( [""] )
  calculatorStateUpdate();

}


function calculateInput( buttonPressedBool = false ) {
  if (!buttonPressedBool ) {
    return operatorParser[calculationItems[1]](calculationItems[0], calculationItems[2]);
  } else if ( typeof parseInt( active[active.length - 1] ) === "number"
    && !isNaN( parseInt( active[active.length - 1] ) ) ) {
    console.log("type detection: " + typeof parseInt( active[active.length - 1] ) );
    console.log("value detection: " + parseInt( active[active.length - 1] ) );
    calculationItems.push( parseFloat( active.reduce( (prev, curr) => {
      return prev.concat(curr);
    }, "")));
    active = [];
    currentOperandDecimalFlag = false;
    calculatorStateUpdate();
  }

}



function calculatorStateUpdate() {

  console.log( "calculation items:" );
  console.log( calculationItems );

  if ( calculationItems.length === 3 ) {

    console.log( "bingo time" );
    console.log( "array length: " + calculationItems.length );
    calculationItems = [calculateInput()];
    console.log( "result: " + calculationItems );

    if ( calculationItems[0] > (10 ** 16) ) {

      console.log("Number too big for display, but still held onto.");

    }

    let activeLight = document.querySelector(".active-light");
    activeLight.classList.remove("active-light");
    displayCurrentOperand();
    activeLightBool = false;
    console.log( [...calculationItems[0].toString().split("")] )
    displayCurrentOperand( [...calculationItems[0].toString().split("")] );

  } else {

    displayCurrentOperand();
  }
}

function displayCurrentOperand( latestInput = [...active] ) {
  console.log( "latest input: " );
  console.log( latestInput );
  let finalOutput;
  if ( latestInput[0] === "+" || latestInput[0] === "-"
  || latestInput[0] === "*" || latestInput[0] === "/" ) {
    console.log("Light display should update in a moment")
    let activeOperatorLight;

    console.log( "Operand Flag Triggered" );

    switch(latestInput.toString()) {
      case "+":
        console.log("Addition detected for light");
        activeOperatorLight = document.querySelector("#addition-light");
        activeOperatorLight.classList.add("active-light");
        break;
      case "-":
        activeOperatorLight = document.querySelector("#subtraction-light");
        activeOperatorLight.classList.add("active-light");
        break;
      case "*":
        activeOperatorLight = document.querySelector("#multiplication-light");
        activeOperatorLight.classList.add("active-light");
        break;
      case "/":
        activeOperatorLight = document.querySelector("#division-light");
        activeOperatorLight.classList.add("active-light");
        break;
    }

    activeLightBool = true;
    finalOutput = operandCurrentlyInDisplay;

  } else {

    console.log( "Trim Flag Triggered" );

    let decimalTrim = false;
    operandCurrentlyInDisplay = latestInput.reduce( (prev, curr) => {
      if (curr === ".") {
        decimalTrim = true;
        return prev.concat( curr );
      } else if ( decimalTrim ) {
        decimalTrim = false;
        return prev.concat( curr );
      } else if ( prev === "" ) {
        return prev.concat( curr );
      } else {
        return prev.concat( " " + curr );
      }
    }, "");

  }

  let tempMyArray = [...operandCurrentlyInDisplay].filter( a => a !== " ");

    if ( tempMyArray.length > 16 ) {
      console.log( tempMyArray );
      console.log( "flag2" );
      finalOutput = parseFloat(tempMyArray.join("")).toExponential(7);
      console.log( finalOutput );
    } else {
      finalOutput = operandCurrentlyInDisplay;
    }

  //update DOM

  console.log( "Display looks like:" + finalOutput );
  inputNumbers.textContent = finalOutput;
}
