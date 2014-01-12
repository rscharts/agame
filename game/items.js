var pickaxes = {
        'wood' : {
            'name' : 'Wooden Pickaxe',
            'img' : 'game/img/items/pickaxeWood.png',
            'speed' : 7000,
            'sharpness' : 1,
            'max' : 15,
            'dropchance' : 100,
            'price' : 0,
            'canbeupgradedto' : true
        },
        'stone' : {
            'name' : 'Stone Pickaxe',
            'img' : 'game/img/items/pickaxeStone.png',
            'speed' : 4000,
            'sharpness' : 2,
            'max' : 45,
            'dropchance' : 70,
            'price' : 250,
            'canbeupgradedto' : true
        },
        'iron' : {
            'name' : 'Iron Pickaxe',
            'img' : 'game/img/items/pickaxeIron.png',
            'speed' : 3000,
            'sharpness' : 3,
            'max' : 100,
            'dropchance' : 5,
            'price' : 1250,
            'canbeupgradedto' : true
        },
        'gold' : {
            'name' : 'Gold Pickaxe',
            'img' : 'game/img/items/pickaxeGold.png',
            'speed' : 2000,
            'sharpness' : 3,
            'max' : 250,
            'dropchance' : 30,
            'price' : 12500,
            'canbeupgradedto' : true
        },
        'diamond' : {
            'name' : 'Diamond Pickaxe',
            'img' : 'game/img/items/pickaxeDiamond.png',
            'speed' : 1000,
            'sharpness' : 3,
            'max' : 450,
            'dropchance' : 5,
            'price' : 20000,
            'canbeupgradedto' : true
        },
        'heavenly' : {
            'name' : 'Heavenly Pickaxe',
            'img' : 'game/img/items/pickaxeHeavenly.png',
            'speed' : 1000,
            'sharpness' : 4,
            'max' : 1000,
            'dropchance' : 1,
            'price' : 5000000,
            'canbeupgradedto' : true
        },
        'underworld' : {
            'name' : 'Underworld Pickaxe',
            'img' : 'game/img/items/pickaxeHell.png',
            'speed' : 1000,
            'sharpness' : 5,
            'max' : 4000,
            'dropchance' : 0,
            'price' : 28000000,
            'canbeupgradedto' : false
        },
        'ender' : {
            'name' : 'Ender Pickaxe',
            'img' : 'game/img/items/pickaxeEnder.png',
            'speed' : 1000,
            'sharpness' : 6,
            'max' : 10000,
            'dropchance' : 0,
            'price' : 500000000,
            'canbeupgradedto' : false
        },
        'final' : {
            'name' : 'Final Pickaxe',
            'img' : 'game/img/items/pickaxeFinal.png',
            'speed' : 1000,
            'sharpness' : 6,
            'max' : 20000,
            'dropchance' : 0,
            'price' : 500000000000,
            'canbeupgradedto' : false 
        },
        'helldrill' : {
            'name' : 'Hell Drill',
            'img' : 'game/img/items/drillHell.png',
            'speed' : 1000,
            'sharpness' : 5,
            'max' : 9000,
            'dropchance' : 0,
            'price' : 30000000,
            'canbeupgradedto' : false
        },
        'muchsock' : {
            'name' : 'MUCH SOCK',
            'img' : 'game/img/items/muchsock.png',
            'speed' : 60000,
            'sharpness' : 0,
            'max' : 2,
            'dropchance' : 110,
            'price' : 0,
            'canbeupgradedto' : false
        }
}

var ores = {
    'endore' : {
        'img' : 'game/img/blocks/endore.png',
        'hardness' : 6,
        'worth' : 7000,
        'prob' : .01
    },
    'netherquartz' : {
        'img' : 'game/img/blocks/netherquartz.png',
        'hardness' : 5,
        'worth' : 3250,
        'prob' : .03
    },
    'glowstone' : {
        'img' : 'game/img/blocks/glowstone.png',
        'hardness' : 4,
        'worth': 2250,
        'prob' : .1
    },
    'diamond' : {
        'img' : 'game/img/blocks/diamond.png',
        'hardness' : 3,
        'worth': 240,
        'prob' : .05
    },
    'gold' : {
        'img' : 'game/img/blocks/gold.png',
        'hardness' : 3,
        'worth': 120,
        'prob' : .08
    },
    'iron' : {
        'img' : 'game/img/blocks/iron.png',
        'hardness' : 2,
        'worth': 30,
        'prob' : .12
    },
    'mossycobble' : {
        'img' : 'game/img/blocks/mossycobble.png',
        'hardness' : 1,
        'worth': 7,
        'prob' : .23
    },
    'coal' : {
        'img' : 'game/img/blocks/coal.png',
        'hardness' : 1,
        'worth' : 3,
        'prob' : .30
    },
    'stone' : {
        'img' : 'game/img/blocks/stone.png',
        'hardness' : 1,
        'worth' : 1,
        'prob' : 1
    }
}

var workers = {
    'steve' : {
        'name' : 'Steve',
        'img' : 'game/img/npc/steve.png',
        'pickaxe' : 'wood',
        'opm' : 200,
        'opmModifier' : 0,
        'price' : 3000,
        'sell' : 1750,
        'wages' : 300,
        'limit' : 900
    },
    'miner' : {
        'name' : 'Dedicated Miner',
        'img' : 'game/img/npc/miner.png',
        'pickaxe' : 'iron',
        'opm' : 400,
        'opmModifier' : 0,
        'price' : 15000,
        'sell' : 7250,
        'wages' : 400,
        'limit' : 800
    },
    'miner2' : {
        'name' : 'Experienced Miner',
        'img' : 'game/img/npc/morris.png',
        'pickaxe' : 'iron',
        'opm' : 1400,
        'opmModifier' : 0,
        'price' : 50000,
        'sell' : 25000,
        'wages' : 600,
        'limit' : 700
    },
    'heavenlyminer' : {
        'name' : 'Heavenly Miner',
        'img' : 'game/img/npc/heavenlyminer.png',
        'pickaxe' : 'heavenly',
        'opm' : 2000,
        'opmModifier' : 0,
        'price' : 200000,
        'sell' : 100000,
        'wages' : 1050,
        'limit' : 600
    },
    'hellminer' : {
        'name' : 'Hellish Miner',
        'img' : 'game/img/npc/hellMiner.png',
        'pickaxe' : 'underworld',
        'opm' : 4000,
        'opmModifier' : 0,
        'price' : 5000000,
        'sell' : 1000000,
        'wages' : 1500,
        'limit' : 500
    },
    'enderminer' : {
        'name' : 'End Miner',
        'img' : 'game/img/npc/enderman_face.png',
        'pickaxe' : 'ender',
        'opm' : 5000,
        'opmModifier' : 0,
        'price' : 15000000,
        'sell' : 7500000,
        'wages' : 2750,
        'limit' : 500
    }
}

var soldiers = {
    'knight' : {
        'name' : 'Knight',
        'img' : 'game/img/npc/soldier1.png',
        'kpe' : 1,
        'price' : 100,
        'sell' : 50,
        'underworld_able' : false
    },
    'advknight' : {
        'name' : 'Skilled Knight',
        'img' : 'game/img/npc/soldier2.png',
        'kpe' : 5,
        'price' : '400',
        'sell' : 120,
        'underworld_able' : false
    },
    'templar' : {
        'name' : 'Heavenly Templar',
        'img' : 'game/img/npc/soldier3.png',
        'kpe' : 20,
        'price' : '5000',
        'sell' : 1250,
        'underworld_able' : true
    }
}

//too late to change now, but "bosses"/"boss" pretty much translates to
//"npcs"/"npc"
var bosses = {
    'zombieBoss' : {
        'div' : '#zombieBoss',
        'messagebox' : '#zombieBoss p:first',
        'optionsbox' : '#zombieBoss p[name="options"]',
        'details' : {}
    },
    'golem' : {
        'div' : '#golem',
        'messagebox' : '#golem p:first',
        'optionsbox' : '#golem p[name="options"]',
        'details' : {},
        'store' : {
            
        }
    },
    'witch' : {
        'div' : '#witch',
        'messagebox' : '#witch p:first',
        'optionsbox' : '#witch p[name="options"]',
        'details' : {},
        'store' : {
            
        }
    },
    'chikolio' : {
        'details' : {
            'id' : 'chikolio',
            'name' : 'Chikolio',
            'prepend' : 'dc',
            'hasPortalParts' : true
        }
    },
    'underlord' : {
        'details' : {
            'id' : 'underlord',
            'name' : 'The Underlord',
            'prepend' : 'ul',
            'hasPortalParts' : false
        }
    },
    'enderboss' : {
        'details' : {
            'id' : 'enderboss',
            'name' : 'Enderboss',
            'prepend' : 'eb',
            'hasPortalParts' : false
        }
    }
}