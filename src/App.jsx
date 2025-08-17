import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { motion } from 'motion/react'
let currentCalculation = 0
const romNums = [{text:'I', value: 1}, {text:'V', value: 5}, {text:'X', value: 10}, {text:'L', value: 50}, {text:'C', value: 100}, {text:'D', value: 500}, {text:'M', value: 1000}];

const calcButton = (span=1, {text, value}, setScreen, setError, isAllowed) => {

  const calculator = (text, value) => {
    isAllowed(screen + text)
  }
  return (
    <motion.div key={text} onClick={()=>calculator(text, value)} whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} whileTap={{scale:0.9, transition:{type: "spring", stiffness: 300}}} title={value} className={`w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-${span}`}><span className='text-center font-mono font-semibold text-zinc-300'>{text}</span></motion.div>
  )
}

function App() {
  const [screen, setScreen] = useState('');
  const [error, setError] = useState(false);
  const maxLetterCount = 3;
  const reset = () => {
    setScreen('');
  }
  const letterCount = (letter, length, arr) => {
    let count = 0;
    for(let i=0; i < length; i++){
      if(arr[i].toLowerCase() == letter.toLowerCase()){
        count++;
      }
    }
    return count;
  }
  const getValRomNums = (text) => {
    console.log(romNums[romNums.findIndex(el=>el["text"].toLowerCase() == text.toLowerCase())]?.value)
    return romNums[romNums.findIndex(el=>el["text"].toLowerCase() == text.toLowerCase())]?.value
  }
  const isAllowed = (current) => {
    let lastChar = current.slice(current.length - 1, current.length).toLowerCase();
    let lastCharValue = getValRomNums(lastChar);
    let characters = Array.from(screen);
    const length = screen.length;
    {
      if (!romNums.some(val=>val['text'].toLowerCase() == lastChar) || letterCount(lastChar, length, characters) >= maxLetterCount
    ||  (length >= 2 && lastCharValue > getValRomNums(characters[length - 1]) && lastCharValue > getValRomNums(characters[length - 2]))){
        setError(true)
        return;
      }else{
        setScreen(screen+lastChar[0].toUpperCase());
        
      }
    }
  }
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  return (
    <>
     <div className="w-screen h-screen bg-[#130e0df7] flex flex-col justify-center items-center">
      <div className='w-50 h-30 border-2 text-center border-yellow-400 rounded-lg p-3'>
        <span className='text-white font-semibold text-2xl'>Roman Casio</span>
        <div>
        <motion.input type="text" className='w-full caret-transparent h-10 text-lg outline-none p-3 text-white border' 
          onChange={(e)=>{return isAllowed(e.target.value)}} 
          animate={{x: error ? [0, -1, -3, -5, -3, -1, 0, 1, 3, 5, 3, 1, 0, -1, -3, -5, -3, -1, 0, 1, 3, 5, 3, 1, 0] : [], border: error ? '1px solid red' : '1px solid white'}} 
          transition={{duration: 0.5}}  
          value={screen}/>
        </div>
      </div>
      <div className='w-50 min-h-30 border-3 shadow-2xl border-t-transparent border-l-[#bb7f57] -mt-1 border-b-[#bb7f57] border-r-[#bb7f57] flex justify-center'>
        <div className='grid grid-cols-3 gap-4 pt-5 pb-5'>
          {romNums.map((value, index)=>{return calcButton(1, value, setScreen, setError, isAllowed)})}
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer'><span className='text-center font-mono font-semibold text-zinc-300'>+</span></motion.div>
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer'><span className='text-center font-mono font-semibold text-zinc-300'>-</span></motion.div>
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer'><span className='text-center font-mono font-semibold text-zinc-300'>*</span></motion.div>
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-2' onClick={reset}><span className='text-center font-mono font-semibold text-zinc-300'>Reset</span></motion.div>
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='w-10 h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer'><span className='text-center font-mono font-semibold text-zinc-300'>/</span></motion.div>
          <motion.div whileHover={{scale:1.1, transition:{type: "spring", stiffness: 300}}} className='h-10 bg-[#ac6b26] text-center flex justify-center items-center cursor-pointer col-span-2'><span className='text-center font-mono font-semibold text-zinc-300'>=</span></motion.div>
        </div>
      </div>
     </div>
    </>
  )
}

export default App
