import React from "react";
import { useState } from "react";
import "./ComicDisplay.css";
import ComicStripApp from "./App";
const ComicDisplay = ({ comicImages, annotation }) => {
  const [state, setState] = useState(1);
  const onClose = () => {
    setState(2);
  };

  return (
    <>
      {state === 2 && <ComicStripApp />}
      {state === 1 && (
        <div className="container1">
          <div className="close-button" onClick={onClose}>
            CLEAR
          </div>
          {comicImages.map((image, index) => (
            <div key={index} className="panel1">
              {annotation[index] && (
                <div className="speech bubble">
                  <p className="thought">{annotation[index]}</p>
                </div>
              )}

              {image && (
                <div className="panel-img">
                  <img src={image} alt={`Panel ${index + 1}`} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ComicDisplay;
