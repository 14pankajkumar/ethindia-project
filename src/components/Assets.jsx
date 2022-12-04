import React from "react";
import { useEffect } from "react";
import {
  useAccount,
  useContractRead,
  useNetwork,
  useContract,
  useSigner,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
// import { SDK, Auth, TEMPLATES } from "@infura/sdk";
import { Network, Alchemy } from "alchemy-sdk";
import { useState } from "react";
import contractAbi from "../utilities/contractAbi.json";
import { ethers } from "ethers";

const Assets = () => {

  

  const { address } = useAccount();
  const { chains, chain } = useNetwork();
  const { data: signer } = useSigner();
  const [allNfts, setAllNfts] = useState([]);
  const [borrower, setBNorrowerAdd] = useState([]);
  const [hide, setHide] = useState(true);

  const { configWrite, error } = usePrepareContractWrite({
    address: "0xC773802974aA098D42cd62Ecf1a6f4Eea3C92293",
    abi: contractAbi,
    functionName: "setUser",
    args: [address, tokenUri,9999999],
  });
  const { write, data } = useContractWrite(configWrite);


  const deligation = async ({ id }) => {
    const borrowerAdd = prompt("")
    const dateStr = "2022-06-22";
    const date = new Date(dateStr);
    const unixTimestamp = Math.floor(date.getTime() / 1000);
    const myNftContract = new ethers.Contract(
      "0xC773802974aA098D42cd62Ecf1a6f4Eea3C92293",
      contractAbi,
      signer
    );
    console.log(borrowerAdd,unixTimestamp)
    const nftTxn = await myNftContract.setUser(
      id,
      [borrowerAdd],
      [unixTimestamp]
    );

    await nftTxn.wait();

    console.log(`https://mumbai.polygonscan.com/tx/${nftTxn}`);
  };

  const config = {
    apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
    network: Network.MATIC_MUMBAI,
  };

  const alchemy = new Alchemy(config);

  useEffect(() => {
    const getNfts = async () => {
      const nftCollection = await alchemy.nft.getNftsForOwner(address);
      // console.log(nftCollection)
      const revisedNfts = nftCollection.ownedNfts.filter(
        (e) =>
          "0xC773802974aA098D42cd62Ecf1a6f4Eea3C92293".toLocaleLowerCase() ===
          e.contract.address.toLocaleLowerCase()
      );
      // console.log("revisedNfts", revisedNfts);
      setAllNfts(revisedNfts);
    };

    getNfts();
  }, []);

  const deligationFunc = () => {
    setHide(false);
  };

  // console.log(allNfts);

  return (
    <div className="h-max w-screen p-10">
      <div className="grid grid-cols-3 gap-8 h-1/2 w-full">
        {allNfts.map((item, index) => (
          <div
            key={index}
            className="w-full h-full rounded-lg border border-black"
          >
            <img className="h-full w-full" src={item.media[0].gateway} alt="" />

            <div className="w-full h-1/3 grid grid-cols-1 gap-4 mt-5">
              {/* {!hide && (
                <>
                  {" "}
                  <input
                    type="text"
                    name="title"
                    id="title"
                    className="px-2 py-3 rounded-lg border border-black"
                    placeholder="Enter The Borrower Address"
                    required
                    onChange={(e) => setBNorrowerAdd(e.target.value)}
                    value={borrowerAdd}
                  />
                  <button
                    onClick={() => deligation(item.tokenId)}
                    className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white"
                  >
                    Deligate
                  </button>{" "}
                </>
              )} */}
                <button
                  onClick={deligation}
                  className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white"
                >
                  Deligate
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Assets;
