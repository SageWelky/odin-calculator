let active = [];
let calculationItems = [];
let currentOperandDecimalFlag = false;
let operandCurrentlyInDisplay = "";
let activeLightBool = false;
console.log( "light off" );


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
        console.log( "There was an error!" );
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

    console.log( "Expecting an operator" );
    // Do not update state if we're not accepting a new input.
    return;

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

  if ( !currentOperandDecimalFlag ) {
    if ( Number.isInteger( parseInt( active[active.length - 1] ) ) ) {
      active.push( "." )
    }
    currentOperandDecimalFlag = true;
  } else {
    console.log( "already has a decimal" );
  }

  calculatorStateUpdate();

}


function operatorInput( operator ) {

  if ( Number.isInteger( parseInt( active[active.length - 1] ) ) ) {

    calculationItems.push( parseFloat( active.reduce( (prev, curr) => {
      return prev.concat(curr);
    }, "")));


    active = [operator];
    currentOperandDecimalFlag = false;

  } else if ( active.length === 0
    && typeof calculationItems[calculationItems.length - 1] === "number" ) {

    active.push( operator );

  } else if ( active[0] === "+" || active[0] === "-"
  || active[0] === "*" || active[0] === "/" || active[0] === "." ) {

    console.log( "Expecting an operand" );
    // No reason to update state, so don't.
    return;

  } else {
    console.log( "operator input very broken" );
    // Definitely don't want to update state
    // when we are getting unexpected behavior.
    return;
  }

  // Once an input is prepared
  // we want to update state accoridingly to see what the calculator should be doing, if anything.
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

    displayCurrentOperand( [""] );
    calculatorStateUpdate();

  } else if ( clearType === "CE" ) {

    if ( active[0] === "+" || active[0] === "-"
    || active[0] === "*" || active[0] === "/" ) {

      if ( activeLightBool ) {

        console.log( "light registered" );
        let activeLight = document.querySelector(".active-light");
        activeLight.classList.remove("active-light");
        activeLightBool = false;

      }

    }

    if ( calculationItems[0] ) {

      displayCurrentOperand( [...calculationItems[0].toString().split("")] );

    } else {

      displayCurrentOperand( [""] );

    }
    active = [];

  }
}


function calculateInput( buttonPressedBool = false ) {

  // The calculation can be done manually or conditionally automatic.
  // We seperate these two because triggering the update manually
  // should prepare the inputs (if in a valid state for calculation)
  // so that they are in the same format as what would cause an
  // automatic trigger, because the requirements should identical.
  // so we want a manual call to arrange the inputs
  // because the user thinks calculation can be done,
  // and an automatic call to actually request the calculation.

  // This ensures that the only way calculation happens is if the calculator
  // expects it, preventing unaccounted for situations.

  if ( !buttonPressedBool ) {

    return operatorParser[calculationItems[1]](calculationItems[0], calculationItems[2]);

  } else if ( typeof parseInt( active[active.length - 1] ) === "number"
    && !isNaN( parseInt( active[active.length - 1] ) ) && calculationItems.length === 2 ) {

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

  // The main state to check for is whether calculation should happen.
  if ( calculationItems.length === 3 ) {

    // Post calculation the array should have a first operand and be length 1.
    calculationItems = [calculateInput()];

    // Calculation items can only reach the length for calculation
    // to trigger if an operator is used. So we know to turn it off.
    let activeLight = document.querySelector(".active-light");
    activeLight.classList.remove("active-light");
    activeLightBool = false;
    console.log( "light off" );

    // An automatic trigger happens when:
    // num -> operator -> num -> operator
    // is entered. We should check with display
    // to see if a new operator light should be on.
    // if there's an operator in 'active',
    // display will catch it.
    displayCurrentOperand();


    // After handling the operator light,
    // we need to update the display to show the
    // new result as the first operand for the user
    displayCurrentOperand( [...calculationItems[0].toString().split("")] );

  } else {

    // Anything that triggers a check for state
    // should also update the display
    displayCurrentOperand();
  }
}

function displayCurrentOperand( latestInput = [...active] ) {

  console.log( "latest input: " );
  console.log( latestInput );

  let finalOutput;

  if ( latestInput[0] === "+" || latestInput[0] === "-"
  || latestInput[0] === "*" || latestInput[0] === "/" ) {

    let activeOperatorLight;

    switch(latestInput.toString()) {
      case "+":
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
    console.log( "light on" );
    finalOutput = operandCurrentlyInDisplay;

  } else {

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

      finalOutput = parseFloat(tempMyArray.join("")).toExponential(7);
      let decimalTrim = false;

      finalOutput = finalOutput.toString().split("").reduce( (prev, curr) => {

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
    } else {

      finalOutput = operandCurrentlyInDisplay;

    }
    if (latestInput[latestInput.length - 1] === ".") {
      console.log( "decimal last detected");
      console.log( finalOutput );
      console.log( typeof finalOutput );
      finalOutput = finalOutput.concat("0");
      console.log( finalOutput );
    }
    if (finalOutput === "I n f i n i t y") {
      finalOutput = "0 F F. .0 F. .5 C A L E";
    }
    if (finalOutput === "N a N") {
      finalOutput = "A C. .C A L C. .P L E A 5 E";
    }

  //update DOM
  console.log( "Display looks like:" + finalOutput );
  inputNumbers.textContent = finalOutput;
}
