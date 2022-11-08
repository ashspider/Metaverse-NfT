
import Footer from '../components/Footer/Footer'
import LoginHeader from '../components/LoginHeader/LoginHeader'
import Login from '../components/Login/Login'
import Main  from '../components/Main/Main'
import Marketplace  from '../components/Marketplace/marketplace'
import { useEffect } from 'react'
import MyNft from '../components/MyNFT/myNft'
import ArtistHeader1  from '../components/ArtistHeader/ArtistHeader1'

const Buyer = () => {
  useEffect(() => {
    console.log("Buyer(user) flow")
  }, [])
  
  return (
    <>
        {/* <LoginHeader /> */}
        {/* <Main/> */}
        {/* <ArtistHeader1 /> */}
        <Footer />
    </>
  )
}
export default Buyer
