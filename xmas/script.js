const btn = document.getElementById("revealBtn");
const gift = document.getElementById("gift");
const intro = document.getElementById("intro");

btn.addEventListener("click", () => {
    gift.hidden = false;
    intro.hidden = true;
});

(() => {
    const canvas = document.getElementById("snow");
    const ctx = canvas.getContext("2d");

    let w, h, dpr;
    function resize() {
        dpr = Math.max(1, window.devicePixelRatio || 1);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        canvas.style.width = w + "px";
        canvas.style.height = h + "px";
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) return;

    const flakes = [];
    const MAX_FLAKES = 180; // adjust for performance

    function rand(min, max) { return Math.random() * (max - min) + min; }

    function spawnFlake(initial = false) {
        const r = rand(1, 3.5);
        flakes.push({
            x: rand(0, w),
            y: initial ? rand(0, h) : -10,
            r,
            vy: rand(0.6, 2.0) * (r / 2),
            vx: rand(-0.6, 0.6),
            phase: rand(0, Math.PI * 2),
            sway: rand(0.3, 1.2),
            alpha: rand(0.4, 0.95),
        });
    }

    // start filled
    for (let i = 0; i < Math.min(MAX_FLAKES, 120); i++) spawnFlake(true);

    let last = performance.now();
    function tick(now) {
        const dt = Math.min(32, now - last); // cap big jumps
        last = now;

        ctx.clearRect(0, 0, w, h);

        // keep near target count
        while (flakes.length < MAX_FLAKES) spawnFlake(false);

        for (let i = flakes.length - 1; i >= 0; i--) {
            const f = flakes[i];

            // drift + gentle sway
            f.phase += 0.01 * (dt / 16);
            f.x += (f.vx + Math.sin(f.phase) * f.sway * 0.3) * (dt / 16);
            f.y += f.vy * (dt / 16);

            // wrap horizontally
            if (f.x < -10) f.x = w + 10;
            if (f.x > w + 10) f.x = -10;

            // draw
            ctx.beginPath();
            ctx.globalAlpha = f.alpha;
            ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
            ctx.fillStyle = "#fff";
            ctx.fill();

            // recycle if off bottom
            if (f.y > h + 10) flakes.splice(i, 1);
        }

        ctx.globalAlpha = 1;
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
})();