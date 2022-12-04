import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="h-20 w-ful flex justify-between items-center px-10">
      <div>
        <Link
          to="/myassets"
          className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white"
        >
          My Asset
        </Link>
        {/* <Link
          to="/videominting"
          className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white ml-3"
        >
          Mint Video
        </Link> */}
      </div>
      <div>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
