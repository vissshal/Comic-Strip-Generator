import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import ComicDisplay from "./ComicDisplay";
import { FiSun, FiMoon } from "react-icons/fi"; // Import icons from React Icons
import Loader from "./Components/Loader";
import { useEffect } from "react";

const ComicStripApp = () => {
  const [comicText, setComicText] = useState(Array(10).fill(""));
  const [comicImages, setComicImages] = useState(Array(10).fill(null));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState(1);

  const [annotation, setAnnotation] = useState(Array(10).fill(""));
  const [darkTheme, setDarkTheme] = useState(false);

  const handleTextChange = (index, text) => {
    const newTextArray = [...comicText];
    newTextArray[index] = text;
    setComicText(newTextArray);
  };

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
    document.body.classList.toggle("dark-theme");
  };

  const handleTextChangeAnnote = (index, text) => {
    const newTextArray = [...annotation];
    newTextArray[index] = text;
    setAnnotation(newTextArray);
  };
  const query = async (data) => {
    try {
      const response = await fetch(
        "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
        {
          headers: {
            Accept: "image/png",
            Authorization:
              "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      const result = await response.blob();
      return URL.createObjectURL(result);
    } catch (err) {
      throw new Error("Error querying the API. Please try again.");
    }
  };

  const generateComic = async () => {
    try {
      setError(null);
      setLoading(true);
      const newComicImages = await Promise.all(
        comicText.map(async (text) => {
          const data = { inputs: text };
          const imageUrl = await query(data);
          return imageUrl;
        })
      );

      setComicImages(newComicImages);
    } catch (err) {
      setError(err.message || "Error generating comic. Please try again.");
    } finally {
      setLoading(false);
      setState(2);
    }
  };

  return (
    <>
      <div className={`homepage ${loading ? "blur" : ""}`}>
        <div className="theme-toggle">
          <button onClick={toggleTheme}>
            {darkTheme ? <FiSun /> : <FiMoon />}
          </button>
        </div>
        {state === 1 && (
          <div>
            <h1>Comic Strip Generator</h1>

            <div>
              {comicText.map((text, index) => (
                <div key={index} className="panel">
                  <label className="labelName">{`Panel ${index + 1}: `}</label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => handleTextChange(index, e.target.value)}
                  />
                  <label className="labelName">
                    Speech Bubble {`Panel ${index + 1}: `}
                  </label>
                  <input
                    type="text"
                    onChange={(e) =>
                      handleTextChangeAnnote(index, e.target.value)
                    }
                  />
                </div>
              ))}
            </div>

            <button onClick={generateComic} className="submit-button">
              <Link
                to="/comic-display"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                Generate Comic
              </Link>
            </button>

            {loading && <Loader />}

            {error && (
              <p style={{ color: "red" }} className="error-message">
                {error}
              </p>
            )}
          </div>
        )}
      </div>
      {state === 2 && (
        <ComicDisplay comicImages={comicImages} annotation={annotation} />
      )}
    </>
  );
};

export default ComicStripApp;
