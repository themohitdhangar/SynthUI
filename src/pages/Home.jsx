import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { FaHandHoldingHeart } from "react-icons/fa";
import Select from "react-select";
import { BsStars } from "react-icons/bs";
import { LuCodeXml } from "react-icons/lu";
import { IoCloseSharp, IoCopy } from "react-icons/io5";
import { PiExportBold } from "react-icons/pi";
import { MdOutlineAutorenew } from "react-icons/md";
import { MdOpenInNew } from "react-icons/md";
import Editor from "@monaco-editor/react";
import { GoogleGenAI } from "@google/genai";
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';

const Home = () => {
  const options = [
    { value: "html-css", label: "HTML + CSS" },
    { value: "html-tailwind", label: "HTML + Tailwind CSS" },
    { value: "html-bootstrap", label: "HTML + Bootstrap" },
    { value: "html-css-js", label: "HTML + CSS + JS" },
  ];

  const [outputScreen, setOutputScreen] = useState(false);
  const [tab, setTab] = useState(1);
  const [prompt, setPrompt] = useState("");
  const [framwork, setFramwork] = useState(options[0]);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isNewTapOpen, setisNewTapOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  function extractCode(response) {
    const match = response.match(/```(?:\w+)?\n?([\s\S]*?)```/);
    return match ? match[1].trim() : response.trim();
  }

  // `GEMINI_API_KEY`.
  const ai = new GoogleGenAI({apiKey: "AIzaSyCs6F15ma06u4OrQ0FQ6c8_fWm_YVgTOOM"});

  async function getResponse() {

    if (!prompt.trim()) return toast.error("Please describe your component first");

    setLoading(true);
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `You are an experienced programmer with expertise in web development and UI/UX design. You create modern, animated, and fully responsive UI components. You are highly skilled in HTML, CSS, Tailwind CSS, Bootstrap, JavaScript, React, Next.js, Vue.js, Angular, and more.

Now, generate a UI component for: ${prompt}  
Framework to use: ${framwork.value}  

Requirements:  
- The code must be clean, well-structured, and easy to understand.  
- Optimize for SEO where applicable.  
- Focus on creating a modern, animated, and responsive UI design.  
- Include high-quality hover effects, shadows, animations, colors, and typography.  
- Return ONLY the code, formatted properly in **Markdown fenced code blocks**.  
- Do NOT include explanations, text, comments, or anything else besides the code.  
- And give the whole code in a single HTML file.`,
  });

  console.log(response.text);
  setCode(extractCode(response.text));
  setOutputScreen(true);
  setLoading(false);
 };

 const copyCode = async () => {
   try {
      await navigator.clipboard.writeText(code);
      toast.success("Code copied to clickboard")
    } catch (err) {
      toast.error("Failed to copy")
    }
  };

const downloadFile = () => {
  const fileName = "SynthUI-Code.html"
  const blob = new Blob([code], { type: 'text/plain' });
  let url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
  toast.success("File downloaded");
}


  return (
    <>
      <Navbar />

      <div className="flex items-center px-[100px] justify-between gap-[30px]">
        <div className="left w-[50%] h-[auto] py-[31px] rounded-xl bg-[#141319] mt-5 p-[20px]">
          <h3 className="text-[25px] font-semibold special-text">
            AI component generator
          </h3>
          <p className="flex text-[gray] mt-2 text-[15px]">
            Describe your idea and let AI will code for you &nbsp;{" "}
            <FaHandHoldingHeart className="mt-1" />
          </p>

          <p className="text-[15px] font-[700] mt-4">Framwork</p>
          <Select
            className="mt-2"
            options={options}
            placeholder="Select"
            styles={{
              control: (base, state) => ({
                ...base,
                backgroundColor: "#0d0d0d",
                borderColor: state.isFocused ? "#6366f1" : "#222",
                boxShadow: state.isFocused ? "0 0 0 1px #6366f1" : "none",
                "&:hover": { borderColor: "#6366f1" },
                color: "#fff",
                borderRadius: "0.5rem",
                minHeight: "44px",
                transition: "all 0.2s ease",
              }),
              menu: (base) => ({
                ...base,
                backgroundColor: "#0d0d0d",
                border: "1px solid #222",
                borderRadius: "0.5rem",
                overflow: "hidden",
                marginTop: "4px",
              }),
              option: (base, state) => ({
                ...base,
                backgroundColor: state.isSelected
                  ? "#1f2937"
                  : state.isFocused
                  ? "#111827"
                  : "#0d0d0d",
                color: state.isSelected ? "#fff" : "#d1d5db",
                padding: "10px 12px",
                cursor: "pointer",
                transition: "background 0.2s ease",
              }),
              singleValue: (base) => ({
                ...base,
                color: "#f9fafb",
              }),
              input: (base) => ({
                ...base,
                color: "#fff",
              }),
              placeholder: (base) => ({
                ...base,
                color: "#6b7280",
              }),
              dropdownIndicator: (base, state) => ({
                ...base,
                color: state.isFocused ? "#818cf8" : "#9ca3af",
                transition: "color 0.2s ease",
                "&:hover": { color: "#a5b4fc" },
              }),
              indicatorSeparator: (base) => ({
                ...base,
                backgroundColor: "#222",
              }),
              menuList: (base) => ({
                ...base,
                padding: 0,
              }),
            }}
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary25: "#111827",
                primary: "#6366f1",
                neutral0: "#0d0d0d",
                neutral80: "#f9fafb",
              },
            })}
            onChange={(e)=>{setFramwork(e.value)}}
          />
          <p className="text-[15px] font-[700] mt-5">Describe Your idea</p>
          <textarea onChange={(e)=> {setPrompt(e.target.value)}} value={prompt}
            className="w-full min-h-[200px] rounded-xl bg-[#0d0d0d] mt-2 p-[10px] resize-none overflow-hidden"
            placeholder="Describe your idea..."
          ></textarea>
          <div className="flex items-center justify-between">
            <p className="text-[gray]">Click for generate</p>
            <button onClick={getResponse} className="genrate flex items-center p-[15px] rounded-lg border-0 bg-gradient-to-r from-purple-400 to-purple-600 mt-3 px-[20px] gap-[10px] transition-all hover:opacity-[.8] ">
              {
                loading === false ?
                <>
                 <i>
                  <BsStars />
                 </i>
                </> : ""
              }
              {
                loading === true ?
                <>
                  <ClipLoader size={20} color="white" />
                </> : ""
              }
              Generate
            </button>
          </div>
        </div>
        <div className="right relative w-[50%] h-[80vh] bg-[#141319] mt-5 rounded-xl overflow-hidden">
          {
            outputScreen === false ? 
            (
            <>      
              <div className="skeleton w-full h-full flex items-center flex-col justify-center">
                <div className="circul p-[20px] w-[70px] flex items-center justify-center text-[30px] h-[70px] rounded-[50%] bg-gradient-to-r from-purple-400 to-purple-600">
                  <LuCodeXml />
                </div>
                <p className="text-[16px] text-[gray] mt-3">
                  Your code will appear here.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="top bg-[#17171C] w-full h-[60px] flex items-center gap-[15px] px-[20px]">
                <button onClick={()=>{setTab(1)}}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 1 ? "bg-[#333]" : ""
                  }`}
                >
                  Code
                </button>
                <button onClick={()=>{setTab(2)}}
                  className={`btn w-[50%] p-[10px] rounded-xl cursor-pointer transition-all ${
                    tab === 2 ? "bg-[#333]" : ""
                  }`}
                >
                  Preview
                </button>
              </div>

              <div className="top-2 bg-[#17171C] w-full h-[60px] flex items-center justify-between gap-[15px] px-[20px]">
                <div className="left">
                  <p className="font-bold">Code Editor</p>
                </div>
                <div className="right flex items-center gap-[10px]">

                  {
                    tab === 1 ?
                    <>
                       <button className="copy  w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={copyCode}><IoCopy /></button>
                       <button className="export w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={downloadFile}><PiExportBold /></button>
                    </> :
                    <>
                       <button className="new-tab  w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => {setisNewTapOpen(true)}}><MdOpenInNew /></button>
                       <button className="refresh w-[40px] h-[40px] rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => setRefreshKey(prev => prev + 1)}><MdOutlineAutorenew /></button>
                    </>
                  }
                  </div>
              </div>

              
              {/* Editor / Preview */}
                <div className="h-full">
                  {tab === 1 ? (
                    <Editor value={code} height="100%" theme='vs-dark' language="html" />
                   ) : (
                    <iframe key={refreshKey} srcDoc={code} className="w-full h-full bg-white text-black"></iframe>
                  )}
                </div>

              <div className="editor h-full">
              </div>
            </>
          )}
        </div>
      </div>
      {  
        isNewTapOpen === true ?
        <>
          <div className="fulltab absolute left-0 top-0 right-0 bottom-0 bg-white w-screen min-h-screen overflow-auto">
            <div className="top w-full h-[60px] flex items-center justify-between px-[20px]">
              <div className="left">
                <p className="font-bold text-black">Preview</p>
              </div>
              <div className="right flex items-center gap-[10px]">
                <button className="close w-[40px] h-[40px] text-black rounded-xl border-[1px] border-zinc-800 flex items-center justify-center transition-all hover:bg-[#333]" onClick={() => { setisNewTapOpen(false) }}><IoCloseSharp /></button>
              </div>
            </div>
            <iframe srcDoc={code} className="w-full h-full"></iframe>
          </div>
        </> 
        : ""
      }
    </>
  );
};

export default Home;
