/* @Project: JavaScript Slingo */
/* @Author:  nick99nack */
/* @Contact: spybob888 at aol dot com */
/* @Modified: 10:35 AM Saturday, September 04, 2021 */

var boardArray = new Array();
boardArray[0] = new Array(0, 0, 0, 0, 0);
boardArray[1] = new Array(0, 0, 0, 0, 0);
boardArray[2] = new Array(0, 0, 0, 0, 0);
boardArray[3] = new Array(0, 0, 0, 0, 0);
boardArray[4] = new Array(0, 0, 0, 0, 0);

var boardIDs = new Array();
boardIDs[0] = new Array("A1", "B1", "C1", "D1", "E1");
boardIDs[1] = new Array("A2", "B2", "C2", "D2", "E2");
boardIDs[2] = new Array("A3", "B3", "C3", "D3", "E3");
boardIDs[3] = new Array("A4", "B4", "C4", "D4", "E4");
boardIDs[4] = new Array("A5", "B5", "C5", "D5", "E5");

slotArray = new Array(0, 0, 0, 0, 0);
activeJokerArray = new Array(0, 0, 0, 0, 0);
max_nums = new Array(15, 30, 45, 60, 75);
min_nums = new Array(1, 16, 31, 46, 61);
used_nums = new Array();
totals = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
slingos = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
unmatchedcols = new Array(0, 0, 0, 0, 0);


var num_devils = 0;
var max_devils = 2;
var active_devil = 0;
var csmb = 0;
var spin = 0;
var score = 0;
var isgameover = 0;
var isspinactive = 0;
var domatchesexist = 0;
var slingoexists = 0;
var maxfcbonus = 13500;
var iscardfull = 0;
var freespins = 0;
var tempnum = 0;
var valid = 0;
var game_end_called = 0;

var fcblinktimer;
var fcblinksleft = 5;
var fcBlinkOn = false;

function newBoard() {
	document.getElementById("gameover").style.display = "none";
	document.getElementById("scoredisplay").innerHTML = score;
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			valid = 0;
			while (valid == 0) {
				tempnum = generateNum(min_nums[i], max_nums[i]);
				if (!(used_nums.includes(tempnum))) {
					used_nums.push(tempnum);
					boardArray[i][j] = tempnum;
					valid = 1;

				}
			}

			document.getElementById(boardIDs[i][j]).innerHTML = boardArray[i][j];
		}

	}
} /* Thanks floppydisk! */

function takeSpin() {
	/* This function is too damn large */
	document.getElementById("startspinbtn").style.display = "none";
	document.getElementById("disabledspinbtn").style.display = "block";
	mPlay("spinclick_snd");
	active_devil = 0;
	if (spin < 20) {
		incrementSpin();
		for (var i = 0; i < 5; i++) {
			(function (i) {
				setTimeout(function () {
					/* Reset */

					activeJokerArray[i] = 0;
					/* Generate numbers */
					slotArray[i] = generateNum(min_nums[i] - 1, max_nums[i] + 4);
					/* Check for Jokers*/
					if (slotArray[i] > max_nums[i]) {
						mPlay("slot" + (i + 1) + "_snd");
						document.getElementById("S" + (i + 1)).innerHTML = "";
						document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/jokerslot.gif')";
						activeJokerArray[i] = 1;
					} /* Devils, Cherubs, Coins, Free Spins */ else if (slotArray[i] < min_nums[i]) {
						csmb = generateNum(0, 6);
						if (csmb == 0 && num_devils < max_devils && active_devil != 1) {
							if (spin == 1) { /* We can't have a dd on the first spin - give them a coin instead */
								mPlay("slot" + (i + 1) + "_snd");
								num_devils++;
								document.getElementById("S" + (i + 1)).innerHTML = "";
								document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/coinslot.gif')";
								score += 1000;
								flashAndUpdateScore(400);
							} else {
								mPlay("slot" + (i + 1) + "_snd");
								document.getElementById("S" + (i + 1)).innerHTML = "";
								document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/devilslot.gif')";
								num_devils++;
								active_devil++;
								score = score / 2;
								setTimeout(function () {
									document.getElementById("devil").style.display = "block";
									mPlay("dd_snd");
									setTimeout(function () {
										document.getElementById("devil").style.display = "none";
										mPlay("scorereduce_snd");
										flashAndUpdateScore(400);
									}, 2500)

								}, 1400)
							}
						} else if (csmb == 1 && num_devils < max_devils && active_devil != 1) {

							if (spin == 1) { /* We can't have a csmb on the first spin - give them a coin instead */
								mPlay("slot" + (i + 1) + "_snd");
								num_devils++;
								document.getElementById("S" + (i + 1)).innerHTML = "";
								document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/coinslot.gif')";
								score += 1000;
								flashAndUpdateScore(400);
							} else {

								mPlay("slot" + (i + 1) + "_snd");
								num_devils++;
								active_devil++;
								document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/devilslot.gif')";

								setTimeout(function () {
									document.getElementById("devil").style.display = "block";
									mPlay("dd_snd");
									setTimeout(function () {
										document.getElementById("devil").style.display = "none";
										document.getElementById("csmb").style.display = "block";
										mPlay("csmb_snd");

										setTimeout(function () {
											document.getElementById("csmb").style.display = "none";
										}, 3800)

									}, 2500)

								}, 1400)
							}

						} else if (csmb > 1 && csmb < 5) {
							mPlay("slot" + (i + 1) + "_snd");
							document.getElementById("S" + (i + 1)).innerHTML = "";
							document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/coinslot.gif')";
							score += 1000;
							flashAndUpdateScore(400);
							mPlay("coin");
						} else if (csmb > 4) {
							mPlay("slot" + (i + 1) + "_snd");
							document.getElementById("S" + (i + 1)).innerHTML = "";
							document.getElementById("S" + (i + 1)).style.backgroundImage = "url('./img/freespinslot.gif')";
							freespins += 1
							document.getElementById("freespindisplay").innerHTML = freespins;
							mPlay("freespin_snd");
						} else if (num_devils >= max_devils) {
							csmb = -1;
							slotArray[i] = generateNum(min_nums[i], max_nums[i]);
							mPlay("slot" + (i + 1) + "_snd");
							document.getElementById("S" + (i + 1)).innerHTML = slotArray[i];
						}


					} else {
						mPlay("slot" + (i + 1) + "_snd");
						document.getElementById("S" + (i + 1)).innerHTML = slotArray[i];
					}
					/* check to see if matches exist in each column */
					for (row = 0; row < 5; row++) {
						if ((boardArray[i][row] === slotArray[i] || activeJokerArray[i] == 1) && boardArray[i][row] != 0) {
							unmatchedcols[i] = 1;
							isspinactive = 1;
						}
					}


				}, 310 * i);
			})(i);




		}
		setTimeout(updateSpinStatus, 1500);
	}

}

function incrementSpin() {
	spin++;
	document.getElementById("spindisplay").innerHTML = spin;
}

function generateNum(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function checkMatch(col, row) {
	if ((boardArray[col][row] === slotArray[col] || activeJokerArray[col] == 1) && boardArray[col][row] != 0) {
		mPlay("filltile_snd");
		document.getElementById(boardIDs[col][row]).style.backgroundImage = "url('./img/coveredtile.gif')";
		document.getElementById(boardIDs[col][row]).innerHTML = "";
		if (activeJokerArray[col] == 1) {
			document.getElementById("S" + (col + 1)).style.backgroundImage = "url('./img/usedjokerslot.gif')";
		}
		boardArray[col][row] = 0;
		activeJokerArray[col] = 0;
		scoring(col, row);
		unmatchedcols[col] = 0;
		csmb = -1;
		updateSpinStatus();



	} else {
		mPlay("invalid_snd");
	}
}

function resetJokerArray() {
	for (var i = 0; i < 5; i++) {
		jokerArray[i] = 0;
	}
}


function scoring(col, row) {

	/* This function sucks shit. */
	score += 200;
	flashAndUpdateScore(400);

	totals[0] = boardArray[0][0] + boardArray[0][1] + boardArray[0][2] + boardArray[0][3] + boardArray[0][4]
	totals[1] = boardArray[1][0] + boardArray[1][1] + boardArray[1][2] + boardArray[1][3] + boardArray[1][4]
	totals[2] = boardArray[2][0] + boardArray[2][1] + boardArray[2][2] + boardArray[2][3] + boardArray[2][4]
	totals[3] = boardArray[3][0] + boardArray[3][1] + boardArray[3][2] + boardArray[3][3] + boardArray[3][4]
	totals[4] = boardArray[4][0] + boardArray[4][1] + boardArray[4][2] + boardArray[4][3] + boardArray[4][4]
	totals[5] = boardArray[0][0] + boardArray[1][0] + boardArray[2][0] + boardArray[3][0] + boardArray[4][0]
	totals[6] = boardArray[0][1] + boardArray[1][1] + boardArray[2][1] + boardArray[3][1] + boardArray[4][1]
	totals[7] = boardArray[0][2] + boardArray[1][2] + boardArray[2][2] + boardArray[3][2] + boardArray[4][2]
	totals[8] = boardArray[0][3] + boardArray[1][3] + boardArray[2][3] + boardArray[3][3] + boardArray[4][3]
	totals[9] = boardArray[0][4] + boardArray[1][4] + boardArray[2][4] + boardArray[3][4] + boardArray[4][4]
	totals[10] = boardArray[0][0] + boardArray[1][1] + boardArray[2][2] + boardArray[3][3] + boardArray[4][4]
	totals[11] = boardArray[4][0] + boardArray[3][1] + boardArray[2][2] + boardArray[1][3] + boardArray[0][4]

	for (var i = 0; i < 12; i++) {
		if (totals[i] == 0 && slingos[i] == 0) {

			slingos[i] = -1;
			slingoexists = 1;
			document.getElementById("slingo" + (i + 1)).style.display = "block";
			setTimeout(function () {
				mPlay("slingo_snd");
				score += 1000;


			}, 1400)


		}
	}
	if (slingoexists == 1) {
		setTimeout(function () {
			document.getElementById("scoredisplay").innerHTML = score;
			slingoexists = 0;
			for (var j = 1; j < 13; j++) {
				document.getElementById("slingo" + j).style.display = "none";
			}
		}, 2500)
	} else {
		flashAndUpdateScore(400);
	}

	if (slingos[0] + slingos[1] + slingos[2] + slingos[3] + slingos[4] + slingos[5] + slingos[6] + slingos[7] + slingos[8] + slingos[9] + slingos[10] + slingos[11] == -12) {
		iscardfull = 1;
		endGame(1);
	}

}

function calcFCBonus(spinnum) {
	var difference = spinnum - 5;
	return maxfcbonus - (500 * difference)
}

function updateSpinStatus() {
	var totalunmatchedcols = 0;
	for (i = 0; i < 5; i++) {
		totalunmatchedcols = totalunmatchedcols + unmatchedcols[i];
	}

	if (totalunmatchedcols == 0) {
		if (slingoexists == 1) {
			setTimeout(function () {
				isspinactive = 0;
				if (spin < 20 && iscardfull == 0) {
					if (spin > 15 && spin < 20) {
						finalSpins();
					} else {
						startNextSpin();
					}
				} else if (spin == 20) {
					endGame(2);
				}
			}, 4000)

		} else if (csmb == 1) {
			setTimeout(function () {
				isspinactive = 0;
				if (spin < 20 && iscardfull == 0) {
					if (spin > 15 && spin < 20) {
						finalSpins();
					} else {
						startNextSpin();
					}
				} else if (spin == 20) {
					endGame(2);
				}
			}, 7800)
		} else if (csmb == 0) {
			setTimeout(function () {
				isspinactive = 0;
				if (spin < 20 && iscardfull == 0) {
					if (spin > 15 && spin < 20) {
						finalSpins();
					} else {
						startNextSpin();
					}
				} else if (spin == 20) {
					endGame(2);
				}
			}, 4000)
		} else {
			setTimeout(function () {
				isspinactive = 0;
				if (spin < 20 && iscardfull == 0) {
					if (spin > 15 && spin < 20) {
						finalSpins();
					} else {
						startNextSpin();
					}
				} else if (spin == 20) {
					endGame(2);
				}
			}, 1800)
		}

	}
}

function startGame() {
	newBoard();
	mPlay("start_snd");
	document.getElementById("startgamebtn").style.display = "none";
	document.getElementById("startspinbtn").style.display = "block";
}

function clearSlots() {
	for (i = 0; i < 5; i++) {
		document.getElementById("S" + (i + 1)).innerHTML = "";
		document.getElementById("S" + (i + 1)).style.backgroundImage = "";
	}
}

function endGame(mode) {
	/* Full Card */
	if (mode == 1) {
		setTimeout(function () {
			game_end_called = 1;
			document.getElementById("timedisplay").innerHTML = "";
			var bonus = calcFCBonus(spin);
			document.getElementById("startspinbtn").style.display = "none";
			score += bonus;
			document.getElementById("scoredisplay").innerHTML = score;
			mPlay("fc_snd");
			mPlay("applause_snd");
			fcBlinkOn = false;
			fcblinksleft = 5;
			fcTimerTick();
			fcblinktimer = setInterval(fcTimerTick, 500);
		}, 2500)

	} else if (mode == 2 && game_end_called == 0) { /* Out of Spins */
		document.getElementById("startspinbtn").style.display = "none";
		document.getElementById("startgamebtn").style.display = "block";
		mPlay("gameover_snd");
		document.getElementById("fullcard").style.display = "none";
		document.getElementById("gameover").style.display = "block";
		gameReset();
	} else if (mode == 3 && game_end_called == 0) { /* Not enough points for a free spin */
		setTimeout(function () {
			game_end_called = 1;
			var bonus = calcFCBonus(spin);
			document.getElementById("startspinbtn").style.display = "none";
			document.getElementById("notenoughpts").style.display = "block";
			setTimeout(function () {
				mPlay("gameover_snd");
				document.getElementById("notenoughpts").style.display = "none";
				document.getElementById("gameover").style.display = "block";
				document.getElementById("startgamebtn").style.display = "block";
				gameReset();
			}, 5000)
		}, 2500)
	}
}

function gameReset() {
	for (i = 0; i < 5; i++) {
		slotArray[i] = 0;
		activeJokerArray[i] = 0;
		unmatchedcols[i] = 0;
	}
	for (j = 0; j < 12; j++) {
		totals[j] = 0;
		slingos[j] = 0;
	}

	for (col = 0; col < 5; col++) {
		for (row = 0; row < 5; row++) {
			document.getElementById(boardIDs[col][row]).style.backgroundImage = "";
			document.getElementById(boardIDs[col][row]).innerHTML = "";
		}
	}

	num_devils = 0;
	active_devil = 0;
	csmb = 0;
	spin = 0;
	score = 0;
	isgameover = 0;
	isspinactive = 0;
	domatchesexist = 0;
	slingoexists = 0;
	iscardfull = 0;
	freespins = 0;
	used_nums = [];
	game_end_called = 0;
	document.getElementById("freespindisplay").innerHTML = freespins;
	document.getElementById("spindisplay").innerHTML = spin;
	document.getElementById("disabledspinbtn").style.display = "none";
	clearSlots();
}

function finalSpins() {
	if (spin == 16) {
		document.getElementById("finalspins4").style.display = "block";
	} else if (spin == 17) {
		document.getElementById("finalspins3").style.display = "block";
	} else if (spin == 18) {
		document.getElementById("finalspins2").style.display = "block";
	} else if (spin == 19) {
		document.getElementById("finalspins1").style.display = "block";
	}


	if (spin == 16 && freespins == 0) {
		setTimeout(function () {
			document.getElementById("finalspins4").style.display = "none";
			setTimeout(function () {
				mPlay("scorereduce_snd");
				score -= 500;
				document.getElementById("scoredisplay").innerHTML = score;
				startNextSpin();

			}, 1000)

		}, 5000)
	} else if (spin == 16 && freespins > 0) {
		setTimeout(function () {
			document.getElementById("finalspins4").style.display = "none";
			document.getElementById("freespinq").style.display = "block";
			document.getElementById("yesbtn").style.display = "block";
			document.getElementById("nobtn").style.display = "block";
		}, 5000)
	}
	else if (spin == 17 && freespins == 0) {
		setTimeout(function () {
			document.getElementById("finalspins3").style.display = "none";
			setTimeout(function () {
				mPlay("scorereduce_snd");
				score -= 1000;
				document.getElementById("scoredisplay").innerHTML = score;
				startNextSpin();

			}, 1000)

		}, 5000)
	} else if (spin == 17 && freespins > 0) {
		setTimeout(function () {
			document.getElementById("finalspins3").style.display = "none";
			document.getElementById("freespinq").style.display = "block";
			document.getElementById("yesbtn").style.display = "block";
			document.getElementById("nobtn").style.display = "block";
		}, 5000)
	}
	else if (spin == 18 && freespins == 0) {
		setTimeout(function () {
			document.getElementById("finalspins2").style.display = "none";
			setTimeout(function () {
				mPlay("scorereduce_snd");
				score -= 1500;
				document.getElementById("scoredisplay").innerHTML = score;
				startNextSpin();

			}, 1000)

		}, 5000)
	} else if (spin == 18 && freespins > 0) {
		setTimeout(function () {
			document.getElementById("finalspins2").style.display = "none";
			document.getElementById("freespinq").style.display = "block";
			document.getElementById("yesbtn").style.display = "block";
			document.getElementById("nobtn").style.display = "block";
		}, 5000)
	}
	else if (spin == 19 && freespins == 0) {
		setTimeout(function () {
			document.getElementById("finalspins1").style.display = "none";
			setTimeout(function () {
				mPlay("scorereduce_snd");
				score -= 2000;
				document.getElementById("scoredisplay").innerHTML = score;
				startNextSpin();

			}, 1000)

		}, 5000)
	} else if (spin == 19 && freespins > 0) {
		setTimeout(function () {
			document.getElementById("finalspins1").style.display = "none";
			document.getElementById("freespinq").style.display = "block";
			document.getElementById("yesbtn").style.display = "block";
			document.getElementById("nobtn").style.display = "block";
		}, 5000)
	}

}

function startNextSpin() {
	mPlay("start_snd");
	document.getElementById("disabledspinbtn").style.display = "none";
	document.getElementById("startspinbtn").style.display = "block";
	clearSlots();
}

function freeSpinAnswer(val) {
	if (val == true) {
		freespins -= 1;
		document.getElementById("freespindisplay").innerHTML = freespins;
		startNextSpin();
		document.getElementById("freespinq").style.display = "none";
		document.getElementById("yesbtn").style.display = "none";
		document.getElementById("nobtn").style.display = "none";

	} else {
		mPlay("scorereduce_snd");
		if (spin == 16) {
			score -= 500;
		} else if (spin == 17) {
			score -= 1000;
		} else if (spin == 18) {
			score -= 1500;
		} else if (spin == 19) {
			score -= 2000;
		}
		document.getElementById("freespinq").style.display = "none";
		document.getElementById("yesbtn").style.display = "none";
		document.getElementById("nobtn").style.display = "none";
		document.getElementById("scoredisplay").innerHTML = score;
		startNextSpin();
	}
}

function fcTimerTick() {
	var bgimage = "url('./img/coveredtile_fcblink.gif')";
	if (fcBlinkOn) {
		bgimage = "url('./img/coveredtile.gif')";
		fcBlinkOn = false;
	} else {
		fcBlinkOn = true;
		if(fcblinksleft > 0) {
			mPlay("fc_slingo_snd");
			fcblinksleft--;
		} else {
			clearInterval(fcblinktimer);
			var bonus = calcFCBonus(spin);
			document.getElementById("bonuspntdisplay").style.display = "block";
			document.getElementById("bonuspntdisplay").innerHTML = bonus;
			document.getElementById("fullcard").style.display = "block";
			setTimeout(function () {
				mPlay("gameover_snd");
				document.getElementById("fullcard").style.display = "none";
				document.getElementById("bonuspntdisplay").style.display = "none";
				document.getElementById("gameover").style.display = "block";
				document.getElementById("startgamebtn").style.display = "block";
				gameReset();
			}, 3000)
			bgimage = "url('./img/coveredtile.gif')";
		}
	}
	for (var i = 0; i < 5; i++) {
		for (var j = 0; j < 5; j++) {
			document.getElementById(boardIDs[i][j]).style.backgroundImage = bgimage;
		}
	}
}

function restartBtnClick() {
	/* This function sucks shit and doesn't work right in some scenarios */
	if(isgameover === 0) {
		document.getElementById("restartbtn").style.backgroundImage = "url('./img/restartbtn_down.gif')";
		setTimeout(function () {
			document.getElementById("restartbtn").style.backgroundImage = "url('./img/restartbtn.gif')";
		}, 200)
		isgameover = 1;
		endGame(2);
	} else {
		mPlay("invalid_snd");
	}
}

function rulesBtnClick() {
	if(document.getElementById("rulesoverlay").style.display == "block") {
		document.getElementById("rulesbtn").style.backgroundImage = "url('./img/rulesbtn.gif')";
		document.getElementById("rulesoverlay").style.display = "none";
	} else {
		document.getElementById("rulesbtn").style.backgroundImage = "url('./img/rulesbtn_down.gif')";
		document.getElementById("rulesoverlay").style.display = "block";
	}
}

function flashAndUpdateScore(duration) {
	document.getElementById("scoredisplay").innerHTML = score;
	document.getElementById("scoredisplay").style.border = "solid red 1px";
	document.getElementById("scoredisplay").style.top = "81px";
	document.getElementById("scoredisplay").style.left = "33px";
	setTimeout(function () {
		document.getElementById("scoredisplay").style.border = "none";
		document.getElementById("scoredisplay").style.top = "82px";
		document.getElementById("scoredisplay").style.left = "34px";
	}, duration)
}