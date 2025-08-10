

const Works = () => {
    return(
        <>
   
   <div className="flex flex-col w-full sm:mt-10 lg:mt-10 mb:mt-10 mt-3 mx-auto shadow-lg p-6 bg-white rounded-lg min-h-[500px] lg:w-[70%] mb:w-[90%] sm:w-[90%] ">

        <div className="w-[100%] lg:w-[60%] mb:w-[80%] sm:w-[80%] flex flex-col justify-center items-center mx-auto">
            <h1 className="text-2xl">How it works</h1>
            <p className="mx-auto text-xl text-zinc-500 mt-4">AirForShare (AFS) is easy solution to share files, text and links within the same Wi-Fi Network.</p>
        </div>

        
        <div className="w-[100%] lg:w-[90%] mb:w-[80%] sm:w-[80%] mx-auto flex flex-wrap mt-4 justify-between">
        <div className="w-full lg:w-1/3 p-2 flex flex-col items-center gap-2">
            <h1 className="text-5xl text-zinc-300">1 .</h1>
            <p className="text-xl">Connect all your devices to the <span className="font-bold">same Wi-Fi</span> network</p>
        </div>

        <div className="w-full lg:w-1/3 p-2 flex flex-col items-center gap-2">
            <h1 className="text-5xl text-zinc-300">2 .</h1>
            <p className="text-xl"> <span className="font-bold">Upload</span> to AirForShare anything you want</p>
        </div>

        <div className="w-full lg:w-1/3 p-2 flex flex-col items-center gap-2">
            <h1 className="text-5xl text-zinc-300">3 .</h1>
            <p className="text-xl">View and manage from <span className="font-bold">any devices *</span></p>
        </div>
</div>



    </div>

  

       <div className="text-center mt-5 text-gray-500 mb-5">
           <p>© 2011-2025 AirForShare.com</p>
           <p>Made in BirdsCorp.com with ❤️</p>
       </div>
        </>
    )
}

export default Works;

