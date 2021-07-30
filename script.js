
/*jshint esversion: 8 */

import { getRandomColor } from "./randomColors.js";
const quoteContainer = document.getElementById("quote-container");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterBtn = document.getElementById("twitter");
const newQuoteBtn = document.getElementById("new-quote");
const loader = document.getElementById("loader");
const maxRetries = 30; /* Max request retries */
const opacity = "33"; /* Opacity Hex/Alpha conversion: BF = 75%, 80 = 50%, 4D = 30%, 33 = 20%, 1A = 10% */

// Get quote from forismatic.com
getQuote();

async function getQuote() {
  // changeBgColor();
  showLoadingSpinner();

  const proxyURL = "https://quicors.herokuapp.com/";
  const apiURL = "http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
  // const apiURL = "https://type.fit/api/quotes";

  // Bad returned requests gets retries up to maxRetries
  const fetchRetry = async (url, options, n) => {
    try {
      const res = await fetch(url, options);
      // console.log("res status: " + res.status + " " + res.statusText);
      return await res.json();
    } catch (err) {
      console.log("fetchRetry error iteration: " + n);
      console.log("fetchRetry: " + err);
      if (n === 1) handleError(err);
      return await fetchRetry(url, options, n - 1);
    }
  };

  try {
    const data = await fetchRetry(proxyURL + apiURL, {}, maxRetries);
    // console.log("json data: ");
    // console.log(data);
    composeQuote(data);
    removeLoadingSpinner();
  } catch (error) {
    handleError(error);
  }
}

function composeQuote(data) {
  if (!data.quoteAuthor) {
    authorText.textContent = "-Unknown";
  } else {
    authorText.textContent = "- " + data.quoteAuthor + " -";
  }

  // if (data.quoteText.length > 120) {
  //   quoteText.classList.add("long-quote");
  // } else {
  //   quoteText.classList.remove("long-quote");
  // }

  quoteText.textContent = data.quoteText;
}

// function composeQuote(data) {
//   if (!data.quoteAuthor) {
//     authorText.textContent = "-Unknown";
//   } else {
//     authorText.textContent = "- " + data.author + " -";
//   }

//   // if (data.quoteText.length > 120) {
//   //   quoteText.classList.add("long-quote");
//   // } else {
//   //   quoteText.classList.remove("long-quote");
//   // }

//   quoteText.textContent = data.text;
// }

function handleError(err) {
  removeLoadingSpinner();
  quoteText.textContent = "Oops, could not get a valid QUI-QUOTE, please click 'Next' to try again.";
  authorText.textContent = "";
  console.log("handleError: " + err);
}

function tweetQuote() {
  const quote = quoteText.textContent;
  const author = authorText.textContent;
  const twitterURL = `https://twitter.com/intent/tweet?text=${quote} - ${author}`;
  window.open(twitterURL, "_blank");
}

function keyEventHandler(event) {
  if (event.keyCode == 13 || event.keyCode == 32) {
    getQuote();
  }
}

function clickNext() {
  getQuote();
}

// function changeBgColor() {
//   window.document.body.style.backgroundColor = getRandomColor() + opacity;
// }

function showLoadingSpinner() {
  quoteContainer.hidden = true;
  loader.hidden = false;
}

function removeLoadingSpinner() {
  if (!loader.hidden) {
    loader.hidden = true;
    quoteContainer.hidden = false;
  }
}

// event listeners
newQuoteBtn.addEventListener("click", e => {
  clickNext();
});
twitterBtn.addEventListener("click", e => {
  tweetQuote();
});
addEventListener("keydown", e => {
  keyEventHandler(e);
});
