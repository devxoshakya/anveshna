import React, { useState, useEffect} from 'react';
import { FaSearch } from 'react-icons/fa';
import { SocialIcon } from 'react-social-icons';
import logo from '../images/icon.png'




const IsMobileView = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth <= 768;
};


const IsDesktopView = () => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return windowWidth <= 1350;
};


const Navbar = () => {
    let [isSearchOpen, setIsSearchOpen] = useState(true);

    const toggleSearch = () => {
        setIsSearchOpen(!isSearchOpen);
    };
    const isMobile = IsMobileView(); // Add this line
    const isDesktop = IsDesktopView(); // Add this line
    if(isMobile) console.log('Mobile View')
    else console.log('Desktop View');



    return (
        <nav className='bg-black px-4 backdrop-blur-sm hover:backdrop-blur-lg justify-between flex w-full fixed'>
            <div className='flex  h-16 items-center'>
                <img src={logo} alt="Anveshna Logo" className="h-16 ml-7 sm:h-12  absolute visible-none" />
                {
                    isMobile && !isSearchOpen && ( // Update this line
                        <>
                            <button className='p-1 focus:outline-none text-white md:text-gray-600' onClick={toggleSearch}></button>
                            {!isSearchOpen && (
                                <div className='relative md:w-65 '>
                                    <input type="text" name="" className='w-full px-4 py-1 pl-12 rounded shadow outline-none md:block' placeholder='Search anime...' />
                                </div>
                            )}
                        </>
                    )
                }
            </div>
            {!isMobile && !isDesktop &&(
            <div className='flex align-left border-solid-white pt-2 justify-between gap-x-3 ml:invisible mr-72'>
                <SocialIcon url="https://twitter.com/devxoshakya" target="_blank" className='p-0 mr-0 ml-0 m-1' style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://instagram.com/devxoshakya" target="_blank" className='p-0 mr-0 ml-0 mt-1 ' style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://github.com/devxoshakya" target="_blank" className='p-0 mr-0 ml-0 mt-1' style={{ height: '40px', width: '40px' }} />
                <SocialIcon url="https://linkedin.com/in/devxoshakya" target="_blank" className='p-0 mr-0 ml-0 mt-1' style={{ height: '40px', width: '40px' }} />

            </div>
            )}
            <div className="flex items-center gap-x-5 mr-8 sm:mr-2">
                <button className='p-1 focus:outline-none text-white md:text-gray-600 ml-2' onClick={toggleSearch}><FaSearch/></button>
                {!isMobile && isSearchOpen && (
                    <div className='relative md:w-65 '>
                        <input type="text" name="" className='w-full px-4 py-1 pl-12 rounded shadow outline-none md:block' placeholder='Search anime...' />
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;