let active = [];
let calculationItems = [];
let currentOperandDecimalFlag = false;
let currentDisplayOutput = "";



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

  console.log( typeof numberInput );
  if ( Number.isInteger( parseInt( active[active.length - 1] ) )
    || [active.length - 1] === ".") {
    console.log("num detected");
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
    //if ( active.length === 0
    //&& )
    active.push( numberInput.toString() );

  }
  console.log(active);
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
  } else if ( clearType === "CE" ) {
    active = [];
  }
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

  if ( calculationItems.length === 3 ) {

    console.log( "bingo time" );
    console.log( "array length: " + calculationItems.length );
    calculationItems = [calculateInput()];
    console.log( "result: " + calculationItems );

    if ( calculationItems[0] > (10 ** 16) ) {

      alert("Number too big for display, but still held onto.");

    }

    displayCurrentOperand( [...calculationItems[0].toString().split("")] );

  } else {
    displayCurrentOperand();
  }
}

function displayCurrentOperand( latestInput = [...active] ) {
  console.log( "latest input: " );
  console.log( latestInput );
  if ( active[0] === "+" || active[0] === "-"
  || active[0] === "*" || active[0] === "/" ) {
    //activate light
  } else {
    let decimalTrim = false;
    currentDisplayOutput = latestInput.reduce( (prev, curr) => {
      if (curr === ".") {
        decimalTrim = true;
        return prev.concat( curr );
      } else if ( decimalTrim ) {
        decimalTrim = false;
        return prev.concat( curr );
      } else {
        return prev.concat( " " + curr );
      }
    }, "");
  }
  console.log( "Display looks like:" + currentDisplayOutput );
}
