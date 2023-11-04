import React from "react";
import heroAnimation from "../assets/heroAnimation.json";
import Lottie from "lottie-react";

const HeroComp = () => {
  const lnk= "https://blog.chain.link/cross-chain-defi/#:~:text=Cross%2Dchain%20lending%20allows%20users,within%20that%20on%2Dchain%20environment.";
  const handleButtonClick = () => {
    window.open(lnk, "_blank"); // Open the link in a new tab
  };
  return (
    <div className="md:grid md:grid-flow-col md:gap-16 md:mt-20 justify-center">
      <div className="md:hidden flex col-span-2 text-center md:text-left mt-6 md:mt-0 text-[3.5rem] md:text-[9.5rem] font-extrabold leading-tight">
        Start Making Money With NFT's
      </div>

      <div className="row-span-3 flex flex-col">
        <Lottie animationData={heroAnimation} />

        <p className=" text-subtitleColor md:pl-10 text-center md:text-left">
          Unlocking NFT Potential Across All Chains: Your Journey, Your Way (Cross chain Lending and Borrowing for NFT's)
        </p>
        <button className=" md:ml-10 font-semibold bg-primaryColor p-4 px-8 text-textColor rounded-lg mt-8" onClick={handleButtonClick}>
          Learn more
        </button>
      </div>

      <div className="hidden md:flex col-span-2 text-center md:text-left mt-6 md:mt-0 text-[3.5rem] md:text-[8.5rem] font-extrabold leading-tight">
        Start Making Money With NFT's
      </div>
      {/* <div className="row-span-2 col-span-2">03</div> */}
    </div>
  );
};

export default HeroComp;
