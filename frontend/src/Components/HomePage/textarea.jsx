import { useState, useRef, useEffect } from "react";

const TextArea = ({ onSendData, initialValue }) => {
  const [text, setText] = useState('');
  const textRef = useRef();


  useEffect(() => {
    if (initialValue !== undefined && initialValue !== text) {
      setText(initialValue);
    }
  }, [initialValue]);

  const handleInput = (e) => {
    const value = e.target.value;
    setText(value);

    const textArea = textRef.current;
    if (textArea) {
      textArea.style.height = "auto";
      textArea.style.height = `${textArea.scrollHeight}px`;
    }

    onSendData(value);
  };

 

    // ✅ Extract only links and ignore other text
    const linkifyText = (text) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g;
      const matches = text.match(urlRegex);
  
      if (!matches) return '';
  
      return matches
        .map(url => `<a href="${url}" target="_blank" class="text-blue-600 underline block truncate">${url}</a>`)
        .join('');
    };

    

  return (
    <>
      <textarea ref={textRef} value={text}
        onChange={handleInput}
        className={`w-full h-64  outline-none p-4 mt-4 placeholder:text-2xl resize-none bg-white`}
        placeholder="Type Something"
      />
      
      {/* 👇 Preview with links below the textarea */}
      <div className="mt-4 p-4 mx-2 "><span dangerouslySetInnerHTML={{ __html: linkifyText(text) }} ></span></div>
     
    </>
  );
};


export default TextArea;
