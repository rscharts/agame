var research_projects = {
    'refinery1' : {
        'name' : 'Refinery 1',
        'img' : 'game/img/icons/refinery1.png',
        'price' : 2500000,
        'time' : 240,
        'requires' : [],
        'resources' : {'stone':2500},
        'description' : 'Increase stone price to $10.',
        'func' : function(){
            ores['stone'].worth = 10;
        }
    },
    'refinery2' : {
        'name' : 'Refinery 2',
        'img' : 'game/img/icons/refinery2.png',
        'price' : 10000000,
        'time' : 1040,
        'requires' : ['refinery1'],
        'resources' : {'stone':4000,'gold':25,'diamond':1},
        'description' : 'Increase stone price to $25.',
        'func' : function(){
            ores['stone'].worth = 25;
        }
    },
    'refinery3' : {
        'name' : 'Refinery 3',
        'img' : 'game/img/icons/refinery3.png',
        'price' : 50000000,
        'time' : 2040,
        'requires' : ['refinery1','refinery2'],
        'resources' : {'stone':10000,'gold':100,'diamond':25,'glowstone':1},
        'description' : 'Increase stone price to $50.',
        'func' : function(){
            ores['stone'].worth = 50;
        }
    },
    'efficiency1' : {
        'name' : 'Efficiency 1',
        'img' : 'game/img/icons/efficiency1.png',
        'price' : 7500000,
        'time' : 600,
        'requires' : [],
        'resources' : {'diamond':100},
        'description' : 'Pickaxe max ore capacity of +250. This research does stack. ',
        'func' : function(){
            for(var pickaxe in pickaxes)
                pickaxes[pickaxe].max += 250
        }
    },
    'efficiency2' : {
        'name' : 'Efficiency 2',
        'img' : 'game/img/icons/efficiency2.png',
        'price' : 14000000,
        'time' : 1260,
        'requires' : ['efficiency1'],
        'resources' : {'diamond':400},
        'description' : 'Pickaxe max ore capacity of +650. This research does stack. ',
        'func' : function(){
            for(var pickaxe in pickaxes)
                pickaxes[pickaxe].max += 650
        }
    },
    'storage1' : {
        'name' : 'Storage 1',
        'img' : 'game/img/icons/storage1.png',
        'price' : 1250000,
        'time' : 120,
        'requires' : [],
        'resources' : {},
        'description' : 'Increases vault storage to 10000.',
        'func' : function(){
            vault_max_storage = 10000;
        }
    },
    'storage2' : {
        'name' : 'Storage 2',
        'img' : 'game/img/icons/storage2.png',
        'price' : 3000000,
        'time' : 240,
        'requires' : ['storage1'],
        'resources' : {},
        'description' : 'Increases vault storage to 15000.',
        'func' : function(){
            vault_max_storage = 15000;
        }
    },
    'storage3' : {
        'name' : 'Storage 3',
        'img' : 'game/img/icons/storage2.png',
        'price' : 5000000,
        'time' : 600,
        'requires' : ['storage2'],
        'resources' : {},
        'description' : 'Increases vault storage to 25000.',
        'func' : function(){
            vault_max_storage = 25000;
        }
    },
    'storage4' : {
        'name' : 'Storage 4',
        'img' : 'game/img/icons/storage2.png',
        'price' : 1000000000,
        'time' : 2000,
        'requires' : ['storage3'],
        'resources' : {},
        'description' : 'Increases vault storage to 35000.',
        'func' : function(){
            vault_max_storage = 35000;
        }
    },
    'attack1' : {
        'name' : 'Attack 1',
        'img' : 'game/img/icons/attack1.png',
        'price' : 1000000,
        'time' : 240,
        'requires' : [],
        'resources' : {},
        'description' : 'Increases all soldiers KPE +1. This research does stack.',
        'func' : function(){
            for(var soldier in soldiers)
                soldiers[soldier].kpe += 1
        }
    },
    'attack2' : {
        'name' : 'Attack 2',
        'img' : 'game/img/icons/attack2.png',
        'price' : 1000000,
        'time' : 480,
        'requires' : ['attack1'],
        'resources' : {},
        'description' : 'Increases all soldiers KPE +1. This research does stack.',
        'func' : function(){
            for(var soldier in soldiers)
                soldiers[soldier].kpe += 1
        }
    },
    'attack3' : {
        'name' : 'Attack 3',
        'img' : 'game/img/icons/attack3.png',
        'price' : 250000000,
        'time' : 920,
        'requires' : ['attack2'],
        'resources' : {},
        'description' : 'Increases all soldiers KPE +1. This research does stack.',
        'func' : function(){
            for(var soldier in soldiers)
                soldiers[soldier].kpe += 1
        }
    },
    'workeropm' : {
        'name' : 'Worker Efficiency',
        'img' : 'game/img/icons/workeropm1.png',
        'price' : 75000000,
        'time' : 1000,
        'requires' : [],
        'resources' : {},
        'description' : 'OPM output for each worker increased 2%',
        'func' : function(){
            research_projects['workeropm'].time = Math.round(Math.pow(1000*workerOPMResearch, 1.00005));
            
            for(var worker in workers)
                workers[worker].opmModifier = Math.round((workers[worker].opm*.02)*workerOPMResearch);
        }
    },
    'advancedequipment' : {
        'name' : 'Advanced Research',
        'img' : 'game/img/icons/advancedequipment.png',
        'price' : 30000000,
        'time' : 800,
        'requires' : [],
        'resources' : {'glowstone':500,'diamond':1000},
        'description' : 'Gives your scientists highly advanced tools to research more complex projects.',
        'func' : function(){}
    },
    'unknown1' : {
        'name' : 'The Unknown',
        'img' : 'game/img/icons/unknown.png',
        'price' : 2500000,
        'time' : 1800,
        'requires' : [],
        'resources' : {'netherquartz':1},
        'description' : 'Your scientists aren\'t really sure what this is yet; maybe researching it will reveal more.',
        'func' : function(){}
    },
    'unknown2' : {
        'name' : 'The Unknown',
        'img' : 'game/img/icons/unknown.png',
        'price' : 100000000,
        'time' : 3600,
        'requires' : ['unknown1'],
        'resources' : {'netherquartz':5,'glowstone':100,'diamond':200,'gold':300,'iron':650,'coal':1000,'stone':3000},
        'description' : 'Your scientists begin to get powerful energy readings.',
        'func' : function(){}
    },
    'unknown3' : {
        'name' : 'The Unknown',
        'img' : 'game/img/icons/unknown.png',
        'price' : 100000000,
        'time' : 3600,
        'requires' : ['unknown1','unknown2','advancedequipment'],
        'resources' : {'netherquartz':1000,'glowstone':2000},
        'description' : 'What the....the energy source is moving.',
        'func' : function(){
            ebUnlocked = true;
        }
    },
    'portal1' : {
        'name' : 'Reconfigure Portal',
        'img' : 'game/img/icons/portal1.png',
        'price' : 3000000,
        'time' : 1200,
        'requires' : ['unknown3'],
        'resources' : {'netherquartz':7500},
        'description' : 'Reconfigure the portal to connect to the unknown.',
        'func' : function(){}
    },
    'workerlimit1' : {
        'name' : 'Worker Capacity 1',
        'img' : 'game/img/icons/workeropm1.png',
        'price' : 250000000,
        'time' : 2000,
        'requires' : [],
        'resources' : {},
        'description' : 'Increase all worker limits +25.',
        'func' : function(){
            for(var worker in workers)
                workers[worker].limit += 25
        }
    },
    'scientistupgrade1' : {
        'name' : 'Mad Scientist 1',
        'img' : 'game/img/icons/madscientist.png',
        'price' : 1000000000,
        'time' : 60000,
        'requires' : [],
        'resources' : {},
        'description' : 'Increase scientist research speed to 3 seconds.',
        'func' : function(){
            scientistTime = 3;
        }
    },
    'scientistupgrade2' : {
        'name' : 'Mad Scientist 2',
        'img' : 'game/img/icons/madscientist.png',
        'price' : 5000000000,
        'time' : 120000,
        'requires' : ['scientistupgrade1'],
        'resources' : {},
        'description' : 'Increase scientist research speed to 5 seconds.',
        'func' : function(){
            scientistTime = 5;
        }
    },
    'scientistupgrade3' : {
        'name' : 'Mad Scientist 3',
        'img' : 'game/img/icons/madscientist.png',
        'price' : 50000000000,
        'time' : 240000,
        'requires' : ['scientistupgrade2'],
        'resources' : {},
        'description' : 'Increase scientist research speed to 10 seconds.',
        'func' : function(){
            scientistTime = 10;
        }
    },
    'bossCap1' : {
        'name' : 'Boss Difficutly Cap Increase 1',
        'img' : 'game/img/icons/bosscapupgrade.png',
        'price' : 250000000000,
        'time' : 50000,
        'requires' : [],
        'resources' : {},
        'description' : 'Increase the boss maximum difficulty to 50.',
        'func' : function(){
            bossDifficultyCap = 50;
        }
    },
    'bossCap2' : {
        'name' : 'Boss Difficutly Cap Increase 2',
        'img' : 'game/img/icons/bosscapupgrade.png',
        'price' : 500000000000,
        'time' : 100000,
        'requires' : ['bossCap1'],
        'resources' : {},
        'description' : 'Increase the boss maximum difficulty to 70.',
        'func' : function(){
            bossDifficultyCap = 70;
        }
    },
    'bossCap3' : {
        'name' : 'Boss Difficutly Cap Increase 3',
        'img' : 'game/img/icons/bosscapupgrade.png',
        'price' : 750000000000,
        'time' : 150000,
        'requires' : ['bossCap2'],
        'resources' : {},
        'description' : 'Increase the boss maximum difficulty to 90.',
        'func' : function(){
            bossDifficultyCap = 90;
        }
    },
    'bossCap4' : {
        'name' : 'Boss Difficutly Cap Increase 4',
        'img' : 'game/img/icons/bosscapupgrade.png',
        'price' : 1000000000000,
        'time' : 200000,
        'requires' : ['bossCap3'],
        'resources' : {},
        'description' : 'Increase the boss maximum difficulty to 110.',
        'func' : function(){
            bossDifficultyCap = 110;
        }
    }
}