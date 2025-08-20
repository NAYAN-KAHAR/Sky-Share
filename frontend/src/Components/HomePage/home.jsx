import { useEffect, useState } from "react";
import TextArea from "./textarea";
import File from "./file";
import axios from 'axios';
import Cookies from 'js-cookie';
import { nanoid } from 'nanoid';
import { IoIosMenu } from "react-icons/io";
import { BsFileRichtext  } from "react-icons/bs";

import { FaLongArrowAltDown } from "react-icons/fa";
import { BsCloudDownloadFill } from "react-icons/bs";
import { MdDelete } from "react-icons/md";

import { ToastContainer, toast } from 'react-toastify';


const HomePage = () => {
    const [isText, setIsText] = useState('text');
    const [textData, setTextData] = useState('');
    const [receiveData, setReceiveData] = useState('');
    const [ownerHash, setOwnerHash] = useState(null); // ✅ use state to wait for cookie
    const [showFile, setShowFile] = useState([]);
    const [loader, setLoader] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [spinner, setSpinner] = useState(false);

    const handleChildData = (data) => {
      setTextData(data);
    };
  
    // ✅ Read cookie (or create) after component mounts
    useEffect(() => {
      let hash = Cookies.get('ownerHash');
      if (!hash) {
        hash = nanoid(10);
        Cookies.set('ownerHash', hash, { expires: 365 });
      }
      setOwnerHash(hash);
    }, []);
  
  
  // get text/files
  const getTextContent = async () => {
     if (!ownerHash || isText !== 'text') return;
     setLoader(true);
     try {
        const res = await axios.get(`${import.meta.env.VITE_SERVAR_URL}/api/text`, {
           params: { ownerHash } });

        const files = res.data?.textContent?.files;
        // console.log(files);
        const fetchedText = res.data?.textContent?.text || '';
        // setReceiveData(data);
        setTextData(fetchedText);
        setShowFile(files || []);
        setLoader(false);
      } catch (err) {
          console.log(err);
      }
       finally {
       setLoader(false); // ✅ stop loader no matter what
  }
  };


const fetchFiles = async () => {
  setLoader(true); // start loader
  if (!ownerHash) return;

  try {
    const res = await axios.get(`${import.meta.env.VITE_SERVAR_URL}/api/text`);
    const files = res.data?.textContent?.files || [];
    setShowFile(files); 

  } catch (err) {
    console.log('Fetch files error:', err);
  } finally {
    setLoader(false); // ✅ stop loader no matter what
  }
};

    // ✅ Fetch text content once ownerHash is ready
useEffect(() => {
  if (!ownerHash) return;

  if (isText === 'text') {
    getTextContent();
  } else {
    fetchFiles();
  }
}, [ownerHash, isText]);

      
  
  // ✅ Save text to server
    const handleTextContent = async () => {
      if (!textData || textData.trim() === '') return;
      setSpinner(true);
      try {
        const res = await axios.post(`${import.meta.env.VITE_SERVAR_URL}/api/textpost`, { ownerHash, textData });
        // console.log(res.data);
        if(res.data){
          setSpinner(false);
        }
      } catch (err) {
        console.log(err);
      }
    };
  

    // file handle to server
const handleFile = async (file) => {
  const toastId = toast.loading("Uploading...", { duration: Infinity });
  setLoading(true);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('ownerHash', ownerHash);

  try {
    const res =  await axios.post(`${import.meta.env.VITE_SERVAR_URL}/api/textpost`, formData);
    
    toast.dismiss(toastId); // 🔥 Dismiss loading toast
    await fetchFiles()
    toast.success("Uploaded successfully!");
    
    setShowFile(prev => {
      const exists = prev.some(f => f.filename === file.name);
      return exists ? prev : [...prev, res.data.file];
    });
  } catch (err) {
    toast.dismiss(toastId); // 🔥 Dismiss loading toast
    toast.error("Upload failed");
  } finally {
    setLoading(false);
  }
};


// files short name for showing 
const getShortFileName = (filename) => {
   const [name, ext] = filename.split('.'); // Split at the first dot
  return `${name.split(/[-_ ]+/).map(w => w[0]).join('').toLowerCase()}.${ext}`;
};
    
const handleClear = () => setTextData("");

// images select logic
const toggleSelectFile = (filename) => {
  setSelectedFiles(prev =>
    prev.includes(filename)
      ? prev.filter(f => f !== filename)
      : [...prev, filename]
  );
};

// Images Dowload logic
const handleDownloadSelected = async () => {
  for (const filename of selectedFiles) {
    const file = showFile.find(f => f.filename === filename);
    if (file) {
      try {
        const response = await fetch(file.fileUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = file.filename || 'download.jpg';
        document.body.appendChild(link); // for Firefox
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url); // cleanup
      } catch (err) {
        console.error(`Failed to download ${file.filename}`, err);
      }
    }
  }
};



// Delete logic 
const handleDeleteSelected = async () => {
  try {
    await axios.post(`${import.meta.env.VITE_SERVAR_URL}/api/deleteFiles`, {
      ownerHash,
      filenames: selectedFiles
    });

    setShowFile(prev => prev.filter(f => !selectedFiles.includes(f.filename)));
    setSelectedFiles([]); // clear selection
    toast.success('deleted successfully')
  } catch (err) {
    console.log('Delete error', err);
  }
};


    return(
        <>
    <ToastContainer />
    <div className="flex lg:hidden sm:hidden mb:hidden  w-[100%]  lg:w-[70%] mb:w-[90%] sm:w-[90%] mx-auto   justify-between items-center mt-10 p-2 ">
    
     <div>
         {isText === "text" && ( <div className="w-full mx-6">
                <h1 className="text-4xl font-extrabold ">Text</h1>
            </div>)}
          {isText === "file" && (<div className="w-full mx-6">
                 <h1 className="text-4xl font-extrabold ">Files</h1>
          </div>)}
                  
     </div>

     <div className="flex justify-end gap-4 items-center">
       
          <IoIosMenu size={40} onClick={() => setIsText('text')} 
            className={`${isText === "text" ? 'text-blue-400' : ''} cursor-pointer`}  
          />
     
          <BsFileRichtext  size={30} onClick={() => setIsText('file')} 
            className={`${isText === "file" ? 'text-blue-400' : ''} cursor-pointer`} 
          />
      
      </div>
</div>



    <div className={`flex flex-col w-full sm:mt-10 lg:mt-10 mb:mt-10 mt-3 mx-auto  p-6  rounded-lg min-h-[500px] 
    lg:w-[70%] mb:w-[90%] sm:w-[90%] 'bg-white shadow-2xl`}>

        <div className="flex mb-4">
        {/* Sidebar */}
            <div className="w-1/12 hidden lg:block sm:block mb:block">

              <IoIosMenu  size={40} onClick={() => setIsText('text')} alt="" width={50} className={`${isText === "text" ? 'text-blue-400' : ''} cursor-pointer` }  />
            
              <BsFileRichtext  size={40} onClick={() => setIsText('file')} alt="logo" width={30} className={`${isText === "file" ? 'text-blue-400' : ''} mt-10 cursor-pointer`} />
                
            </div>

            {/* Main Content */}
           {isText === "text" && ( <div className="w-full mx-6">
                <h1 className="hidden lg:block sm:block mb:block text-4xl font-bold TEXT">Text</h1>
                {loader ? <div className="flex items-center justify-center">
                    <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
                     </div>: <TextArea onSendData={handleChildData} initialValue={textData} />
                  }

            </div>)}


            {isText === "file" && (<div className="w-full mx-6">
              <div className="flex justify-between">
                    <h1 className="hidden lg:block sm:block mb:block text-4xl font-bold ">Files</h1>
                   {showFile.length > 0 && ( <div className="w-full justify-between  flex items-center
                    mb:gap-4 lg:gap-4 sm:gap-4 lg:justify-end  md:justify-end  sm:justify-end">

                 <p className="text-sm cursor-pointer flex items-center gap-1" onClick={handleDownloadSelected}> 
                    <BsCloudDownloadFill size={20} /> <span>Download</span>
                    </p> 

                  <div className="text-sm cursor-pointer text-red-500 flex items-center gap-1"
                   onClick={handleDeleteSelected}>  <MdDelete size={20}/> <span>Delete</span>
                </div>
                     
                     </div>)}

                  </div>
                
                
                 {loader ? (<div className="flex items-center justify-center">
                    <div className="mt-6 h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-500 border-t-transparent"></div>
                     </div>) : (
                      showFile.length > 0 ?  <div className="w-full flex gap-3 mt-10 flex-wrap justify-center md:justify-start">
                 {showFile?.map((f, i) =>
                        f?.filename && f?.fileUrl ? (
                        <div key={i} onClick={() => toggleSelectFile(f.filename)}  className={`p-1 flex items-center flex-col border rounded cursor-pointer ${
                          selectedFiles.includes(f.filename) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}>
                        <img src={f.fileUrl} alt="img" className="w-28 h-25 object-cover rounded" />
                       <p>{getShortFileName(f.filename)}</p>
                       </div>
                       ) : null
                      )}

               
                  <File handleFile = {handleFile} size='small'/>
                </div> : <File handleFile = {handleFile} /> 
                )}
               

            </div>)

            }   
        </div>

        {/* Buttons at Bottom Left */}
       {isText === "text" && (

            <div className="flex justify-end mt-auto">
            <div className="flex gap-6">
                <button onClick={handleClear}  className=" hover:text-red-600 cursor-pointer">Clear</button>
                <button onClick={handleTextContent} className="bg-white font-bold text-2xl italic rounded-lg p-2 px-10 cursor-pointer border hover:text-blue-600 hover:border-blue-600">
                {spinner ? 'Saving':'Save'}</button>
            </div>
            </div>
       )}
</div>



        <div className="text-center mt-5 text-gray-500 mb-5">
            <p>© 2011-2025 AirForShare.com</p>
            <p>Made in BirdsCorp.com with ❤️</p>
        </div>

        </>
    )
}

export default HomePage;