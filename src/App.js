import "./App.css";
import React, { useEffect, useState } from "react";
import Player from "./container/player";
import songs from "./helpers/songs";
import EmotionCam from "./container/emotionCam";
import Form from "./container/form";
import Modal from "./portals/modal";
import { ToastContainer } from "react-toastify";
import "tachyons";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./container/profile";
import axios from "axios";
import { setUser } from "./reduxComponents/action";
import { dispError } from "./helpers/toaster";
import { connect } from "react-redux";
import {port} from './config'

export const FormContext = React.createContext();

const mapDispatchToProps = (dispatch) => {
  return {
    setUser: (user) => dispatch(setUser(user)),
  };
};

function App({ setUser }) {
  const [playlistFromEmotion, setPlaylistFromEmotion] = useState(null);
  const [emotionFinder, setEmotionFinder] = useState(false);
  const [formDisplay, setFormDisplay] = useState(false);
  const [profileDisp, setProfileDisp] = useState(false);
  useEffect(() => {
    if(JSON.parse(localStorage.getItem("$token$"))){
      axios({
        url: `${port}/user/loginWithJWT`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: JSON.parse(localStorage.getItem("$token$")),
        },
        data: {},
      })
        .then((data) => {
          console.log(data.data);
          setUser(data.data);
        })
        .catch((err) => {
          localStorage.clear();
        });
    }
  }, [JSON.parse(localStorage.getItem("$token$"))]);
  const dispForm = (val) => {
    setFormDisplay(val);
  };
  const setEmPl = (emotion) => {
    setPlaylistFromEmotion(emotion);
    setEmotionFinder(false);
  };

  const dispProfile = (val) => {
    setProfileDisp(val);
  };
  const findEmotion = (val) => {
    setEmotionFinder(val);
  };

  return (
    <>
      {emotionFinder ? (
        <Modal>
          <EmotionCam setEmPl={setEmPl} findEmotion={findEmotion} />
        </Modal>
      ) : null}
      {formDisplay ? (
        <Modal>
          <Form dispForm={dispForm} />
        </Modal>
      ) : null}
      {profileDisp ? <Profile dispProfile={dispProfile} /> : null}
      <FormContext.Provider value={dispForm}>
        <Player
          allSongs={songs}
          findEmotion={findEmotion}
          playlistFromEmotion={playlistFromEmotion}
          dispProfile={dispProfile}
        />
      </FormContext.Provider>
      <ToastContainer />
    </>
  );
}

export default connect(null, mapDispatchToProps)(App);
