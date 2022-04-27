import React from "react";

export default function SongLists({
  songs,
  emotion,
  playThis,
  currentPlaying,
  playing,
}) {
  return (
    <div id="toggleThemWithThis">
      <h1
        className="listTitle"
        style={{
          textAlign: "center",
          position: "fixed",
          left: "50%",
          transform: "translate(-50%,0)",
          fontSize: "30px",
          width: " fit-content",
        }}
      >
        {emotion} Songs
      </h1>
      <div className="listContainer" style={{ marginTop: "40px" }}>
        {songs.map((song, i) => {
          return (
            <div key={i} className="listContent">
              <h2>{song.title}</h2>
              <a href="#">
                {currentPlaying.src === song.src && playing ? (
                  <p style={{ color: "white" }}>Playing</p>
                ) : (
                  <i
                    className="fa fa-play"
                    title="play"
                    onClick={() => playThis(song)}
                  ></i>
                )}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
