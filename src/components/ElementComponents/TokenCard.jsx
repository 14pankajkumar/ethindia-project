import React from "react";

const TokenCard = ({
  title,
  network,
  bgImage,
  bgVideo,
  fileType,
  bgAudio,
  handleClick,
}) => {
  const handleCardClick = (e) => {
    e.stopPropagation();
    handleClick();
  };

  return (
    <div
      onClick={(e) => handleCardClick(e)}
      className="card mt-11 h-max w-1/3 overflow-hidden rounded-xl border-2 border-solid border-[#2C2C2C] bg-white hover:border-2 hover:border-[#8E30FF]"
    >
      <div className="image-container w-full bg-[#D9D9D9]">
        {fileType?.split("/")[0] == "image" && (
          <img src={bgImage} className="h-full w-full" />
        )}
        {fileType?.split("/")[0] == "video" && (
          <video
            className="aspect-square h-full w-full rounded-md object-cover"
            controls
            autoPlay={false}
            src={bgVideo}
          ></video>
        )}
        {fileType?.split("/")[0] == "audio" && (
          <audio
            className="aspect-square h-full w-full rounded-md object-cover"
            controls
            autoPlay={false}
            src={bgAudio}
          ></audio>
        )}
      </div>
    </div>
  );
};

export default TokenCard;
