import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { m, motion } from "motion/react";
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
  const [error, setError] = useState(false);
  const [placeValue, setPlaceValue] = useState(Infinity);
  //const maxLetterCount = 3;
  const [subPairUsed, setSubPairUsed] = useState(false);
  const reset = () => {
    setScreen("");
    setCurrentMix("");
    setSubPairUsed(false);
    currentCalculation = 0;
    calculation = [];
  };
  const pushCalculation = (symbol) => {
    setScreen(screen=>screen+symbol);
    setCurrentMix(""); 
    calculation.push(currentCalculation, symbol); 
    //console.log(calculation.join(''))
    currentCalculation = 0;
  }
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
  const getValRomNums = (text) => {
    //console.log(romNums[romNums.findIndex(el=>el["text"].toLowerCase() == text.toLowerCase())]?.value)
    return romNums[
      romNums.findIndex((el) => el["text"].toLowerCase() == text.toLowerCase())
    ]?.value;
  };
  const evaluateAddition = (current, position) => {
    if(evaluateSubtraction(current)) return;
    let modulus = parseFloat(current / romNums[position].value);
    let remainder = current - (modulus * romNums[position].value)
    console.log("current:", current, "rremainder:", romNums[position].value)
    for(let i = 0; i < modulus; i++){
      setCalculated(calculated+romNums[position].text)
      console.log(calculated)
    }
    if(remainder != 0){
      evaluateAddition(remainder, position-1);
    }
  }

  const evaluateSubtraction = (current) => {
    let value = subtractionAllowed.findIndex(el => el.value === current);
    if(value != -1){
      setCalculated(calculated+subtractionAllowed[value].value)
      return true;
    }

  }
  const isAllowed = (current) => {
    let lastChar = current.toLowerCase();
    let lastCharValue = getValRomNums(lastChar);
    const length = currentMix.length;
    let characters = Array.from(currentMix);
    let lastSecondChar =
      length >= 1 ? characters[length - 1].toLowerCase() : "";
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
      setError(true);
      return;
    } else if (subPairUsed) {
      if (
        lastChar.toLowerCase() == characters[length - 2].toLowerCase() ||
        lastChar.toLowerCase() == characters[length - 1].toLowerCase()
      ) {
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
        setError(true);
        return;
      }
      setSubPairUsed(false);
      setPlaceValue(null);
    } else if (
      forbiddenRepetition(lastChar, length, characters) ||
      (length >= 1 && !moveAllowed())
    ) {
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
              className="w-full caret-transparent h-10 text-lg outline-none p-3 text-white border"
              onChange={(e) => {
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
        <div className="w-50 min-h-30 border-3 shadow-2xl border-t-transparent border-l-[#bb7f57] -mt-1 border-b-[#bb7f57] border-r-[#bb7f57] flex justify-center">
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
              onClick={()=>{calculation.push(currentCalculation);evaluateAddition(eval(calculation.join('')),romNums.length - 1); setCurrentMix(""); currentCalculation=0; setClearScreen(true); }}
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
