import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { motion } from "motion/react";
let currentCalculation = 0;
let calculation = [];
const romNums = [
  { text: "I", value: 1 },
  { text: "V", value: 5 },
  { text: "X", value: 10 },
  { text: "L", value: 50 },
  { text: "C", value: 100 },
  { text: "D", value: 500 },
  { text: "M", value: 1000 },
];
const subtractionAllowed = [
  { text: "iv", value: 4 },
  { text: "ix", value: 9 },
  { text: "xl", value: 40 },
  { text: "xc", value: 90 },
  { text: "cd", value: 400 },
  { text: "cm", value: 900 },
];
const calcButton = (
  span = 1,
  { text, value },
  isAllowed
) => {
  const calculator = (text, value) => {
    isAllowed(text);
  };
  return (
    <motion.button
      type="button"
      key={text}
      onClick={() => calculator(text, value)}
      whileHover={{
        scale: 1.1,
        transition: { type: "spring", stiffness: 300 },
      }}
      whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 300 } }}
      title={value}
      className={`w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-${span}`}
    >
      <span className="text-center font-mono font-semibold text-zinc-300">
        {text}
      </span>
    </motion.button>
  );
};

function App() {
  const [screen, setScreen] = useState("");
  const [clearScreen, setClearScreen] = useState(false);
  const [calculated, setCalculated] = useState('')
  const [currentMix, setCurrentMix] = useState("");
  const [isNumber, setIsNumber] = useState(false)
  const [error, setError] = useState(false);
  const [placeValue, setPlaceValue] = useState(Infinity);
  const [subPairUsed, setSubPairUsed] = useState(false);

  //const maxLetterCount = 3;
  useEffect(() => {
    setScreen(isNumber ? calculated : calculated.toUpperCase());
  }, [calculated]);

  /** reset() clears the screen and resets all variables */
  /** reset() takes no variable */
  const reset = () => {
    setScreen("");
    setCurrentMix("");
    setSubPairUsed(false);
    setCalculated("")
    setPlaceValue(Infinity)
    currentCalculation = 0;
    calculation = [];
  };

  /** pushCalculation(symbol) is a helper function that pushes the currentCalculation and symbol to calculation(the array which eval evaluates) */
  /** Arguments:(symbol). This is either a +, -, *, / symbol being pushed */
  const pushCalculation = (symbol) => {
    if(screen == '' || symbol == screen.slice(screen.length - 1)){
      return;
    }
    setScreen(screen=>screen+symbol);
    setCurrentMix(""); 
    setSubPairUsed(false);
    calculation.push(currentCalculation, symbol); 
    //console.log(calculation.join(''))
    currentCalculation = 0;
  }

  /** forbiddenRepetition() ensures that letters not meant to be repeated aren't repeated */
  /** Arguments: (letter, length, arr). Letter is the current letter being evaluated, length is the length of arr and arr is the current mix of characters being checked for any invalid repetitions */
  const forbiddenRepetition = (letter, length, arr) => {
    let count = 0;
    let noRepeat = ["v", "l", "d"];
    if (!noRepeat.includes(letter.toLowerCase())) {
      return false;
    }
    for (let i = 0; i < length; i++) {
      if (arr[i].toLowerCase() == letter.toLowerCase()) {
        count++;
      }
    }
    return count > 0;
  };

  /** getValRomNums(text) is a helper function that converts a letter to it's equivalent value */
  /** Arguments: (text). text is the letter being converted */
  const getValRomNums = (text) => {
    //console.log(romNums[romNums.findIndex(el=>el["text"].toLowerCase() == text.toLowerCase())]?.value)
    return romNums[
      romNums.findIndex((el) => el["text"].toLowerCase() == text.toLowerCase())
    ]?.value;
  };

  /** evaluateSubtraction(current, position)  */
  const evaluateAddition = (current, position) => {
    if(current > 3999){
      setIsNumber(true)
      setCalculated(current);
      return;
    }
    if(evaluateSubtraction(current, position)) return;
    let int = parseInt(current / romNums[position].value);
    let remainder = current - (int * romNums[position].value)
    for(let i = 0; i < int; i++){
      //console.log(romNums[position])
      setCalculated(prev => prev + romNums[position].text);
      //console.log("calculated",romNums[position].text)
    }
    if(remainder != 0){
      //console.log(remainder);
      evaluateAddition(remainder, position-1);
    }
  }

  /** evaluateSubtraction(current, position) finds a subtractive pair within an number and converts it to its roman numeral equivalent letter */
  /** If there is no remainder it ends the program else it sends the remainder to evaluateAddition(current position) */
  /** Arguments:(Current, position). Current is the integer to be evaluated. Position is the current position in romNums[]  */
  const evaluateSubtraction = (current, position) => {
    //console.log(current, "current")
    let valueNoRemainderArr = Array.from(current.toString());
    //console.log(valueNoRemainderArr, "valueNoRemainderArr")
    let valueNoRemainder = parseInt(valueNoRemainderArr[0]) * (valueNoRemainderArr.length > 1 ? Math.pow(10, (valueNoRemainderArr.length - 1)) : 1);
    //console.log("(10 * (valueNoRemainderArr.length - 1))", Math.pow(10, (valueNoRemainderArr.length - 1)))
    //console.log(valueNoRemainder, "valueNoRemainder")
    let remainder = current - valueNoRemainder;
    let value = subtractionAllowed.findIndex(el => el.value === valueNoRemainder);
    if(value != -1){
      setCalculated(prev => prev + subtractionAllowed[value].text)

      if(remainder != 0){
        evaluateAddition(remainder, position)
      }
      return true;
    }
    return false;
  }


  /** isAllowed(current) checks whether a roman numeral is allowed or not */
  /** Arg: (Current) is the character currently being added to mix or the whole screen(if called by input) */
  const isAllowed = (current) => {
    let lastChar = current.slice(current.length - 1, current.length).toLowerCase();
    let lastCharValue = getValRomNums(lastChar);
    const length = currentMix.length;
    let characters = Array.from(currentMix);
    let lastSecondChar =
      length >= 1 ? characters[length - 1].toLowerCase() : "";

    /** moveAllowed() checks to see if the rules of addition and subtraction in roman numerals are being followed */
    /** moveAllowed() then adds up the calculation if the roman numeral is valid */
    /** moveAllowed() takes no argument */
    const moveAllowed = () => {
      if (lastCharValue > getValRomNums(lastSecondChar)) {
        let index = subtractionAllowed.findIndex(
          (el) => el.text == (lastSecondChar + lastChar).toLowerCase()
        );
        let indexPrevious = romNums.findIndex(
          (el) => el.text.toLowerCase() == lastSecondChar.toLowerCase()
        );

        if (index != -1) {
          setSubPairUsed(true);
          setPlaceValue((index + 1) % 2);
          currentCalculation += subtractionAllowed[index].value - romNums[indexPrevious].value;
          //console.log(currentCalculation);
          return true;
        }
      } else if (lastCharValue <= getValRomNums(lastSecondChar)) {
        currentCalculation += lastCharValue;
        //console.log(currentCalculation);
        return true;
      }
      return false;
    };

    if(clearScreen){
      setScreen("");
      setClearScreen(false);
    }

    

    if(length == 0 && romNums.some((val) => val["text"].toLowerCase() === lastChar)){
      currentCalculation += lastCharValue;
      setCurrentMix(lastChar[0].toUpperCase())
      setScreen(screen+lastChar[0].toUpperCase());
      return;
    }

    if (
      !romNums.some((val) => val["text"].toLowerCase() === lastChar) ||
      (length >= 3 &&
        lastChar === lastSecondChar &&
        lastChar === characters[length - 2].toLowerCase() &&
        lastChar === characters[length - 3].toLowerCase()) ||
      (length >= 2 &&
        lastCharValue > getValRomNums(lastSecondChar) &&
        lastCharValue > getValRomNums(characters[length - 2]))
    ) {
      console.log("Here1", romNums.some((val) => val["text"].toLowerCase() === lastChar, lastChar))
      setError(true);
      return;
    } else if (subPairUsed) {
      if (
        lastChar.toLowerCase() == characters[length - 2].toLowerCase() ||
        lastChar.toLowerCase() == characters[length - 1].toLowerCase()
      ) {
        console.log("Here2")
        setError(true);
        return;
      }
      if (
        (romNums.findIndex(
          (el) => el.text.toLowerCase() == lastChar.toLowerCase()
        ) +
          1) %
          2 ==
        placeValue
      ) {
        //console.log((romNums.findIndex(el=>el.text == lastChar)))
        console.log("Here3")
        setError(true);
        return;
      }
      setSubPairUsed(false);
      setPlaceValue(null);
    } else if (
      forbiddenRepetition(lastChar, length, characters) ||
      (length >= 1 && !moveAllowed())
    ) {
        console.log("Here4")
      setError(true);
      return;
    } else {
      setCurrentMix(currentMix + lastChar[0].toUpperCase())
      setScreen(screen + lastChar[0].toUpperCase());
    }
  };
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <>
      <div className="w-screen h-screen bg-[#130e0df7] flex flex-col justify-center items-center">
        <div className="w-50 h-30 border-2 text-center flex flex-col border-yellow-400 rounded-lg p-3">
          <span className="text-white font-semibold text-2xl pb-3">Roman Casio</span>
          <div>
            <motion.input
              type="text"
              className={`w-full caret-transparent h-10 text-lg p-3 text-white  ${!error ? 'focus:border-2 focus:border-sky-500' : 'outline-none'}`}
              onChange={(e) => {
                const char = e.target.value;
                let lastChar = char.slice(char.length - 1, char.length).toLowerCase();
                if(['*', '+', '/', '-'].includes(lastChar)){
                  pushCalculation(lastChar);
                  return 
                }
                return isAllowed(e.target.value);
              }}
              placeholder="MM + XXV = 2025"
              animate={{
                x: error
                  ? [
                      0, -1, -3, -5, -3, -1, 0, 1, 3, 5, 3, 1, 0, -1, -3, -5,
                      -3, -1, 0, 1, 3, 5, 3, 1, 0,
                    ]
                  : [],
                border: error ? "1px solid red" : "1px solid white",
              }}
              transition={{ duration: 0.5 }}
              value={screen}
            />
          </div>
        </div>
        <div className="w-50 min-h-30 border-3 shadow-2xl border-t-transparent border-l-[#bb7f57] -mt-1 border-b-[#bb7f57] border-r-[#bb7f57] flex justify-center ">
          <div className="grid grid-cols-3 gap-4 pt-5 pb-5">
            {romNums.map((value, index) => {
              return calcButton(1, value, isAllowed);
            })}
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={()=>{pushCalculation("+")}}
              className="w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer"
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                +
              </span>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={()=>{pushCalculation("-")}}
              className="w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer"
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                -
              </span>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={()=>{pushCalculation("*")}}
              className="w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer"
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                *
              </span>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              className="h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-2"
              onClick={reset}
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                Reset
              </span>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={()=>{pushCalculation("/")}}
              className="w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer"
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                /
              </span>
            </motion.div>
            <motion.div
              whileHover={{
                scale: 1.1,
                transition: { type: "spring", stiffness: 300 },
              }}
              onClick={()=>{calculation.push(currentCalculation);evaluateAddition(Math.round(eval(calculation.join(''))),romNums.length - 1); setCurrentMix(""); currentCalculation=0; setClearScreen(true); }}
              className="h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-2"
            >
              <span className="text-center font-mono font-semibold text-zinc-300">
                =
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
