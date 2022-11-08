import Footer from '../components/Footer/Footer'
import RegisterHeader from '../components/RegisterHeader/RegisterHeader'
import MYNFT from '../components/MyNFT/myNft'
import BuyerMyNft from "../components/MyNFT/buyerMyNft"
import { useEffect, useState } from 'react'

const Mynft = () =>{
    const [userType, setUserType] = useState("");
    useEffect(()=>{
        const typeOfUser = localStorage.getItem('userType')
        setUserType(typeOfUser);
    },[])
    return (
        <>
            {/* <RegisterHeader/> */}
            {userType == "buyer" ? <BuyerMyNft></BuyerMyNft> : 
            <MYNFT/>}
            <Footer />
        </>
    )
}
export default  Mynft;