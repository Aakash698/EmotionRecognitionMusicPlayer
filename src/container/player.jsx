import React, { useState, useRef, useEffect, lazy, Suspense } from "react";
// import BottomIcons from "../views/bottomIcons";
import ListSelect from "../views/listSelect";
// import PlayerButton from "../views/playerButtons.jsx";
// import SongDesc from "../views/songDesc";
// import SongLists from "../views/songLists";
// import TopIcons from "../views/topIcons";

import shuffle from "../helpers/shuffleArr";
import EmotionCam from "./emotionCam";
import { setUser } from "../reduxComponents/action";
import { connect } from "react-redux";
import axios from "axios";
import { port } from "../config";
const PlayerButton = lazy(() => import("../views/playerButtons.jsx"));
const BottomIcons = lazy(() => import("../views/bottomIcons"));
const SongDesc = lazy(() => import("../views/songDesc"));
const SongLists = lazy(() => import("../views/songLists"));
const TopIcons = lazy(() => import("../views/topIcons"));

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

function Player({
  allSongs,
  playlistFromEmotion,
  findEmotion,
  dispProfile,
  user,
  setUser,
}) {
  const [playlistToggle, setplaylistToggle] = useState(false);
  const [listSelectToggle, setListSelectToggle] = useState(false);
  const [playlistDisplay, setPlaylistDisplay] = useState("Happy");
  const [playlist, setPlaylist] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [currentMusicTime, setCurrentMusicTime] = useState(0);
  const [maxSongDuration, setMaxSongDuration] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [retweeted, setRetweeted] = useState(false);

  const audioRef = useRef(null);
  useEffect(() => {
    (async function () {})();
    let songFilter = allSongs.filter(
      (songs) => songs.emotion === playlistDisplay
    );
    setPlaylist(songFilter);
    setCurrentSong(songFilter[0]);
  }, []);
  useEffect(() => {
    (async function () {
      audioRef.current.addEventListener("loadedmetadata", async () => {
        if (audioRef.current)
          setMaxSongDuration(await audioRef.current.duration);
      });
      audioRef.current.addEventListener("timeupdate", async () => {
        if (audioRef.current)
          setCurrentMusicTime(await audioRef.current.currentTime);
      });
      if (currentSong) {
        if (retweeted) setPlaylist([currentSong]);
        else {
          let songFilter = allSongs.filter(
            (songs) => songs.emotion === playlistDisplay
          );
          setPlaylist(songFilter);
        }
      }
      if (playlistFromEmotion && playlistFromEmotion !== playlistDisplay) {
        let songFilter = allSongs.filter(
          (songs) => songs.emotion === playlistFromEmotion
        );
        setPlaylistDisplay(playlistFromEmotion);
        setPlaylist(songFilter);
        setCurrentSong(songFilter[0]);
      }
      if (playing) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    })();
  }, [
    user,
    currentSong,
    playing,
    retweeted,
    playlistDisplay,
    playlistFromEmotion,
  ]);

  const changeCurrentMusicTime = (value) => {
    if (value !== audioRef.current.currentTime) {
      audioRef.current.currentTime = value;
      setCurrentMusicTime(value);
    }
  };
  const playThis = (song) => {
    setCurrentSong(song);
    setPlaylistDisplay(song.emotion);
    setPlaying(true);
  };
  const topIconHandler = (arg) => {
    let action;
    if (arg === "wishlist") {
      if (user.songs) {
        if (user.songs.findIndex((e) => e.title === currentSong.title) > -1) {
          action = "remove";
        } else {
          action = "add";
        }

        axios({
          url: `${port}/user/${user._id}`,
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: JSON.parse(localStorage.getItem("$token$")),
          },
          data: {
            action,
            song: currentSong,
          },
        })
          .then((data) => setUser(data.data))
          .catch(console.log);
      }
      setWishlisted((wishlisted) => !wishlisted);
    } else if (arg === "emotionFinder") {
      findEmotion(true);
    }
  };
  const getIndex = (arr, item) => {
    return arr.indexOf(item);
  };
  const playerButtonHandler = (arg) => {
    if (arg === "play-pause") {
      setPlaying((playing) => !playing);
    } else if (arg === "next") {
      let ind = getIndex(playlist, currentSong);

      ind = ind === playlist.length - 1 ? -1 : ind;
      setCurrentSong(playlist[ind + 1]);
    } else if (arg === "previous") {
      let ind = getIndex(playlist, currentSong);
      ind = ind === 0 ? playlist.length : ind;
      setCurrentSong(playlist[ind - 1]);
    } else if (arg === "retweet") {
      setRetweeted(!retweeted);
    } else if (arg === "random") {
      setPlaylist((playlist) => shuffle(playlist));
    }
  };

  const handleBottomButtons = (arg) => {
    if (arg === "playlist") {
      setplaylistToggle((playlistToggle) => !playlistToggle);
    } else if (arg === "listSelector") {
      setListSelectToggle((listSelectToggle) => !listSelectToggle);
    }
  };
  const listSelected = (emotion) => {
    setplaylistToggle(true);
    setPlaylistDisplay(emotion);
    setListSelectToggle(false);
  };
  let arr = [];
  allSongs.forEach((song) => {
    if (arr.indexOf(song.emotion) < 0) {
      arr.push(song.emotion);
    }
  });
  return (
    <div className="bg">
      <>
        <audio ref={audioRef} src={currentSong ? currentSong.src : ""} />
      </>
      <section className="player">
        <div className="container">
          <Suspense fallback={<div>Loading...</div>}>
            <TopIcons
              topIconHandler={topIconHandler}
              dispProfile={dispProfile}
              color={
                user.songs
                  ? user.songs.findIndex((e) => e.title === currentSong.title) >
                    -1
                    ? "red"
                    : "black"
                  : wishlisted
                  ? "red"
                  : "black"
              }
            />

            {playlistToggle ? (
              <SongLists
                songs={playlist}
                emotion={playlistDisplay}
                playThis={playThis}
                currentPlaying={currentSong}
                playing={playing}
              />
            ) : (
              <SongDesc
                img={currentSong ? currentSong.img : ""}
                max={maxSongDuration}
                title={currentSong ? currentSong.title : ""}
                artist={currentSong ? currentSong.artist : ""}
                currentTime={currentMusicTime}
              />
            )}

            <PlayerButton
              playerButtonHandler={playerButtonHandler}
              playing={playing ? true : false}
              changeCurrentMusicTime={changeCurrentMusicTime}
              currentMusicTime={currentMusicTime}
              max={maxSongDuration}
            />

            <BottomIcons
              songName={
                playlistToggle && currentSong ? currentSong.title : null
              }
              rightColor={listSelectToggle ? "blue" : "black"}
              leftColor={playlistToggle ? "blue" : "black"}
              handleBottomButtons={handleBottomButtons}
            />
          </Suspense>
        </div>
        {listSelectToggle ? (
          <ListSelect
            shown="true"
            listSelected={listSelected}
            lists={arr}
            nowPlaying={currentSong ? currentSong.emotion : playlistDisplay}
          />
        ) : null}
      </section>
    </div>
  );
}
export default connect(mapStateToProps, mapDispatchToProps)(Player);
