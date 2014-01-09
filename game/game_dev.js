//yeah yeah yeah
var feedbackIDs = {};

//saving-related variables
var lastSave = 0;
var lastCookie = '';
var lastSubmit = 0;
var lastHardSave = 0;

//coming soon maybe?
var profileID = 0;

//don't touch this value, lel
var money = 0;
var achievements = {};

//stats, don't touch these either u cheater
var totalMoneyEarned = 0;
var statLootMoney = 0;
var statEnemiesKilled = 0;
var statDefendersKilled = 0;
var statBattlesWon = 0;
var statBattlesLost = 0;
var statWorkerOPM = 0;
var statMoneyPerTick = 0;

var vault = {};
var vaultStorageSettings = {};
var vault_max_upgrades = 20;
//not including starting vault space
var vault_cost_per_upgrade_baseprice = 500;
var vault_cost_per_upgrade_modifier = 3;
//price of previous upgrade * 3 for each upgrade
var vault_storage_per_upgrade = 250;
var vault_max_storage = vault_storage_per_upgrade;
//starting storage
var nextVaultUpgradePrice;

var pickaxe_type = 'wood';
var nextPickaxe;
var pickaxeUpgradeAvailable = false;

var maxWorkerMultiplier = 1;

var hasAutoPilot = false;
var autoPilotEnabled = false;
var autoPilotCost = 500000;

//zombie boss variables
var zbMoneyStolen = 0;
var canGetZombieProtection = false;
var zbChance = 0;
var zbChanceModifier = 1.10;
var zbInterval;
var zbActive = false;

//golem
var befriendedGolem = false;
var golemCost = 25000;
var golemHasOffered = false;

//witch
var befriendedWitch = false;
var witchCost = 25000;
var witchHasOffered = false;

//chikolio
var dcUnlocked = false;
var dcIntro = false;
var dcInterval;
var dcSoldiers = 0;
var dcChance = 5;
var dcAttacks = 0;
var dcOption = 0;
var dcActive = false;
var dcRanAway = false;

//underlord
var ulUnlocked = false;
var ulActive = false;
var ulIntro = false;
var ulInterval;
var ulSoldiers = 0;
var ulChance = 5;
var shrineHealth = 500000;
var shrineLastAttack = 0;

//enderman
var ebUnlocked = false;
var ebIntro = false;
var ebSoldiers = 0;
var ebInterval;
var ebAttacks = 0;
var ebHint = false;
var ebHealth = 5000000;
var ebOrbs = {
	1 : 1000000,
	2 : 1000000,
	3 : 1000000
};
var ebOrbsLastAttacked = 0;
var ebLastAttack = 0;

//two best bosses, resurrected
var dbResurrected = false;
var zbResurrected = false;

//workers
var employed = {};
var workerToggle = true;
var workerHappiness = 100;
var workersLastPaid = 0;
var workerTotalWages = 0;
var workerCurrentWages = 0;
var workerOPMLost = 0;
var workerPayCycle = 120000;

//soldiers
var employedSoldiers = {};

//insurance
var hasInsurance = false;
var insuranceCost = 5000000;

//portal parts
var portalParts = 0;
var portalBuilt = false;
var portalLit = false;
var portalPartChance = 60;
//chance you get a portal part from don chikolio
var portalCost = 750000;
var portalIgniteCost = 0;
var portalWarning = true;
var overWorld = true;
var portal = 0;
//where does the portal go to?

//research lab
var ownsResearchLab = false;
var scientists = 0;
var projects = {};
var finishedResearch = {};
var researching = false;
var workerOPMResearch = 0;

var partWaysCost = 100000;
var tab = '';

//stores popup messages that need to be displayed
var popupStack = {};
var popupActive = false;

var xoxo = false;
var saves = 0;

$(document).ready(function() {
    //variables containing DOM elements need to wait for document on ready
    var pickaxe_imgObject = $('#pickaxe');

    function mine() {
            var miningButton = $('button[name="mine"]');

            $('div[name="ores_collected"]').html('');

            //pickaxe details
            var miningTime = pickaxes[pickaxe_type].speed;
            //speed of pickaxe
            var maxOres = pickaxes[pickaxe_type].max;
            //max ores pickaxe can mine
            var dropchance = pickaxes[pickaxe_type].dropchance;
            //probability you will lose ores

            swingPickaxeAnimation(pickaxe_imgObject, pickaxe_type);

            miningButton.prop('disabled', true);

            //mining logic
            setTimeout(function() {
                    var numOresMined = maxOres;
                    var oresDropped = 0;
                    var oresObtained = 0;
                    var oresMined = {};

                    //percent chance of dropping 30% of ores mined
                    if ((rand(0, 1000) / 10) <= dropchance) {
                            oresDropped = Math.floor(rand(1, (numOresMined * .30)));
                            oresDropped = (oresDropped > 50) ? 50 : oresDropped;
                            oresObtained = (numOresMined - oresDropped);
                    } else {
                            oresObtained = numOresMined;
                    }

                    oresMined = generateOres(oresObtained, pickaxe_type);
                    addOreToVault(oresMined);

                    if (!hasAutoPilot || (hasAutoPilot && !autoPilotEnabled)) {
                            var oresMinedHtml = '<br/><br/><b>Ores Mined</b><br/><br/><table cellpadding="6">';
                            for (var minedOre in oresMined) {
                                    oresMinedHtml += '<tr><td style="text-align:center;"><img src="' + ores[minedOre].img + '" width="43" height="43" /></td><td>' + oresMined[minedOre] + '</td></tr>';
                            }
                            oresMinedHtml += '</table>';
                    }

                    $('div[name="ores_collected"]').html('Mined ' + numOresMined + ' ores, ' + ((oresDropped > 0) ? 'but' : 'and') + ' you lost ' + oresDropped + ' ore(s) in the process.' + oresMinedHtml);
                    updateVaultDisplay();

                    if (!hasAutoPilot || (hasAutoPilot && !autoPilotEnabled))
                            miningButton.prop('disabled', false);
                    else
                            mine();

                    updateValues();

            }, miningTime);
    }

    function researchLab() {
            if (ownsResearchLab) {
                    $('#employment div[name="research"] div[name="1"]').hide();
                    $('#employment div[name="research"] div[name="lab"]').show();

                    //open menu to choose a new upgrade to research
                    $(document).on('click', '#employment div[name="research"] a[name="start_research"]', function() {
                            if (Object.size(projects) >= 3) {
                                    alert('You cannot have more than 3 research projects at a time.');
                            } else {
                                    $('#employment div[name="research_options"]').show();
                                    drawResearchProjects();
                            }
                    });
            }
    }

    function research() {
            researching = true;
            setTimeout(function() {
                    if (Object.size(projects) > 0 && scientists > 0) {
                            var project;
                            for (var p in projects) {
                                    project = p;
                                    break;
                            }

                            //project time lapsed
                            projects[project] += scientists;

                            var percent = Math.round((projects[project] / research_projects[project].time) * 100);
                            percent = (percent >= 100) ? 100 : percent;

                            var htmlobj = $('#employment div[name="projects_holder"] div[name="' + project + '"] span');

                            htmlobj.css('width', percent + '%');
                            htmlobj.html(percent + '%');

                            if (projects[project] >= research_projects[project].time) {
                                    projects[project] = undefined;
                                    projects = removeUndefined(projects);

                                    if (project == 'workeropm')
                                            workerOPMResearch++;

                                    //research successful!
                                    research_projects[project].func();
                                    finishedResearch[project] = true;

                                    $('#employment div[name="projects_holder"] div[name="' + project + '"]').prev('span[name="details"]').remove();
                                    $('#employment div[name="projects_holder"] div[name="' + project + '"]').remove();

                                    if (Object.size(projects) == 0)
                                            $('#employment div[name="research"] span[name="no_projects"]').show();

                                    switch (project) {
                                            case 'workeropm':
                                                    startResearch('', 'workeropm');
                                            break;

                                            case 'unknown1':
                                                    var m1 = '<img src="game/img/npc/steve.png" style="margin-right:6px;" width="40" height="40" class="left">Dammit! Sir, I\'m sorry to report that, during our "unknown" research project, one of our scientists died; however, we managed to get the research completed on time.';
                                                    popup('INCIDENT REPORT', m1, '', 0);

                                                    scientists--;
                                            break;

                                            case 'unknown3':
                                                    var m2 = '<img src="game/img/npc/steve.png" style="margin-right:6px;" width="40" height="40" class="left">No, no! What is it?! It\'s in the lab!';

                                                    var buttons = {
                                                            '1' : {
                                                                    'text' : 'Continue',
                                                                    'func' : function() {
                                                                            enderboss();
                                                                            displayCurrentBoss();
                                                                    }
                                                            }
                                                    };

                                                    popup('INCIDENT REPORT', m2, buttons, 0);
                                                    scientists = Math.round(scientists / 2);
                                            break;

                                            case 'portal1':
                                                    portal = 1;
                                            break;

                                            default:
                                            break;
                                    }

                                    drawResearchProjects();
                            }
                    }

                    research();
            }, 1000);
    }

    function startResearch(e, project) {
            if ( typeof project == 'undefined') {
                    e.preventDefault();
                    project = $(this).attr('name').split('-')[1];
            }

            var obj = research_projects[project];

            //first, let's see if they have the required resources
            var hasRequiredResources = true;

            if (Object.size(obj.resources) > 0) {
                    for (var x in obj.resources) {
                            if ( typeof vault[x] == 'undefined' || vault[x] < obj.resources[x]) {
                                    hasRequiredResources = false;
                                    break;
                            }
                    }
            }

            if (money >= obj.price && hasRequiredResources) {
                    money -= obj.price;

                    //remove the resources from their vault
                    if (Object.size(obj.resources) > 0) {
                            for (var y in obj.resources) {
                                    vault[y] -= obj.resources[y];
                            }
                    }

                    projects[project] = 0;

                    if (!researching && Object.size(projects) > 0)
                            research();

                    $('#employment div[name="research"] span[name="no_projects"]').hide();
                    $('#employment div[name="projects_holder"]').show();
                    $('#employment div[name="projects_holder"]').append('<span name="details"><b>' + obj.name + '</b> <a href="#" name="research_cancel-' + project + '">[CANCEL]</a></span><div class="bar" name="' + project + '"><span style="width:0%;">0%</span></div>');

                    drawResearchProjects();
                    updateVaultDisplay();
                    updateValues();
            } else {
                    alert('You don\'t have the money or required resources for this research.');
            }
    }

    function cancelResearch(e) {
            e.preventDefault();

            var project = $(this).attr('name').split('-')[1];

            if (confirm("Are you sure you wish to cancel this research project?")) {
                    money += research_projects[project].price;

                    projects[project] = undefined;
                    projects = removeUndefined(projects);

                    $('#employment div[name="projects_holder"] div[name="' + project + '"]').prev('span[name="details"]').remove();
                    $('#employment div[name="projects_holder"] div[name="' + project + '"]').remove();
                    $('#employment div[name="research_options"]').hide();

                    if (Object.size(projects) == 0)
                            $('#employment div[name="research"] span[name="no_projects"]').show();
            }
    }

    function drawResearchProjects() {
            $('#employment div[name="research_options"] table').empty();
            for (var rp in research_projects) {
                    //can they research this yet?
                    var show = true;
                    var requires = research_projects[rp].requires;
                    if (Object.size(requires) > 0) {
                            for (var i = 0; i < Object.size(requires); i++) {
                                    if ( typeof finishedResearch[requires[i]] == 'undefined') {
                                            show = false;
                                            break;
                                    }
                            }
                    }

                    //now check if they've already researched or are researching it
                    if (show && ( typeof finishedResearch[rp] != 'undefined' && rp != 'workeropm'))
                            show = false;
                    else if (show && typeof projects[rp] != 'undefined')
                            show = false;

                    if (show) {
                            var r = research_projects[rp].resources;
                            var resources = '<b>RESOURCES REQUIRED:</b> ';
                            if (Object.size(r) > 0) {
                                    for (var resource in r)
                                    resources += ' <span style="color:orange;">[' + resource + ': ' + r[resource] + ']</span> ';
                            } else {
                                    resources += 'None.';
                            }

                            $('#employment div[name="research_options"] table').append('<tr class="research"><td><img src="' + research_projects[rp].img + '"></td><td><b>' + research_projects[rp].name + '</b><br/>' + research_projects[rp].description + ' Costs $' + moneyFormat(research_projects[rp].price) + '. Research time: ' + research_projects[rp].time + ' seconds.<br/>' + resources + '<br/><a href="#" name="research-' + rp + '" style="color:green;">RESEARCH THIS</a><br/><br/></td></tr>');
                    }
            }
    }

    function loadResearchLab() {
            //have they already researched stuff?
            //give them their benefits
            if (Object.size(finishedResearch) > 0) {
                    for (var x in finishedResearch) {
                            //some research projects may have been removed from
                            //the game, so lets remove them from their finished projects
                            if ( typeof research_projects[x] == 'undefined') {
                                    finishedResearch[x] = undefined;
                                    finishedResearch = removeUndefined(finishedResearch);
                            } else {
                                    //not removed!
                                    research_projects[x].func();
                            }
                    }
            }

            if (Object.size(projects) > 0) {
                    $('#employment div[name="research"] span[name="no_projects"]').hide();

                    for (var project in projects) {
                            var obj = research_projects[project];
                            var percent = Math.round((projects[project] / research_projects[project].time) * 100);

                            $('#employment div[name="projects_holder"]').append('<span name="details"><b>' + obj.name + '</b> <a href="#" name="research_cancel-' + project + '">[CANCEL]</a></span><div class="bar" name="' + project + '"><span style="width:' + percent + '%;">' + percent + '%</span></div>');
                    }

                    //resume researching
                    if (!researching)
                            research();
            }

            $('#employment span[name="scientists_owned"]').html(scientists);

            researchLab();
    }

    function zombieBoss() {
            zbInterval = setInterval(function() {
                    if (!befriendedGolem && !befriendedWitch) {
                            if (rand(0, 100) < zbChance && !zbActive) {
                                    zbActive = true;
                                    canGetZombieProtection = true;

                                    var message = '<img src="game/img/npc/zombie.png" style="margin-right:6px;" width="40" height="40" class="left"> Hello there. It seems your business is doing rather successful. But, there\'s a small problem. Your company is in my territory, therefore I expect some money in return for your success. I hope you don\'t mind I\'ve taken 60% of your money. We will be seeing each other soon.';

                                    popup('Zombie Boss', message, '', 0);

                                    //take 30% of their money
                                    var moneyStolen = Math.floor(money * .6)
                                    money -= moneyStolen;
                                    zbMoneyStolen += moneyStolen;

                                    updateValues();
                            }
                    }
            }, 180000);
    }

    function donChikolio() {
            if (dcUnlocked && !dcRanAway) {
                    //let the new boss introduce himself
                    if (!dcIntro) {
                            var message = '<img src="game/img/npc/chicken.png" style="margin-right:6px;" width="40" height="40" class="left"> I see you took care of that dimwit zombie of mine; he was really becoming an annoyance. But I must say, I\'m rather surprised by the growth rate of your business. We would make great "partners", if we worked together; however, if you choose other wise, ...';
                            var buttons = {
                                    'option1' : {
                                            'text' : "Let's be business partners.",
                                            'response' : '<img src="game/img/npc/chicken.png" style="margin-right:6px;" width="40" height="40" class="left"> Good, good! I\'m glad you have some sense in you. To officially confirm our partnership and respect, I\'ll be taking some of your manpower and 30% of your money. In return, I shall give you five portal parts. We\'re off to a great partnership, my friend.',
                                            'func' : function() {
                                                    money -= money * .3;
                                                    portalParts += 5;

                                                    //take half of workers for each category
                                                    for (var worker in employed) {
                                                            var numWorkers = employed[worker][0];

                                                            if (numWorkers > 0)
                                                                    employed[worker][0] = Math.ceil(employed[worker][0] / 2);
                                                    }

                                                    dcOption = 1;
                                                    dcIntro = true;
                                                    donChikolio();
                                            }
                                    },
                                    'option2' : {
                                            'text' : "No thanks.",
                                            'response' : '<img src="game/img/npc/chicken.png" style="margin-right:6px;" width="40" height="40" class="left"> Pfft, fool! If you aren\'t going to give me your business willingly, it seems I\'ll have take it! A war you shall be given!',
                                            'func' : function() {
                                                    dcOption = 2;
                                                    dcIntro = true;
                                                    donChikolio();
                                            }
                                    },
                                    'option3' : {
                                            'text' : "!#$@ off.",
                                            'response' : '<img src="game/img/npc/chicken.png" style="margin-right:6px;" width="40" height="40" class="left"> AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARRRRRRRGGGGGGGHHHHHHHHHHH!',
                                            'func' : function() {
                                                    dcSoldiers += 500;
                                                    dcOption = 3;
                                                    dcIntro = true;
                                                    donChikolio();
                                            }
                                    }
                            }

                            popup('Don Chikolio', message, buttons, 0);
                    } else {

                            //do work based off decision
                            dcInterval = setInterval(function() {
                                    if (dcOption == 1) {
                                            dcChance = 0;
                                    } else if (dcOption == 2) {
                                            dcSoldiers += 100 * (dcAttacks + 1);
                                            dcChance += 2;
                                    } else {
                                            dcSoldiers += 200 * (dcAttacks + 1);
                                            dcChance += 2;
                                    }

                                    //now what are the odds of attacking?
                                    //let there be a 5% of an attack, and for every skipped possibility
                                    //add on to that percentage
                                    if (rand(0, 100) < dcChance && !dcActive) {
                                            dcActive = true;
                                            dcAttacks++;

                                            battle(bosses['chikolio']['details']);
                                    }

                            }, 30000);
                    }

                    displayCurrentBoss();
            }
    }

    function underlord() {
            if (ulUnlocked && !ulIntro) {
                    //make sure the user manually clicks "continue" so we can say they've
                    //seen the intro to the underlord
                    var options = {
                            'x' : {
                                    'text' : 'Continue',
                                    'func' : function() {
                                            ulIntro = true;
                                            underlord();
                                    }
                            }
                    }

                    setTimeout(function() {
                            var message = '<img src="game/img/npc/zombiepigman_face.png" style="margin-right:6px;" width="40" height="40" class="left"> GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH! AT LAST, WE\'RE FREE! DESTROY THIS WORLD, AND CLAIM VICTORY FOR THE UNDERWORLD!';
                            popup('Underlord', message, options, 0);

                            //earthquake effect
                            $('#underlord').effect("shake", {
                                    times : 10
                            });
                    }, 10000);
            } else {
                    ulInterval = setInterval(function() {
                            if (shrineHealth > 0) {
                                    if (!overWorld)
                                            ulSoldiers += 60000;
                                    else
                                            ulSoldiers += 20000;

                                    ulChance += 2;
                                    $('#container').effect("shake", {
                                            times : 12
                                    });

                                    if (rand(0, 100) < ulChance && !ulActive) {
                                            ulActive = true;

                                            battle(bosses['underlord']['details']);
                                    }
                            }
                    }, 45000);
            }
    }

    function enderboss() {
            if (ebUnlocked) {
                    if (!ebIntro) {
                            var chars = ['!', '$', '#', '@'];
                            var interval = setInterval(function() {
                                    $('#popup p[name="title"]').text(chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)]);
                            }, 25);

                            var buttons = {
                                    '1' : {
                                            'text' : 'Continue',
                                            'func' : function() {
                                                    clearInterval(interval);
                                                    ebIntro = true;
                                                    enderboss();
                                            }
                                    }
                            };

                            var message = '<img src="game/img/npc/enderman_face.png" style="margin-right:6px;" width="40" height="40" class="left"> I am the Guardian of the End. It seemed your scientists were getting ahead of themselves, so I had to put an end to your research. Any attempts to attack me will be pointless; I cannot be seen. If you try to reach my homeland again, it will be <b>the end</b> of you.';
                            popup('', message, buttons, 0);
                    } else {
                            ebInterval = setInterval(function() {
                                    if (!areAllOrbsDestroyed()) {
                                            if (money > 0)
                                                    money -= money * .1;

                                            var message = 'This thing, it seems to get around undetected; it stole 10% of the money from your bank! Unbelievable!';
                                            if (befriendedGolem)
                                                    popup('MONEY STOLEN', '<img src="game/img/npc/golem_face.png" style="margin-right:6px;" width="40" height="40" class="left">' + message, '', 0);
                                            else
                                                    popup('MONEY STOLEN', '<img src="game/img/npc/witch_face.png" style="margin-right:6px;" width="40" height="40" class="left">' + message, '', 0);

                                            //they've seen the hint, therefore they have entered the end
                                            if (ebHint)
                                                    ebSoldiers += 100000;
                                    }
                            }, 80000);
                    }
            }
    }

    function attackOrb() {
            if (ebUnlocked && ebIntro && !areAllOrbsDestroyed()) {
                    if (ebSoldiers == 0) {
                            var d = new Date().getTime();

                            if ((d - ebOrbsLastAttacked) >= 20000) {
                                    ebOrbsLastAttacked = d;
                                    var orb = parseInt($(this).attr('name').split('-')[1]);
                                    var kpe = getArmyStrength();

                                    //make sure it isn't already destroyed
                                    if (ebOrbs[orb] > 0) {
                                            ebOrbs[orb] -= kpe;

                                            var health = (ebOrbs[orb] < 0) ? 0 : ebOrbs[orb];
                                            var percent = (health == 0) ? 100 : 100 - Math.round((health / 1000000) * 100);

                                            if (health == 0)
                                                    $('#orbs div[name="orb-' + orb + '"] span').css('width', percent + '%');

                                            $('#orbs span[name="orbhp-' + orb + '"]').text(health);

                                            if (areAllOrbsDestroyed()) {
                                                    var chars = ['!', '$', '#', '@'];
                                                    var interval = setInterval(function() {
                                                            $('#popup p[name="title"]').text(chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)]);
                                                    }, 25);

                                                    var buttons = {
                                                            '1' : {
                                                                    'text' : 'Continue',
                                                                    'func' : function() {
                                                                            $('#orbs').hide();
                                                                            $('#enderbossFight').show(800);
                                                                            clearInterval(interval);
                                                                            clearInterval(ebInterval);
                                                                    }
                                                            }
                                                    };

                                                    var message = '<img src="game/img/npc/enderman_face.png" style="margin-right:6px;" width="40" height="40" class="left"> NO! This can\'t be! How does a pathetic being like you manage such a task?! You may have defeated my minions and destroyed the orbs, but now it is time for me to end this madness once and for all.';
                                                    popup('', message, buttons, 0);
                                            }
                                    }
                            } else {
                                    alert('You can only attack the orbs once every 20 seconds.');
                            }
                    } else {
                            alert('You can\'t attack the orbs when there are endermen guarding it.');
                    }
            }
    }

    function attackEnderBoss() {
            if (areAllOrbsDestroyed() && ebHealth > 0) {
                    var d = new Date().getTime();

                    if ((d - ebLastAttack) > 30000) {
                            ebLastAttack = d;
                            ebHealth -= getArmyStrength();

                            $('#enderbossFight div[name="health"] span').css('width', 100 - Math.round((ebHealth / 5000000) * 100) + '%');

                            if (ebHealth > 0) {

                                    //kill off 40% of each soldier
                                    for (var soldier in employedSoldiers) {
                                            var killed = Math.round(employedSoldiers[soldier] * .4);
                                            employedSoldiers[soldier] -= killed;
                                    }

                                    $('#container').effect("shake", {
                                            times : 15
                                    });
                            } else {
                                    var chars = ['!', '$', '#', '@'];
                                    var interval = setInterval(function() {
                                            $('#popup p[name="title"]').text(chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)]);
                                    }, 25);

                                    setTimeout(function() {
                                            clearInterval(interval);
                                            $('#popup p[name="title"]').text('ENDERBOSS');
                                    }, 2000);

                                    var buttons = {
                                            '1' : {
                                                    'text' : 'Continue',
                                                    'func' : function() {
                                                            $('#enderbossFight').hide();
                                                            $('#mining_container').show(800);
                                                    }
                                            }
                                    };

                                    var message = '<img src="game/img/npc/enderman_face.png" style="margin-right:6px;" width="40" height="40" class="left"> Damn you, puny human...you may have defeated me, but you have not seen the last of my kind. You will perish!';
                                    popup('', message, buttons, 0);
                            }
                    } else {
                            alert('You can only attack every 30 seconds.');
                    }
            }
    }

    function areAllOrbsDestroyed() {
            var destroyed = 0;
            for (var orb in ebOrbs) {
                    if (!(ebOrbs[orb] > 0))
                            destroyed++;
            }
            return (destroyed == 3) ? true : false;
    }

    /* UPGRADING FUNCTIONS */

    function showUpgrades() {
            var color;

            //PICKAXE UPGRADE
            var i = 1;
            var pickaxeIndex = 1;
            var totalPickaxes = Object.size(pickaxes);

            //get next upgradeable pickaxe
            for (var pickaxe in pickaxes) {
                    //this is our pickaxe
                    if (pickaxes[pickaxe].name == pickaxes[pickaxe_type].name)
                            pickaxeIndex = i;

                    //this is the next pickaxe in the array/object
                    if (i == (pickaxeIndex + 1)) {
                            if (pickaxes[pickaxe].canbeupgradedto) {
                                    nextPickaxe = pickaxe;
                                    pickaxeUpgradeAvailable = true;
                            } else {
                                    pickaxeUpgradeAvailable = false;
                            }
                    }

                    i++;
            }

            //PICKAXE UPGRADE AVAILABLE
            if (pickaxeUpgradeAvailable && (totalPickaxes - pickaxeIndex) > 0 && overWorld) {
                    color = (money >= pickaxes[nextPickaxe].price) ? 'green' : 'red';
                    $('#pickaxe_upgrade_box').show();
                    $('#pickaxe_upgrade_box').html('<a href="#" name="upgrade_pickaxe" border="0"><div class="upgrade ' + color + '"><img src="' + pickaxes[nextPickaxe].img + '" width="65" height="60" /><b>' + pickaxes[nextPickaxe].name + '</b><br/>Price: $' + pickaxes[nextPickaxe].price + '<div class="clear"></div></div></a>');
            } else {
                    $('#pickaxe_upgrade_box').hide();
            }

            //VAULT UPGRADES
            var currentVaultUpgrade = (vault_max_storage / vault_storage_per_upgrade) - 1;

            //upgrades available
            if (currentVaultUpgrade < vault_max_upgrades && overWorld) {
                    var priceModifier = (currentVaultUpgrade * vault_cost_per_upgrade_modifier);
                    nextVaultUpgradePrice = (priceModifier == 0) ? vault_cost_per_upgrade_baseprice : vault_cost_per_upgrade_baseprice * priceModifier;

                    color = (money >= nextVaultUpgradePrice) ? 'green' : 'red';
                    $('#vault_upgrade_box').show();
                    $('#vault_upgrade_box').html('<a href="#" name="upgrade_vault" border="0"><div class="upgrade ' + color + '"><img src="game/img/icons/vault.png" width="65" height="60" /><b>Vault Upgrade ' + (currentVaultUpgrade + 1) + '</b><br/>Price: $' + nextVaultUpgradePrice + '<div class="clear"></div></div>');
            } else {
                    $('#vault_upgrade_box').hide();
            }

            //auto-pilot upgrade
            if (!hasAutoPilot && overWorld) {
                    color = (money >= autoPilotCost) ? 'green' : 'red';
                    $('#autopilot_upgrade_box').show();
                    $('#autopilot_upgrade_box').html('<a href="#" name="upgrade_autopilot" border="0"><div class="upgrade ' + color + '"><img src="game/img/icons/compass.png" width="65" height="60" /><b>Auto Pilot</b><br/>Price: $' + autoPilotCost + '<br/>Mining/selling is automatic.<div class="clear"></div></div>');
            } else {
                    $('#autopilot_upgrade_box').hide();
            }

            //golem protection upgrade
            if ((!befriendedGolem && !befriendedWitch) && canGetZombieProtection && overWorld) {
                    color = (money >= golemCost) ? 'green' : 'red';
                    $('#golem_upgrade_box').show();
                    $('#golem_upgrade_box').html('<a href="#" name="upgrade_golem" border="0"><div class="upgrade ' + color + '"><img src="game/img/npc/golem.png" width="65" height="60" /><b>Befriend Golem</b><br/>Price: $' + moneyFormat(golemCost) + '<br/>Me break zombie.<div class="clear"></div></div>');
            } else {
                    $('#golem_upgrade_box').hide();
            }

            //witch protection upgrade
            if ((!befriendedGolem && !befriendedWitch) && canGetZombieProtection && overWorld) {
                    color = (money >= witchCost) ? 'green' : 'red';
                    $('#witch_upgrade_box').show();
                    $('#witch_upgrade_box').html('<a href="#" name="upgrade_witch" border="0"><div class="upgrade ' + color + '"><img src="game/img/npc/witch.png" width="65" height="60" /><b>Befriend Witch</b><br/>Price: $' + moneyFormat(witchCost) + '<br/>Zombie? *Poof!*<div class="clear"></div></div>');
            } else {
                    $('#witch_upgrade_box').hide();
            }

            if (dcOption == 1 && !dcRanAway && overWorld) {
                    color = (money >= partWaysCost) ? 'green' : 'red';
                    $('#partways_upgrade_box').show();
                    $('#partways_upgrade_box').html('<a href="#" name="upgrade_partways" border="0"><div class="upgrade ' + color + '"><img src="game/img/npc/chicken.png" width="65" height="60" /><b>Part Ways</b><br/>Price: $' + moneyFormat(partWaysCost) + '<br/>Partners? No longer.<div class="clear"></div></div>');
            } else {
                    $('#partways_upgrade_box').hide();
            }

            if (portalParts >= 10 && !portalBuilt && overWorld) {
                    color = (money >= portalCost) ? 'green' : 'red';
                    $('#buildportal_upgrade_box').show();
                    $('#buildportal_upgrade_box').html('<a href="#" name="upgrade_buildportal" border="0"><div class="upgrade ' + color + '"><img src="game/img/icons/portal_lit.png" width="65" height="60" /><b>Build Portal</b><br/>Price: $' + moneyFormat(portalCost) + '<br/>Construct a portal.<div class="clear"></div></div>');
            } else {
                    $('#buildportal_upgrade_box').hide();
            }

            if (!portalLit && portalBuilt && overWorld) {
                    color = (money >= portalIgniteCost) ? 'green' : 'red';
                    $('#igniteportal_upgrade_box').show();
                    $('#igniteportal_upgrade_box').html('<a href="#" name="upgrade_igniteportal" border="0"><div class="upgrade ' + color + '"><img src="game/img/icons/flintnsteel.png" width="65" height="60" /><b>Ignite Portal</b><br/>Price: $' + moneyFormat(portalIgniteCost) + '<br/>Uh oh.<div class="clear"></div></div>');
            } else {
                    $('#igniteportal_upgrade_box').hide();
            }

            if (!portalLit && portalBuilt && overWorld) {
                    color = (money >= portalIgniteCost) ? 'green' : 'red';
                    $('#igniteportal_upgrade_box').show();
                    $('#igniteportal_upgrade_box').html('<a href="#" name="upgrade_igniteportal" border="0"><div class="upgrade ' + color + '"><img src="game/img/icons/flintnsteel.png" width="65" height="60" /><b>Ignite Portal</b><br/>Price: $' + moneyFormat(portalIgniteCost) + '<br/>Uh oh.<div class="clear"></div></div>');
            } else {
                    $('#igniteportal_upgrade_box').hide();
            }

            if (pickaxe_type != 'underworld' && shrineHealth == 0 && portal == 0 && !overWorld) {
                    var pObj = pickaxes['underworld'];

                    color = (money >= pObj.price) ? 'green' : 'red';
                    $('#hellpickaxe_upgrade_box').show();
                    $('#hellpickaxe_upgrade_box').html('<a href="#" name="upgrade_hellpickaxe" border="0"><div class="upgrade ' + color + '"><img src="' + pObj.img + '" width="65" height="60" /><b>' + pObj.name + '</b><br/>Price: $' + moneyFormat(pObj.price) + '<br/>The underlord\'s.<div class="clear"></div></div>');
            } else {
                    $('#hellpickaxe_upgrade_box').hide();
            }

            if (pickaxe_type != 'ender' && pickaxe_type != 'final' && ebHealth <= 0 && portal == 1 && !overWorld) {
                    var pObj = pickaxes['ender'];

                    color = (money >= pObj.price) ? 'green' : 'red';
                    $('#enderpickaxe_upgrade_box').show();
                    $('#enderpickaxe_upgrade_box').html('<a href="#" name="upgrade_enderpickaxe" border="0"><div class="upgrade ' + color + '"><img src="' + pObj.img + '" width="65" height="60" /><b>' + pObj.name + '</b><br/>Price: $' + moneyFormat(pObj.price) + '<br/>!$#<div class="clear"></div></div>');
            } else {
                    $('#enderpickaxe_upgrade_box').hide();
            }

            if (pickaxe_type == 'ender') {
                    var pObj = pickaxes['final'];

                    color = (money >= pObj.price) ? 'green' : 'red';
                    $('#finalpickaxe_upgrade_box').show();
                    $('#finalpickaxe_upgrade_box').html('<a href="#" name="upgrade_finalpickaxe" border="0"><div class="upgrade ' + color + '"><img src="' + pObj.img + '" width="65" height="60" /><b>' + pObj.name + '</b><br/>$' + moneyFormat(pObj.price) + '<br/>Pickaxes are outdated.<div class="clear"></div></div>');
            } else {
                    $('#finalpickaxe_upgrade_box').hide();
            }

            //STILL DON'T KNOW WHAT TO DO WITH THIS.
            //GOT ANY IDEAS FELLOW SOURCE CODE VIEWER?
            /*if(totalMoneyEarned >= 1000000){
                if(!hasInsurance){
                color = (money >= insuranceCost) ? 'green' : 'red';
                $('#insurance_upgrade_box').show();
                $('#insurance_upgrade_box').html('<a href="#" name="upgrade_insurance" border="0"><div class="upgrade '+color+'"><img src="game/img/icons/insurance.png" width="65" height="60" /><b>Insurance</b><br/>Price: $'+ insuranceCost +'<br/>You never know.<div class="clear"></div></div>');
                }else{
                $('#insurance_upgrade_box').hide();
                }
                }*/
    }

    /* UPGRADING FUNCTIONS */

    function upgradePickaxe(e) {
            e.preventDefault();

            if (money >= pickaxes[nextPickaxe].price) {
                    money -= pickaxes[nextPickaxe].price;
                    pickaxe_type = nextPickaxe;
                    updateValues();

                    if (!achievements['upgradedPickaxe']) {
                            achievements['upgradedPickaxe'] = true;
                            popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">FIRST UPGRADE...</td></tr></table>', false, 4000);
                    }
            }
    }

    function upgradeVault(e) {
            e.preventDefault();

            if (money >= nextVaultUpgradePrice) {
                    money -= nextVaultUpgradePrice;
                    vault_max_storage += vault_storage_per_upgrade;
                    updateValues();
            }
    }

    function upgradeAutoPilot(e) {
            e.preventDefault();

            if (money >= autoPilotCost) {
                    money -= autoPilotCost;
                    hasAutoPilot = true;
                    autoPilotEnabled = true;
                    $('#autopilot_option').show();
                    mine();
                    sellVaultOres();
                    updateValues();
            }
    }

    function upgradeHellPickaxe() {
            if (shrineHealth == 0 && money >= pickaxes['underworld'].price) {
                    pickaxe_type = 'underworld';
                    money -= pickaxes['underworld'].price;
            }
    }

    function upgradeEnderPickaxe() {
            if (ebHealth <= 0 && money >= pickaxes['ender'].price) {
                    pickaxe_type = 'ender';
                    money -= pickaxes['ender'].price;
            }
    }

    function upgradeFinalPickaxe() {
            if (pickaxe_type == 'ender' && money >= pickaxes['final'].price) {
                    pickaxe_type = 'final';
                    money -= pickaxes['final'].price;
            }
    }

    function befriendGolem() {
            if (money >= golemCost) {
                    money -= golemCost;

                    befriendedGolem = true;
                    canGetZombieProtection = false;

                    dcUnlocked = true;
                    clearInterval(zbInterval);
                    updateValues();
                    displayFriends();
                    displayCurrentBoss();

                    var buttons = {
                            'button1' : {
                                    'text' : 'Thanks!',
                                    'func' : function() {
                                            money += zbMoneyStolen;
                                            setTimeout(donChikolio, 10000);
                                    }
                            },
                            'button2' : {
                                    'text' : 'Thanks, but you can keep the money!',
                                    'func' : function() {
                                            setTimeout(donChikolio, 10000);
                                    }
                            }
                    }

                    var message = '<img src="game/img/npc/golem_face.png" style="margin-right:6px;" width="40" height="40" class="left">You don\'t have to worry about him anymore. Let\'s just say it\'s been taken care of. Oh, and that $' + moneyFormat(zbMoneyStolen) + ' stolen from you? Here, have it back.';
                    popup('Golem', message, buttons, 0);
            }
    }

    function befriendWitch() {
            if (money >= witchCost) {
                    money -= witchCost;

                    befriendedWitch = true;
                    canGetZombieProtection = false;

                    dcUnlocked = true;
                    clearInterval(zbInterval);
                    updateValues();
                    displayFriends();
                    displayCurrentBoss();

                    var buttons = {
                            'button1' : {
                                    'text' : 'Thanks!',
                                    'func' : function() {
                                            setTimeout(donChikolio, 10000);
                                    }
                            }
                    }

                    var message = '<img src="game/img/npc/witch_face.png" style="margin-right:6px;" width="40" height="40" class="left">Phew! Let\'s just say that zombie won\'t be a problem anymore. It\'s nice to meet you; hope we can see eachother again sometime!';
                    popup('Witch', message, buttons, 0);
            }
    }

    function partWays(e) {
            e.preventDefault();

            if (money >= partWaysCost) {
                    money -= partWaysCost;
                    dcOption = 2;
                    updateValues();
            }
    }

    function buildPortal() {
            if (money >= portalCost && portalParts >= 10 && !portalBuilt) {
                    money -= portalCost;
                    portalParts -= 10;
                    portalBuilt = true;

                    $('#employment div[name="portal"]').html('<img id="portal" src="game/img/icons/portal_unlit.png" width="310" height="365" />');
                    updateValues();
            }
    }

    function ignitePortal() {
            if (money >= portalIgniteCost && portalBuilt && !portalLit) {
                    money -= portalIgniteCost;
                    portalLit = true;
                    ulUnlocked = true;

                    $('#employment div[name="portal"]').html('<a href="#" name="portal"><img id="portal" src="game/img/icons/portal_lit.png" width="310" height="365" /></a>');
                    updateValues();
                    displayCurrentBoss();

                    var buttons = {
                            'x' : {
                                    'text' : 'Continue',
                                    'func' : function() {
                                            //let's meet our new boss!
                                            underlord();
                                            dcRanAway = true;
                                            clearInterval(dcInterval);
                                            ulSoldiers += 100000;
                                    }
                            }
                    };

                    var message = '<img src="game/img/npc/chicken.png" style="margin-right:6px;" width="40" height="40" class="left"> WHAT ARE YOU DOING?! YOU ARE OPENING A PORTAL TO HELL! YOU\'VE KILLED US ALL!!!!!!!!!!!!!!!';
                    popup('Don Chikolio', message, buttons, 0);
            }
    }

    /* ALLY/FRIEND FUNCTIONS */

    function witchOffer() {
            var message = '<img src="game/img/npc/witch_face.png" style="margin-right:6px;" width="40" height="40" class="left"> Ah, yes! You again. Hmm, well...if you\'re looking for something...I\'ve recently learned some new enchantments. I could upgrade that pickaxe of yours with some nice new abilities, if you brought me the necessary items.';
            popup('Witch', message, '', 0);
            witchHasOffered = true;
    }

    function golemOffer() {

    }

    /* STORE */

    function store() {

    }

    /* WORKER FUNCTIONS*/

    function workerMain(){
    setTimeout(function(){
        if(workerToggle){
            calculateWorkerWages();

            for(var e in employed){
                var wObj = workers[e];
                var orePerSecond = Math.ceil((wObj.opm+wObj.opmModifier)/60)*employed[e][0];
                var oresMined = generateOres(orePerSecond, wObj.pickaxe);

                //add newly mined ore count to worker's ore
                for(var ore in oresMined){
                    employed[e][1][ore] += oresMined[ore];

                    //we aren't storing the ore, so let's go ahead and sell it
                    totalMoneyEarned += ores[ore].worth*oresMined[ore];
                    money += ores[ore].worth*oresMined[ore];
                }
            }
        }

        updateValues();
        workerMain();
    }, 1000);
}

function workerHappinessFunc(){
    setTimeout(function(){
            var d = new Date().getTime();

            //determine happiness
            //happiness will drop by 1 every 30 seconds
            if(workersLastPaid > 0){
                if((d-workersLastPaid) > workerPayCycle && workerHappiness > 0)
                    workerHappiness--;

                if((d-workersLastPaid) < workerPayCycle && workerHappiness < 100)
                    workerHappiness++;
            }
    },30000);
}

function calculateWorkerWages(){
    //a workers "wage property is the value of how much you will pay
    //per worker when the page time is up

    var d = new Date().getTime();

    //wages variables
    var wages = 0;
    var totalWages = 0;

    //e.g: if wage is $20, and wages need to be paid every 10 minutes
    //and only 5 minutes have passed, so far only $5 of the $10 will be added
    console.log(workersLastPaid);
    var timeVar = (workersLastPaid == 0) ? 0/workerPayCycle : ((d-workersLastPaid)/workerPayCycle);

    for(var e in employed){
        if(employed[e][0] > 0){
            totalWages += Math.round(workers[e].wages*employed[e][0]);
            wages += Math.round((workers[e].wages*employed[e][0])*timeVar);
        }
    }

    workerTotalWages = totalWages;
    workerCurrentWages = wages;
    }

    function showWorkers(){
        var d = new Date().getTime();
        var html = '<tr><td><button name="toggleworkers">TURN WORKERS '+ ((workerToggle) ? 'OFF' : 'ON') +'</button></td><td style="text-align:left;" colspan="2"><b>WORKER HAPPINESS:</b> '+ workerHappiness +'/100<br/>';
        html += '<b>OPM PRODUCTIVITY LOST:</b> '+ workerOPMLost +'<br/><button name="pay_wages" '+(((d-workersLastPaid < workerPayCycle) || workersLastPaid == 0) ? 'disabled="disabled"' : '')+'>';
        html += 'Pay Wages ($'+ numberFormat(workerCurrentWages) +'/$'+ numberFormat(workerTotalWages) +')</button></td></tr>';
        html += '<tr><td colspan="3"><hr></td></tr>';

        for(var worker in workers){
            if((worker == 'enderminer' && ebHealth <= 0) || worker != 'enderminer'){
                var wObj = workers[worker];

                //modified price, based on # owned
                var price = wObj.price*(Math.pow(1.025,employed[worker][0]));
                price = (price == 0) ? wObj.price : price;

                html += '<tr><td><img src="'+ wObj.img +'" width="60" height="65"><br/><b>'+ wObj.name +'<br/>'+ pickaxes[wObj.pickaxe].name +'</b><br/>$'+ moneyFormat(price) +' - '+ (wObj.opm+wObj.opmModifier) +' OPM</td>';
                html += '<td><button name="buy-'+ worker +'">Buy</button><button name="sell-'+ worker +'">Sell</button><br/><button name="buymax-'+ worker +'">Buy Max</button><br/>You own '+ employed[worker][0] +' / ' + Math.floor(wObj.limit * maxWorkerMultiplier) + '.</td>';

                for(var ore in employed[worker][1]){
                    var amount = employed[worker][1][ore];

                    if(amount > 0){
                        html += '<td><img src="'+ ores[ore].img +'" /><br/>x'+ numberFormat(amount) +'</td>';
                    }
                }

                html += '</tr>';
            }
        }
        $('#employment table[name="workers"]').html(html);
    }

    function showSoldiers() {
            var html = '';
            for (var soldier in soldiers) {
                    var sObj = soldiers[soldier];
                    html += '<tr><td><img src="' + sObj.img + '" width="60" height="65"><br/><b>' + sObj.name + '</b><br/>$' + moneyFormat(sObj.price) + ' - KPE: ' + sObj.kpe + '</td>';
                    html += '<td><button name="buy-' + soldier + '">Buy</button><button name="sell-' + soldier + '">Sell</button><br/><button name="buyx-' + soldier + '">Buy X</button><button name="sellx-' + soldier + '">Sell X</button><br/>You own ' + numberFormat(employedSoldiers[soldier]) + '.</td>';
                    html += '<td>Total KPE: ' + numberFormat(soldiers[soldier].kpe * employedSoldiers[soldier]) + '</td>';
            }

            $('#employment table[name="soldiers"]').html(html);
    }

    function buyWorker() {
            var workerType = $(this).attr('name').split('-')[1];
            var workerCount = employed[workerType][0];
            var cost = workers[workerType].price * (Math.pow(1.025, workerCount));

            if ( (workerCount + 1) <= ( Math.floor(workers[workerType].limit * maxWorkerMultiplier) )) {

                    if (money >= cost) {
                            money -= cost;
                            employed[workerType][0] += 1;
                            updateValues();

                            if(workersLastPaid == 0)
                                    workersLastPaid = new Date().getTime();
                    } else {
                            alert('You need more money to hire this worker.');
                    }
            } else {
                    alert('You can not buy any more workers of that type.');
            }

            if (employed[workerType][0] > Math.floor(workers[workerType].limit * maxWorkerMultiplier) ) {
                    employed[workerType][0] = Math.floor(workers[workerType].limit * maxWorkerMultiplier);
            }

    }

    function buyMaxWorkers() {
            var workerType = $(this).attr('name').split('-')[1];
            var workerCount = employed[workerType][0];
            var totalcost = workers[workerType].price * (Math.pow(1.025, workerCount));
            var newWorkerCount = workerCount;

            var i = 1;
            for (i; money >= totalcost; i++) {
                    var newAmount = workers[workerType].price * (Math.pow(1.025, workerCount + i));
                    newWorkerCount++;

                    //TODO: include percentage from research for worker
                    if (!(money >= totalcost + newAmount) || ( (newWorkerCount + 1) >  Math.floor(workers[workerType].limit * maxWorkerMultiplier) ) )
                            break;

                    totalcost += newAmount;
            }

            if (money >= totalcost) {
                    var buttons = {
                            '1' : {
                                    'text' : 'Yes',
                                    'func' : function() {
                                            if (money >= totalcost) {
                                                    money -= totalcost;
                                                    employed[workerType][0] += i;
                                                    updateValues();

                                                    if(workersLastPaid == 0)
                                                            workersLastPaid = new Date().getTime();
                                            }
                                    }
                            },
                            '2' : {
                                    'text' : 'No',
                                    'func' : function() {
                                    }
                            }
                    };

                    popup('CONFIRM', 'Are you sure you wish to purchase ' + i + ' ' + workers[workerType].name + '(s) ?', buttons, 0);

                    $("html, body").animate({
                            scrollTop : 0
                    }, "slow");
            } else {
                    alert('You can\'t even afford one!');
            }
    }

    function sellWorker() {
            var workerType = $(this).attr('name').split('-')[1];

            if (employed[workerType][0] > 0) {
                    money += workers[workerType].sell;
                    employed[workerType][0] -= 1;
                    updateValues();
            } else {
                    alert('You can\'t sell something you don\'t have.');
            }
    }

    function buySoldier(soldierType, x) {
            var name = soldiers[soldierType].name;
            var cost = soldiers[soldierType].price;
            var amount = (x) ? x : 1;

            cost = cost * amount;

            if (money >= cost) {
                    if (amount == 1) {
                            money -= cost;
                            employedSoldiers[soldierType] += amount;
                            updateValues();
                    } else if (amount > 1) {
                            //confirm purchase
                            var html = 'Are you sure you wish to purchase ' + amount + ' ' + name + 's, worth ' + cost + '.';

                            var buttons = {
                                    'yes' : {
                                            'text' : 'Yes',
                                            'func' : function() {
                                                    if (money >= cost) {
                                                            money -= cost;
                                                            employedSoldiers[soldierType] += amount;
                                                            updateValues();
                                                    }
                                            }
                                    },
                                    'no' : {
                                            'text' : 'No',
                                            'func' : function() {
                                            }
                                    }
                            };

                            popup('CONFIRM PURCHASE', html, buttons, 0);
                    }
            } else {
                    alert('You do not have enough money.');
            }
    }

    function sellSoldier(obj, x) {
            var soldierType = obj.attr('name').split('-')[1];
            var name = soldiers[soldierType].name;
            var amount = 1;

            if (x)
                    amount = parseInt(prompt('How many ' + name + 's do you wish to sell?', ''));

            if (employedSoldiers[soldierType] >= amount) {
                    if (amount == 1 || (amount > 0 && confirm('Are you sure you wish to sell ' + amount + ' ' + name + 's?'))) {
                            money += soldiers[soldierType].sell * amount;
                            employedSoldiers[soldierType] -= amount;
                            updateValues();
                    }
            } else {
                    alert('You do not have this many to sell.');
            }
    }

    function buyScientist() {
            var cost = 1000000 * (Math.pow(1.0005, scientists));

            if (money >= cost) {
                    scientists++;
                    money -= cost;
                    updateValues();

                    $('#employment span[name="scientists_owned"]').html(scientists);
            } else {
                    popup('You need more money to hire this worker.');
            }
    }

    function buyXScientists() {
            var html = '# of scientists you wish to hire<br/><input type="text" name="x_amount" length="30">';

            var buttons = {
                    'continue' : {
                            'text' : 'Buy',
                            'func' : function() {
                                    var amount = parseInt($('#popup input[name="x_amount"]').val());
                                    var totalcost = 1000000 * (Math.pow(1.0005, scientists));

                                    var i = 1;
                                    for (i; i >= amount; i++) {
                                            var newAmount = 1000000 * (Math.pow(1.0005, scientists + i));
                                            totalcost += newAmount;
                                    }

                                    if (money >= totalcost) {
                                            scientists += amount;
                                            money -= totalcost;
                                            $('#employment span[name="scientists_owned"]').html(scientists);
                                    } else {
                                            popup('WOOPS', 'You can\'t afford to purchase that many scientists!', '', 0);
                                    }
                            }
                    },
                    'cancel' : {
                            'text' : 'Cancel',
                            'func' : function() {
                            }
                    }
            };

            popup('HOW MANY, EXACTLY?', html, buttons, 0);
    }

    function buyMaxScientists() {

            var totalcost = 1000000 * (Math.pow(1.0005, scientists));

            var i = 1;
            for (i; money >= totalcost; i++) {
                    var newAmount = 1000000 * (Math.pow(1.0005, scientists + i));

                    if (!(money >= totalcost + newAmount))
                            break;

                    totalcost += newAmount;
            }

            if (money >= totalcost) {
                    var buttons = {
                            '1' : {
                                    'text' : 'Yes',
                                    'func' : function() {

                                            if (money >= totalcost) {
                                                    scientists += i;
                                                    money -= totalcost;

                                                    $('#employment span[name="scientists_owned"]').html(scientists);
                                                    updateValues();
                                            }
                                    }
                            },
                            '2' : {
                                    'text' : 'No',
                                    'func' : function() {
                                    }
                            }
                    };

                    popup('ARE YOU SURE?', 'Are you sure you wish to buy ' + i + ' scientist(s) for $' + moneyFormat(totalcost) + '?', buttons, 0);
            } else {
                    alert('You can\'t even afford one!');
            }
    }

    function sellScientist() {
            var cost = 1000000 * (Math.pow(1.0005, scientists));

            if (scientists > 0) {
                    scientists--;
                    money += Math.floor(cost / 4);
                    updateValues();

                    $('#employment span[name="scientists_owned"]').html(scientists);
            }
    }

    /* VAULT FUNCTIONS */
    function addOreToVault(ore) {
            if ((amountOfOreInVault() < vault_max_storage) || autoPilotEnabled) {
                    for (var o in ore) {
                            var amount = ore[o];
                            var inVault = amountOfOreInVault();

                            if ( typeof vault[o] == 'undefined')
                                    vault[o] = 0;

                            //how much can we add without overflowing?
                            if (inVault + amount < vault_max_storage) {
                                    vault[o] += amount;
                            } else {
                                    //well then how many can we squeeze in?
                                    vault[o] += (vault_max_storage - inVault);
                            }

                            //finally, one last check
                            if (amountOfOreInVault() >= vault_max_storage) {
                                    if (autoPilotEnabled) {
                                            sellVaultOres();
                                    } else {
                                            $('#vault p[name="full"]').show();
                                            break;
                                    }
                            }
                    }
            } else {
                    $('#vault p[name="full"]').show();
            }
    }

    function amountOfOreInVault() {
            var x = 0;
            for (var ore in vault) {
                    x += vault[ore];
            }
            return ( typeof x == 'NaN') ? 0 : x;
    }

    function sellVaultOres() {
            var worth = 0;
            for (var ore in vault) {
                    var keep = ( typeof vaultStorageSettings[ore] != 'number') ? 0 : vaultStorageSettings[ore];

                    if (vault[ore] > keep) {
                            var sold = (vault[ore] - keep);
                            worth += ores[ore].worth * sold;
                            vault[ore] -= sold;
                    }
            }

            totalMoneyEarned += worth;
            money += worth;

            updateVaultDisplay();
            updateValues();

            $('#vault p[name="full"]').hide();
    }

    function updateVaultDisplay() {
            var newHtml = '';

            var totalWorth = 0;
            for (var storedOre in vault) {
                    //price * amount stored in vault
                    var worth = ores[storedOre].worth * vault[storedOre]
                    totalWorth += worth;

                    newHtml += '<tr><td style="text-align:center;"><img src="' + ores[storedOre].img + '" width="43" height="43" /></td><td>' + vault[storedOre] + '</td><td>$' + worth + '</td></tr>';
            }

            newHtml += '<tr><td colspan="2" style="text-align:right;"><b>total worth:</b></td><td> $' + totalWorth + '</td></tr>';
            newHtml += '<tr><td colspan="3" style="text-align:center;"><button name="vault_sell">Sell Ore</button><button name="vault_options">Storage Options</button></td></tr>';

            $('table[name="vault"]').find('tr:gt(0)').remove();
            $('table[name="vault"] tr:first').after(newHtml);
    }

    function updateVaultSettings() {
            var html = 'Next to each ore is an input field; type in a number into this field, and your vault will make sure to keep that # of ore in your vault at all times.<hr><table>';

            for (var ore in ores) {
                    var currentSetting = vaultStorageSettings[ore];

                    if ( typeof vaultStorageSettings[ore] == 'undefined')
                            currentSetting = 0;

                    html += '<tr><td><img src="' + ores[ore].img + '" /></td><td><input type="text" name="maxore-' + ore + '" value="' + currentSetting + '" maxlength="20"></td></tr>';
            }

            var buttons = {
                    'update' : {
                            'text' : 'Save Changes',
                            'func' : function() {
                                    $.each($('#popup input[name|="maxore"]'), function(i, v) {
                                            var int_val = parseInt($(this).val());

                                            if (int_val >= 0) {
                                                    vaultStorageSettings[($(this).attr('name').split('-')[1])] = int_val;
                                            } else {
                                                    vaultStorageSettings[($(this).attr('name').split('-')[1])] = 0;
                                            }
                                    });
                            }
                    },
                    'reset' : {
                            'text' : 'Reset to 0',
                            'func' : function() {
                                    $.each($('#popup input[name|="maxore"]'), function(i, v) {
                                            $(this).val('0');
                                    });
                            }
                    },
                    'cancel' : {
                            'text' : 'Cancel',
                            'func' : function() {
                            }
                    }
            };

            popup('VAULT SETTINGS', html, buttons, 0);
    }

    /* OIOIOIOIO, DA PORTAL FUNCTION */

    function enterPortal() {
            if (overWorld) {
                    if (portal == 0) {
                            if (ulSoldiers <= 0) {
                                    if (!portalWarning || (portalWarning && confirm("Are you sure you wish to go to the underworld? **WARNING** While in the Underworld, the Underlord's army increases at a higher rate; they can only be killed with heavenly warriors."))) {
                                            overWorld = false;
                                            portalWarning = false;

                                            $('body').css('background-color', 'black');
                                            $('body').css('color', 'red');
                                            $('a').css('color', 'red');
                                            $('h2').css('color', 'red');
                                            $('#bosses').css('background-color', 'black');
                                            $('#container').effect("shake", {
                                                    times : 30
                                            });

                                            if (shrineHealth > 0) {
                                                    ulSoldiers += 100000;
                                                    $('#mining_container').hide();
                                                    $('#shrine').fadeIn(2000);
                                            }
                                    }
                            } else {
                                    alert('You cannot go to the underworld until you have defeated the Underlord\'s soldiers here in the overworld.');
                            }
                    } else {
                            //going to the end!
                            overWorld = false;

                            $('body').css('background-color', '#0f2729');
                            $('body').css('color', '#2a6e74');
                            $('a').css('color', '#2a6e74');
                            $('h2').css('color', '#2a6e74');
                            $('#container').effect("shake", {
                                    times : 15
                            });

                            if (!areAllOrbsDestroyed()) {
                                    $('#mining_container').hide();
                                    $('#orbs').show(500);

                                    if (!ebHint) {
                                            var buttons = {
                                                    '1' : {
                                                            'text' : 'Continue',
                                                            'func' : function() {
                                                                    ebHint = true;

                                                                    var chars = ['!', '$', '#', '@'];
                                                                    var interval = setInterval(function() {
                                                                            $('#popup p[name="title"]').text(chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)] + chars[rand(0, Object.size(chars) - 1)]);
                                                                    }, 25);

                                                                    var buttons = {
                                                                            '1' : {
                                                                                    'text' : 'Continue',
                                                                                    'func' : function() {
                                                                                            clearInterval(interval);
                                                                                    }
                                                                            }
                                                                    };

                                                                    var message = '<img src="game/img/npc/enderman_face.png" style="margin-right:6px;" width="40" height="40" class="left"> You were warned. You\'ve left me no choice but to unleash my soldiers to ensure your destruction. Why get my hands dirty?';
                                                                    popup('', message, buttons, 0);
                                                            }
                                                    }
                                            };

                                            var message = 'Your scientists report that the only way we will be able to fight this thing is if we manage to destroy the three orbs. The orbs, if completely destroyed, will allow your army to see and fight the monster. We also believe that they will regenerate health overtime, so be quick. Good luck.';
                                            if (befriendedGolem)
                                                    popup('HINT', '<img src="game/img/npc/golem_face.png" style="margin-right:6px;" width="40" height="40" class="left">' + message, buttons, 0);
                                            else
                                                    popup('HINT', '<img src="game/img/npc/witch_face.png" style="margin-right:6px;" width="40" height="40" class="left">' + message, buttons, 0);
                                    }
                            } else if (ebHealth > 0) {
                                    $('#mining_container').hide();
                                    $('#enderbossFight').show(800);
                            }
                    }
            } else {
                    overWorld = true;

                    $('body').css('background-color', 'white');
                    $('body').css('color', 'black');
                    $('a').css('color', 'black');
                    $('h2').css('color', 'black');
                    $('#bosses').css('background-color', 'white');
                    $('#container').effect("shake", {
                            times : 15
                    });

                    $('#mining_container').fadeIn(2000);
                    $('#shrine').hide();
                    $('#orbs').hide();
            }
    }

    /* GAME LOADING/SAVING FUNCTIONS */
    function load() {
            $('#loading_screen').show();

            var cookie = getCookie('saved_game');

            if ( typeof cookie != 'undefined' && cookie.length > 0) {
                    cookie = decodeURIComponent(escape(Base64.decode(cookie)));
                    cookie = JSON.parse(cookie);

                    console.log(cookie);

                    //loop through object and load each element into session
                    for (var key in cookie) {
                            var obj = cookie[key];
                            window[""+key] = obj;
                    }

                    //eval(cookie);
                    eval(Base64.decode('aWYodXBkYXRlPDkpe3Byb2ZpbGVJRD1zYXZlczt9'));

                    lastCookie = cookie;

                    //update message
                    if (update < 19) {
                            if (confirm("There's been an update! Would you like to see the changes?"))
                                    window.open('http://www.rscharts.com/game/changelog.txt?v=2');

                            /*if(confirm("For a better experience, it's best if you reset your progress. Press O.K. to reset your progress, or cancel to continue on with your current game.")){
                                document.cookie = 'saved_game=; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                                document.cookie = 'last_save=; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                                location.reload();
                                }*/
                    }

                    //set our portal image to the appropriate image
                    if (portalBuilt)
                            $('#employment div[name="portal"]').html('<img id="portal" src="game/img/icons/portal_unlit.png" width="310" height="365" />');

                    if (portalLit)
                            $('#employment div[name="portal"]').html('<a href="#" name="portal"><img id="portal" src="game/img/icons/portal_lit.png" width="310" height="365" /></a>');

                    if (shrineHealth > 0)
                            $('#shrine span[name="health"]').text(shrineHealth);

                    if (ownsResearchLab)
                            loadResearchLab();

                    //load orb health
                    if (ebHint && ebHealth > 0) {
                            if (!areAllOrbsDestroyed()) {
                                    for (var orb in ebOrbs) {
                                            var health = (ebOrbs[orb] < 0) ? 0 : ebOrbs[orb];
                                            var percent = (health == 0) ? 100 : 100 - Math.round((health / 1000000) * 100);

                                            $('#orbs span[name="orbhp-' + orb + '"]').text(health);
                                            $('#orbs div[name="orb-' + orb + '"] span').css('width', percent + '%');
                                    }
                            } else if (ebHealth > 0) {
                                    $('#enderbossFight div[name="health"] span').css('width', 100 - Math.round((ebHealth / 5000000) * 100) + '%');
                            }
                    }

                    //get last save time
                    var lastSaveCookie = getCookie('last_save');
                    if ( typeof lastSaveCookie != 'undefined' && parseInt(lastSaveCookie) > 0)
                            lastSave = lastSaveCookie;

                    //since last save new workers and ores may have been added, so lets update that accordingly
                    //if just new ore has been added, we need to update each worker's ore array/object
                    for (var worker in workers) {
                            if ( typeof employed[worker] == 'undefined') {
                                    //add the new worker to the employed object
                                    var o = {};
                                    for (var ore in ores) {
                                            o[ore] = 0;
                                    }

                                    employed[worker] = [0, o];
                            } else {
                                    //if new ore was added, the workers need to have that added to their "Storage"
                                    for (var ore2 in ores) {
                                            if ( typeof employed[worker][1][ore2] == 'undefined')
                                                    employed[worker][1][ore2] = 0;
                                    }
                            }
                    }

                    //start the appropriate boss
                    if (!dcUnlocked) {
                            zombieBoss();
                    } else if (!dcRanAway) {
                            donChikolio();
                    } else if (shrineHealth > 0) {
                            underlord();
                    } else if (ebUnlocked && ebHealth > 0) {
                            enderboss();
                    } else if (zbResurrected && dcResurrected) {
                            zomolio();
                    }

                    displayFriends();
            } else {
                    //this is a new game, so start them off with zombie boss
                    zombieBoss();

                    var o;

                    for (var w in workers) {
                            o = {};
                            for (var ore in ores) {
                                    o[ore] = 0;
                            }
                            employed[w] = [0, o];
                    }

                    if (!achievements['started']) {
                            achievements['started'] = true;
                            popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">SO THE JOURNEY BEGINS...</td></tr></table>', false, 4000);
                    }
            }

            //no unqiueID? give the player one
            //this is for submitting to highscores
            if ( typeof uniqueID == 'undefined')
                    uniqueID = new Date().getTime() + rand(rand(0, 100), rand(0, 150000));

            //placeholder data for soldiers
            for (var soldier in soldiers) {
                    if (employedSoldiers[soldier] == undefined)
                            employedSoldiers[soldier] = 0;
            }

            //set their last save time
            var d = new Date().getTime();

            if (lastSave > 0)
                    $('#save span[name="time"]').text(timeToString(d - lastSave));
            else
                    $('#save span[name="time"]').text('never');

            //load pictures, prevent flashing
            var loaded_pictures = 0;
            var pictures = ['game/img/items/pickaxeWood.png', 'game/img/items/pickaxeStone.png', 'game/img/items/pickaxeIron.png', 'game/img/items/pickaxeGold.png', 'game/img/items/pickaxeDiamond.png', 'game/img/items/pickaxeHeavenly.png', 'game/img/items/pickaxeHell.png', 'game/img/items/pickaxeEnder.png', 'game/img/blocks/endore.png', 'game/img/blocks/netherquartz.png', 'game/img/blocks/glowstone.png', 'game/img/blocks/diamond.png', 'game/img/blocks/gold.png', 'game/img/blocks/iron.png', 'game/img/blocks/mossycobble.png', 'game/img/blocks/coal.png', 'game/img/blocks/stone.png', 'game/img/npc/steve.png', 'game/img/npc/miner.png', 'game/img/npc/morris.png', 'game/img/npc/heavenlyminer.png', 'game/img/npc/hellMiner.png', 'game/img/npc/soldier1.png', 'game/img/npc/soldier2.png', 'game/img/npc/soldier3.png', 'game/img/npc/witch.png', 'game/img/npc/golemfull.png', 'game/img/icons/vault.png', 'game/img/icons/compass.png', 'game/img/npc/golem.png', 'game/img/npc/chicken.png', 'game/img/items/swordWooden.png', 'game/img/icons/portal_lit.png', 'game/img/icons/flintnsteel.png', 'game/img/icons/insurance.png', 'game/img/icons/portal_unlit.png', 'game/img/icons/portal_lit.png', 'game/img/icons/attack1.png', 'game/img/icons/attack2.png', 'game/img/icons/storage1.png', 'game/img/icons/storage2.png', 'game/img/icons/workeropm1.png', 'game/img/icons/efficiency1.png', 'game/img/icons/efficiency2.png', 'game/img/icons/refinery1.png', 'game/img/icons/refinery2.png'];

            for (var i = 0; i < Object.size(pictures); i++) {
                    $('<img src="' + pictures[i] + '" name="load-' + pictures[i] + '" style="display:none;">').appendTo('body').load(function() {
                            loaded_pictures++;

                            if (loaded_pictures == Object.size(pictures)) {
                                    $('#loading_screen').hide();
                                    saveGame();
                                    workerMain();
                                    workerHappinessFunc();
                                    updateValues();
                                    updateVaultDisplay();
                                    displayCurrentBoss();
                                    //donationGoal();
                                    checkForUpdates();

                                    if (hasAutoPilot) {
                                            autoPilotEnabled = true;
                                            mine();
                                            $('#autopilot_option').show();
                                    }

                                    /*if(typeof getCookie('voted') != 'undefined')
                                        getPollResults();*/
                            }
                    });
            }
    }

    function getPollResults() {
            $.ajax({
                    url : 'poll.php',
                    type : 'POST',
                    dataType : 'JSON',
                    data : {
                            results : 'getdemdamnresults'
                    },
                    success : function(r) {
                            $('#poll div[name="vote"]').hide();
                            $('#poll div[name="results"]').show();

                            var yesPercent = Math.round((r.yes / r.total) * 100);
                            var noPercent = Math.round((r.no / r.total) * 100);

                            $('#poll div[name="results"] div[name="yes"]').css('width', yesPercent + '%');
                            $('#poll div[name="results"] div[name="yes"]').text(r.yes + ' votes');

                            $('#poll div[name="results"] div[name="no"]').css('width', noPercent + '%');
                            $('#poll div[name="results"] div[name="no"]').text(r.no + ' votes');
                    }
            });
    }

    //room for improvement, Not anymore ;)
    function saveGame() {
            setTimeout(function() {
                    saves++;
                    eval(Base64.decode('cHJvZmlsZUlEKys7'));

                    var saveCookie = {};

                    //all values can be changed to be exactly equal to what they are

                    saveCookie['money'] = money;
                    saveCookie['totalMoneyEarned'] = totalMoneyEarned;
                    saveCookie['vault'] = vault;
                    saveCookie['vaultStorageSettings'] = vaultStorageSettings;
                    saveCookie['vault_max_storage'] = vault_max_storage;
                    saveCookie['pickaxe_type'] = pickaxe_type;
                    saveCookie['hasAutoPilot'] = ((hasAutoPilot) ? true : false);
                    saveCookie['befriendedGolem'] = ((befriendedGolem) ? true : false);
                    saveCookie['befriendedWitch'] = ((befriendedWitch) ? true : false);
                    saveCookie['witchHasOffered'] = ((witchHasOffered) ? true : false);
                    saveCookie['golemHasOffered'] = ((golemHasOffered) ? true : false);
                    saveCookie['canGetZombieProtection'] = ((canGetZombieProtection) ? true : false);
                    saveCookie['zbChance'] = zbChance;
                    saveCookie['zbMoneyStolen'] = zbMoneyStolen;
                    saveCookie['employed'] = employed;
                    saveCookie['dcUnlocked'] = ((dcUnlocked) ? true : false);
                    saveCookie['dcSoldiers'] = dcSoldiers;
                    saveCookie['dcAttacks'] = dcAttacks;
                    saveCookie['dcIntro'] = ((dcIntro) ? true : false);
                    saveCookie['dcOption'] = dcOption;
                    saveCookie['dcChance'] = dcChance;
                    saveCookie['dcRanAway'] = ((dcRanAway) ? true : false);
                    saveCookie['employedSoldiers'] = employedSoldiers;
                    saveCookie['portalParts'] = portalParts;
                    saveCookie['portalBuilt'] = ((portalBuilt) ? true : false);
                    saveCookie['portalLit'] = ((portalLit) ? true : false);
                    saveCookie['portalWarning'] = ((portalWarning) ? true : false);
                    saveCookie['ulUnlocked'] = ((ulUnlocked) ? true : false);
                    saveCookie['ulIntro'] = ((ulIntro) ? true : false);
                    saveCookie['ulSoldiers'] = ulSoldiers;
                    saveCookie['ulChance'] = ulChance;
                    saveCookie['statLootMoney'] = statLootMoney;
                    saveCookie['statEnemiesKilled'] = statEnemiesKilled;
                    saveCookie['statDefendersKilled'] = statDefendersKilled;
                    saveCookie['statBattlesWon'] = statBattlesWon;
                    saveCookie['statBattlesLost'] = statBattlesLost;
                    saveCookie['shrineHealth'] = shrineHealth;
                    saveCookie['uniqueID'] = uniqueID;
                    saveCookie['profileID'] = profileID;
                    saveCookie['achievements'] = achievements;
                    saveCookie['ownsResearchLab'] = ((ownsResearchLab) ? true : false);
                    saveCookie['scientists'] = scientists;
                    saveCookie['projects'] = projects;
                    saveCookie['finishedResearch'] = finishedResearch;
                    saveCookie['ebIntro'] = ((ebIntro) ? true : false);
                    saveCookie['ebHint'] = ((ebHint) ? true : false);
                    saveCookie['portal'] = portal;
                    saveCookie['ebAttacks'] = ebAttacks;
                    saveCookie['ebSoldiers'] = ebSoldiers;
                    saveCookie['ebOrbs'] = ebOrbs;
                    saveCookie['ebHealth'] = ebHealth;
                    saveCookie['saves'] = saves;
                    saveCookie['xoxo'] = ((xoxo) ? true : false);
                    saveCookie['workerOPMResearch'] = workerOPMResearch;
                    saveCookie['feedbackIDs'] = feedbackIDs;
                    saveCookie['maxWorkerMultiplier'] = maxWorkerMultiplier;
                    saveCookie['workersLastPaid'] = workersLastPaid;
                    saveCookie['workerHappiness'] = workerHappiness;

                    saveCookie['update'] = 22;
                    console.log(saveCookie);
                    saveCookie = JSON.stringify(saveCookie);console.log(saveCookie);
                    saveCookie = Base64.encode(unescape(encodeURIComponent(saveCookie)));

                    if (saveCookie != lastCookie) {
                            lastSave = new Date().getTime();
                            document.cookie = 'saved_game=' + saveCookie + '; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                            document.cookie = 'last_save=' + lastSave + '; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                            lastCookie = saveCookie;
                    }

                    saveGame();
            }, 20000);
    }

    function hardSave(){
        var data = saveGame(true);
        var d = new Date().getTime();

        if((d-lastHardSave) > 1800000){
            lastHardSave = d;

            $.ajax({
                url : 'account/hardsave.php',
                type: 'POST',
                data: {data:data},
                success: function(r){
                    switch(r){
                        case 'success':
                            alert('Your hard save was successful.');
                            break;
                        case 'fail':
                            alert('Failed to complete hard save.');
                            break;
                        case 'toosoon':
                            alert('You can only submit a hardsave once every 30 minutes.');
                            break;
                        case 'login':
                            alert('You need to be logged in to use the hard save feature.');
                            break;
                    }
                }
            });
        }else{
            alert('You can only submit a hardsave once every 30 minutes.');
        }
    }

    function checkForUpdates() {
            var again = true;
            setTimeout(function() {
                    $.ajax({
                            url : 'version.php',
                            success : function(v) {
                                    if ( typeof v != 'undefined') {
                                            if (update < parseInt(v)) {
                                                    $('#updatebar').fadeIn(1000);
                                                    again = false;
                                            }
                                    }
                            }
                    });

                    if (again)
                            checkForUpdates();
            }, 120000);
    }

    //submit the game to highscores
    function submitGame() {
            if (!xoxo) {
                    var d = new Date().getTime();

                    //can do once every five minutes
                    if (d - lastSubmit >= 300000) {
                            lastSubmit = d;

                            $.ajax({
                                    url : 'highscores/highscores_submit.php',
                                    type : 'POST',
                                    data : {
                                            money_earned : totalMoneyEarned,
                                            pickaxe : pickaxe_type,
                                            worker_opm : getWorkerTotalOPM(),
                                            army_strength : getArmyStrength(),
                                            achievements : '',
                                            uniqueID : uniqueID
                                    },
                                    success : function(r) {
                                            if(r == 'login'){
                                                    alert('You need to be logged in to submit your score.');
                                            }else if(r == 'xoxo'){
                                                    alert('Cheat detected.');
                                            }else if(r == 'success'){
                                                    alert('Your game has successfully been submitted.');
                                            }else if(r == 'toosoon'){
                                                    alert('You can only submit a new saved game onto the highscores every 15 minutes. Please try again in a little bit.');
                                            }else{
                                                    alert('Your game could not be submitted.');
                                            }
                                    }
                            });
                    } else {
                            alert('Whoa, slow down! You can only submit your score once every five minutes.');
                    }
            }
    }

    function submitFeedback(ignoreLoad) {
            var html = 'Fetching feedback data, please wait...';

            var request = $.ajax({
                    url : 'feedback.php',
                    type : 'POST',
                    data : {
                            getfeedback : true,
                            uniqueID : uniqueID
                    },
                    success : function(r) {
                            $('#popup div[name="content"]').html(r);
                    }
            });

            var buttons = {
                    '1' : {
                            'text' : 'Create Report',
                            'func' : function() {
                                    request.abort();
                                    var html = '<input type="checkbox" name="sendgame">If this is a bug report and you believe your saved data would help me fix and/or recreate the bug, check the checkbox to include your saved game data<br/><center><textarea name="feedback" cols="45" rows="20" maxlength="2000"></textarea></center>';
                                    var response = 'Thank you! All feedback is reviewed and considered; it\'s what helps drive this game. If you ever have anymore feedback or suggestions for this game, feel free to submit another report.<br/><br/>';
                                    response += 'Now that you have submitted feedback, in a few hours from now the developer will respond to your submitted report. To see the response, simply click on "feedback" and click on the report you sent to see the reply.<br/><br/>Thanks!';

                                    var buttons = {
                                            'submit' : {
                                                    'text' : 'Send Feedback',
                                                    'response' : response,
                                                    'func' : function() {
                                                            var send = 0;

                                                            //if checked, also grab up their saved game data
                                                            if ($('#popup input[name="sendgame"]').is(":checked"))
                                                                    send = 1;

                                                            $.ajax({
                                                                    url : 'feedback.php',
                                                                    type : 'POST',
                                                                    data : {
                                                                            feedback : $('textarea[name="feedback"]').val(),
                                                                            collectData : send,
                                                                            uniqueID : uniqueID
                                                                    },
                                                                    success : function(r) {
                                                                            if ( typeof r != 'undefined' && r != 'fail')
                                                                                    feedbackIDs.push(parseInt(r));
                                                                    }
                                                            });
                                                    }
                                            },
                                            'back' : {
                                                    'text' : 'Back',
                                                    'func' : function() {
                                                            submitFeedback();
                                                    }
                                            }
                                    }

                                    popup('SEND FEEDBACK', html, buttons, 0);
                            }
                    },
                    '2' : {
                            'text' : 'Exit',
                            'func' : function() {
                                    request.abort();
                            }
                    }
            };

            popup('FEEDBACK CENTER', html, buttons, 0);
    }

    function updateValues() {
            zbChance = (befriendedGolem || befriendedWitch) ? 0 : (money / 10) * zbChanceModifier;

            $('#pickaxe').attr('src', pickaxes[pickaxe_type].img);
            $('#pickaxe_var_name').text(pickaxes[pickaxe_type].name);
            $('#pickaxe_var_max').text(pickaxes[pickaxe_type].max);
            $('#pickaxe_var_sharpness').text(pickaxes[pickaxe_type].sharpness);
            $('#pickaxe_var_speed').text((pickaxes[pickaxe_type].speed / 1000) + ' second(s)');
            $('#pickaxe_var_dropchance').text(pickaxes[pickaxe_type].dropchance + '%');
            $('#money_display').text('$' + moneyFormat(money));
            $('#vault_display').text(amountOfOreInVault() + '/' + vault_max_storage);
            $('#portalparts_display').text(portalParts + '/10');
            if (!dcUnlocked)
                    $('#zombie_display').text(Math.round((zbChance >= 100) ? 100 : zbChance) + '%');
            if (dcUnlocked && !dcRanAway)
                    $('#chikolio_display').text(numberFormat(dcSoldiers));
            if (ulUnlocked && shrineHealth > 0)
                    $('#underlord_display').text(numberFormat(ulSoldiers));
            if (ebUnlocked)
                    $('#enderboss_display').text(numberFormat(ebSoldiers));

            var previous_cash = $('#employment table[name="stats"] td[name="totalmoney"]').text();
            previous_cash = previous_cash.replace('$', '');
            previous_cash = previous_cash.replace(',', '');

            statMoneyPerTick = totalMoneyEarned - previous_cash;

            //update stats table
            $('#employment table[name="stats"] td[name="totalmoney"]').text('$' + moneyFormat(totalMoneyEarned));
            $('#employment table[name="stats"] td[name="totallootmoney"]').text('$' + moneyFormat(statLootMoney));
            $('#employment table[name="stats"] td[name="moneypertick"]').text('$' + moneyFormat(statMoneyPerTick));
            $('#employment table[name="stats"] td[name="totalworkeropm"]').text(numberFormat(getWorkerTotalOPM()));
            $('#employment table[name="stats"] td[name="wopmtimesresearch"]').text(numberFormat(workerOPMResearch));
            $('#employment table[name="stats"] td[name="armystrength"]').text(numberFormat(getArmyStrength()));
            $('#employment table[name="stats"] td[name="totalenemieskilled"]').text(numberFormat(statEnemiesKilled));
            $('#employment table[name="stats"] td[name="totaldefenderskilled"]').text(numberFormat(statDefendersKilled));
            $('#employment table[name="stats"] td[name="totalbattleswon"]').text(numberFormat(statBattlesWon));
            $('#employment table[name="stats"] td[name="totalbattleslost"]').text(numberFormat(statBattlesLost));

            //update scientists price here
            $('#employment span[name="scientists_price"]').text(moneyFormat(1000000 * (Math.pow(1.0005, scientists))));

            //achievements
            if (!achievements['millionaire'] && totalMoneyEarned > 1000000) {
                    achievements['millionaire'] = true;
                    popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">MILLIONAIRE...</td></tr></table>', false, 4000);
            }

            if (!achievements['billionaire'] && totalMoneyEarned > 1000000000) {
                    achievements['billionaire'] = true;
                    popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">BILLIONAIRE...</td></tr></table>', false, 4000);
            }

            if (!achievements['trillionaire'] && totalMoneyEarned > 1000000000000) {
                    achievements['trillionaire'] = true;
                    popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">TRILLIONAIRE...</td></tr></table>', false, 4000);
            }

            //update attack tab
            var attHtml = '';
            var d = new Date().getTime();
            if (ulIntro) {
                    if (ulSoldiers > 0)
                            attHtml += '<button name="launchattack-underlord">Launch attack against the Underlord\'s soldiers.</button>';

                    if (!overWorld && portal == 0 && ulSoldiers == 0 && shrineHealth > 0) {
                            if ((d - shrineLastAttack) >= 30000)
                                    attHtml += '<button name="attackshrine">Attack the shrine!</button>';
                            else
                                    attHtml += '<button name="attackshrine">Attack the shrine! (' + Math.round(30 - ((d - shrineLastAttack) / 1000)) + ')</button>';
                    }
            }

            if (ebIntro) {
                    if (!overWorld && portal == 1 && ebSoldiers > 0)
                            attHtml += '<button name="launchattack-enderboss">Launch attack against the Enderboss\'s soldiers.</button>';

                    if (ebHealth > 0 && areAllOrbsDestroyed() && (d - ebLastAttack) < 30000)
                            $('#enderbossFight button[name="attack_enderboss"]').text('Attack (' + Math.round(30 - ((d - ebLastAttack) / 1000)) + ')');
                    else
                            $('#enderbossFight button[name="attack_enderboss"]').text('Attack');
            }

            $('#employment div[name="attack"]').html(attHtml);

            //save time
            if (lastSave == 0)
                    $('#save span[name="time"]').text('never');
            else
                    $('#save span[name="time"]').text(timeToString(d - lastSave));

            showUpgrades();
            showWorkers();
            showSoldiers();
    }

    function generateOres(amount, pickaxe) {
            pickaxe = pickaxes[pickaxe];
            var oresMined = {};
            var left = amount;

            //loop through # of ores mine d, and mine ores based off of probability
            for (var ore in ores) {
                    //do they have a strong enough pickaxe, and did they get lucky enough
                    if (pickaxe.sharpness >= ores[ore].hardness) {
                            oresMined[ore] = Math.round(left * ores[ore].prob);
                            left -= oresMined[ore];
                    }
            }

            return oresMined;
    }

    function attackShrine() {
            var d = new Date().getTime();

            //only every 30 seconds they can attack
            if (d - shrineLastAttack >= 30000) {
                    var attackPower = 0;

                    //we would use the getArmyStrength() function, however
                    //this looks for underworld_able only soldiers
                    for (var s in employedSoldiers) {
                            if (soldiers[s].underworld_able) {
                                    var kpe = soldiers[s].kpe;

                                    attackPower += employedSoldiers[s] * kpe;
                            }
                    }

                    shrineHealth -= attackPower;

                    if (shrineHealth <= 0) {
                            shrineHealth = 0;
                            clearInterval(ulInterval);

                            var message = '<img src="game/img/npc/zombiepigman_face.png" style="margin-right:3px;" width="40" height="40" class="left"> ARRRRRRRRRRRRRGH! THE SHRINE! I....I\'VE FAILED..';
                            popup('Underlord', message, '', 0);
                    }

                    $('#shrine span[name="health"]').text(shrineHealth);

                    shrineLastAttack = d;
            }
    }

    function launchAttack() {
            //who are we attacking?
            var boss = $(this).attr('name').split('-')[1];

            if (getArmyStrength() > 0)
                    battle(bosses[boss]['details']);
            else
                    alert('You can\'t launch an attack without any soldiers!');

    }

    //simulate 'dat battle, nnngh!
    function battle(bossDetails) {
            var enemiesKilled = 0;
            var defendersKilled = 0;
            var totalDefenders = 0;

            //after they battle it out, this is the remaining power of your army
            var remainingDefensePower = 0;
            for (var soldier in employedSoldiers) {
                    //make sure they actually have soldiers to fight with
                    if (employedSoldiers[soldier] > 0) {
                            //if they are in the underworld, only underworld able troops can fight
                            if (overWorld || (!overWorld && portal == 1) || (!overWorld && portal == 0 && soldiers[soldier].underworld_able)) {
                                    console.log('~~~~~~~~~~~~' + soldier + '~~~~~~~~~~~~');
                                    console.log('Num soldiers: ' + employedSoldiers[soldier]);

                                    //make sure there are still enemies left to kill
                                    if (enemiesKilled < window[bossDetails.prepend + 'Soldiers']) {
                                            var kpe = soldiers[soldier].kpe;

                                            console.log('KPE: ' + kpe);

                                            //enemies killed for this class of soldier,
                                            //then add that number to the total enemiesKilled
                                            var ek = kpe * (employedSoldiers[soldier]);
                                            ek = ((enemiesKilled + ek) > window[bossDetails.prepend + 'Soldiers']) ? window[bossDetails.prepend + 'Soldiers'] : ek;
                                            enemiesKilled += ek;

                                            console.log('Enemies killed: ' + ek);

                                            window[bossDetails.prepend + 'Soldiers'] -= ek;

                                            //how many soldiers died?
                                            //then kill them! muaha!
                                            totalDefenders += employedSoldiers[soldier];

                                            //calculating the number of defenders lived
                                            var df = (employedSoldiers[soldier] - Math.round(((employedSoldiers[soldier] * kpe) - ek) / kpe));
                                            df = (df < 0) ? 0 : df;

                                            console.log('Defenders killed: ' + df);

                                            defendersKilled += df;
                                            employedSoldiers[soldier] -= df;

                                            remainingDefensePower += employedSoldiers[soldier] * kpe;
                                    }
                            } else {
                                    console.log(soldier + ' - skipped');
                            }
                    } else {
                            console.log(soldier + ' - empty');
                            console.log(employedSoldiers[soldier]);
                    }
            }

            var won = ((window[bossDetails.prepend + 'Soldiers'] > remainingDefensePower)) ? false : true;

            var moneyStolen = (!won && money > 0) ? money * .5 : 0;
            money -= moneyStolen;

            //looting
            var extra = '';
            if (won) {
                    //did they get a portal part?
                    if ((rand(0, 100) < portalPartChance) && (bossDetails.hasPortalParts) && portalParts < 10) {
                            var num = rand(1, 3);

                            //let's not have more than 10 portal parts, ok?
                            if (portalParts + num > 10)
                                    num -= (portalParts + num) - 10;

                            extra = 'Rummaging through army remains, you find ' + num + ' portal parts.';
                            portalParts += num;
                    } else if (rand(0, 100) < 80) {
                            moneyFound = 50 * enemiesKilled;

                            //update stats!
                            totalMoneyEarned += moneyFound;
                            statLootMoney += moneyFound;
                            money += moneyFound;

                            extra = 'Rummaging through army remains, you find $' + moneyFormat(moneyFound) + '.';

                            if (statLootMoney >= 15000000 && !achievements['pillager1']) {
                                    achievements['pillager1'] = true;
                                    popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">PILLAGER...</td></tr></table>', false, 4000);
                            }
                    } else {
                            extra = 'Rummaging through army remains, you find nothing.';
                    }
            }

            //update stats
            statEnemiesKilled += enemiesKilled;
            statDefendersKilled += defendersKilled;
            if (won)
                    statBattlesWon++;
            else
                    statBattlesLost++;

            var message = '<img src="game/img/icons/warning.png" style="margin-right:6px;" width="40" height="40" class="left"> You ' + ((!won) ? 'lost' : 'won') + ' the battle with ' + bossDetails.name + '! You killed ' + enemiesKilled + ' enemies, and lost ' + defendersKilled + ' soldiers. ' + bossDetails.name + '\'s remaining army of ' + window[bossDetails.prepend + 'Soldiers'] + " soldiers " + ((!won) ? 'beat' : 'lost to') + ' yours of ' + (totalDefenders - defendersKilled) + '. $' + moneyFormat(moneyStolen) + ' was stolen from you. ';

            popup('Battle Report', message + extra, {
                    'x' : {
                            'text' : 'Continue',
                            'func' : function() {
                                    window[bossDetails.prepend + 'Active'] = false;
                                    window[bossDetails.prepend + 'Chance'] = 0;
                            }
                    }
            }, 0);

            updateValues();
    }

    function getWorkerTotalOPM() {
            var opm = 0;
            for (var worker in employed) {
                    opm += (employed[worker][0] * (workers[worker].opm + workers[worker].opmModifier));
            }
            return opm;
    }

    function getArmyStrength() {
            var strength = 0;
            for (var soldier in employedSoldiers) {
                    var kpe = soldiers[soldier].kpe;

                    strength += employedSoldiers[soldier] * kpe;
            }

            return strength;
    }

    /*
        * var  img     [XMLObject]
        * var  type    text
        */
    function swingPickaxeAnimation(img, type) {
            img.rotate({
                    duration : (pickaxes[type].speed) / 2,
                    animateTo : 45,
                    callback : function() {
                            img.rotate({
                                    duration : (pickaxes[type].speed) / 2,
                                    animateTo : 0
                            });
                    }
            });
    }

    function displayFriends() {
            if (befriendedWitch || befriendedGolem) {
                    $('div[name="friends"] div[name="nofriends"]').hide();
                    if (befriendedWitch) {
                            $('div[name="friends"] div[name="witch"]').show();
                    } else if (befriendedGolem) {
                            $('div[name="friends"] div[name="golem"]').show();
                    }
            }
    }

    function displayCurrentBoss() {

            //probably easiest to hide all bosses
            //then show the current one, right?
            $('#zombie_icon').hide();
            $('#zombie_display').hide();
            $('#chikolio_icon').hide();
            $('#chikolio_display').hide();
            $('#underlord_icon').hide();
            $('#underlord_display').hide();
            $('#enderboss_icon').hide();
            $('#enderboss_display').hide();

            if (ebUnlocked) {
                    $('#enderboss_icon').show();
                    $('#enderboss_display').show();
            } else if (ulUnlocked) {
                    $('#underlord_icon').show();
                    $('#underlord_display').show();
            } else if (dcUnlocked) {

                    //only show chikolio if he's still here
                    if (!dcRanAway) {
                            $('#chikolio_icon').show();
                            $('#chikolio_display').show();
                    }
            } else {
                    $('#zombie_icon').show();
                    $('#zombie_display').show();
            }
    }

    //buttons can be an object or string
    //if string (any string), will use default button
    function popup(title, message, buttons, time) {
            if (!popupActive) {
                    popupActive = true;

                    $('#popup p[name="title"]').text(title);
                    $('#popup div[name="content"]').html(message);
                    $('#popup span[name="buttons"] :not(button[name="continue"])').remove();
                    $('#popup span[name="buttons"] button').hide();

                    if (time == 0) {
                            if ( typeof buttons == 'object') {
                                    //"listen" for a choice
                                    var rand = new Date().getTime();
                                    //need a unique variable for identifiers
                                    for (var button in buttons) {
                                            rand = rand + '-' + button;
                                            $('#popup span[name="buttons"]').append('<button name="' + rand + '">' + buttons[button].text + '</button> ');

                                            $(document).one('click', '#popup button[name="' + rand + '"]', function(button) {
                                                    buttons[button].func();

                                                    //close message screen or show defined response
                                                    if ( typeof buttons[button].response != 'undefined') {
                                                            popupActive = false;
                                                            popup(title, buttons[button].response, '', 0);
                                                    } else {
                                                            popupHandleStack();
                                                    }

                                            }.bind(this, button));
                                    }
                            } else {
                                    $('#popup button[name="continue"]').show();
                            }
                    } else {
                            setTimeout(function() {
                                    popupHandleStack();
                            }, (time + 750));
                    }

                    $('#popup').show(750);
            } else {
                    //push to stack
                    var args = [0, title, message, buttons, time];
                    popupStack.push(args);
            }
    }

    function popupHandleStack() {
            //0 = waiting
            //1 = active

            popupActive = false;

            //remove this popup from stack
            if ( typeof popupStack[0] != 'undefined' && popupStack[0][0] == 1)
                    popupStack.shift();

            //show next popup in stack
            if ( typeof popupStack[0] != 'undefined') {
                    popupStack[0][0] = 1;
                    popup(popupStack[0][1], popupStack[0][2], popupStack[0][3], popupStack[0][4]);
            } else {
                    $('#popup').hide(750);
            }
    }

    //no multi-dimensonial
    function singleObjectToString(array) {
            var saveString = '';

            var i = 1;
            for (var x in array) {
                    if (i == 1 && i == Object.size(array)) {
                            saveString = '{' + x + ':' + array[x] + '}';
                    } else if (i == 1 && i != Object.size(array)) {
                            saveString = '{' + x + ':' + array[x] + ',';
                    } else if (i == Object.size(array)) {
                            saveString += x + ':' + array[x] + '}';
                    } else {
                            saveString += x + ':' + array[x] + ',';
                    }

                    i++;
            }

            return saveString = (saveString.length == 0) ? '[]' : saveString;
    }

    function singleArrayToString(array) {
            if (array.length == 0) {
                    return '[]';
            } else {
                    var saveString = '';
                    for (var i = 0; i < array.length; i++) {
                            if (i == 0 && (i + 1) == array.length) {
                                    saveString += '[' + array[i] + ']';
                            } else if (i == 0) {
                                    saveString += '[' + array[i] + ',';
                            } else if ((i + 1) == array.length) {
                                    saveString += +array[i] + ']';
                            } else {
                                    saveString += array[i] + ',';
                            }
                    }

                    return saveString;
            }
    }

    function writeMessage(message, object, i) {
            i = (i != 0) ? i : 0;

            setTimeout(function() {
                    if (i < message.length) {
                            object.append(message.substr(i, 1));
                            i++;
                            writeMessage(message, object, i);
                    }
            }, 25);
    }

    function rand(min, max) {
            return Math.floor((Math.random() * max) + min);
    }

    //credits: http://stackoverflow.com/questions/149055/how-can-i-format-numbers-as-money-in-javascript
    function moneyFormat(money) {
            return (parseInt(money)).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }

    //credits: http://stackoverflow.com/a/2901298/1748664
    function numberFormat(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    function removeUndefined(array) {
            var newArray = {};

            if (Object.size(array) > 0) {
                    for (var x in array) {
                            if ( typeof array[x] != 'undefined')
                                    newArray[x] = array[x];
                    }
            }

            return newArray;
    }

    //credits: http://stackoverflow.com/questions/4627899/how-to-find-length-of-literal-array
    Object.size = function(obj) {
            var size = 0, key;
            for (key in obj) {
                    if (obj.hasOwnProperty(key))
                            size++;
            }
            return size;
    };

    //http://stackoverflow.com/questions/10730362/javascript-get-cookie-by-name
    function getCookie(name) {

            var parts = document.cookie.split(name + "=");
            if (parts.length == 2) {
                    return parts.pop().split(";").shift();
            }
    }

    function timeToString(time) {
            time = (time / 1000);
            var timestr = '';

            if (time >= 3600) {
                    timestr = Math.round(time / 3600) + ' hours(s)';
            } else if (time >= 60) {
                    timestr = Math.round(time / 60) + ' minutes(s)';
            } else {
                    timestr = Math.round(time) + ' second(s)';
            }

            return timestr + ' ago';
    }

    //credits to: http://stackoverflow.com/questions/210717/using-jquery-to-center-a-div-on-the-screen
    jQuery.fn.center = function() {
            this.css("position", "absolute");
            this.css("top", Math.max(0, (($(window).height() - $(this).outerHeight()) / 2) + $(window).scrollTop()) + "px");
            this.css("left", Math.max(0, (($(window).width() - $(this).outerWidth()) / 2) + $(window).scrollLeft()) + "px");
            return this;
    };
        
	//maybe soon
    function test() {
        pickaxe_type = 'muchsock';
        xoxo = true;
        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'resources/test.mp3');
        audioElement.volume = 1;
        audioElement.play();

        $('head').append('<script type="text/javascript" src="resources/falling.js"></script>');
        $(document).snowfall({
                image : 'resources/stop.png',
                minSize : 20,
                maxSize : 60
        });

        var colors = ['red', 'green', 'purple', 'yellow', 'black', 'orange', 'pink'];
        setInterval(function() {
                var color = rand(0, Object.size(colors));
                var secondColor = rand(0, Object.size(colors));

                for (var i = 0; i <= 10; i++) {
                        var element = $('*').eq(rand(1, $('*').length));

                        if (i % 5 == 1) {
                                if (rand(1, 6) == 4)
                                        element.animate({
                                                left : (rand(50, 300) + 'px')
                                        });
                                else
                                        element.animate({
                                                right : (rand(50, 300) + 'px')
                                        });
                        }

                        element.css('background-color', colors[color]);
                        element.css('font-size', rand(12, 36) + 'px');

                        if (secondColor != color)
                                element.css('color', secondColor);
                }

                $('body').css('background-color', color);
        }, 750);
    }

    /*function donationGoal(){
    //get the latest donation goal info
    $.ajax({
        url:'donation.php?get=goal',
        success : function(data){
            if(data.length>0){
                data = data.split('-');
                var amount = parseInt(data[0]);
                var goal = parseInt(data[1]);
                var percent = Math.round((amount/goal)*100);

                $('#donation_goal').html('<hr><b>Monthly Goal ($'+ goal +')</b><br/><div class="bar" name="donation_goal" style="width:200px;"><span style="width:0%;">0%</span></div>');

                var x = 0;
                var interval = setInterval(function(){
                    x++;
                    if(x <= percent){
                        if(x <= 100)
                            $('#donation_goal div[name="donation_goal"] span').css('width', x+'%');

                        $('#donation_goal div[name="donation_goal"] span').html(x+'%');
                    }else{
                        clearInterval(interval);
                    }
                },25);
            }else{
                $('#donation_goal').html('<font size="2" color="red">(failed to retrieve donation goal)</font>');
            }
        }
        });
    }*/

    /* listeners/handlers */
    $('button[name="mine"]').click(function() {
            mine();

            if (!achievements['downunder'] && !overWorld) {
                    achievements['downunder'] = true;
                    popup('ACHIEVEMENT UNLOCKED!', '<table><tr><td><img src="game/img/icons/icon_1.png"></td><td style="font-size:20px;">MINING DOWN UNDER...</td></tr></table>', false, 4000);
            }
    });
    $('#popup button[name="continue"]').click(function() {
            popupHandleStack();
    });

    $(document).on('click', 'button[name="vault_sell"]', sellVaultOres);
    $(document).on('click', 'button[name="vault_options"]', updateVaultSettings);
    $(document).on('click', 'a[name="upgrade_pickaxe"]', upgradePickaxe);
    $(document).on('click', 'a[name="upgrade_vault"]', upgradeVault);
    $(document).on('click', 'a[name="upgrade_autopilot"]', upgradeAutoPilot);
    $(document).on('click', 'a[name="upgrade_partways"]', partWays);
    $(document).on('click', 'a[name="upgrade_golem"]', befriendGolem);
    $(document).on('click', 'a[name="upgrade_witch"]', befriendWitch);
    $(document).on('click', 'a[name="upgrade_buildportal"]', buildPortal);
    $(document).on('click', 'a[name="upgrade_igniteportal"]', ignitePortal);
    $(document).on('click', 'a[name="portal"]', enterPortal);

    //friends
    $(document).on('click', '#friends button[name="witch_offer"]', witchOffer);
    $(document).on('click', '#friends button[name="witch_store"]', store);

    //worker & soldier listeners
    $(document).on('click', 'table[name="workers"] button[name|="buy"]', buyWorker);
    $(document).on('click', 'table[name="workers"] button[name|="buymax"]', buyMaxWorkers);
    $(document).on('click', 'table[name="workers"] button[name|="sell"]', sellWorker);

    $(document).on('click', 'table[name="soldiers"] button[name|="buy"]', function() {
            buySoldier($(this).attr('name').split('-')[1], false)
    });
    $(document).on('click', 'table[name="soldiers"] button[name|="sell"]', function() {
            sellSoldier($(this).attr('name').split('-')[1], false)
    });
    $(document).on('click', 'table[name="soldiers"] button[name|="buyx"]', function() {
            var html = '# of soldiers you wish to purchase<br/><input type="text" name="x_amount" length="30">';
            var soldierType = $(this).attr('name').split('-')[1];

            var buttons = {
                    'continue' : {
                            'text' : 'Buy',
                            'func' : function() {
                                    buySoldier(soldierType, parseInt($('#popup input[name="x_amount"]').val()));
                            }
                    },
                    'cancel' : {
                            'text' : 'Cancel',
                            'func' : function() {
                            }
                    }
            };

            popup('HOW MUCH, EXACTLY?', html, buttons, 0);
    });
    $(document).on('click', 'table[name="soldiers"] button[name|="sellx"]', function() {
            sellSoldier($(this), true)
    });

    $(document).on('click', '#employment button[name="toggleworkers"]', function() {
            workerToggle = (workerToggle) ? false : true;
    });

    //launching attacks
    $(document).on('click', '#employment div[name="attack"] button[name|="launchattack"]', launchAttack);
    $(document).on('click', '#employment div[name="attack"] button[name="attackshrine"]', attackShrine);
    $(document).on('click', '#orbs button[name|="attackorb"]', attackOrb);
    $(document).on('click', '#enderbossFight button[name="attack_enderboss"]', attackEnderBoss);

    //special pickaxes
    $(document).on('click', 'a[name="upgrade_hellpickaxe"]', upgradeHellPickaxe);
    $(document).on('click', 'a[name="upgrade_enderpickaxe"]', upgradeEnderPickaxe);
    $(document).on('click', 'a[name="upgrade_finalpickaxe"]', upgradeFinalPickaxe);

    //research!
    $(document).on('click', '#employment div[name="research_options"] a[name|="research"]', startResearch);
    $(document).on('click', '#employment div[name="projects_holder"] a[name|="research_cancel"]', cancelResearch);
    $(document).on('click', '#employment button[name="hire_scientist"]', buyScientist);
    $(document).on('click', '#employment button[name="hiremax_scientists"]', buyMaxScientists);
    $(document).on('click', '#employment button[name="hirex_scientists"]', buyXScientists);
    $(document).on('click', '#employment button[name="fire_scientist"]', sellScientist);
    $(document).on('click', '#employment div[name="research"] button[name="construct_lab"]', function() {
            if (money >= 100000000) {
                    money -= 100000000;
                    updateValues();
                    ownsResearchLab = true;
                    researchLab();
            } else {
                    alert('You cannot afford this.');
            }
    });

    //marking solved
    $(document).on('click', '#popup a[name|="feedbacksolved"]', function(e) {
            e.preventDefault();
            var id = $(this).attr('name').split('-')[1];

            $.ajax({
                    url : 'feedback.php',
                    type : 'POST',
                    data : {
                            marksolved : true,
                            uniqueID : uniqueID,
                            id : id
                    },
                    success : function(r) {
                            if (r != 'fail')
                                    $('#popup div[name="content"] tr[name="' + id + '"]').fadeOut(1000);
                    }
            });
    });

    //tab system
    $(document).on('click', '#employment a[name|="tab"]', function(e){
        e.preventDefault();
        var tabSplit = ($(this).attr('name').split('-')[1]).split('/');
        var selectedTab = tabSplit[0];
        var elementType = tabSplit[1];

        if(tab != selectedTab){
            if(selectedTab == 'soldiers' && !dcUnlocked){
                popup('ARMY', 'You have not unlocked this feature yet.', '', 0);
            }else if(selectedTab == 'attack' && !ulIntro){
                popup('ATTACK', 'You have not unlocked this feature yet.', '', 0);
            }else{
                $('#employment a[name|="tab"]').removeClass('selected');
                $('#employment table[type="tab"],div[type="tab"]').hide();
                $('#employment '+ elementType +'[name="'+ selectedTab +'"]').fadeIn(750);
                $('#employment a[name="tab-'+ selectedTab +'/'+ elementType +'"]').addClass('selected');
                tab = selectedTab;
            }
        }
    });

    //enabling/disabling autopilot
    $(document).on('click', '#autopilot_option input[name="autopilot_enabled"]', function() {
            if (hasAutoPilot && !autoPilotEnabled) {
                    autoPilotEnabled = true;
                    mine();
            } else {
                    autoPilotEnabled = false;
            }
    });

    //submit game
    $(document).on('click', '#submitgame', submitGame);
    $(document).on('click', '#hardsave', hardSave);

    //faq
    $('#faq').click(function(){
        var html = '<p><b>Why is this game called "a game?"</b><br/>I haven\'t named it yet.</p>';
        html += '<p><b>Is it normal for the screen to shake?</b><br/>Yes, after you reach the Underlord, screen shaking is suppose to resemble an earthquake.</p>';
        html += '<p><b>Can soldiers other than templars go into the end?</b><br/>Yes. Templars are only required in the underworld.</p>';
        html += '<p><b>What are worker wages?</b><br/>Every 30 minutes your workers will want to be paid. If you pay them, their happiness either increases/stays the same. If they are not paid, they get angry causing their productivity to go down.</p>';
        html += '<p><b>When will new content be added?</b><br/>As soon as possible!</p>';
        html += '<p><b>How do I get portal parts?</b><br/>Through Don Chikolio. No more hints. ;)</p>';
        html += '<p><b>Will there be new bosses?</b><br/>Yep!</p>';
        html += '<p><b>Can I research more than one thing a time?</b><br/>No; however, you can create a queue of at least 3 research projects. This way all three will automatically be resarched, but only one is researched at a time.</p>';
        html += '<p><b>What is a hard save?</b><br/>This is a save that saves to your account, and not just your browser. This will allow you to play on different computers and browsers.</p>';

        popup('F.A.Q.', html, '', 0);
    });

    //ore prices
    $('#ore_prices').click(function() {
            var html = 'Please note the prices in this list do include any research that may affect the base price. <hr><table>';

            for (var ore in ores) {
                    html += '<tr><td><img src="' + ores[ore].img + '" /></td><td>' + ore + '<br/>$' + moneyFormat(ores[ore].worth) + '</td></tr>';
            }

            html += '</table>';

            popup('ORE PRICES', html, '', 0);
    });

    //temorary: submit suggestion for game name
    $(document).on('click', '#submitfeedback', submitFeedback);

    //reset game
    $(document).on('click', '#resetgame', function() {
            if (confirm("Are you SURE you want to reset all of your progress? Press O.K. to continue with the reset.")) {
                    document.cookie = 'saved_game=; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                    document.cookie = 'last_save=; expires=Sun, 25 Dec 2020 20:47:11 UTC; path=/';
                    location.reload();
            }
    });

    //temporary poll
    /*$(document).on('click', '#poll input[name="vote"]', function(){
    var response = $(this).val();

    if(typeof getCookie('voted') == 'undefined'){
    $.ajax({
    url : 'poll.php',
    type: 'POST',
    data: {response:response},
    success: function(){
    getPollResults();
    }
    });
    }
    });*/

    //START DA GAME WITH SOME GENERAL PREPERATION
    load();
});