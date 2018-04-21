//main game
var DotaSpinner = function (w, h) {

	var DotaSpinner = {}
	var width = w;
	var height = h;

	var canvas = null;
	var context = null;
	var SpinButton = null;

	//assets loaded flag
	var loaded = false;
    var imageData = {};

	// systems
	var inputHandler = null;

	// game state
	var gameTime = null;
	var deltaTime = null;
	var gameState = "initialise";
	
	// Hero data
	var HeroCount = 115;
	var Cols = 9;
	var MarginSize = 10;
	var IconW = 150;
	var IconH = 84;
	
	// Spin data
	var SpinSoundCap = 0.05;
	var SpinTimer = 0.0;
	var GlowAmount = 0.0;
	var GlowAmountMax = 1.0;
	var GlowDecayRate = 0.4;

	var SpinSpeed = 25.0;
	var SpinSpeedVariance = 3.0;
	var SpinDecayRate = 5.0;
	var SpinCurrentSpeed = 0.0;
	var CurrentSpinProgress = 0.0;
	
	var SpinVisibleHeroCount = 7;
	var SpinPoolSize = 35;
	var SpinHeroIdPoolSize = 0;
	var SpinHeroIdPool = [];
	var SpinPool = [];
	
	//create canvas
	DotaSpinner.createCanvas = function (w, h) {

		canvas = document.getElementById("mainCanvas");
		SpinButton = document.getElementById("SpinButton");
		SpinButton.addEventListener("click", function(){ DotaSpinner.TrySpin();} );
		context = canvas.getContext("2d");
	}

	//preload images
	DotaSpinner.preloadImages = function () {
		var loader = new PxLoader();
        imageData.image_crystal = loader.addImage("images/sprites.jpg");

		//callback on images loaded
		loader.addCompletionListener(function () {
			loaded = true;
		});

		loader.start();
	}

	//clear canvas
	DotaSpinner.clear = function () {
		context.fillStyle = "#000000";
		context.fillRect(0, 0, canvas.width, canvas.height);
	}

	//init game
	DotaSpinner.init = function () {
		DotaSpinner.createCanvas(width, height);
		DotaSpinner.preloadImages();
        audioManager = AudioManager();
		inputHandler = InputHandler();

        audioManager.loadSFX("level_complete", "sounds/171671__fins__success-1.wav");
        audioManager.loadSFX("menu_nav", "sounds/171697__nenadsimic__menu-selection-click.wav");
	}
	
	DotaSpinner.TrySpin = function() {
		if (gameState === "idle")
		{
			gameState = "spin";
			CurrentSpinIteration = 0;
			SpinTimer = 0.0;
			
			SpinCurrentSpeed = SpinSpeed + (SpinSpeedVariance - (Math.random() * SpinSpeedVariance * 2));
			CurrentSpinProgress = 0.0;
			
			SpinHeroIdPoolSize = SpinHeroIdPool.length;
			SpinButton.disabled = true;
			SpinPool.length = 0;
			for (var i = 0; i < SpinPoolSize; ++i)
			{
				var HeroIdIndex = Math.floor(Math.random() * Math.floor(SpinHeroIdPoolSize));
				var result = SpinHeroIdPool[HeroIdIndex];
				SpinPool.push(result);
				SpinHeroIdPool[HeroIdIndex] = SpinHeroIdPool[SpinHeroIdPoolSize - 1];
				SpinHeroIdPool[SpinHeroIdPoolSize - 1] = result;
				--SpinHeroIdPoolSize;
			}
			
		}
	}

	DotaSpinner.updateMenu = function () {

	}
	
	DotaSpinner.drawResult = function () {
		context.save();
        context.strokeStyle="#f11";
        context.setLineDash([0,0]);
        context.lineWidth = 5;
		context.strokeRect( canvas.width/2 - IconW /2, 100 - IconH/2, IconW, IconH );
		context.restore();
		
		for ( var i = 0; i < SpinVisibleHeroCount; ++i)
		{
			var progress = (i + CurrentSpinProgress) % SpinPoolSize;
			DotaSpinner.drawHeroIcon(SpinPool[Math.floor(progress)], i + (1.0 - (progress % 1.0)) );	
		}
	}
	
	DotaSpinner.drawHeroIcon = function (id, slot) {
		if (id >= 0)
		{
			var HeroIdX = id % Cols;
			var HeroIdY = Math.floor(id / Cols);
			
			var subReagion = {};
			subReagion.x = MarginSize + HeroIdX * (MarginSize * 2 + IconW);
			subReagion.y = MarginSize + HeroIdY * (MarginSize * 2 + IconH)
			subReagion.w = IconW;
			subReagion.h = IconH;
			
			var SlotOffset = (slot - Math.floor((SpinVisibleHeroCount) / 2) - 1) * IconW;
			
			context.save();
			context.translate(canvas.width/2 + SlotOffset, 100);
			context.drawImage(imageData.image_crystal,
			subReagion.x, subReagion.y,
			subReagion.w, subReagion.h,
			-subReagion.w / 2, -subReagion.h / 2,
			subReagion.w, subReagion.h);

			context.restore();
		}
	}

	DotaSpinner.initialise = function () {
		gameState = "idle";
		
		var tempPool = [];
		for (var i = 0; i < HeroCount; ++i)
		{
			SpinHeroIdPool.push(i);
		}
		SpinHeroIdPoolSize = SpinHeroIdPool.length;
		
		for (var i = 0; i < SpinVisibleHeroCount; ++i)
		{
			SpinPool.push(i);
		}

		// for (var i = 0; i < SpinVisibleHeroCount; ++i)
		// {
			// var HeroIdIndex = Math.floor(Math.random() * Math.floor(SpinHeroIdPoolSize));
			// var result = SpinHeroIdPool[HeroIdIndex];
			// SpinPool.push(result);
			// SpinHeroIdPool[HeroIdIndex] = SpinHeroIdPool[SpinHeroIdPoolSize - 1];
			// SpinHeroIdPool[SpinHeroIdPoolSize - 1] = result;
			// --SpinHeroIdPoolSize;
		// }
		
		// SpinHeroIdPoolSize = SpinHeroIdPool.length;
	}
	
	DotaSpinner.updateSpin = function () {
		var prevSpinProgress = CurrentSpinProgress;
		CurrentSpinProgress = CurrentSpinProgress + SpinCurrentSpeed * deltaTime;
		SpinCurrentSpeed = Math.max(SpinCurrentSpeed - SpinDecayRate * deltaTime, 0.0);
		
		SpinTimer -= deltaTime;
		if (Math.floor(prevSpinProgress) != Math.floor(CurrentSpinProgress) && SpinTimer < 0.0)
		{
			audioManager.playSFX("menu_nav");
			SpinTimer = SpinSoundCap;
		}

		if (SpinCurrentSpeed <= 0.0)
		{
			if ( (CurrentSpinProgress % 1.0) < 0.001 )
			{
				CurrentSpinProgress = Math.round(CurrentSpinProgress);
				gameState = "result";
			}
			else
			{
				var TargetProgress = Math.round(CurrentSpinProgress);
				var TargetDelta = Math.abs((TargetProgress - CurrentSpinProgress));
				var MaxStep = Math.sign(TargetProgress - CurrentSpinProgress) * 0.5 * deltaTime;
				var Step = Math.min(Math.max(MaxStep, -TargetDelta), TargetDelta);
				CurrentSpinProgress += Step;

			}
		}
	}
	
	DotaSpinner.updateResult = function () {
		SpinButton.disabled = false;
		audioManager.playSFX("level_complete");
		gameState = "idle";
	}
	
	DotaSpinner.drawTitle = function () {
		DotaSpinner.drawResult();
	}

	//update loop
	DotaSpinner.update = function () {
		if (!loaded) {
			requestAnimationFrame(DotaSpinner.update);
			return;
		}
		
		if (inputHandler.actionPressed(0)) {
			DotaSpinner.TrySpin();
		}

		DotaSpinner.clear();
		DotaSpinner.drawTitle();

        var timeMult = 1; // used for debugging
		var currentTime = Date.now() * 0.001;
		deltaTime = (currentTime - gameTime) * timeMult;
		gameTime = currentTime;
		
		switch (gameState) {
        case "initialise":
			DotaSpinner.initialise();
            break;
		case "idle":
			DotaSpinner.updateMenu();
			break;
		case "spin":
			DotaSpinner.updateSpin();
			break;
		case "result":
			DotaSpinner.updateResult();
			break;
		default:
            console.log("Unknown state: ", gameState);
			gameState = "initialise";
		}

		inputHandler.update();

		requestAnimationFrame(DotaSpinner.update);
	}

	DotaSpinner.start = function () {
		requestAnimationFrame(this.update);
	}

	return DotaSpinner;
}

// main game loop
var main = function () {
	var game = DotaSpinner(800, 600);
	game.init();
	game.start();
};

var audioManager = AudioManager(); 
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

main();
