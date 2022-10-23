/* 
HELP FROM:
Data transfer / drag n drop = https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer
Merging audio = https://stackoverflow.com/questions/64717758/merge-two-audio-tracks-into-one-track


*/

// Array for mp3 samples, items are object having file source and name
const samples = [];

samples.push({ src: "audio/bass.mp3", name: "Bass" });
samples.push({ src: "audio/drum.mp3", name: "Drum" });
samples.push({ src: "audio/piano.mp3", name: "Piano" });
samples.push({ src: "audio/silence.mp3", name: "Silence" });
samples.push({ src: "audio/strange-beat.mp3", name: "Strange Beat" });
samples.push({ src: "audio/violin.mp3", name: "Violin" });

const resetButton = document.getElementById("reset");
resetButton.style.display = "none";
// 2D array of tracks – so one track can have multiple samples in a row
let lastTrackIndex = 0;
let tracks = [];

const addATrack = document.getElementById("addTrack");
addATrack.addEventListener("click", () => {
  createATrack(lastTrackIndex);
});

// Let's add these tracks to HTML page, so that user can see them
const tracksDiv = document.getElementById("tracks");
createATrack(lastTrackIndex);

function createATrack(i) {
  tracks.push([]);
  lastTrackIndex += 1;
  let infoDiv = document.createElement("div");
  let trackDiv = document.createElement("div");
  let trackVolume = document.createElement("input");
  infoDiv.setAttribute("id", "info-div");
  trackVolume.setAttribute("type", "range");
  trackVolume.setAttribute("min", "0");
  trackVolume.setAttribute("max", "100");
  trackVolume.setAttribute("step", "5");
  trackVolume.setAttribute("class", "slider");
  trackVolume.setAttribute("id", "trackVol" + i);
  trackDiv.setAttribute("id", "trackDiv" + i);

  // When dragged item hovered over tracks
  trackDiv.addEventListener("dragover", (ev) => {
    ev.preventDefault();
  });

  // When dragged item dropped into a track
  trackDiv.addEventListener("drop", (ev) => {
    ev.preventDefault();

    const data = ev.dataTransfer.getData("text");
    const source = document.getElementById(data);

    const trackNumber = ev.target.id.charAt(ev.target.id.length - 1);
    const sampleNumber = data.charAt(data.length - 1);
    const duration = samples[sampleNumber]["duration"];

    tracks[trackNumber].push(samples[sampleNumber]);

    // Make a copy of sample and add it to track
    let copySource = document.createElement("button");
    copySource.src = source.src;
    copySource.style.width = String((duration / 60) * 100) + "%";
    copySource.setAttribute("class", "on-track-sample");
    copySource.innerText = source.innerText + " (" + duration + "s)";
    ev.target.appendChild(copySource);
  });

  let trackDivHeader = document.createElement("h2");
  trackDivHeader.innerText = "Track " + (i + 1);
  infoDiv.appendChild(trackDivHeader);
  infoDiv.appendChild(trackVolume);
  tracksDiv.appendChild(infoDiv);
  tracksDiv.appendChild(trackDiv);
}

// Adding the sample buttons to the page, each sample will generate its own button
const addButtons = document.getElementById("addButtons");
let id = 0;
samples.forEach((sample) => {
  let newButton = document.createElement("button");
  newButton.setAttribute("id", "instrument-" + id++);
  newButton.setAttribute("draggable", "true");

  setSampleLength(sample);

  // Start dragging event listener
  newButton.addEventListener("dragstart", (ev) => {
    ev.currentTarget.classList.add("dragging");
    ev.dataTransfer.clearData();
    ev.dataTransfer.setData("text/plain", ev.target.id);
    ev.dataTransfer.effectAllowed = "copy";
  });

  // Stop dragging event listener
  newButton.addEventListener("dragend", (ev) => {
    ev.target.classList.remove("dragging");
  });

  newButton.innerText = sample.name;
  addButtons.appendChild(newButton);
});

function setSampleLength(sample) {
  var request = new XMLHttpRequest();
  request.open("GET", sample.src, true);
  request.responseType = "blob";
  request.onload = function () {
    let reader = new FileReader();
    reader.onload = function (event) {
      let audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      audioContext.decodeAudioData(event.target.result, function (buffer) {
        const duration = buffer.duration;
        sample.duration = Math.round(duration);
      });
    };
    reader.onerror = function () {
      console.error("Error occured while reading sample");
    };
    reader.readAsArrayBuffer(request.response);
  };
  request.send();
}

const playButton = document.getElementById("play");
playButton.addEventListener("click", () => playSong());

const pauseButton = document.getElementById("pause");
elementVisibility(pauseButton, false);

// Song is played so that each track is started simultaneously
function playSong() {
  let i = 0;
  tracks.forEach((track) => {
    if (track.length > 0) {
      playTrack(track, i);
    }
    i++;
  });
}

// Track is looped – that means it is restarted each time its samples are playd through
function playTrack(track, trackNumber) {
  if (playButton.style.display !== "none") {
    elementVisibility(playButton, false);
  }
  let audio = new Audio();

  const volume = document.getElementById("trackVol" + trackNumber);
  volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
  });

  let i = 0;
  audio.addEventListener(
    "ended",
    () => {
      i = ++i < track.length ? i : 0;
      audio.src = track[i].src;
      audio.play();
    },
    true
  );
  audio.loop = false;
  audio.src = track[0].src;
  audio.play();

  elementVisibility(pauseButton, true);
  pauseButton.addEventListener("click", () => {
    audio.pause();
    elementVisibility(pauseButton, false);
    elementVisibility(playButton, true);
  });

  elementVisibility(resetButton, true);
  resetButton.addEventListener("click", () => resetSongs());

  function resetSongs() {
    const elements = document.getElementsByClassName("on-track-sample");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    audio.pause();
    tracks.forEach((loopItem) => {
      loopItem.length = 0;
    });
    elementVisibility(resetButton, false);
    elementVisibility(pauseButton, false);
    elementVisibility(playButton, true);
  }
}

function elementVisibility(element, visible) {
  if (visible) {
    element.style.display = "inline-block";
  } else {
    element.style.display = "none";
  }
}

/*
There is a upload button that adds a sample 
to samples array and a sample button with an event listener
*/
const uploadButton = document.getElementById("upload");
uploadButton.addEventListener("click", () => {
  const file = document.getElementById("input-sample").files[0];
  let audioSrc = "";
  if (!file) return;

  audioSrc = URL.createObjectURL(file);
  let sample = { src: audioSrc, name: "New Sample" };
  samples.push(sample);
  id = samples.length - 1;

  let newButton = document.createElement("button");
  newButton.setAttribute("data-id", id);
  newButton.addEventListener("click", () => addSample(newButton));
  newButton.innerText = sample.name;

  addButtons.appendChild(newButton);
});
