import React, { useContext } from "react";
import { FormContext } from "../App";
import { connect } from "react-redux";
import { setUser } from "../reduxComponents/action";
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
function TopIcons({ topIconHandler, color, user, dispProfile }) {
  const formCtx = useContext(FormContext);

  return (
    <div className="top-icons">
      {user.email ? (
        <a href="#">
          <i
            onClick={() => topIconHandler("emotionFinder")}
            className="fas fa-grin-alt"
            title="Emotion Recognizer"
          ></i>
        </a>
      ) : null}
      {user.userName ? (
        <button
          className="loginBtn"
          onClick={() => dispProfile(true)}
          title="Click: User Profile"
        >
          {user.userName}
        </button>
      ) : (
        <button className="loginBtn" onClick={() => formCtx(true)}>
          Sign In
        </button>
      )}
      {user.email ? (
        <a href="#">
          <i
            onClick={() => topIconHandler("wishlist")}
            className="fa fa-heart"
            title="Favorites"
            style={{ color: color }}
          ></i>
        </a>
      ) : null}
    </div>
  );
}
export default connect(mapStateToProps)(TopIcons);
