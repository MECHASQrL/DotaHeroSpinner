var AudioManager = function () {
	var manager = {};
	var audioSFXAssets = [];
	var audioMusicAssets = [];

	var masterVolume = 1;
	var sfxVolume = 1;
	var musicVolume = 1;

	var maxAudioChannlels = 10;

	// prepare audio channels
	var audioChannels = new Array();
	for (i = 0; i < maxAudioChannlels; ++i) {
		audioChannels[i] = new Array();
		audioChannels[i]['channel'] = new Audio();
		audioChannels[i]['finished'] = -1;
	}

	//detect IE
	function getInternetExplorerVersion() {
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer') {
			var ua = navigator.userAgent;
			var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
				rv = parseFloat(RegExp.$1);
		}
		return (rv === -1);
	}

	var audioEnabled = getInternetExplorerVersion();

	manager.loadSFX = function (name, path) {
		audioSFXAssets[name] = new Audio(path);
	}

	manager.loadMusic = function (name, path) {
        audioMusicAssets[name] = new Audio(path);
        audioMusicAssets[name].buffer = true;
	}

	manager.playSFX = function (name) {
		if (audioEnabled) {
			for (i = 0; i < audioChannels.length; ++i) {
				var thistime = new Date();
				if (audioChannels[i]['finished'] < thistime.getTime()) {
					audioChannels[i]['finished'] = thistime.getTime() + audioSFXAssets[name].duration * 1000;

					audioChannels[i]['channel'].src = audioSFXAssets[name].src;
					audioChannels[i]['channel'].load();
					audioChannels[i]['channel'].play();
					break;
				}
			}
		}
	}

    manager.playMusic = function(name, loop)
    {
        if (audioEnabled) {
            audioMusicAssets[name].volume = masterVolume * musicVolume;
            audioMusicAssets[name].loop = loop;
            audioMusicAssets[name].play();
        }
    };

    manager.pauseMusic = function(name)
    {
        audioMusicAssets[name].pause();
    };


    manager.stopMusic = function(name)
    {
        audioMusicAssets[name].currentTime = 0;
        audioMusicAssets[name].pause();
    };

	return manager;
}
