import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { setUser } from "../reduxComponents/action";
import axios from "axios";
import { dispError, dispSuccess } from "../helpers/toaster";
import { port } from "../config";
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
const Profile = ({ user, dispProfile }) => {
  const imageUploader = useRef(null);
  const [cImage, setCImage] = useState(null);
  const [image, setImage] = useState(null);
  const styleX = {
    padding: "20px",
    borderRadius: "10px",
    border: "1px solid black",
    fontWeight: "bold",
  };
  const updateUserImage = () => {
    imageUploader.current.click();
  };
  useEffect(() => {
    let img = image
      ? URL.createObjectURL(image)
      : `${port}/profile/${user.image}`;

    setCImage(img);
  }, [image]);
  const imageChange = (e) => {
    setImage(e.target.files[0]);
  };
  const uploadImage = (e) => {
    if (image) {
      var formData = new FormData();
      formData.append("img", image);
      axios({
        url: `${port}/user/uploadProfileImage`,
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: JSON.parse(localStorage.getItem("$token$")),
        },
        data: formData,
      })
        .then((data) => {
          dispSuccess("Successfully Updated");
          setUser(data.data);
          setImage(null);
        })
        .catch((err) => {
          dispError(err);
        });
    }
  };

  const cancelProcess = (_) => {
    setImage(null);
  };

  return (
    <>
      <div className="card-container" style={{ zIndex: "100" }}>
        <span className="cross" onClick={() => dispProfile(false)}>
          &times;
        </span>

        <div className="upper-container">
          <div className="image-container">
            <img src={cImage} />:
          </div>
          <a
            onClick={() => {
              localStorage.clear();
              setUser(null);
            }}
            href=""
            className="f6 pointer link dim ph3 pv2 mb2 dib white bg-dark-gray"
          >
            Sign Out
          </a>
          <div style={{ float: "right", padding: "20px", marginRight: "80px" }}>
            <h3>{user.userName}</h3>
            <h4>{user.email}</h4>
          </div>
          {image ? (
            <>
              <i
                className="fa fa-upload"
                style={{ position: "relative", left: "40%", top: "35%" }}
                onClick={uploadImage}
              />
              <i
                className="fa fa-backspace"
                style={{ position: "relative", left: "45%", top: "35%" }}
                onClick={cancelProcess}
              />
            </>
          ) : (
            <i
              className="fa fa-camera"
              style={{ position: "relative", left: "30%", top: "0%" }}
              onClick={updateUserImage}
            />
          )}
          <input
            type="file"
            onChange={imageChange}
            style={{ display: "none" }}
            ref={imageUploader}
          />
        </div>

        <div className="lower-container">
          <div>
            <p>Favorite Musics</p>
          </div>
          <div className="box">
            <ul>
              {user.songs.length > 0 ? (
                user.songs.map((song, i) => {
                  return (
                    <li key={song._id}>
                      <span>{song.emotion}</span>
                      {song.title}
                    </li>
                  );
                })
              ) : (
                <li>None</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);
