import React from "react";

export default function SongDesc({ img, title, currentTime, artist, max }) {
  return (
    <div id="toggleThem">
      <div className="img">
        <img src={img} alt="" />
      </div>
      <div className="text">
        <h1 id="title">{title}</h1>
        <h3 id="artist">{artist}</h3>
      </div>
    </div>
  );
}
