(function waitCCSE(){
    if(typeof CCSE !== 'undefined'){
        (function(){
            // GardenPersist MOD 本体
            var GardenPersist = {
                savedGarden:null,
                save:function(){
                    var M = Game.Objects['Farm'] && Game.Objects['Farm'].minigame;
                    if(!M) return;
                    this.savedGarden={
                        plots:JSON.stringify(M.plot),
                        soil:M.soil,
                        nextSoil:M.nextSoil,
                        step:M.step,
                        unlocks:JSON.stringify(M.plants)
                    };
                    Game.Notify('GardenPersist','Garden saved',[16,5]);
                },
                load:function(){
                    var M = Game.Objects['Farm'] && Game.Objects['Farm'].minigame;
                    if(!M || !this.savedGarden) return;
                    try{
                        var data=this.savedGarden;
                        M.plot=JSON.parse(data.plots);
                        M.soil=data.soil;
                        M.nextSoil=data.nextSoil;
                        M.step=data.step;
                        var unlocks=JSON.parse(data.unlocks);
                        for(var id in unlocks) if(M.plants[id]) M.plants[id].unlocked=unlocks[id].unlocked;
                        if(M.plotCanvas) M.plotCanvas.needRedraw=1;
                        Game.Notify('GardenPersist','Garden restored',[16,5]);
                    }catch(e){console.error(e);}
                },
                init:function(){
                    Game.customAscend.push(this.save.bind(this));
                    Game.customReset.push(this.load.bind(this));
                }
            };
            GardenPersist.init();
            window.GardenPersist=GardenPersist;
            Game.Notify('GardenPersist','MOD loaded',[16,5]);
        })();
    } else setTimeout(waitCCSE,500);
})();
