<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <title>A GAME</title>
        <script type="text/javascript" src="resources/jquery2.js"></script>
        <script type="text/javascript" src="resources/jquery-ui.js"></script>
        <script type="text/javascript" src="resources/jQueryRotateCompressed.js"></script>
        <script type="text/javascript" src="resources/base64.js"></script>
        <script type="text/javascript" src="resources/perfectscrollbar.js"></script>
        <script type="text/javascript" src="game/items.js?v=1.42"></script>
        <script type="text/javascript" src="game/game_dev.js?v=1.49"></script>
        <script type="text/javascript" src="game/research.js?v=4"></script>
        <link rel="stylesheet" type="text/css" href="css/style.css?v=1.30">
    </head>
    <body>
        <div id="updatebar" class="hidden">
            <p>An update is available! Refresh the page to load the new content, or <a href="changelog.txt" target="_blank">see what's new</a>.</p>
        </div>
        
        <div id="container">
            <div id="save">
                <img src="game/img/icons/save.png" width="32" height="32"> Saved: <span name="time">never</span>
                <p name="gamesave_actions">
                    <a href="#" id="hardsave" style="color:green;">HARD SAVE</a>
                    <br/><br/>
                    <a href="#" id="resetgame" style="color:red;">RESET GAME</a>
                    <br/><br/>
                    <a href="#" id="submitgame" style="color:green;">SUBMIT GAME</a>
                    <br/><br/>
                    <a href="#" id="submitfeedback" style="color:green;">FEEDBACK</a>
                    <br/><br/>
                    <a href="highscores/index.php" style="color:green;" target="_blank">HIGHSCORES</a>
                    <br/><br/>
                    <a href="account/index.php" style="color:green;" target="_blank">ACCOUNT CENTER</a>
                    <br/><br/>
                    <a href="#" style="color:green;" id="faq">F.A.Q.</a>
                    <br/><br/>
                    <a href="#" style="color:green;" id="ore_prices">ORE PRICES</a>
                    <!--<div id="donation_goal" style="margin:15px 0px;">
                        <img src="game/img/icons/loading2.gif">
                    </div>-->
                    <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
                        <input type="hidden" name="cmd" value="_s-xclick">
                        <input type="hidden" name="hosted_button_id" value="GCDL5A7NY9TRE">
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
                        <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
                    </form>

                    <font size="1">helps pay for hosting, and will allow me to upgrade the server to be less laggy!</font>
                    <hr>
                    <!--<b>Temporary poll:</b> Should you have to have an account (just username/pass) to post your scores?<br/>
                    <br/>
                    <div id="poll">
                        <div name="vote" style="margin:0;padding:0;">
                            <input type="radio" name="vote" value="yes"> Yes
                            <br/>
                            <input type="radio" name="vote" value="no"> No
                        </div>
                        <div name="results" class="hidden" style="margin:0;padding:0;">
                            <b>YES</b><br/><div name="yes" class="votebar"></div>
                            <br/><br/>
                            <b>NO</b><br/><div name="no" class="votebar"></div>
                        </div>
                    </div>
                    <br/>
                    <font size="1">this would make your scores safe from being lost if you reset your game cache/cookies, or hijacked</font>-->
                    <b>IRC (come chat)</b><br/>
                    <b>network:</b> irc.coldfront.net<br/>
                    <b>channel:</b> #AGAME
                    <br><br/>
                    or you can use mibbit<br/>
                    <a href="http://client00.chat.mibbit.com/?server=irc.coldfront.net&channel=%23AGAME" target="_blank" style="color:red;">CLICK HERE</a>
                </p>
            </div>
            <div id="gamecontainer">
                <div id="quickdetails" class="textleft center" style="width:80%;margin-bottom:30px;">
                    <table cellspacing="6">
                        <tr>
                            <td><img src="game/img/icons/moneyBag.png" width="20" height="32"></td><td id="money_display"></td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td><img src="game/img/icons/vault.png" width="20" height="32"></td><td id="vault_display" class="displaytext"></td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td id="zombie_icon"><img src="game/img/npc/zombie.png" width="32" height="32"></td><td id="zombie_display" class="displaytext"></td>
                            <td id="chikolio_icon" class="hidden"><img src="game/img/npc/chicken.png" width="32" height="32"></td><td id="chikolio_display" class="hidden displaytext"></td>
                            <td id="underlord_icon" class="hidden"><img src="game/img/icons/zombiepigman.png" width="32" height="32"></td><td id="underlord_display" class="hidden displaytext"></td>
                            
                            <td id="enderboss_icon" class="hidden">
                                <img src="game/img/npc/enderman_face.png" width="32" height="32">
                            </td>
                            <td id="enderboss_display" class="hidden displaytext"></td>
                            <td id="enderboss_health" class="hidden"></td>
                            
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;</td>
                            <td><img src="game/img/icons/portalparts_lit.png" width="32" height="32"></td><td id="portalparts_display" class="displaytext"></td><td></td>
                        </tr>
                    </table>
                    <ul>

                    </ul>
                </div>

                <div id="upgrades_container">
                    <p class="title">Upgrades</p>
                    <div id="upgrades">
                        <div id="finalpickaxe_upgrade_box" class="hidden"></div>
                        <div id="enderpickaxe_upgrade_box" class="hidden"></div>
                        <div id="hellpickaxe_upgrade_box" class="hidden"></div>
                        <div id="pickaxe_upgrade_box" class="hidden"></div>
                        <div id="vault_upgrade_box" class="hidden"></div>
                        <div id="autopilot_upgrade_box" class="hidden"></div>
                        <div id="golem_upgrade_box" class="hidden"></div>
                        <div id="witch_upgrade_box" class="hidden"></div>
                        <div id="partways_upgrade_box" class="hidden"></div>
                        <div id="sword_upgrade_box" class="hidden"></div>
                        <div id="insurance_upgrade_box" class="hidden"></div>
                        <div id="buildportal_upgrade_box" class="hidden"></div>
                        <div id="igniteportal_upgrade_box" class="hidden"></div>
                    </div>
                </div>

                <div id="mining_container">
                    <button class="button_mine" name="mine">START MINING</button>

                    <div id="mine_box">
                        <div name="pickaxe_icon_holder" class="left max50">
                            <img src="" width="91" height="92" id="pickaxe" />
                            <p class="textleft">
                                <span id="pickaxe_var_name" style="font-weight:bold;"></span><br/>
                                Max ores per: <span id="pickaxe_var_max"></span><br/>
                                Sharpness: <span id="pickaxe_var_sharpness"></span><br/>
                                Speed: <span id="pickaxe_var_speed"></span><br/>
                                Drop Chance: <span id="pickaxe_var_dropchance"></span><br/>
                                <span id="autopilot_option" class="hidden">Autopilot: <input type="checkbox" name="autopilot_enabled" checked="checked"></span> 
                            </p>
                        </div>

                        <div name="ores_collected" style="text-align:left;" class="right max50">

                        </div>
                    </div>
                    <div class="clear"></div>
                </div>

                <div id="shrine" class="hidden">
                    <h2>Shrine health: <span name="health">0</span>/500000</h2>
                </div>
                
                <div id="orbs" class="hidden">
                    <div style="float:left;margin-right:30px;">
                        <img src="game/img/icons/orb.png" name="orb-1"><br/>
                        <div class="healthbar" name="orb-1" style="width:65px;"><span style="width:0;"></span></div>
                        <font size="1"><span name="orbhp-1">1000000</span> HP</font>
                        <br/>
                        <button name="attackorb-1">Attack</button>
                    </div>
                    <div style="float:left;margin-right:30px;">
                        <img src="game/img/icons/orb.png" name="orb-2"><br/>
                        <div class="healthbar" name="orb-2" style="width:65px;"><span style="width:0;"></span></div>
                        <font size="1"><span name="orbhp-2">1000000</span> HP</font>
                        <br/>
                        <button name="attackorb-2">Attack</button>
                    </div>
                    <div style="float:left;">
                        <img src="game/img/icons/orb.png" name="orb-3"><br/>
                        <div class="healthbar" name="orb-3" style="width:65px;"><span style="width:0;"></span></div>
                        <font size="1"><span name="orbhp-3">1000000</span> HP</font>
                        <br/>
                        <button name="attackorb-3">Attack</button>
                    </div>
                </div>
                
                <div id="enderbossFight" class="hidden">
                    <div style="float:left;">
                        <img src="game/img/npc/enderman_face.png" width="275" height="130"><br/>
                        <div class="healthbar large" name="health" style="width:275px;"><span style="width:0;"></span></div>
                        <br/>
                        <button name="attack_enderboss" style="width:275px">Attack</button>
                    </div>
                </div>

                <div id="vault_container">
                    <div id="vault">
                        <p class="title">Your Vault</p>
                        <p class="title hidden" name="full" style="color:red;">(FULL)</p>
                        <table name="vault" cellpadding="4" class="center">
                            <tr><th>Ore</th><th>Amount</th><th>Worth</th></tr>
                        </table>
                    </div>
                </div>
                <div class="clear"></div>
                
                <div id="employment">
                    <hr>
                    <p name="tabs" class="title"><a href="#" name="tab-workers/table" class="selected">Workers</a> &nbsp;&nbsp; <a href="#" name="tab-research/div">Research</a> &nbsp;&nbsp;
                        <a href="#" name="tab-friends/div" class="hidden">FRIENDS</a><a href="#" name="tab-soldiers/table">ARMY</a> &nbsp;&nbsp; <a href="#" name="tab-attack/div">Attack</a>
                        &nbsp;&nbsp; <a href="#" name="tab-portal/div">Portal</a> &nbsp;&nbsp; <a href="#" name="tab-stats/table">Stats</a></p>
                   
                    <div name="research" type="tab" style="margin-top:20px;" class="hidden">
                        <div name="1">
                            <button name="construct_lab" style="padding:30px;">Construct a research lab for $100,000,000</button>
                        </div>
                        <div name="lab" class="hidden">
                            <table class="left">
                                <tr>
                                    <td>
                                        <img src="game/img/npc/steve.png"><br/>
                                        <b>$<span name="scientists_price">1,000,000</span></b><br/>
                                        Research rate +1 second
                                    </td>
                                    <td>
                                        You own <span name="scientists_owned">0</span> scientists.<br/>
                                        <button name="hire_scientist">Buy</button> &nbsp;
                                        <button name="fire_scientist">Sell</button><br/>
                                        <button name="hirex_scientists">Buy X</button>
                                        <button name="hiremax_scientists">Buy max</button>
                                    </td>
                                </tr>
                            </table>
                            <div class="left textleft" style="margin-left:40px;">
                                <a href="#" name="start_research" style="color:green;">Start Research Project</a><br/>
                                <span name="no_projects">You currently have no projects.</span>
                                <div style="width:100%;" name="projects_holder"></div>
                            </div>
                            <div class="clear"></div>
                            <div name="research_options" class="hidden">
                                <hr>
                                <p class="title">CHOOSE A RESEARCH PROJECT</p>
                                <table></table>
                            </div>
                        </div>
                    </div>
                    <div name="friends" id="friends" type="tab" class="hidden" style="margin-top:20px;">
                        <div name="nofriends">
                            You have no friends.
                        </div>
                        <div name="witch" class="hidden textleft">
                            <img src="game/img/npc/witch.png" class="left" width="132" height="218">
                            <button name="witch_offer" style="margin-top:30px;">What do you have to offer?</button><br/>
                            <button name="witch_store">What items are you exchanging?</button>
                        </div>
                        <div name="golem" class="hidden textleft">
                            <img src="game/img/npc/golemfull.png" class="left" width="132" height="218">
                            <button name="witch_offer" style="margin-top:30px;">What do you have to offer?</button><br/>
                            <button name="witch_store">What items are you exchanging?</button>
                        </div>
                    </div>
                    <table name="workers" cellpadding="8" type="tab">

                    </table>
                    <table name="soldiers" cellpadding="8" type="tab" class="hidden">

                    </table>
                    <table name="stats" cellpadding="8" type="tab" class="hidden textleft">
                        <tr><td>Money earned</td><td name="totalmoney"></td></tr>
                        <tr><td>Money from looting</td><td name="totallootmoney">0</td></tr>
                        <tr><td>Total Worker OPM</td><td name="totalworkeropm">0</td></tr>
                        <tr><td>Times Worker Efficiency<br/>has been researched</td><td name="wopmtimesresearch">0</td></tr>
                        <tr><td>Total Army KPE</td><td name="armystrength">0</td></tr>
                        <tr><td>Enemies killed</td><td name="totalenemieskilled">0</td></tr>
                        <tr><td>Defenders killed</td><td name="totaldefenderskilled">0</td></tr>
                        <tr><td>Battles won</td><td name="totalbattleswon">0</td></tr>
                        <tr><td>Battles lost</td><td name="totalbattleslost">0</td></tr>
                    </table>
                    <div name="attack" type="tab" class="hidden center" style="margin-top:20px;">

                    </div>
                    <div name="portal" type="tab" class="hidden center" style="margin-top:20px;">
                        <font color="red">BEWARE...</font>
                    </div>
                </div>
            </div>
        </div>
        
        <div id="popup" class="popup hidden">
            <div name="store_content">
                <p name="title" class="title"></p>
                <div name="content">
                    
                </div>
                <span name="buttons">
                    <button name="continue">CONTINUE</button>
                </span>
                <div class="clear"></div>
            </div>
        </div>
        
        <div id="loading_screen">
            <h2>A G A M E . . .</h2>
            <br/>
            <img src="game/img/icons/loading.gif" width="50" height="50" />
            <br/>
            <font size="1">Please wait while the game resources are loaded.</font> 
        </div>
    </body>
    <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-44010885-1', 'rscharts.com');
    ga('send', 'pageview');

    </script>
</html>
