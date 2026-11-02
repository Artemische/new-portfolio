// AFTER HOURS — boot loader.
// Holds a glitching "AH" title card over a live pixel
// skyline until the monitor artwork (the heroine atlas and
// the city panorama) has decoded, then tears away.
(function () {
    "use strict";
    const oLoader = document.getElementById("loader");
    if (!oLoader) return;
    const oCity = document.getElementById("loaderCity");
    const oCtx = oCity.getContext("2d");
    const oBar = document.getElementById("loaderBar");
    const oPct = document.getElementById("loaderPct");
    const oLabel = document.getElementById("loaderLabel");
    const oRoot = document.documentElement;
    const bReduced = matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    const iStart = performance.now();
    const iMinMs = bReduced ? 300 : 1100;
    const iMaxMs = 7000;
    const aTint = ["#C982A3", "#e9a3c3", "#7cc7c2"];
    let iW = 0;
    let iH = 0;
    let iDpr = 1;
    let aBuildings = [];
    let iShown = 0;
    let bDone = false;

    // ---- geometry ----------------------------------------
    function _resize() {
        iDpr = Math.min(devicePixelRatio || 1, 2);
        iW = innerWidth;
        iH = innerHeight;
        oCity.width = iW * iDpr;
        oCity.height = iH * iDpr;
        aBuildings = _buildSkyline();
    }
    function _buildSkyline() {
        const aOut = [];
        const iStep = iW < 700 ? 46 : 68;
        const iGround = iH * 0.82;
        let iX = -24;
        let iSeed = 7;
        while (iX < iW + 40) {
            iSeed = (iSeed * 73 + 11) % 160;
            const iFrac = (iSeed % 100) / 100;
            const iHgt = iH * 0.16 + iFrac * iH * 0.32;
            aOut.push({
                x: iX,
                w: iStep - 12 + (iSeed % 20),
                top: iGround - iHgt,
                c: ["#101a27", "#121e2a", "#17222d"]
                    [aOut.length % 3],
                s: iSeed
            });
            iX += iStep;
        }
        return aOut;
    }

    // ---- painting ----------------------------------------
    function _paintCity(iT) {
        oCtx.setTransform(iDpr, 0, 0, iDpr, 0, 0);
        _paintSky();
        _paintBuildings(iT);
        _paintHaze();
    }
    function _paintSky() {
        oCtx.fillStyle = "#080c13";
        oCtx.fillRect(0, 0, iW, iH);
        const oGlow = oCtx.createRadialGradient(
            iW * 0.72, iH * 0.26, 0,
            iW * 0.72, iH * 0.26, iW * 0.55
        );
        oGlow.addColorStop(0, "#22384d66");
        oGlow.addColorStop(1, "transparent");
        oCtx.fillStyle = oGlow;
        oCtx.fillRect(0, 0, iW, iH);
        oCtx.fillStyle = "#cdd9cc";
        oCtx.beginPath();
        oCtx.arc(iW * 0.78, iH * 0.2,
            iW < 700 ? 10 : 16, 0, Math.PI * 2);
        oCtx.fill();
    }
    function _paintBuildings(iT) {
        const iGround = iH * 0.82;
        for (const oB of aBuildings) {
            oCtx.fillStyle = oB.c;
            oCtx.fillRect(oB.x, oB.top, oB.w,
                iGround - oB.top);
            _paintWindows(oB, iGround, iT);
        }
        oCtx.fillStyle = "#0a141c";
        oCtx.fillRect(0, iGround, iW, iH - iGround);
    }
    function _paintWindows(oB, iGround, iT) {
        for (let iY = oB.top + 10; iY < iGround - 6;
            iY += 12) {
            for (let iX = oB.x + 5; iX < oB.x + oB.w - 4;
                iX += 9) {
                const iK = (iX * 3 + iY * 7 + oB.s) | 0;
                if (iK % 5 > 1) continue;
                const iTw = Math.sin(iT * 1.3 + iK)
                    * 0.5 + 0.5;
                oCtx.globalAlpha = 0.22 + iTw * 0.6;
                oCtx.fillStyle = aTint[iK % 3];
                oCtx.fillRect(iX, iY, 3, 5);
            }
        }
        oCtx.globalAlpha = 1;
    }
    function _paintHaze() {
        const iGround = iH * 0.82;
        const oGrad = oCtx.createLinearGradient(
            0, iGround - 46, 0, iH);
        oGrad.addColorStop(0, "transparent");
        oGrad.addColorStop(1, "#15303a7a");
        oCtx.fillStyle = oGrad;
        oCtx.fillRect(0, iGround - 46, iW, iH);
    }

    // ---- readiness ---------------------------------------
    function _heroShare() {
        if (typeof heroFrames === "undefined") return 0;
        return Math.min(heroFrames.length, 8) / 8;
    }
    function _cityReady() {
        return typeof tokyoImage !== "undefined"
            && tokyoImage.complete
            && tokyoImage.naturalWidth > 0;
    }
    function _deskReady() {
        return typeof deskImage !== "undefined"
            && deskImage.complete
            && deskImage.naturalWidth > 0;
    }
    function _assetsReady() {
        return _heroShare() === 1 && _cityReady()
            && _deskReady();
    }
    function _target(iNow) {
        if (_assetsReady()) return 1;
        const iReady = _heroShare() * 0.5
            + (_cityReady() ? 0.4 : 0);
        const iCreep = Math.min(0.9,
            (iNow - iStart) / iMaxMs * 0.9);
        return Math.min(0.96, Math.max(iReady, iCreep));
    }

    // ---- lifecycle ---------------------------------------
    function _dismiss() {
        if (bDone) return;
        bDone = true;
        oBar.style.width = "100%";
        oPct.textContent = "100%";
        oLabel.textContent = "ENTER THE CITY";
        oRoot.classList.remove("booting");
        oLoader.classList.add("is-leaving");
        setTimeout(() => oLoader.remove(),
            bReduced ? 260 : 560);
    }
    function _frame(iNow) {
        if (bDone) return;
        _paintCity((iNow - iStart) / 1000);
        const iStep = bReduced ? 0.2 : 0.09;
        iShown += (_target(iNow) - iShown) * iStep;
        oPct.textContent = Math.round(iShown * 100) + "%";
        oBar.style.width = (iShown * 100).toFixed(1) + "%";
        const iElapsed = iNow - iStart;
        const bReady = _assetsReady() && iElapsed >= iMinMs;
        if (bReady || iElapsed >= iMaxMs) return _dismiss();
        requestAnimationFrame(_frame);
    }

    addEventListener("resize", _resize);
    _resize();
    requestAnimationFrame(_frame);
})();
