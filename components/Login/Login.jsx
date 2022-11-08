import style from './login.module.css'
import Image from 'next/image'
import { useRouter } from "next/router"
import Swal from 'sweetalert2';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useRouteMatch,
    useParams
  } from "react-router-dom";


export default function Login() {
    const router = useRouter();
    const [connected, toggleConnect] = useState(false);
    //const location = useLocation();
    const [currAddress, updateAddress] = useState('0x');
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [emailError, setEmailError] = useState();
    const [passwordError, setPasswordError] = useState();

    useEffect(() => {
        console.log("router.query.ref : ", router.query.ref);
    }, [])
    const validate = () => {

        let emailError = "";
        let passwordError = ""
        if (!email) {
            emailError = "Email is required";
        }
        if (email != "" && !String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            emailError = "Email not valid";
        }
        if (!password) {
            passwordError = "Password is required";
        }
        if (password != "" && String(email)
            .toLowerCase()
            .match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/)) {
            passwordError = "Password is not valid "
        }

        if (emailError || passwordError) {
            setEmailError(emailError);
            setPasswordError(passwordError);
            return false;
        }
        return true;
    }

    const handleEmail = (e) => {
        let val = e.target.value;
        setEmail(val);
        setEmailError("")
    }

    const handlePassword = (e) => {
        let val = e.target.value;
        setPassword(val);
        setPasswordError("");
    }

    const postUserData = (e) => {
        console.log("clicked login submit button")
        e.preventDefault()
        if (validate()) {
            const body = {
                emailFromBody: email,
                passwordFromBody: password
            }

            const url = "http://localhost:5000/api/v1/login";
            // console.log("line no 60",url)
            axios.post(url, body).then((res) => {
                console.log("res", res);
                console.log("token", res.data.data.token);
                if (res.data.success) {
                    localStorage.setItem("user", "Signed")
                    localStorage.setItem("token", JSON.stringify(res.data.data.token));
                    localStorage.setItem("userType", (res.data.data.user_type));
                    Swal.fire(res.data.message, '', 'success')
                    if (router.query.ref) {
                        router.push(router.query.ref);
                    }
                    router.push("/artist");
                    // if( res.data.data.user_type == "artist"){
                    // }
                    //  else if(res.data.data.user_type == "buyer") {
                    //     router.push("/buyer");
                    // }
                    clearField();
                } else {
                    Swal.fire(res.data.message, '', 'error')
                    clearField();
                }
            }).catch((err) => {
                console.log(err);
                clearField();
            })
        }
    }
    const clearField = () => {
        setEmail("")
        setPassword("")
    }

    async function getAddress() {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        updateAddress(addr);
    }

    function updateButton() {
        const ethereumButton = document.querySelector('.enableEthereumButton');
        ethereumButton.textContent = "Connected";
        ethereumButton.classList.remove("hover:bg-blue-70");
        ethereumButton.classList.remove("bg-blue-500");
        ethereumButton.classList.add("hover:bg-green-70");
        ethereumButton.classList.add("bg-green-500");
    }

    async function connectWebsite() {

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== '0x13881') {
            //alert('Incorrect network! Switch your metamask network to Rinkeby');
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x13881' }],
            })
        }
        await window.ethereum.request({ method: 'eth_requestAccounts' })
            .then(() => {
                updateButton();
                console.log("here");
                getAddress();
                window.location.replace(location.pathname)
            });
    }

    useEffect(() => {
        let val = window.ethereum.isConnected();
        if (val) {
            console.log("here");
            getAddress();
            toggleConnect(val);
            updateButton();
        }

        window.ethereum.on('accountsChanged', function (accounts) {
            window.location.replace(location.pathname)
        })
    });
    return (
        <>
            <div className='container'>
                <div className='row mt-5 pt-5'>
                    <div className='col-md-6 col-sm-12'>
                        <div>
                            <span className={`global-text-primary fs-3 fw-bold`}>
                                Welcome Back!
                            </span>
                            <br />
                            <span className={`fs-6 global-text-tertiary`}>
                                Didn&apos;t have an account?
                            </span>
                            &nbsp;&nbsp;
                            <span role="button" className={`${style.login} fs-6 text-white fw-bold`} onClick={() => { router.push("/register"); }}>
                                Register now!
                            </span>
                            <br />
                        </div>
                        <br />
                        <li>
                            <button className="enableEthereumButton bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                             onClick={connectWebsite}>{connected ? "Connected" : "Connect Wallet"}</button>
                        </li>
                        <div className='text-white text-bold text-right mr-10 text-sm'>
                            {currAddress !== "0x" ? "Connected to" : "Not Connected? Please connect to Polygon Mumbai testnet using Metamask"}
                             {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
                        </div>
                        <div>
                            <form>
                                <div className="mb-3">
                                    <input type="email" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" placeholder='Email' value={email} onChange={handleEmail} spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{emailError}</span>
                                <div className="mb-3">
                                    <input type="password" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={password} onChange={handlePassword} placeholder='Password' spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{passwordError}</span>
                                <button type="submit" onClick={postUserData} className="btn btn-success lh-lg col-12 fw-bold mb-3">Log In</button>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" style={{ backgroundColor: "rgba(194,212,248,.15)" }} id="exampleCheck1" defaultChecked />
                                    <label className="form-check-label global-text-tertiary" htmlFor="exampleCheck1">Keep me logged in</label>
                                    <span role="button" className={`fs-6 text-primary fw-bold float-end`} onClick={() => { router.push("/password-reset"); }}>
                                        Forgot Password?
                                    </span>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className='col-md-6 col-sm-12'>
                        <br />
                        <Image src="/assets/img/register.png" width="700" height="400" />
                    </div>
                </div>
            </div>
        </>
    )
}
