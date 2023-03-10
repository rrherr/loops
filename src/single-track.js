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
  wavesurfer.on("ready", function() {
    container.appendChild(button);
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

  // Add links to loops
  let re = /^.*#([0-9]*[.]?[0-9]*),([0-9]*[.]?[0-9]*)$/;
  let sub = "javascript:loop($1, $2)";
  document.querySelectorAll("a").forEach(a => {
    if (re.test(a.href)) {
      a.setAttribute("href", a.href.replace(re, sub));
    }
  });

});

window.loop = function (start, end) {
  let region = wavesurfer.addRegion({start, end});
  region.isNewLoop = true;
  wavesurfer.fireEvent('region-update-end', region);
  wavesurfer.pause();
}
