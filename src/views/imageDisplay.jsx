import React, { useEffect, useRef } from "react";

export default function ImageDisplay({ cam, url, goBack, send, setcanvUri }) {
  const canvRef = useRef(null);
  useEffect(() => {
    if (cam) {
      const ctx = canvRef.current.getContext("2d");
      ctx.drawImage(url, 0, 0, canvRef.current.width, canvRef.current.height);
      let uri = canvRef.current.toDataURL();
      setcanvUri(uri);
    }
  }, [canvRef, cam, url]);
  return (
    <>
      {cam ? (
        <canvas
          style={{ display: "block", margin: "auto" }}
          ref={canvRef}
          width="400"
          height="400"
        ></canvas>
      ) : (
        <img
          src={url}
          alt="userImage"
          style={{
            width: "400px",
            height: "400px",
            display: "block",
            margin: "auto",
          }}
        />
      )}
      <button className="designedButton" onClick={goBack}>
        Go Back
      </button>
      <button className="designedButton" onClick={send} id="done">
        Send
      </button>
    </>
  );
}
