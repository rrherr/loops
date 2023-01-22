import "https://unpkg.com/wavesurfer.js";
import "https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js";
import "https://unpkg.com/wavesurfer.js/dist/plugin/wavesurfer.regions.min.js";

let waveform = document.createElement("div");
let timeline = document.createElement("div");
let wavesurfer = WaveSurfer.create({
  container: waveform,
  responsive: true,
  plugins: [
    WaveSurfer.regions.create(),
    WaveSurfer.timeline.create({
        container: timeline
    })
  ]
});

window.addEventListener('DOMContentLoaded', (event) => {

  // Load audio
  let audio = document.querySelector("audio");
  let container = document.querySelector("#wavesurfer");
  wavesurfer.load(audio);
  container.appendChild(waveform);
  container.appendChild(timeline);

  // Play / Pause
  let button = document.createElement("button");
  button.className = "wavesurfer-button";
  button.innerHTML = "Play / Pause";
  button.addEventListener("click", () => {
    wavesurfer.playPause();
  });
  
  // Loops
  wavesurfer.enableDragSelection({});
  wavesurfer.on('region-created', function(region) {
    wavesurfer.clearRegions();
    region.isNewLoop = true;  
  });
  wavesurfer.on('region-updated', function (region) {
    if (region.isDragging) {
      region.isNewLoop = true;
    }
  });
  wavesurfer.on('region-update-end', function (region) {
    if (region.isNewLoop) {
      region.playLoop();
      region.isNewLoop = false;
    }
  });
  wavesurfer.on('seek', function() {
    wavesurfer.clearRegions();
  });

  // Append to document
  wavesurfer.on('ready', function() {
    container.appendChild(timeline);
    container.appendChild(button);
  });

});

window.loop = function (start, end) {
  let region = wavesurfer.addRegion({start, end});
  region.isNewLoop = true;
  wavesurfer.fireEvent('region-update-end', region);
  wavesurfer.pause();
}