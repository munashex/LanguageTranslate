import {useState} from 'react' 
import { TbArrowsExchange2 } from "react-icons/tb";


const Translate = () => {
// const [language, setLanguage] = useState('') 
const [rightLanguage, setRightLanguage] = useState('')

    return (
        <div className="mt-10"> 
            {/* on small screens and md screens */}

            <div className="flex justify-between px-9 py-2 lg:hidden items-center"> 
            <h1 className="text-lg font-bold">English</h1> 
            <span className="border-2 p-1 rounded-full"><TbArrowsExchange2 size={29}/></span> 
            <h1 className="text-lg font-bold">Spanish</h1>
            </div>

            <div className="flex flex-col lg:hidden">
              <div>
               <textarea 
               className="border-2 w-full placeholder:text-lg placeholder:font-bold border-slate-200 h-36 overflow-y-auto py-3 px-3 outline-none" 
               placeholder="Type the text to translate"
               />
              </div> 

              <div className="border-b-2  w-full h-36 border-slate-200 overflow-y-auto py-3 px-3"> 
            
              </div> 

            </div>  


        </div>
    )
}

export default Translate