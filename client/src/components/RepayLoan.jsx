import React, { useState, useEffect } from "react";

const RepayLoan = ({ lendBorrowContract, signer }) => {
  const [activeLendingContract, setActiveLendingContract] = useState(null);
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (signer.provider.network.chainId === 80001) {
      setActiveLendingContract(lendBorrowContract.polygon);
    }
    if (signer.provider.network.chainId === 43113) {
      setActiveLendingContract(lendBorrowContract.avalanche);
    }
  }, [signer]);

  const handleRepayLoan = async (e) => {
    e.preventDefault();
    try {
      await activeLendingContract.repayLoan(borrowerAddress);

      // If the transaction was successful, you can set the status accordingly
      setStatus("Loan repayment successful.");
    } catch (error) {
      console.error("Repayment error:", error);
      setStatus("Loan repayment failed. Cause You havent withdrawed tokens yet.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6" style={{height: '550px'}}>
      <form className="bg-900 shadow-md rounded px-8 pt-6 pb-8 mb-4" style={{backgroundColor: 'white'}}>
        <div className="mb-6">
          <label className="block text-sm font-bold text-green-400 mb-2" htmlFor="borrowerAddress" style={{color: '#2135e5'}}>
            Borrower Address
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-green-400 leading-tight focus:outline-none focus:shadow-outline"
            id="borrowerAddress"
            type="text"
            placeholder="Borrower Address"
            value={borrowerAddress}
            onChange={(e) => setBorrowerAddress(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" style={{color: "black", backgroundColor:'#9FFF45'}}
            type="submit"
            onClick={handleRepayLoan}
          >
            Repay Loan
          </button>
        </div>
      </form>

      {/* Display status message */}
      {status && <p>{status}</p>}
    </div>
  );
};

export default RepayLoan;
