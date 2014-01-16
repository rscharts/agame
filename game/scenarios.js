var scenarios = {
        1 : {
		'func' : function(bossDifficulty){
			var me = bossScenario['boss'];
			var vars = me['vars'];
                        
                        if(!vars.set){
                            vars.rbSoldiers = bossDifficulty*200000;
                            vars.soldiersRestore = vars.rbSoldiers;
                            vars.rewards.bc = bossDifficulty;
                            vars.rewards.money = 40000000*bossDifficulty;
                            
                            //will this be a normal or specialized battle?
                            if(rand(1,3) == 2)
                                vars.excludeSoldiers.push(randomObjectElement(soldiers));
                            
                            //how quick will the attacks be?
                            switch(bossDifficulty){
                                case 1:
                                    vars.intervalTime = 60000;
                                    vars.waves = 2;
                                    break;
                                case 2:
                                    vars.intervalTime = 45000;
                                    vars.waves = 3;
                                    break;
                                case 3:
                                    vars.intervalTime = 30000;
                                    vars.waves = 4;
                                    break;
                                default:
                                    vars.intervalTime = 20000;
                                    vars.waves = 4;
                                    break;
                            }
                            
                            var html = 'Below is your scenario for this random boss<hr><br/><table>';
                            
                            html += '<tr><td><b>Boss Name</b></td><td>'+ bossScenario['boss']['name'] +'</td></tr>';
                            if(vars.excludeSoldiers.length > 0){
                                html += '<tr><td><b>Scenario Type</b></td><td>Specialized Battle</td></tr>';
                                html += '<tr><td><b>Soldier not allowed:</b></td><td>'+ soldiers[vars.excludeSoldiers[0]].name +'</td></tr>';
                            }else{
                                html += '<tr><td><b>Scenario Type</b></td><td>Normal Battle</td></tr>';
                            }
                            
                            html += '<tr><td><b>Difficulty</b></td><td>Level '+ bossDifficulty +'</td></tr>';
                            html += '<tr><td><b>Attack interval: </b></td><td>'+ (vars.intervalTime)/1000 +' seconds</td></tr>';
                            html += '<tr><td><b>Enemy Soldiers:</b></td><td>'+ numberFormat(vars.rbSoldiers) +'</td></tr>';
                            html += '<tr><td><b>Waves: </b></td><td>'+ numberFormat(vars.waves) +'</td></tr>';
                            html += '<tr><td><b>Rewards:</b></td><td>'+ numberFormat(vars.rewards.bc) +' boss currency, $'+ numberFormat(vars.rewards.money) +'</td></tr></table>';
                            
                            popup('SCENARIO #1', html, '', 0);
                            vars.set = true;
                        }
                    
                        vars.interval = setInterval(function(){
                            if(vars.wavesCompleted < vars.waves)
                                randBossBattle(vars);
                        }, vars.intervalTime);
		},
		'vars' : {
                    set : false,
                    interactive : false,
                    interval : null,
                    intervalTime : 0,
                    waves : 0,
                    wavesCompleted : 0,
                    wins : 0,
                    rbSoldiers : 0,
                    soldiersRestore : 0,
                    excludeSoldiers : [],
                    rewards : {
                        bc : 0,
                        money: 0
                    }
                }
	},
        2 : {
            'func' : function(bossDifficulty){
                    var me = bossScenario['boss'];
                    var vars = me['vars'];

                    if(!vars.set){
                        vars.health = bossDifficulty*300000;
                        vars.startHealth = vars.health;
                        vars.rewards.bc = bossDifficulty;
                        vars.rewards.money = 40000000*bossDifficulty;

                        //how quick will the attacks be?
                        switch(bossDifficulty){
                            case 1:
                                vars.healRate = 200;
                                vars.time = 4;
                                vars.waves = 1;
                                break;
                            case 2:
                                vars.healRate = 400;
                                vars.time = 3;
                                vars.waves = 2;
                                break;
                            case 3:
                                vars.healRate = 600;
                                vars.time = 2;
                                vars.waves = 3;
                                break;
                            default:
                                vars.healRate = 800;
                                vars.time = 1;
                                vars.waves = 4;
                                break;
                        }

                        var html = 'Below is your scenario for this random boss<hr><br/><table>';

                        html += '<tr><td><b>Boss Name</b></td><td>'+ bossScenario['boss']['name'] +'</td></tr>';
                        html += '<tr><td><b>Scenario Type</b></td><td>Interactive</td></tr>';
                        html += '<tr><td><b>Difficulty</b></td><td>Level '+ bossDifficulty +'</td></tr>';
                        html += '<tr><td><b>Health:</b></td><td>'+ numberFormat(vars.health) +'</td></tr>';
                        html += '<tr><td><b>Heal rate: </b></td><td>'+ numberFormat(vars.healRate) +' per second</td></tr>';
                        html += '<tr><td><b>Timer</b></td><td>'+ vars.time +' minutes</td></tr>';
                        html += '<tr><td><b>Rewards:</b></td><td>'+ numberFormat(vars.rewards.bc) +' boss currency, $'+ numberFormat(vars.rewards.money) +'</td></tr></table>';

                        popup('SCENARIO #2', html, '', 0);
                        vars.set = true;
                        
                        //show the boss
                        $('#mining_container').hide();
                        $('#randomBossArea').show();
                    }
                    
                    $('#randomBossArea h2[name="bossName"]').text(bossScenario['boss']['name']);
                    
                    var timeInMilliseconds = ((vars.time)*60*1000);
                    vars.interval = setInterval(function(){
                        var d = new Date().getTime();
                        
                        if(vars.timeStart == 0){
                            vars.timeStart = d;
                        }else{
                            //time comparison in milliseconds
                            var won = (vars.health <= 0 && vars.wavesCompleted == vars.waves) ? true : false;
                            
                            if((d-vars.timeStart) > timeInMilliseconds || won){
                                //time is up!
                                if(won){
                                    //win!
                                    bossWon(vars);
                                    
                                    var html = 'You have successfully beat this random boss.<hr><table>';
                                    html += '<tr><td><b>Difficulty:</b></td><td>'+ bossDifficulty +'</td></tr>';
                                    html += '<tr><td><b>Total waves:</b></td><td>'+ vars.waves +'</td></tr>';
                                    html += '<tr><td><b>Successful waves:</b></td><td>'+ vars.wavesCompleted +'</td></tr>';
                                    html += '<tr><td><hr>REWARDS<br/><br/></td></tr>';
                                    html += '<tr><td><b>Money earned:</b></td><td>$'+ numberFormat(vars.rewards.money) +'</td></tr>';
                                    html += '<tr><td><b>Boss currency earned:</b></td><td>'+ numberFormat(vars.rewards.bc) +'</td></tr>';

                                    popup('ACTIVITY PASSED!', html, '', 0);
                                    bossLastGenerated = d;
                                }else{
                                    //fail!
                                    popup('ACTIVITY FAILED!', 'You failed to complete the random boss activity. You receive no rewards.', '', 0);
                                }
                                
                                clearInterval(vars.interval);
                                bossScenario['active'] = false;

                                if(!overWorld){
                                    $('#randomBossArea').hide();
                                    $('#randomBossPortal').show(1250);
                                }
                            }else{
                                vars.health += vars.healRate;
                                
                                //don't heal over max health
                                if(vars.health > 0)
                                    vars.health = vars.startHealth;
                            }
                        }
                        
                        //update button countdown
                        var cooldown = (d-vars.lastAttack)/1000;
                        
                        if(cooldown < 10)
                            $('#randomBossArea button[name="attack_randomboss"]').text('Attack (' + Math.round(10-cooldown) +')');
                        else
                            $('#randomBossArea button[name="attack_randomboss"]').text('Attack');
                        
                        $('#randomBossArea span[name="timer"]').text(timeToString(
                            timeInMilliseconds - (d-vars.timeStart), ''
                        ));
                        $('#randomBossArea span[name="wave"]').text(
                            vars.wavesCompleted+'/'+vars.waves
                        );
                    }, 1000);
                    
                    
            },
            'vars' : {
                set : false,
                interactive : true,
                interval : null,
                waves:  0,
                wavesCompleted : 0,
                health : 0,
                healRate : 0,
                startHealth : 0,
                lastHeal : 0,
                time : 0,
                timeStart : 0,
                lastAttack : 0,
                rewards : {
                    bc : 0,
                    money : 0
                }
            }
        }
}
var bossNames = [
    'Kim',
    'Schizotypal',
    'Vendetta',
    'Ajuri',
    'Ajuri',
    'Verl',
    'Zestorax',
    'Cr4zY'
];