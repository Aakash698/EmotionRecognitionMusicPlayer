import React, { useEffect, useRef } from "react";

export default function AudioSong({
  source,
  playing,
  musicRunningTime,
  maxDuration,
  changeCurrentMusicTime,
}) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (playing) {
      if (audioRef.current) {
        audioRef.current.play();
      }
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    }
    (async function () {
      changeCurrentMusicTime(await audioRef.current.currentTime);
      maxDuration(await audioRef.current.duration);
    })();
  }, [playing, changeCurrentMusicTime, maxDuration]);

  return (
    <>
      <audio ref={audioRef} src={source} />
    </>
  );
}
