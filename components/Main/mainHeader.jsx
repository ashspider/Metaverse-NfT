import style from '../Main/main.module.css'
import { useRouter } from "next/router";
import Link from 'next/link'
import { useState, useEffect } from 'react';

const MainHeader = (props) => {
    const router = useRouter();
    const [userSigned, setUserSigned] = useState(false);
    const [ toggle, setToggle] = useState(false);
    
    useEffect(() => {
        const isUserSigned = localStorage.getItem('user')
        if (isUserSigned) {
            setUserSigned(true)
        }
    }, [toggle])
    const logout = () =>{
        console.log("logout")
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        router.push('/home');
        setToggle(!toggle);
    }

    const Minted = () =>{
        console.log("Minted")
        localStorage.removeItem("user");
        localStorage.removeItem("userType");
        localStorage.removeItem("token");
        router.push('/home');
        setToggle(!toggle);
    }

    const homeMyNftToggleHandler = (val) => {
        console.log("val : ",val);
        props.sethomeMynftToggle(val)
        
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
                                <a role="button" className={`${style.navItem} global-text-primary nav-link active fs-5`} aria-current="page" onClick={() => homeMyNftToggleHandler("home")}>Home</a> {/* global-active */}
                            </li>
                            {/* <li className="nav-item me-3">
                                <a className={`${style.navItem} global-text-primary nav-link fs-5`} aria-current="page" href="#">Explore</a>
                            </li> */}
                            {/* <li className="nav-item me-3">
                                <a className={`${style.navItem} global-text-primary nav-link fs-5`} aria-current="page" href="#">Admin</a>
                            </li> */}
                            </ul>
                            
                        {userSigned ?
                            <form className="d-flex">
                                {/* <input className="form-control me-2 global-background-secondary border-0 global-text-primary" type="search" placeholder="Search" aria-label="Search" spellCheck="false" /> */}
                                <button type="button" className="btn btn-warning text-nowrap rounded-pill" onClick={() => { router.push("/create-nft"); }}>Create NFT</button>
                            </form> :
                            <form className="d-flex">
                                {/* <input className="form-control me-2 global-background-secondary border-0 global-text-primary" type="search" placeholder="Search" aria-label="Search" spellCheck="false" /> */}
                                <button type="button" className="btn btn-warning text-nowrap rounded-pill" onClick={() => { router.push("/register")}}>Login As Buyer</button>
                            </form>
                        }
                         

                        {
                            userSigned  ?  <button type="button" className="btn btn-warning text-nowrap rounded-pill artistBtn" onClick={ logout }>Logout</button> : 
                        <button type="button" onClick={() => { router.push(`/register?refUserType=artist`)}} style={{marginLeft:'10px'}} className="btn btn-warning text-nowrap rounded-pill artistBtn">Login As Artist</button>
                        }

                    </div>
                </div>
            </nav>
        </>
    )

}

export default MainHeader