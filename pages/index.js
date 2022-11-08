import Head from "next/head";
import Buyer from "./buyer";
import Artist from "./artist";
import { useEffect, useState } from "react";
import {useRouter} from 'next/router'
import MainHeader from "../components/Main/mainHeader"
import Main from "../components/Main/Main"

export default function Home () {
   //window.ethereum.enable()
  const router = useRouter();
  const [userType, setUserType] = useState();
  const [userSigned, setUserSigned] = useState(false);

  useEffect(() => {
    const isUserSigned = localStorage.getItem('user')
    if (isUserSigned == null) {
      router.push('/')
    } else {
      setUserSigned(true);
    }
    const typeOfUser = localStorage.getItem('userType')
    setUserType(typeOfUser);
    const token = localStorage.getItem('token')
  }, [])

  return (
    <>
      {userSigned ? <Artist /> 
      : <>
      <MainHeader></MainHeader>
      <Main></Main>
      </>
    }
    </>


  )
}

