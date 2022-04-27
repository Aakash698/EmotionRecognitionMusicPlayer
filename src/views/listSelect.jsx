import React from "react";

export default function ListSelect({ shown, lists, listSelected, nowPlaying }) {
  let stylex = shown
    ? { zIndex: "1", display: "block" }
    : { zIndex: "-1", display: "none" };

  let content = lists
    ? lists.map((list, i) => {
        return (
          <h2
            key={i}
            onClick={() => listSelected(list)}
            style={nowPlaying === list ? { background: "green" } : {}}
          >
            {list} Songs
          </h2>
        );
      })
    : null;
  return (
    <div id="list-select" style={stylex}>
      {content}
    </div>
  );
}
