import {useState} from 'react' 
import { TbArrowsExchange2 } from "react-icons/tb";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io" 
import { languages } from '../data/language';




const Translate = () => {
const [openLeftLanguages, setOpenLeftLanguages]  = useState(false)   
const [openRightLanguages, setOpenRightLanguages] = useState(false)

const leftLanguage = (lang: string) => {
    if(localStorage.getItem('leftLanguage')) {
     localStorage.removeItem('leftLanguage')
    }
    localStorage.setItem('leftLanguage', lang) 
    setOpenLeftLanguages(false)
}

const rightLanguage = (lang: string) => {
    if(localStorage.getItem('rightLanguage')) {
     localStorage.removeItem('rightLanguage')
    }
    localStorage.setItem('rightLanguage', lang) 
    setOpenRightLanguages(false)
}



 
const leftLanguageFromStorage = localStorage.getItem('leftLanguage') 
const rightLanguageFromStorage = localStorage.getItem('rightLanguage')

    return (
        <div className="mt-10"> 
            {/* on small screens and md screens */}

            <div className="flex justify-between px-3 py-2 lg:hidden items-center"> 
            <h1 onClick={() => setOpenLeftLanguages(!openLeftLanguages)} className="text-lg font-bold inline-flex items-center gap-1 cursor-pointer">
            {leftLanguageFromStorage || 'English'} {openLeftLanguages ? <IoIosArrowUp/> : <IoIosArrowDown/>}</h1> 
            
            <span className="border-2 p-1 rounded-full"><TbArrowsExchange2 size={29}/></span>

            <h1 onClick={() => setOpenRightLanguages(!openRightLanguages)} className="text-lg font-bold inline-flex items-center gap-1 cursor-pointer"> 
            {rightLanguageFromStorage || 'Spanish'}  {openRightLanguages ? <IoIosArrowUp/> : <IoIosArrowDown/>}</h1>
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
            
            <div className="absolute top-24 w-full overflow-y-auto">
            {
            openLeftLanguages ? (
            <div className="grid lg:hidden grid-cols-2 p-2 py-5  gap-1 bg-[#F7F7F7]"> 
             {languages.map((lang) => (
            <div key={lang.code}> 
             <h1 className="cursor-pointer" onClick={() => leftLanguage(lang.language)}>{lang.language}</h1>
            </div>
             ))}
            </div>
            )
            : 
            null
            }
            </div>


            <div className="absolute top-24 w-full overflow-y-auto">
            {
             openRightLanguages ? (
            <div className="grid lg:hidden grid-cols-2 p-2 py-5  gap-1 bg-[#F7F7F7]"> 
             {languages.map((lang) => (
            <div key={lang.code}> 
             <h1 className="cursor-pointer" onClick={() => rightLanguage(lang.language)}>{lang.language}</h1>
            </div>
             ))}
            </div>
            )
            : 
            null
            }
            </div>
           
        </div>
    )
}

export default Translate