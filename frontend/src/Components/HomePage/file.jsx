import { useState } from "react";

const File = ({ handleFile, size }) => {
 
    const handleFileChange = (e) => {
     
        const file = e.target.files[0];
        if(file){
             const maxSize = 5 * 1024 * 1024 // 5 MB Size
             if (file.size > maxSize) {
                 alert("File is too large. Maximum size is 5MB.");
                 e.target.value = ""; // Clear the file input
                 return;
                }
        // console.log('file', file)
        handleFile(file);   
        e.target.value = ""; // ✅ reset input to allow re-selection of same file
        }
       
    };
          

    return(
        <>
        {size === 'small' ? (
            <div className="border border-dashed w-25 h-29 mt-2 flex items-center justify-center flex-wrap">
                <label htmlFor="Browser" className=" mx-2 text-sm font-bold cursor-pointer" >+ Add File
                     <p className="text-sm text-blue-600">(up to 5 MB)</p></label>
                <input type="file"  id="Browser"  accept="image/*,.pdf,.doc,.docx,.txt"
                 className="hidden"  onChange={handleFileChange}/>
            </div>
        )
        : (
        <div className="border border-dashed border-blue-200 flex justify-center items-center w-full min-h-[340px] mt-4">
            
                <p>
            Drag and drop any files up to 2 files, 5Mbs each or 
            <label htmlFor="Browser" className=" mx-2 text-blue-600 cursor-pointer" >Browse</label>
            <input type="file"  id="Browser"  accept="image/*,.pdf,.doc,.docx,.txt"
             className="hidden"  onChange={handleFileChange}/>
            </p>

        </div>
        )}
        </>
    )
}


export default File

