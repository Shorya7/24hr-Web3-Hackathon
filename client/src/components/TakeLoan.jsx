import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import { Alchemy, Network } from 'alchemy-sdk';
// import { Link } from "react-router-dom";
import nftData from "../utils/data.js";

const TakeLoan = ({ signer, account, tokenId, setTokenId, nftContractABI, nftContractAddress, lendBorrowContract }) => {
  const [selectedNft, setSelectedNft] = useState(null);
  const [tokenDataObjects, setTokenDataObjects] = useState([]);
  const [hasQueried, setHasQueried] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeLendingContract, setActiveLendingContract] = useState(null);
  const [tokenID, setTokenID] = useState('');
  const [tokenContractAddress, setTokenContractAddress] = useState('');
  const [borrowableUsd, setBorrowableUsd] = useState(null);

  useEffect(() => {
    if (!hasQueried) {
      getNFTsForOwnerAddress();
    }
    if (signer.provider.network.chainId === 80001) {
      setActiveLendingContract(lendBorrowContract.polygon);
    }
    if (signer.provider.network.chainId === 43113) {
      setActiveLendingContract(lendBorrowContract.avalanche);
    }

  }, [signer]); // Empty dependency array means this effect runs once when the component mounts

  async function getNFTsForOwnerAddress() {
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        apiKey: 'U8SXjgFzb8yZvAK6_1oe7aKDOjK6sG0D',
        network: Network.ETH_SEPOLIA,
      };

      const alchemy = new Alchemy(config);
      const data = await alchemy.nft.getNftsForOwner(account);

      const tokenDataPromises = [];

      for (let i = 0; i < data.ownedNfts.length; i++) {
        const tokenData = alchemy.nft.getNftMetadata(
          data.ownedNfts[i].contract.address,
          data.ownedNfts[i].tokenId
        );
        tokenDataPromises.push(tokenData);
      }

      const tokenDataResults = await Promise.all(tokenDataPromises);
      setTokenDataObjects(tokenDataResults);
      setHasQueried(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const checkCanWithDrawTokens = async () => {
    const address = await activeLendingContract?.signer?.getAddress();
    const hexTokenAmount = await activeLendingContract?.borrowingPowerInUSD(address);
    if (hexTokenAmount) { 
      const tokenAmount = parseInt(hexTokenAmount._hex, 16);
      setBorrowableUsd(tokenAmount);
    } else {
      alert("Error  hex Token amount");
    }
  }

  // Function to open the NFT pop-up
  const openPopup = (nft) => {
    setSelectedNft(nft);
    setTokenId(nft.tokenId);
  };

  // Function to close the NFT pop-up
  const closePopup = () => {
    setSelectedNft(null);
  };
  const handleDeposit = async () => {
    if (activeLendingContract) { 
      await activeLendingContract.depositNFT(tokenContractAddress, tokenID, { gasLimit: 900000 });
    } else {
      alert("NULL");
    }
  }

  const withdrawTokens = async()=>{
    if(borrowableUsd>0){
      await activeLendingContract.withDrawTokens({ gasLimit: 300000 });
    }
  }

  return (
    <div className=" text-400 min-h-screen p-4 " style={{color: "#9FFF45"}}>
      {isLoading && <p>Loading...</p>}
      {error && <p className="text-red-400">Error: {error}</p>}

      {/* NFTs */}
      <p className="text-3xl font-semibold mb-8">Available NFTs</p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
      {nftData.map((nft, index) => (
          <div className="bg-green-900 p-4 rounded-lg" key={index} style={{backgroundColor: "white"}}>
            <img
              src={nft.imageSrc}
              alt={nft.title}
              className="rounded-lg"
              style={{ height: '300px' }}
            />
            <div className="p-4">
              <p className="font-semibold text-xl text-green-400" style={{color: "#2135e5"}} >{nft.title}</p>
              <p className="text-justify mt-3"style={{color: "black"}} >{nft.description}</p>
              <button
                className="bg-green-500 text-black font-semibold py-3 rounded-xl mt-6 w-full" style={{color: "black", backgroundColor:'#9FFF45'}}
                onClick={() => openPopup(nft)}
              >
                Take Loan
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up/Modal */}
      {selectedNft && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-green-900 p-4 rounded-lg m-8 md:w-1/2">
            <div className="flex items-end justify-end">
              <AiFillCloseCircle
                className="text-3xl text-green-400 cursor-pointer"
                onClick={closePopup}
              />
            </div>
            <div className="flex items-center justify-center flex-col">
              <img
                src={selectedNft.rawMetadata.image}
                alt={selectedNft.title}
                className="rounded-lg"
                style={{ height: '300px' }}
              />
              <p className="font-semibold text-lg text-green-400 mt-3">
                {selectedNft.title}
              </p>
              <p className="text-justify mt-3">{selectedNft.description}</p>
              <button className="font-semibold bg-green-500 w-full rounded-lg py-3 mt-5">
                Start the Process 🔃
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deposit NFT Form */}
      <div className="max-w-md mx-auto mt-6" >
        <form className="bg-900 shadow-md rounded px-8 pt-6 pb-8 mb-4 "style={{backgroundColor: "white", marginTop: '20px'}}>
          <div className="mb-4">
            <label className="block text-sm font-bold text-400 mb-2"style={{color: "#2135e5"}} htmlFor="tokenContractAddress">
              Token Contract Address
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenContractAddress"
              type="text"
              placeholder="Token Contract Address"
              value={tokenContractAddress}
              onChange={(e) => setTokenContractAddress(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-bold text-green-400 mb-2" style={{color: "#2135e5"}} htmlFor="tokenID">
              Token ID
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
              id="tokenID"
              type="text"
              placeholder="Token ID"
              value={tokenID}
              onChange={(e) => setTokenID(e.target.value)}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" style={{color: "black", backgroundColor:'#9FFF45'}}
              type="button"
              onClick={handleDeposit}
            >
              Deposit NFT
            </button>
          </div>
        </form>

        {/* Check Withdraw Amount Button */}
        <button className="font-semibold bg-500 w-full rounded-lg py-3 mt-5 text-white" onClick={checkCanWithDrawTokens} style={{backgroundColor: '#2135e5'}} >
          Check Withdraw Amount
        </button>
      </div>

      {/* Borrow DUSD Button */}
      {borrowableUsd && signer && (
        <div className="max-w-md mx-auto">
          <button className="font-semibold bg-green-500 w-full rounded-lg py-3 mt-5" onClick={withdrawTokens}>
            Borrow DUSD {borrowableUsd}
          </button>
        </div>
      )}
    </div>
  );
};

export default TakeLoan;
