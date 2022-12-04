import React, { useRef, useState } from "react";
import { NFTStorage } from "nft.storage";
import TokenCard from "./ElementComponents/TokenCard";
import { usePrepareContractWrite, useContractWrite, useAccount } from "wagmi";
import contractAbi from "../utilities/contractAbi.json";

const Home = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [myBlob, setMyBlob] = useState(null);
  const [typeFile, settypeFile] = useState("image/png");
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef(null);
  const { address } = useAccount();
  const [tokenUri, setTokenUri] = useState("");
  const [hide, setHide] = useState(false);

  const { config, error } = usePrepareContractWrite({
    address: "0xC773802974aA098D42cd62Ecf1a6f4Eea3C92293",
    abi: contractAbi,
    functionName: "safeMint",
    args: [address, tokenUri],
  });
  const { write, data } = useContractWrite(config);
  // console.log("data", data);

  function randomString() {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  const handleFile = (e) => {
    if (!e.target.files[0]) {
      return;
    }

    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      setFile(e.target.files[0].name);
      let fileType = e.target.files[0].type;
      settypeFile(fileType);
      reader.addEventListener("load", () => {
        let arr = new Uint8Array(reader.result);
        let d = new Blob([arr], { type: fileType });
        setMyBlob(d);
      });
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  const [previewVideo, setPreviewVideo] = useState("");
  const [previewMedia, setPreviewMedia] = useState("");
  const [previewAudio, setPreviewAudio] = useState("");

  const showPreview = (e) => {
    if (!e.target.files[0]) {
      return;
    }
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", (e) => {
        setPreviewMedia(e.target.result);
      });

      if (e.target.files[0].type.split("/")[0] == "video") {
        reader.addEventListener("load", (e) => {
          setPreviewVideo(e.target.result);
        });
      }

      if (e.target.files[0].type.split("/")[0] == "audio") {
        reader.addEventListener("load", (e) => {
          setPreviewAudio(e.target.result);
        });
      }

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const uploadIpfs = async () => {
      if (!file || !title || !description) return alert("Fields are required");
      console.log("Uploading to IPFS");
      setLoading(true)

    // file upload to IPFS
    const storeNFT = async () => {
      const nftStorage = new NFTStorage({
        token: process.env.REACT_APP_NFT_STORAGE_KEY,
      });
      return nftStorage.store({
        name: title,
        description,
        fileType: typeFile?.split("/")[0],
        image: new File([myBlob], file.replaceAll(file, randomString()), {
          type: typeFile,
        }),
      });
    };

    const result = await storeNFT();
    const tokenUriRes = result.url;
    setTokenUri(tokenUriRes);
    console.log(result.url);
    setLoading(false);
    if(tokenUriRes) return setHide(true);
  };

  const onMint = () => {
    console.log("Minting..!")
    setLoading(true)
    write?.();
    setHide(false);
    setLoading(false);
  };

  return (
    <div className="w-screen h-screen flex justify-between px-32 items-center">
      <div className="w-1/2 h-max grid gap-6 p-5 border rounded-lg bg-[#FFFFFF]">
        <label
          htmlFor="file"
          className="relative flex h-[100px] w-full cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#0e0e0e]"
        >
          <span className="mt-2 text-base leading-normal">
            {file ? (
              `${file}`
            ) : (
              <p className="absolute top-1/2 left-1/2 w-fit -translate-x-1/2 -translate-y-1/2 transform font-raleway text-[14px] font-normal leading-[18px] text-[#0e0e0e]">
                JPG, PNG, GIF, SVG, MP4, WEBM, MP3
              </p>
            )}
          </span>
          <input
            ref={mediaRef}
            onChange={(e) => {
              handleFile(e);
              showPreview(e);
            }}
            type="file"
            name="file"
            id="file"
            className="hidden"
          />
        </label>
        <input
          type="text"
          name="title"
          id="title"
          className="px-2 py-3 rounded-lg border border-black"
          placeholder="Title"
          required
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          type="text"
          name="description"
          id="description"
          className="px-2 py-3 rounded-lg border border-black"
          placeholder="Description"
          required
          onChange={(e) => setDescription(e.target.value)}
          value={description}
        />
        <div className="w-full h-full flex justify-center items-center">
          {!hide ? (
            <button
              onClick={uploadIpfs}
              className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white"
            >
              {loading ? "Loading..." : "Upload to IPFS"}
            </button>
          ) : (
            <button
              onClick={onMint}
              className="text-xl font-bold rounded-md bg-blue-500 px-3 py-2 text-white"
            >
              {loading ? "Loading..." : "Mint Nft"}
            </button>
          )}
        </div>
      </div>

      <TokenCard
        title={title}
        bgVideo={previewVideo}
        bgImage={previewMedia}
        fileType={typeFile}
        bgAudio={previewAudio}
        handleClick={null}
      />
    </div>
  );
};

export default Home;
