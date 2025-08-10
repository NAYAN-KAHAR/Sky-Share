import { Link } from "react-router-dom";
import { TiAdjustBrightness,TiAdjustContrast  } from "react-icons/ti";
import { useEffect, useState } from "react";
import { IoIosMenu, IoMdClose } from "react-icons/io";

const Header = () => {
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    
    useEffect(() => {
        const hanldeResize = () => {
            // console.log(window.innerWidth);
            setIsMobile(window.innerWidth <= 639);
        };
        hanldeResize();
        window.addEventListener('resize', hanldeResize);
        return () => window.removeEventListener('resize', hanldeResize);
    },[]);
    return(
        <>
   
        <div className="w-full mt-10 mx-auto lg:w-[70%] mb:w-[90%] sm:w-[90%] flex justify-between items-center">
 
            <div className="p-2 logo cursor-pointer">
            <Link to='/'><img src="/profile.png" alt="logo" width={60} className="hidden lg:block rounded-full"/></Link>
            <Link to='/'><img src="/cover.png" alt="logo" width={70} height={100} className="block lg:hidden rounded"/></Link>
            </div>

            {isMobile ? (
                <div className="cursor-pointer" onClick={() => setIsOpenMenu(!isOpenMenu)}>
                    {isOpenMenu ? <IoMdClose size={33}/> :  <IoIosMenu size={33}/>}
                </div>
            ):(
                <div className="p-2 items">
                <ul className="flex gap-8 items-center">
                    <li className=" text-sm font-bold cursor-pointer text-zinc-600"><Link to='/works'>How it's Work</Link></li>
                    <li className=" text-sm text-blue-400 font-bold cursor-pointer">Login/Signup</li>
            
                </ul>
            </div>
            )
            }
        </div>

        {isMobile && isOpenMenu && (
            <div className="p-8 pb-4 items shadow-lg bg-white">
                <ul className="flex items-center gap-4 flex-col">
                    <li className=" text-sm font-bold cursor-pointer text-zinc-600"><Link to='/works'>How it's Work</Link></li>
                    <li className=" text-sm text-blue-400 font-bold cursor-pointer">Login/Signup</li>
                    
                </ul>
            </div>
        )

        }
        
        </>
    )
}

export default Header;