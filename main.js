// ==UserScript==
// @name         Garden Persist After Ascend
// @namespace    CookieClickerMods
// @version      1.0
// @description  Keeps Garden state across ascensions in Cookie Clicker
// @author       You
// @match        https://orteil.dashnet.org/cookieclicker/*
// @grant        none
// ==/UserScript==

(function() {
    if (!CCSE) return;

    CCSE.NewGame = function() {
        if (GardenPersist.savedGarden) {
            GardenPersist.loadGarden();
        }
    };

    var GardenPersist = {
        savedGarden: null,

        init: function() {
            Game.customAscend.push(function() {
                GardenPersist.saveGarden();
            });
            Game.customReset.push(function() {
                GardenPersist.loadGarden();
            });
        },

        saveGarden: function() {
            if (Game.Objects['Farm'] && Game.Objects['Farm'].minigame) {
                var M = Game.Objects['Farm'].minigame;
                GardenPersist.savedGarden = {
                    plots: JSON.stringify(M.plot),
                    soil: M.soil,
                    nextSoil: M.nextSoil,
                    step: M.step,
                    unlocks: JSON.stringify(M.plants),
                };
            }
        },

        loadGarden: function() {
            if (GardenPersist.savedGarden && Game.Objects['Farm'] && Game.Objects['Farm'].minigame) {
                var M = Game.Objects['Farm'].minigame;
                var data = GardenPersist.savedGarden;

                try {
                    M.plot = JSON.parse(data.plots);
                    M.soil = data.soil;
                    M.nextSoil = data.nextSoil;
                    M.step = data.step;

                    var unlocks = JSON.parse(data.unlocks);
                    for (var id in unlocks) {
                        if (M.plants[id]) {
                            M.plants[id].unlocked = unlocks[id].unlocked;
                        }
                    }

                    if (M.plotCanvas) M.plotCanvas.needRedraw = 1;
                } catch(e) {
                    console.error('GardenPersist load error:', e);
                }
            }
        }
    };

    GardenPersist.init();
})();
