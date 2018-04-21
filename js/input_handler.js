var InputHandler = function () {
	var inputHandler = {};
	var keysDown = {};
	var keysPressed = {};

	var playerSet = [{
			upPressed: false,
			downPressed: false,
			leftPressed: false,
			rightPressed: false,
			actionPressed: false,

			upHeld: false,
			downHeld: false,
			leftHeld: false,
			rightHeld: false,
			actionHeld: false,

			upButtons: [38],
			downButtons: [40],
			leftButtons: [37],
			rightButtons: [39],
			actionButtons: [13],

			padUpButtons: [12],
			padDownButtons: [13],
			padLeftButtons: [14],
			padRightButtons: [15],
			padActionButtons: [0],
			padId: 0
		}, {
			upPressed: false,
			downPressed: false,
			leftPressed: false,
			rightPressed: false,
			actionPressed: false,

			upHeld: false,
			downHeld: false,
			leftHeld: false,
			rightHeld: false,
			actionHeld: false,

			upButtons: [87],
			downButtons: [83],
			leftButtons: [65],
			rightButtons: [68],
			actionButtons: [32],

			padUpButtons: [12],
			padDownButtons: [13],
			padLeftButtons: [14],
			padRightButtons: [15],
			padActionButtons: [0],
			padId: 1
		}, {
			upPressed: false,
			downPressed: false,
			leftPressed: false,
			rightPressed: false,
			actionPressed: false,

			upHeld: false,
			downHeld: false,
			leftHeld: false,
			rightHeld: false,
			actionHeld: false,

			upButtons: [104],
			downButtons: [101],
			leftButtons: [100],
			rightButtons: [102],
			actionButtons: [96],

			padUpButtons: [12],
			padDownButtons: [13],
			padLeftButtons: [14],
			padRightButtons: [15],
			padActionButtons: [0],
			padId: 2
		}, {
			upPressed: false,
			downPressed: false,
			leftPressed: false,
			rightPressed: false,
			actionPressed: false,

			upHeld: false,
			downHeld: false,
			leftHeld: false,
			rightHeld: false,
			actionHeld: false,

			upButtons: [85],
			downButtons: [74],
			leftButtons: [72],
			rightButtons: [75],
			actionButtons: [76],

			padUpButtons: [12],
			padDownButtons: [13],
			padLeftButtons: [14],
			padRightButtons: [15],
			padActionButtons: [0],
			padId: 3
		}
	]

	// these reset after a frame
	inputHandler.upPressed = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].upPressed : false;
	}
	inputHandler.downPressed = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].downPressed : false;
	}
	inputHandler.leftPressed = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].leftPressed : false;
	}
	inputHandler.rightPressed = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].rightPressed : false;
	}
	inputHandler.actionPressed = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].actionPressed : false;
	}
	inputHandler.debugWinPressed = function () {
		return isAnyButtonPressed([78], keysDown);
	}

	// these stay true until key up event
	inputHandler.upHeld = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].upHeld : false;
	}
	inputHandler.downHeld = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].downHeld : false;
	}
	inputHandler.leftHeld = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].leftHeld : false;
	}
	inputHandler.rightHeld = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].rightHeld : false;
	}
	inputHandler.actionHeld = function (playerId) {
		return (playerId < playerSet.length) ? playerSet[playerId].actionHeld : false;
	}

	function isAnyButtonPressed(buttonList, keyList) {
		for (var i = 0; i < buttonList.length; ++i) {
			if (buttonList[i]in keysDown) {
				return true;
			}
		}
		return false;
	}

	function padButtonPressed(b) {
		if (typeof(b) == "object") {
			return b.pressed;
		}
		return b == 1.0;
	}

	function padAnyButtonPressed(pad, buttonList) {
		for (var buttonIndex = 0; buttonIndex < buttonList.length; ++buttonIndex) {
			if (padButtonPressed(pad.buttons[buttonList[buttonIndex]]))
				return true;
		}
		return false;
	}

	inputHandler.updateActions = function () {
		for (var i = 0; i < playerSet.length; ++i) {
			var controlSet = playerSet[i];
			controlSet.upPressed = isAnyButtonPressed(controlSet.upButtons, keysPressed);
			controlSet.downPressed = isAnyButtonPressed(controlSet.downButtons, keysPressed);
			controlSet.leftPressed = isAnyButtonPressed(controlSet.leftButtons, keysPressed);
			controlSet.rightPressed = isAnyButtonPressed(controlSet.rightButtons, keysPressed);
			controlSet.actionPressed = isAnyButtonPressed(controlSet.actionButtons, keysPressed);

			controlSet.upHeld = isAnyButtonPressed(controlSet.upButtons, keysDown);
			controlSet.downHeld = isAnyButtonPressed(controlSet.downButtons, keysDown);
			controlSet.leftHeld = isAnyButtonPressed(controlSet.leftButtons, keysDown);
			controlSet.rightHeld = isAnyButtonPressed(controlSet.rightButtons, keysDown);
			controlSet.actionHeld = isAnyButtonPressed(controlSet.actionButtons, keysDown);
		}
	}

	inputHandler.updateGamePads = function () {
		var gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
		for (var padId = 0; padId < gamepads.length; padId++) {
			if (padId != 0)
				return;
			var gp = gamepads[padId];
			var controlSet = null;
			for (var i = 0; i < playerSet.length; ++i) {
				if (padId == playerSet[i].padId) {
					controlSet = playerSet[i];
					break;
				}
			}
			if (gp && controlSet) {
				var up = padAnyButtonPressed(gp, controlSet.padUpButtons);
				var down = padAnyButtonPressed(gp, controlSet.padDownButtons);
				var left = padAnyButtonPressed(gp, controlSet.padLeftButtons);
				var right = padAnyButtonPressed(gp, controlSet.padRightButtons);
				var action = padAnyButtonPressed(gp, controlSet.padActionButtons);

				controlSet.upPressed = controlSet.upHeld == false && up;
				controlSet.downPressed = controlSet.downHeld == false && down;
				controlSet.leftPressed = controlSet.leftHeld == false && left;
				controlSet.rightPressed = controlSet.rightHeld == false && right;
				controlSet.actionPressed = controlSet.actionHeld == false && action;

				controlSet.upHeld = up || isAnyButtonPressed(controlSet.upButtons, keysDown);
				controlSet.downHeld = down || isAnyButtonPressed(controlSet.downButtons, keysDown);
				controlSet.leftHeld = left || isAnyButtonPressed(controlSet.leftButtons, keysDown);
				controlSet.rightHeld = right || isAnyButtonPressed(controlSet.rightButtons, keysDown);
				controlSet.actionHeld = action || isAnyButtonPressed(controlSet.actionButtons, keysDown);

				// for (var buttonId = 0; buttonId < gp.buttons.length; ++buttonId) {
				// if (padButtonPressed(gp.buttons[buttonId]))
				// console.log(padId, buttonId);
				// }
			}
		}
	}

	inputHandler.update = function () {
		keysPressed = {};
		for (var i = 0; i < playerSet.length; ++i) {
			playerSet[i].upPressed = false;
			playerSet[i].downPressed = false;
			playerSet[i].leftPressed = false;
			playerSet[i].rightPressed = false;
			playerSet[i].actionPressed = false;
		}
		inputHandler.updateGamePads();
	}

	addEventListener("keydown", function (e) {
		keysDown[e.keyCode] = true;
		switch (e.keyCode) {
		case 37:
		case 39:
		case 38:
		case 40: // Arrow keys
		case 32: // Space
			e.preventDefault();
			break;
		default:
			break; // do not block other keys
		}
		inputHandler.updateActions();
	}, false);

	addEventListener("keyup", function (e) {
		delete keysDown[e.keyCode];
		inputHandler.updateActions();
	}, false);

	return inputHandler;
}
