(async () => {

    const { default: YTPlayer } = await import("https://cdn.skypack.dev/yt-player@3.6.1");

    customElements.define(
        "yt-player",
        class extends HTMLElement {
            constructor() {
                super();
                const videoId = this.getAttribute("id");
                const div = document.createElement("div");
                div.setAttribute("style", "aspect-ratio: 16 / 9; width: 100%;");
                this.player = new YTPlayer(div, { timeupdateFrequency: 30 });
                this.player.load(videoId);
                this.appendChild(div);

                let a = 0;
                let b = Infinity;
                let lag = 0.100;
                let i, music_t0, wall_t0, music_t1, wall_t1;

                this.player.on("timeupdate", (currentTime) => {
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
                        this.player.seek(a);
                    }
                    i += 1;
                });

                const re = /^t:([0-9]*[.]?[0-9]*),((Infinity)?([0-9]*[.]?[0-9]*))$/;
                document.querySelectorAll("a").forEach(anchor => {
                    if (re.test(anchor.href)) {
                        const id = self.crypto.randomUUID();
                        const container = document.createElement("div");
                        const input = document.createElement("input");
                        const label = document.createElement("label");
                        input.setAttribute("type", "radio");
                        input.setAttribute("name", "loop");
                        input.setAttribute("id", id);
                        input.setAttribute("value", anchor.href.replace(re, "$1,$2"));
                        input.setAttribute("style", "margin-right: 0.5em;")
                        label.setAttribute("for", id);
                        label.setAttribute("style", "font-weight: bold;");
                        label.textContent = anchor.textContent;
                        container.appendChild(input);
                        container.appendChild(label);
                        anchor.replaceWith(container);
                        input.addEventListener("change", (event) => {
                            [a, b] = event.target.value.split(",");
                            a = parseFloat(a);
                            b = parseFloat(b);
                            let currentTime = this.player.getCurrentTime();
                            if (currentTime < a || currentTime > b) {
                                this.player.seek(a);
                            }
                        });
                    }
                });

            }

        }
    );

})();
