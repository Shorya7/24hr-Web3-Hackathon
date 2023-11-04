import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import { Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import TakeLoan from "./components/TakeLoan";
import RepayLoan from "./components/RepayLoan";
import LiquidateNFT from "./pages/LiquidateNFT";
import { nft_contract_address, nft_contract_abi } from "./contract_Interactions/NFT_Contract";
import { LendBorrowContactAddress,LendBorrowContractABIs } from "./contract_Interactions/LendBorrow";
import Particles from './components/Particles';

const { ethers } = require("ethers");

const App = () => {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [showConnectButton, setShowConnectButton] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [nftContract, setNftContract] = useState(null);
  const [lendBorrowContract, setLendBorrowContract] = useState({
    avalanche: null,
    polygon: null
  });

  const connectWallet = async () => {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      try {
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        setSigner(signer);
        const address = await signer.getAddress();
        setAccount(address);
        setProvider(provider);
        setShowConnectButton(false); // Wallet connected, hide the button

        const contractNFT = new ethers.Contract(nft_contract_address, nft_contract_abi, signer)
        setNftContract(contractNFT);

        const lendContractOnPolygon = new ethers.Contract(LendBorrowContactAddress.polygon, LendBorrowContractABIs.polygon, signer);
        const lendContractOnAva = new ethers.Contract(LendBorrowContactAddress.avalanche, LendBorrowContractABIs.avalanche, signer);
        setLendBorrowContract({avalanche:lendContractOnAva,polygon:lendContractOnPolygon});

      } catch (error) {
        // An error occurred, the wallet is not connected
        console.error(error); // Log the error for debugging
      }
    } else {
      setShowConnectButton(true);
    }
  };

  useEffect(() => {
    connectWallet(); // Trigger wallet connection when the component mounts
  }, []);

  return (
    <>
      {provider ? (
        <div className="px-8 md:px-16">
          <Navbar />
          <Routes>
            <Route path="/*" element={<Homepage />} />
            <Route path="/takeLoan" element={<TakeLoan signer={signer} provider={provider} account={account} tokenId={tokenId} setTokenId={setTokenId} nftContract={nftContract} lendBorrowContract={lendBorrowContract} />} />
            <Route path="/repayLoan" element={<RepayLoan lendBorrowContract={lendBorrowContract} signer={signer} />} />
            <Route path="/liquidateNFT" element={<LiquidateNFT lendBorrowContract={lendBorrowContract} signer={signer}/>} />
          </Routes>
        </div>
      ) : (
        <div className="px-8 md:px-16">
          {showConnectButton ? (
            <div>
              <button
                className="md:ml-10 font-semibold bg-primaryColor p-4 px-8 text-backgroundColor rounded-lg mt-8"
                href=''
              >
                Install Wallet
              </button>
              <p>
                If you don't have MetaMask installed, you can{" "}
                <a
                  href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  install it from the Chrome Web Store
                </a>.
              </p>
            </div>
          ) : null}
        </div>
      )}
      <Particles id="tsparticles" />
    </>
  );
};

export default App;
