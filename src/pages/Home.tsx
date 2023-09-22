import { useState, useRef, useEffect, SetStateAction } from "react";
import EthLogo from "../assets/images/eth-logo.svg";
import "../App.css";


export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isChatMode, setIsChatMode] = useState(false);
  // const [isPromptOpen, setIsPromptOpen] = useState(false);
  // const [prompt, setPrompt] = useState("");
  // const [status, setStatus] = useState("");
  // const [messages, setMessages] = useState([]);
  // const [message, setMessage] = useState("");
  // const [echartsRes, setEchartsRes] = useState({});

  const [isAnimating, setIsAnimating] = useState(false); // 使用另一个值来跟踪，只在isChatMode真正改变时才更新按钮的位置
  useEffect(() => {
    setIsAnimating(true);
  }, [isChatMode]); 

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [text, setText] = useState('');

  const handleTextareaChange = (event: { target: { value: SetStateAction<string>; }; }) => {
    setText(event.target.value);

    if (textareaRef.current) {
      const currentTextarea = textareaRef.current as HTMLTextAreaElement;

      // 重置高度
      currentTextarea.style.height = 'auto';
      
      // 设置为scrollHeight，但不超过最大高度，这里使用256px作为示例值
      currentTextarea.style.height = `${Math.min(currentTextarea.scrollHeight, 256)}px`;

      // 更新尺寸到state
      setDimensions({
        width: currentTextarea.offsetWidth,
        height: parseInt(currentTextarea.style.height)
      });
    }
  };

  
  return (
    <>
      <div id="app" className="min-h-screen flex flex-col">
        <div className="text-center">
          <div className="my-8 flex justify-center items-center">
            <img
              alt="Vue logo"
              src={EthLogo}
              className="w-24 h-24 "
            />
            <div className="text-4xl font-bold ml-3">ETH问数成章</div>
          </div>
          <textarea
            ref={textareaRef}
            rows={1}
            onChange={handleTextareaChange}
            style={{ width: '100%', height: dimensions.height }}
            className={`py-1.5 px-1 mb-1 mt-1 mx-auto min-w-[40%] max-w-xs rounded border-2 shadow-lg focus:shadow-xl transition-transform duration-500 ease-in-out ${isChatMode ? 'transform translate-y-20' : 'transform translate-y-0'} resize-none overflow-y-auto`}
            placeholder="请输入内容..."
          ></textarea>
          <div className={`flex justify-center space-x-5 mt-6 mb-4`}>
            <button style={isChatMode ? { transform: `translateY(${-dimensions.height/16 - 2.5}rem) translateX(${dimensions.width/196 + 2.5}rem)`  } : {}} 
              onTransitionEnd={() => {
                console.log("Transition ended for button 1");
                setIsAnimating(false);
              }}
              className={`btn btn-primary shadow-sm transition-transform duration-500 ease-in-out`} 
              onClick={() => setIsChatMode(!isChatMode)}>切换到{isChatMode ? "查询模式" : "聊天模式"}
            </button>
            <button style={isChatMode ? { transform: `translateY(${-dimensions.height/32 + 1.5}rem) translateX(${dimensions.width/30 + 5})`  } : {}} 
              onTransitionEnd={() => {
                console.log("Transition ended for button 2");
                setIsAnimating(false);
              }}
              className={`btn btn-primary shadow-sm transition-transform duration-500 ease-in-out`}>{isChatMode ? "发送" : "查询"}
            </button>
          </div>
          <div className="my-2 py-1"></div>
          {/* <Illustration /> */}
          {/* <PromptWindow /> */}
          <p className="mt-5 mb-3">
            连接状态：<span id="status">状态内容</span>
          </p>
          <div className="chat-box">
            {/* 聊天信息列表，暂时留空 */}
          </div>
          <p className="mb-3">
            GPT回复：<span id="message">消息内容</span>
          </p>
          <p className="mt-5 mb-3">
            {/* <EchartsComponent /> */}
          </p>
        </div>
      </div>
    </>
  );
}