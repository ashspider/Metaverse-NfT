import NFTCard from '../NFTCard/NFTCard'
import style from './createNFT.module.css'
import { useState } from 'react'
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import Swal from 'sweetalert2';
import { useRouter } from "next/router"
import axios from 'axios';
import Web3Modal from 'web3modal'
import { ethers } from 'ethers'
import { uploadFileToIPFS } from "../pinata";
import { uploadJSONToIPFS } from "../pinata";





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

  export default function CreateNFT() {
  const router = useRouter();
  const [inputImage, setInputImage] = useState();
  const [imageIcon, setImageIcons] = useState();
  const [formParams, updateFormParams] = useState({ name: '', description: '', price: '' });
  const [fname, setFname] = useState();
  const [price, setPrice] = useState();
  const [description, setDescriptions] = useState();
  const [termsAndConditions, setTermsAndConditions] = useState();
  const [fileUrl, setFileURL] = useState(null);

  const [inputImageError, setInputImageError] = useState();
  const [fnameError, setFnameError] = useState();
  const [priceError, setPriceError] = useState();
  const [descriptionError, setDescriptionsError] = useState();
  const [termsAndConditionsError, setTermsAndConditionsError] = useState();

  const validate = () => {
    let inputImageError = ""
    let fnameError = ""
    let priceError = ""
    let descriptionError = ""
    let termsAndConditionsError = ""

    if (!inputImage) {
      inputImageError = "File is required";
    }
    if (!fname) {
      fnameError = "Name is required";
    }
    if (!price) {
      descriptionError = "Descriptions is required";
    }
    if (!description) {
      priceError = "Price is required";
    }
    if (!termsAndConditions) {
      termsAndConditionsError = "Please accept terms and conditions"
    }
    if (inputImageError || fnameError || descriptionError || priceError || termsAndConditionsError) {
      setFnameError(fnameError);
      setInputImageError(inputImageError);
      setDescriptionsError(descriptionError);
      setPriceError(priceError);
      setTermsAndConditionsError(termsAndConditionsError)
      return false;
    }
    return true;
  }

  async function uploadMetadataToIPFS() {
    // const {name} = fname;
    // const {price} =  price;
    // const{description} = description;
    const { name, description, price } = formParams

    //Make sure that none of the fields are empty
    if (!name || !description || !price || !fileUrl)
      return;

    const nftJSON = {
      name, description, price, image: fileUrl
    }

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      console.log(":::::");
      if (response.success === true) {
        console.log("Uploaded JSON to Pinata: ", response)
        return response.pinataURL;
      }
    }
    catch (e) {
      console.log("error uploading JSON metadata:", e)
    }
  }


  async function ImageHandleChange(e) {
    // console.log("Inside files Details");
    // console.log("Inside files Details", e.target.files[0]);
    setInputImage(e.target.files[0]);
    setInputImageError("")
    base(e.target.files[0])
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      //console.log("uploaded")
      if (response.success === true) {
        console.log("Uploaded image to Pinata: ", response.pinataURL)
        setFileURL(response.pinataURL);
      }
    }
    catch (e) {
      console.log("Error during file upload", e);
    }
  }

  async function handleFname(e) {
    let val = e.target.value
    val = val.replace(/[^a-zA-Z ]/g, '')
    setFname(val);
    // console.log(e.target.value)
    setFnameError("")
  }
  async function handleDescription(e) {
    setDescriptions(e.target.value);
    // console.log(e.target.value)
    setDescriptionsError("")
  }
  async function handlePrice(e) {
    let val = e.target.value;
    val = val.replace(/[^a-zA-Z0-9]/g, '');
    setPrice(e.target.value);
    // console.log(e.target.value)
    setPriceError("")
  }
  async function handleTermsAndConditions(e) {
    let val = e.target.value;
    setTermsAndConditions(val);
    setTermsAndConditionsError("");
  }
  const clearField = () => {
    setInputImage("")
    setFname("")
    setDescriptions("")
    setPrice("")
  }
  let nftDetails = {
    image: '/assets/img/nft/1.jpg',
    type: 'Featured',
    price: '0.324',
    currency: 'ETH',
    title: 'Macaw Bird',
    user: {
      image: '/assets/img/user/1.jpg',
      userName: '@creative_art',
      avatarSize: 2
    }
  }


  async function MintNft() {
    // e.preventDefault();
    // try {
    //connection with metamask
    const metadataURL = await uploadMetadataToIPFS();
    const web3Modal = new Web3Modal()
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner()
    //updateMessage("Please wait.. uploading (upto 5 mins)")

    //pull the deployed contract instance



    //const t = '0.34'
    const price = ethers.utils.parseUnits(formParams.price, 'ether')
    let contract = new ethers.Contract(marketplaceAddress, abi, signer)

    let listingPrice = await contract.getListingPrice()
    listingPrice = listingPrice.toString()

    let transaction = await contract.createToken(metadataURL, price, { value: listingPrice })
    await transaction.wait();
    alert("Minting Successfull")

    router.push('/')
  }






  const postUserData = (e) => {
    // console.log("onsubmit")
    // alert('SUCCESS!! :-)\n\n' + JSON.stringify(data, null, 4));
    // return false;
    e.preventDefault()
    if (validate()) {
      let formData = new FormData();
      formData.append('image', inputImage);
      formData.append('name', fname);
      formData.append('price', price);
      formData.append('description', description);
      const url = "http://localhost:5000/api/v1/marketplace";
      //console.log("line no 60", url)
      const configHeaders = { headers: { "Content-Type": "multipart/form-data" } };
      axios.post(url, formData, configHeaders).then((res) => {
        //console.log(res);
        MintNft();
        //    Swal.fire (res.data.message, '', 'success')
        clearField()
        //router.push("/");
      }).catch((err) => {
        console.log(err);
        clearField();
      })
    }
  }

  const base = async (file) => {
    console.log("file in preview : ", file.type);
    const typeFile = file.type.split("/");
    console.log("typeFile : ", typeFile[1]);
    let reader = new FileReader();
    reader.readAsDataURL(file);
    let a = "abc";
    reader.onload = function () {
      console.log("reader.result : ", reader.result)
      // setImg(reader.result)
      setImageIcons(reader.result)
    }

  }
  return (
    <>
      <div className='container'>
        <div className='row mt-5 pt-5'>
          <div className={`${style.borderStyle} col-md-8 col-sm-12 global-border-primary border border-1 border-secondary rounded py-5 px-5 mb-3`}>
            <div>
              <span className={`global-text-primary fs-3 fw-bold`}>
              </span>
            </div>
            <br />
            <div>
              <form>
                <div className="mb-3">
                  <label htmlFor="image" className='fs-6 global-text-tertiary' >Upload File</label>
                  <input type="file" name='files' id="files" onChange={ImageHandleChange} className={`${style.upload} 
                                    form-control global-background-secondary border-0 global-text-primary p-2 lh-lg bg-transparent `} placeholder='Choose Files'
                  />
                  {/* {
                                        fileUrl && (
                                       <img src={fileUrl} />
                                            )
                                         } */}
                  <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{inputImageError}</span>
                </div>


                <div className="mb-3">
                  <label htmlFor="fname" className="form-label global-text-tertiary">Title</label>
                  <input type="text" name='title' id="fname" onChange={(e) => updateFormParams({ ...formParams, name: e.target.value })}
                    onChangeCapture={(e) => handleFname(e)} value={formParams.name}

                    className={'form-control global-background-secondary border-0 global-text-primary p-2 lh-lg'}
                    placeholder='NFT Name' />

                </div>
                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{fnameError}</span>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label global-text-tertiary">Description</label>
                  <textarea id="description" name="description" onChange={(e) => updateFormParams({ ...formParams, description: e.target.value })} value={formParams.description}
                    onChangeCapture={(e) => handleDescription(e)}
                    className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg"
                    placeholder='Write short description' spellCheck="false" rows="4" cols="50"></textarea>

                </div>
                <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{descriptionError}</span>
                <div className='row'>
                  <div className="mb-3 col-12 col-sm-12">
                    <label htmlFor="price" className="form-label global-text-tertiary">Price</label>
                    <input type="text" name='price' id="price" onChange={(e) => updateFormParams({ ...formParams, price: e.target.value })}
                      onChangeCapture={(e) => handlePrice(e)} value={formParams.price}
                      className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg"
                      placeholder='Price (INR)' spellCheck="false" />


                  </div>
                  <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{priceError}</span>
                  {/* <div className="mb-3 col-md-6 col-sm-12">
                                    <label htmlFor="categories" className="form-label global-text-tertiary">Categories</label>
                                    <select name="categories" id="categories" className="form-control form-select global-background-secondary border-0 global-text-primary p-2 lh-lg global-cursor-pointer">
                                        <option defaultValue value="Art" className={`${style.dropdownItem}`}>Art</option>
                                        <option value="Cards" className={`${style.dropdownItem}`}>Cards</option>
                                        <option value="Collectibles" className={`${style.dropdownItem}`}>Collectibles</option>
                                        <option value="Domain" className={`${style.dropdownItem}`}>Domain</option>
                                        <option value="Music" className={`${style.dropdownItem}`}>Music</option>
                                    </select>
                                </div> */}
                </div>

                {/* <div className='row'>
                                <div className="mb-3 col-md-6 col-sm-12">
                                    <label htmlFor="startingDate" className="form-label global-text-tertiary">Starting Date</label>
                                    <input type="date" id="startingDate" name="startingDate" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" />
                                </div>
                                <div className="mb-3 col-md-6 col-sm-12">
                                    <label htmlFor="endingDate" className="form-label global-text-tertiary">Ending Date</label>
                                    <input type="date" id="endingDate" name="endingDate" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" />
                                </div>
                            </div>
                            <div className='row'>
                                <div className="mb-3 col-md-4 col-sm-12">
                                    <label htmlFor="royality" className="form-label global-text-tertiary">Royality</label>
                                    <input type="text" id="royality" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" placeholder='5%' spellCheck="false" />
                                </div>
                                <div className="mb-3 col-md-4 col-sm-12">
                                    <label htmlFor="copies" className="form-label global-text-tertiary">No of copies</label>
                                    <input type="text" id="copies" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" placeholder='13' spellCheck="false" />
                                </div>
                                <div className="mb-3 col-md-4 col-sm-12">
                                    <label htmlFor="size" className="form-label global-text-tertiary">Size</label>
                                    <input type="text" id="size" className="form-control global-background-secondary border-0 global-text-primary p-2 lh-lg" placeholder='20 MB' spellCheck="false" />
                                </div>
                            </div> */}
                <div className='row'>
                  <div className="mb-3 col-md-8 col-sm-12 form-check">
                    <input type="checkbox" name="acceptTerms" className={`form-check-input `} onChange={(e) => handleTermsAndConditions(e)} style={{ backgroundColor: "rgba(194,212,248,.15)", marginLeft: "-10px" }} id="exampleCheck1" />
                    &nbsp;&nbsp;
                    <label className="form-check-label global-text-tertiary" htmlFor="exampleCheck1">I agree to all terms & conditions.</label>

                  </div>
                  <span className="text-danger" style={{ display: "flex", fontSize: "12px" }}>{termsAndConditionsError}</span>
                  <div className="mb-3 col-md-4 col-sm-12">
                    <div name="submit" className="btn btn-primary text-nowrap lh-lg col-12 fw-bold rounded-pill" onClick={postUserData}>Mint NFT</div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='mb-3 col-md-4 col-sm-12'>
            <NFTCard nftDetails={nftDetails} imageIcon={imageIcon} />
          </div>
        </div>
      </div>
    </>
  )
}
