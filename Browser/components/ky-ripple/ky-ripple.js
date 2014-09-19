(function() {
    var WAVE_DISSAPER_DURATION = 350, //マウスを離してから波が消滅するまでの時間(ms)
        MAX_RADIUS_RATE = 1,
        DEFAULT_COLOR = "#4df0ee",
        PI2 = Math.PI * 2;

    var WaveState = {
        Propagation: 0,
        Dissapering: 1
    };

    function drawCircle(ctx, cx, cy, r, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, PI2);
        ctx.fill();
    };

    Polymer("ky-ripple", {
        WaveState: WaveState,
        publish: {
            color: {
                value: DEFAULT_COLOR,
                reflect: true
            }
        },
        get waveCount() {
            return this._waveQue.length;
        },
        get waveSpeed() {
            var bcr = this.getBoundingClientRect()
            return Math.max(bcr.width, bcr.height) * MAX_RADIUS_RATE / WAVE_DISSAPER_DURATION;
        },
        ready: function() {
            this.canvas = this.$.canvas;

            this.downAction = this.downAction.bind(this);
            this.upAction = this.upAction.bind(this);
            this.update = this.update.bind(this);

            this.canvas.addEventListener("mousedown", this.downAction);

            this._waveQue = [];
        },
        downAction: function(ev) {
            this.createWave(ev.offsetX, ev.offsetY);
            document.body.addEventListener("mouseup", this.upAction);
            document.body.addEventListener("mouseout", this.upAction);
        },
        upAction: function(ev) {
            var lastWave = this.getWaveAt(this.waveCount - 1);
            if (lastWave.state === WaveState.Propagation) {
                lastWave.state = WaveState.Dissapering;
            }

            document.body.removeEventListener("mouseup", this.upAction);
            document.body.removeEventListener("mouseout", this.upAction);
        },
        createWave: function(cx, cy, state) {
            var wave = {
                cx: cx,
                cy: cy,
                radius: 0,
                color: new KYColor(this.color),
                state: state || WaveState.Propagation,
                lastUpdate: Date.now(),
                speed: this.waveSpeed
            };

            this._waveQue.push(wave);
            requestAnimationFrame(this.update);

            return wave;
        },
        getWaveAt: function(index) {
            return this._waveQue[index];
        },
        removeWaveAt: function(index) {
            this._waveQue.splice(index, 1);
        },
        update: function() {
            var ctx = this.canvas.getContext("2d"),
                now = Date.now();

            var bcr = this.canvas.getBoundingClientRect();
            this.canvas.width = bcr.width;
            this.canvas.height = bcr.height;

            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            for (var i = 0, max = this.waveCount; i < max; i++) {
                var wave = this.getWaveAt(i);

                //波の大きさなどを更新
                var elapsed = now - wave.lastUpdate;

                wave.radius += this.waveSpeed * elapsed;

                if (wave.state === WaveState.Dissapering) {
                    wave.color.a -= 1.0 * elapsed / WAVE_DISSAPER_DURATION;

                    if (wave.color.a <= 0) {
                        this.removeWaveAt(i);
                        i--;
                        max--;
                        continue;
                    }
                }
                wave.lastUpdate = now;

                //描画
                var color = wave.color.toString(KYColor.ColorFormat.DecWithAlpha);
                drawCircle(ctx, wave.cx, wave.cy, wave.radius, color);
            }

            if (this.waveCount > 0) {
                requestAnimationFrame(this.update);
            }
        }
    });

}());
