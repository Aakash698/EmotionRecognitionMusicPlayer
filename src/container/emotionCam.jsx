import React, { useEffect, useRef, useState } from "react";
import ImageDisplay from "../views/imageDisplay";
import axios from "axios";
import { dispError, dispSuccess } from "../helpers/toaster";
import * as tf from "@tensorflow/tfjs";
import { port } from "../config";

const EmotionCam = ({ setEmPl, findEmotion }) => {
  const fileRef = useRef(null);

  const videoRef = useRef(null);
  const [imageSelect, setImageSelect] = useState(false);
  const [file, setFile] = useState(null);
  const [url, setURL] = useState("");
  const [emotion, setEmotion] = useState(null);
  const [camShow, setCamShow] = useState(false);
  const [cam, setCam] = useState(false);
  const [camImgUri, setCamImgUri] = useState(undefined);
  const inputChange = (e) => {
    let file = e.target.files[0];
    setFile(file);
    setURL(URL.createObjectURL(file));
    setCam(false);
  };
  const setcanvUri = (uri) => {
    setCamImgUri(uri);
  };

  const send = (e) => {
    e.preventDefault();
    if (cam) {
      axios({
        url: `${port}/emotion`,
        method: "POST",
        data: {
          uri: camImgUri,
        },
      })
        .then(async (data) => {
          let obj = data.data;
          var model = await tf.loadLayersModel(`${port}/models/model.json`);
          var canvImg = new Image();
          canvImg.src = camImgUri;
          const cnvs = document.createElement("canvas");
          cnvs.width = 48;
          cnvs.height = 48;
          const ctx = cnvs.getContext("2d");
          canvImg.onload = async () => {
            ctx.drawImage(
              canvImg,
              obj.x,
              obj.y,
              obj.width,
              obj.height,
              0,
              0,
              cnvs.width,
              cnvs.height
            );
            const tensor = tf.browser
              .fromPixels(cnvs, 1)
              .div(255)
              .toFloat()
              .expandDims(0);

            const prediction = await model.predict(tensor).data();
            var emotions = [
              "Angry",
              "Disgust",
              "Fear",
              "Happy",
              "Sad",
              "Surprise",
              "Neutral",
            ];
            var index = Object.values(prediction).findIndex(
              (p) => p === Math.max(...Object.values(prediction))
            );
            setEmotion(emotions[index]);
            setEmPl(emotions[index]);
            dispSuccess(emotions[index]);
          };
        })
        .catch((err) => {
          dispError(err);
        });
    } else {
      var formData = new FormData();
      formData.append("img", file);
      axios({
        url: `${port}/emotion`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        data: formData,
      })
        .then(async (data) => {
          let obj = data.data;
          var model = await tf.loadLayersModel(`${port}/models/model.json`);
          var canvImg = new Image();
          canvImg.src = url;
          const cnvs = document.createElement("canvas");
          cnvs.width = 48;
          cnvs.height = 48;
          const ctx = cnvs.getContext("2d");
          canvImg.onload = async () => {
            ctx.drawImage(
              canvImg,
              obj.x,
              obj.y,
              obj.width,
              obj.height,
              0,
              0,
              cnvs.width,
              cnvs.height
            );
            const tensor = tf.browser
              .fromPixels(cnvs, 1)
              .div(255)
              .toFloat()
              .expandDims(0);

            const prediction = await model.predict(tensor).data();
            var emotions = [
              "Angry",
              "Disgust",
              "Fear",
              "Happy",
              "Sad",
              "Surprise",
              "Neutral",
            ];
            var index = Object.values(prediction).findIndex(
              (p) => p === Math.max(...Object.values(prediction))
            );
            setEmotion(emotions[index]);
            setEmPl(emotions[index]);
            dispSuccess(emotions[index]);
          };
        })
        .catch((err) => {
          dispError(err);
        });
    }
  };
  const imageSelectGoBack = () => {
    setImageSelect(false);
  };
  const captured = (e) => {
    e.preventDefault();
    setURL(videoRef.current);
    setCamShow(false);
    setCam(true);
    setImageSelect(true);
  };

  useEffect(() => {
    if (url.length) setImageSelect(true);
    (async function () {
      if (camShow) {
        let stream = await navigator.mediaDevices.getUserMedia({ video: true });
        window.stream = stream;
        videoRef.current.srcObject = stream;
      } else {
        if (window.stream) {
          window.stream.getTracks().forEach(function (track) {
            track.stop();
          });
        }
      }
    })();
  }, [url, emotion, camShow]);
  var displayEmotion;
  if (emotion && imageSelect) {
    displayEmotion = (
      <p
        style={{
          fontWeight: "bolder",
          textAlign: "center",
          fontSize: "2em",
          background: "black",
        }}
      >
        Emotion is {emotion}
      </p>
    );
  }
  return (
    <>
      <span onClick={() => findEmotion(false)} className="cross">
        &times;
      </span>
      {imageSelect ? (
        <ImageDisplay
          cam={cam}
          url={url}
          goBack={imageSelectGoBack}
          send={send}
          setcanvUri={setcanvUri}
        />
      ) : (
        <>
          {!camShow ? (
            <div className="choose">
              <div
                className="file"
                onClick={() => {
                  fileRef.current.click();
                }}
              >
                <i className="fa fa-file-image fa-5x"></i>
                <h3>Choose from a File</h3>
                <input
                  id="fileChoose"
                  type="file"
                  ref={fileRef}
                  onChange={inputChange}
                />
              </div>

              <div className="camera" onClick={() => setCamShow(true)}>
                <i className="fa fa-camera fa-5x"></i>
                <h3>Capture from Camera</h3>
              </div>
            </div>
          ) : (
            <div>
              <video
                style={{ display: "block", margin: "auto" }}
                ref={videoRef}
                width="400"
                height="400"
                autoPlay
              />
              <button className="designedButton" onClick={captured}>
                Capture
              </button>
            </div>
          )}
        </>
      )}
      {displayEmotion}
    </>
  );
};
export default EmotionCam;
