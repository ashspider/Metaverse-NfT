
import Footer from '../components/Footer/Footer'
import ArtistHeader from '../components/ArtistHeader/ArtistHeader'
import Login from '../components/Login/Login'
import Main from '../components/Main/Main'
import MYNFT from "../pages/my-nft"
import Resellnft from "../components/ListNft/listnft"
//import Marketplace  from '../components/Marketplace/marketplace'
import { useEffect, useState } from 'react'

const Artist = () => {

  const [homeMynftToggle,sethomeMynftToggle] = useState("home")
  useEffect(() => {
    console.log("Buyer(user) flow")
  }, [])

  

  return (
    <>
      <ArtistHeader
        homeMynftToggle={homeMynftToggle}
        sethomeMynftToggle = {sethomeMynftToggle}
      />
      {homeMynftToggle == "home" ?
        <Main /> :  homeMynftToggle == "mynft" ? <MYNFT></MYNFT> :  homeMynftToggle == "reselNft" ? <Resellnft></Resellnft> : ""
      }

      <Footer />
    </>
  )
}
export default Artist;