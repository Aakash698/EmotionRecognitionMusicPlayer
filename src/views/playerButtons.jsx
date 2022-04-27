import React, { useRef, useState } from "react";
import formatTime from "../helpers/formatTime";
export default function PlayerButton({
  playerButtonHandler,
  playing,
  currentMusicTime,
  changeCurrentMusicTime,
  max,
}) {
  return (
    <>
      <div className="time">
        <a href="#">{formatTime(currentMusicTime)}</a>
        <a href="#">{formatTime(max)}</a>
      </div>
      <input
        type="range"
        style={{ width: "100%" }}
        id="timeInstance"
        min="0"
        onChange={(e) => changeCurrentMusicTime(e.target.value)}
        max={isNaN(max) ? 0 : max}
        value={currentMusicTime}
      />

      <div className="btns">
        <a href="#" onClick={() => playerButtonHandler("retweet")}>
          <i id="retweet" className="fa fa-retweet" title="Retweet"></i>
        </a>
        <a href="#" onClick={() => playerButtonHandler("previous")}>
          <i className="fa fa-backward" id="prev" title="Previous"></i>
        </a>
        <a href="#" onClick={() => playerButtonHandler("play-pause")}>
          <i
            className={playing ? "fa fa-pause" : "fa fa-play"}
            id="play"
            title="play"
          ></i>
        </a>
        <a href="#" onClick={() => playerButtonHandler("next")}>
          <i className="fa fa-forward" id="next" title="Next"></i>
        </a>
        <a href="#" onClick={() => playerButtonHandler("random")}>
          <i id="random" className="fa fa-random" title="Shuffle"></i>
        </a>
      </div>
    </>
  );
}
