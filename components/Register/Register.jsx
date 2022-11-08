import style from './register.module.css'
import Image from 'next/image'
import Swal from 'sweetalert2';
import { useRouter } from "next/router"
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function  Register() {
    const router = useRouter();
    const [refuserType, setRefUserType] = useState();

    useEffect(() => {
        const typeOfUser = router.query.refUserType;
        console.log("line no 13", router.query.refUserType)
        setRefUserType(typeOfUser);
    }, [])


    const [email, setEmail] = useState();
    const [userName, setUserName] = useState();
    const [fullName, setFullName] = useState();
    const [password, setPassword] = useState();
    const [termsAndConditions, setTermsAndConditions] = useState();
    const [walletAddress, setWalletAddress] = useState();

    const [emailError, setEmailError] = useState();
    const [userNameError, setUserNameError] = useState();
    const [fullNameError, setFullNameError] = useState();
    const [passwordError, setPasswordError] = useState();
    const [termsAndConditionsError, setTermsAndConditionsError] = useState();
    const [walletAddressError, setWalletAddressError] = useState();

    const validate = () => {
        let emailError = ""
        let userNameError = ""
        let fullNameError = ""
        let passwordError = ""
        let termsAndConditionsError = ""
        let WalletAddressError = ""
        if (!email) {
            emailError = "Email is required";
        }
        if (email != "" && !String(email)
            .toLowerCase()
            .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
            emailError = "Email not valid";
        }
        if (!userName) {
            userNameError = "User Name is required";
        }
        if (!fullName) {
            fullNameError = "Full Name is required";
        }
        if (!password) {
            passwordError = "Password is required";
        }
        if (!walletAddress) {
            walletAddressError = "Wallet Address is required";
        }
        if (!termsAndConditions) {
            termsAndConditionsError = "Please accept terms and conditions"
        }
        if (emailError || userNameError || fullNameError || passwordError || termsAndConditionsError || WalletAddressError) {
            setEmailError(emailError);
            setUserNameError(userNameError);
            setFullNameError(fullNameError);
            setPasswordError(passwordError);
            setTermsAndConditionsError(termsAndConditionsError)
            setWalletAddressError(WalletAddressError)
            return false;
        }
        return true;
    }
    const postUserData = (e) => {
        console.log("clicked");
        e.preventDefault()
        if (validate()) {
            console.log("all feilds validate");
            const body = {
                email: email,
                userName: userName,
                fullName: fullName,
                passwordFromBody: password,
                metaMaskWalletAddress:walletAddress
            }
            console.log("line no 63", body)
            const url = "http://localhost:5000/api/v1/registration";
            // console.log("line no 60",url)
            axios.post(url, body).then((res) => {
                console.log(res);
                Swal.fire(res.data.message, '', 'success')
                router.push("/login");
                clearField();
            }).catch((err) => {
                console.log(err);
                clearField();
            })
        }
    }

    const handleEmail = (e) => {
        let val = e.target.value
        setEmail(val)
        setEmailError("")
    }
    const handleUserName = (e) => {
        let val = e.target.value
        val = val.replace(/[^a-zA-Z ]/g, '')
        setUserName(val)
        setUserNameError("")
    }
    const handleFullName = (e) => {
        let val = e.target.value
        val = val.replace(/[^a-zA-Z ]/g, '')
        setFullName(val)
        setFullNameError("")
    }
    const handlePassword = (e) => {
        let val = e.target.value;
        setPassword(val);
        setPasswordError("");
    }
    const handleWalletAddress = (e) => {
        let val = e.target.value;
        setWalletAddress(val);
        setWalletAddressError("");
    }
    const handleTermsAndConditions = (e) => {
        let val = e.target.value;
        setTermsAndConditions(val);
        setTermsAndConditionsError("");
    }
    const clearField = () => {
        setEmail("")
        setUserName("")
        setFullName("")
        setPassword("")
        setTermsAndConditions("")
        setWalletAddress("")
    }
    return (
        <>
            <div className='container'>
                <div className='row mt-5 pt-5'>
                    <div className='col-md-6 col-sm-12'>
                        <div>
                            <span className={`global-text-primary fs-3 fw-bold`}>
                                Create your free account
                            </span>
                            <br />
                            <span className='fs-6 global-text-tertiary'>
                                Already have an account?
                            </span>
                            &nbsp;&nbsp;
                            <span role="button" className={`${style.login} fs-6 text-white fw-bold`} onClick={() => { router.push("/login"); }}>
                                Log In
                            </span>
                            <br />
                        </div>
                        <br />
                        <div>
                            <form>
                                <div className="mb-3">
                                    <input type="email" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={email} onChange={(e) => handleEmail(e)} placeholder='Email' spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{emailError}</span>
                                <div className="mb-3">
                                    <input type="text" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={userName} onChange={(e) => handleUserName(e)} placeholder='Username' spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{userNameError}</span>
                                <div className="mb-3">
                                    <input type="text" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={fullName} onChange={(e) => handleFullName(e)} placeholder='Full Name' spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{fullNameError}</span>
                                <div className="mb-3">
                                    <input type="password" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={password} onChange={(e) => handlePassword(e)} placeholder='Password' spellCheck="false" />
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{passwordError}</span>
                                {/* {refuserType ? "":
                                    <div className="mb-3">
                                        <input type="text" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" value={walletAddress} onChange={(e) => handleWalletAddress(e)} placeholder='Wallet Address' spellCheck="false" />
                                        <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{walletAddressError}</span>
                                    </div> } */}

                                
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className='form-check-input' style={{ backgroundColor: "rgba(194,212,248,.15)" }} id="acceptTerms" onChange={(e) => handleTermsAndConditions(e)} />
                                    <label className="form-check-label global-text-tertiary" htmlFor="acceptTerms">I agree to all terms & conditions</label>
                                </div>
                                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{termsAndConditionsError}</span>
                                <div name='submit' onClick={postUserData} value='Register Now' className="btn btn-primary text-nowrap lh-lg col-12 fw-bold">Register Now</div>
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
