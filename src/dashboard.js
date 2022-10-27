"use strict";

const getGif = () => {
  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    "https://api.giphy.com/v1/gifs/random?api_key=89Njdn4YPq0UBIkotMG5HaeMW7PLHGyz&tag=&rating=g",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
        const dataGif = JSON.parse(result);
        $("#gifRandom").html(`
        <img src="${dataGif.data.images.original.url}" height="450px">`);
    })
    .catch((error) => console.log("error", error));
};

const token = localStorage.getItem("tokenDWproject") || "undefined";
if (token == "undefined") {
  window.location = "index.html";
}

getGif();