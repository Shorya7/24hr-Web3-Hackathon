import React, { useState, useEffect } from "react";
import { AiFillCloseCircle } from "react-icons/ai";

const LiquidateNFT = ({ lendBorrowContract, signer }) => {
  const [activeLendingContract, setActiveLendingContract] = useState(null);
  const [tokenID, setTokenID] = useState("");
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (signer.provider.network.chainId === 80001) {
      setActiveLendingContract(lendBorrowContract.polygon);
    }
    if (signer.provider.network.chainId === 43113) {
      setActiveLendingContract(lendBorrowContract.avalanche);
    }
  }, [signer]);

  const handleLiquidation = async (e) => {
    e.preventDefault();
    try {
      const response = await activeLendingContract.tryToLiquidateNFT(tokenID, tokenContractAddress);

      // If the transaction was successful, you can set the status accordingly
      setStatus("Liquidation was not successful. Transaction hash: " + response.hash);
    } catch (error) {
      console.error("Liquidation error:", error);
      setStatus("Liquidation failed. See the console for details.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6">
      <form className="bg-green-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-sm font-bold text-green-400 mb-2" htmlFor="tokenContractAddress">
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
          <label className="block text-sm font-bold text-green-400 mb-2" htmlFor="tokenID">
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
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Liquidate NFT
          </button>
        </div>
      </form>

      {/* Display status message */}
      {status && <p>{status}</p>}
    </div>
  );
};

export default LiquidateNFT;
