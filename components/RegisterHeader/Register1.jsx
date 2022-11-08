import style from './registerHeader.module.css'
import { useRouter } from "next/router";
import Link from 'next/link'
import { useState, useEffect } from 'react';

const Register = () => {
    const router = useRouter();
    const [userSigned, setUserSigned] = useState(false);

    useEffect(() => {
        const isUserSigned = localStorage.getItem('user')
        if (isUserSigned) {
            setUserSigned(true)
        }
    }, [])


    return (
        <>
           
                             
                                <button className={`${style.navItem} global-text-primary nav-link active fs-5`} 
                                onClick={() => { router.push("/"); }}>Home </button>
                           
                           
        </>
    )

}

export default Register