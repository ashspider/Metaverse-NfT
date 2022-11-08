import style from './loginHeader.module.css'
import { useRouter } from "next/router";
import Link from 'next/link'
import { useState, useEffect } from 'react';

const LoginHeader = () => {
    const router = useRouter();
    const [userSigned, setUserSigned] = useState(false);
    const [ toggle, setToggle] = useState(false);
    useEffect(() => {
        const isUserSigned = localStorage.getItem('user')
        if (isUserSigned) {
            setUserSigned(true)
        }
    }, [])
    const logout = () =>{
        console.log("logout")
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        router.push('/home');
        setToggle(!toggle);
    }


    return (
        <>
            <nav className={`${style.borderStyle} navbar navbar-expand-lg global-border-primary global-background-dark border-bottom border-1 border-secondary sticky-top`}> {/* navbar-light bg-light */}
                <div className="container py-1">
                    <a className="navbar-brand" href="#">
                        <img src={"/logos/favicon.png"} alt="" />
                    </a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse ps-md-5" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item me-3">
                                <a role="button" className={`${style.navItem} global-text-primary nav-link active fs-5`} aria-current="page" onClick={() => { router.push("/"); }}>Home</a> {/* global-active */}
                            </li>
                            {/* <li className="nav-item me-3">
                                <a className={`${style.navItem} global-text-primary nav-link fs-5`} aria-current="page" href="#">Explore</a>
                            </li> */}
                            {/* <li className="nav-item me-3">
                                <a className={`${style.navItem} global-text-primary nav-link fs-5`} aria-current="page" href="#">Admin</a>
                            </li> */}
                            {/* <li className="nav-item dropdown me-3">
                                <a className={`${style.navItem} global-text-primary nav-link dropdown-toggle fs-5`} href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    Pages
                                </a>
                                <ul className="global-background-secondary dropdown-menu" aria-labelledby="navbarDropdown">
                                    <li>
                                        <Link href='/my-nft'>
                                            <a href='#' className="dropdown-item global-text-primary">My NFT</a>
                                        </Link></li> */}
                                    {/* <li><a className="dropdown-item global-text-primary" href="#">Connect ss</a></li>
                                    <li><hr className="dropdown-divider global-text-primary" /></li>
                                    <li><a className="dropdown-item global-text-primary" href="#">Activity</a></li> */}
                                </ul>
                            
                            {/* <li className="nav-item me-3">
                                <a className={`${style.navItem} global-text-primary nav-link fs-5`} aria-current="page" href="#">Help Center</a>
                            </li> */}
                    
                        {userSigned ?
                            <form className="d-flex">
                                {/* <input className="form-control me-2 global-background-secondary border-0 global-text-primary" type="search" placeholder="Search" aria-label="Search" spellCheck="false" /> */}
                                <button type="button" className="btn btn-warning text-nowrap rounded-pill" onClick= {logout}>Logout</button>
                            </form>:''
                        }


                    </div>
                </div>
            </nav>
        </>
    )

}

export default LoginHeader