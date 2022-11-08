import style from './main.module.css'
import Image from 'next/image'
import ArtistHeader from '/components/ArtistHeader/ArtistHeader'
//import { BsArrowRightShort } from "react-icons/bs";
//import React, { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import { useEffect, useState } from 'react'
import axios from 'axios';
import jsonwebtoken from "jsonwebtoken";
import Head from 'next/head';
import Script from 'next/script';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import Link from 'next/link';


const marketplaceAddress = "0xd6E7006CAfB6BE57a58290E248632820cc248FBa"
let abi = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "approved",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Approval",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "ApprovalForAll",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "seller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "sold",
        "type": "bool"
      }
    ],
    "name": "MarketItemCreated",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "approve",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "createMarketSale",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "tokenURI",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "createToken",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchItemsListed",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "sold",
            "type": "bool"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchMarketItems",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "sold",
            "type": "bool"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fetchMyNFTs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "uint256",
            "name": "tokenId",
            "type": "uint256"
          },
          {
            "internalType": "address payable",
            "name": "seller",
            "type": "address"
          },
          {
            "internalType": "address payable",
            "name": "owner",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "price",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "sold",
            "type": "bool"
          }
        ],
        "internalType": "struct NFTMarketplace.MarketItem[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "getApproved",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getListingPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "ownerOf",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      }
    ],
    "name": "resellToken",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "data",
        "type": "bytes"
      }
    ],
    "name": "safeTransferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "bytes4",
        "name": "interfaceId",
        "type": "bytes4"
      }
    ],
    "name": "supportsInterface",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "tokenURI",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "tokenId",
        "type": "uint256"
      }
    ],
    "name": "transferFrom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_from",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenid",
        "type": "uint256"
      }
    ],
    "name": "transfernft",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_listingPrice",
        "type": "uint256"
      }
    ],
    "name": "updateListingPrice",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
]
export default function Main() {

  async function displayRazorpay(nft) {
    //await window.ethereum.enable()
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    await provider.send('eth_requestAccounts', []);
    const signer = provider.getSigner()
    const contract = new ethers.Contract(marketplaceAddress, abi, signer)
    console.log("hi");
    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), 'ether')

    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price
    });

    await transaction.wait();
    loadNFTs()
    // router.push('/my-nft')
    const res = await loadRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    // Make API call to the serverless API
    const data = await fetch("/api/razorpay", { method: "POST" }).then((t) =>
      t.json()
    );
    console.log(data);
    var options = {
      key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
      name: "Almond Solutions",
      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      description: "Thankyou for your Purchase",
      image: "https://manuarora.in/logo.png",
      handler: function (response) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);

      },

      prefill: {
        name: "Almond Solution",
        email: "almond@gmail.com",
        contact: "9148070301",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };






  const router = useRouter();
  const [connected, toggleConnect] = useState(false);
  const [currAddress, updateAddress] = useState('0x');
  const [nfts, setNfts] = useState([])
  const [loadingState, setLoadingState] = useState('not-loaded')
  const [userSigned, setUserSigned] = useState(false);


  useEffect(() => {
    const isUserSigned = localStorage.getItem('user')
    const token = JSON.parse(localStorage.getItem("token"));
    const payload = jsonwebtoken.decode(token);
    console.log("payload inside use effect : ", payload);
    // const walletAddress = payload.metaMaskWalletAddress;
    // console.log("line no 681",walletAddress);
    // setUserWalletAddress(walletAddress)
    if (isUserSigned) {
      setUserSigned(true)
    }
  }, [])
  useEffect(() => {
    //console.log("working ")
    //window.ethereum.enable()
    loadNFTs()
  }, [])


  async function loadNFTs() {
  
    //const provider = new ethers.providers.JsonRpcProvider("https://rpc-mumbai.maticvigil.com")
    const ethers = require("ethers");
    try{
    if (typeof window !== "undefined") {
      //await window.ethereum.enable()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(marketplaceAddress, abi, signer)
      const data = await contract.fetchMarketItems()

      /*
      *  map over items returned from smart contract and format 
      *  them as well as fetch their token metadata
      */
      const items = await Promise.all(data.map(async i => {
        const tokenUri = await contract.tokenURI(i.tokenId)
        // console.log("tokenUri : ", tokenUri)
        const meta = await axios.get(tokenUri)
        // console.log("meta : ", meta)
        meta = meta.data
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.image,
          name: meta.name,
          description: meta.description,
          status: meta.status
        }
        return item
      }))
      setNfts(items)
      setLoadingState('loaded')
    }
    else {
      throw new Error("No injected web3 found")
    }
  } catch(error) {
    console.error(error)
    
  }
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
    ethereumButton.textContent = "Connect to Metamask";
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
        <li>
          <button className="enableEthereumButton"
            onClick={connectWebsite}>{connected ? "Connect" : "Connect Wallet"}</button>
        </li>
        <div className='text-white text-bold text-right mr-10 text-sm'>
          {currAddress !== "0x" ? "Connected to" : "Not Connected? Please connect to Polygon Mumbai testnet using Metamask"}
          {currAddress !== "0x" ? (currAddress.substring(0, 15) + '...') : ""}
        </div>

        <div className='row mt-5 pt-5'>
          <div className='col-md-6 col-sm-12'>
            <p className={`${style.hero_text} global-text-primary fs-1 fw-bold`}>

              Discover, collect, and sell extraordinary NFT's
            </p>
            <p className='fs-3 global-text-tertiary'>
              It&apos;s crafted with the latest trend of Designs
            </p>
            <br />
            {/* <button type="button" className="btn btn-primary text-nowrap rounded-pill text-white fw-bold" onClick={() => { router.push("/register"); }}>Explore Now <BsArrowRightShort size={20} /></button> */}
          </div>
          <div className='col-md-6 col-sm-12'>
            <Image src="/assets/img/heroImg.png" width="700" height="500" />
          </div>
          <div className={`${style.nftBtn}`}>
            {/* <button className={`${style.buyNft}`} onClick={() => buyNft(nft)}>Buy</button> */}
            {/* <button className={`${style.buyNft}`} type="button" onClick={()=>MetaMaskClientCheck()} >Ownership</button> */}
          </div>
        </div>

        <div className='row'>
          {nfts.map((nft, i) => {
            // console.log("nft : ", nft)
            return (
              <>

                <div key={i} className='col-md-3 col-12 p-2'>
                  <div className='global-background-secondary p-2'>

                    <img src={nft.image} className={`${style.nftImage} img-fluid rounded mb-2`} />


                    <div className='d-flex justify-content-between p-2'>
                      <div className={`${style.left_details}`}>Name</div>
                      <div className={`${style.right_details}`}>{nft.name}</div>
                    </div>



                    <div className='d-flex justify-content-between p-2'>
                      <div className={`${style.left_details}`}>Descriptions</div>
                      <div className={`${style.right_details}`}>{nft.description}</div>
                    </div>
                    <div className='d-flex justify-content-between p-2'>
                      <div className={`${style.left_details}`}>Price(INR)</div>
                      <div className={`${style.right_details}`}>{nft.price}</div>
                    </div>


                    {/* <div className='buyBtn'>Buy</div> */}

                    {/* <div>
                                            <Popup trigger={<button className={`${style.buyNft}`}> Transfer </button>}
                                                position="bottom left">
                                                <div className="popup-overlay">
                                                    <input onChange={WalletAddresInputHandler} type="text" value={toValue} placeholder='Polygon wallet address' name="type" id="" className={`${style.butNft}`} />
                                                    <button input type="text" className={`${style.butNft}`}
                                                        onClick={() => sendnft(nft)} >Submit</button></div>
                                            </Popup>
                                        </div> */}


                    <div className={`${style.nftBtn}`}>



                      {typeof window !== "undefined" && localStorage.getItem('user') === "Signed" ? <button className={`${style.buyNft}`} onClick={() => displayRazorpay(nft)} >Buy NFT</button> : <Link href="/register"><button className={`${style.buyNft}`} >Buy NFT</button></Link>}



                      {/* <button className={`${style.buyNft}`} type="button" onClick={() =>sendnft(nft)} >Transfer</button> */}
                    </div>



                  </div>
                </div>
                <style jsx>
                  {`
                  .popup-overlay {
                    box-shadow: rgba(0, 0, 0, 0.16) 0px 0px 3px;
                    width: 50%
                  }
                  `}
                </style>
              </>
            )
          })}




        </div>
      </div>



    </>
  )
}
