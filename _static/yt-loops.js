let load = function (YTPlayer, videoId) {
    const div = document.getElementById("yt");
    const player = new YTPlayer(div, { timeupdateFrequency: 30 });
    player.load(videoId);

    let a = 0;
    let b = Infinity;
    let lag = 0.100;
    let i, music_t0, wall_t0, music_t1, wall_t1;

    player.on("timeupdate", (currentTime) => {
        if (i == 0) {
            music_t0 = currentTime;
            wall_t0 = performance.now() / 1000;
        }
        if (i == 1) {
            music_t1 = currentTime;
            wall_t1 = performance.now() / 1000;
            lag = (wall_t1 - wall_t0) - (music_t1 - music_t0);
        }
        if (currentTime > b - lag) {
            i = -1;
            player.seek(a);
        }
        i += 1;
    });

    const inputs = document.getElementsByTagName("input");
    for (const input of inputs) {
        input.addEventListener("change", (event) => {
            [a, b] = event.target.value.split(",");
            a = parseFloat(a);
            b = parseFloat(b);
            let currentTime = player.getCurrentTime();
            if (currentTime < a || currentTime > b) {
                player.seek(a);
            }
        });
    }
}