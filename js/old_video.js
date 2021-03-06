/**
 * Youtube Video in Header
 * Copyright (c) 2013 Brandon Thomas <bt@brand.io>
 * See more at http://brand.io
 */
var install_video = function() {
	window.video  = new VideoView();
	window.button = new PlayButtonView();
}

var onYouTubeIframeAPIReady = function() {
	window.video.isYoutubeReady = true;
}

var VideoView = Backbone.View.extend({
	$el: null,
	$player: null,
	$loader: null,
	$ytScript: null,

	tagName: 'header',
	videoId: '0RcjojbuwxM', // TODO: Pull from HTML

	player: null, // YT video class
	playerEl: null, // YT video API to call playVideo() on

	isYoutubeReady: false,
	isInstalled: false,

	events: {
		'click': '_install',
	},

	constructor: function() {
		var that = this;
		this.$ytScript = $('<script></script>')
							.attr('src', 
								'https://www.youtube.com/iframe_api');

		this.$el = $(this.tagName);
		this.$player = this.$el.find('#player');
		this.$loader = this.$el.find('#loader');

		this.$el.append(this.$ytScript);

		$(window).on('resize', function() { that._fitVideo(); });
		this.delegateEvents();
	},

	// Programmatic installation and play
	// Also calls YT api to play
	play: function() {
		this._install();
		if(!this.playerEl) {
			return;
		}
		this.playerEl.playVideo();
	},

	// Install the Youtube Video
	_install: function() {
		if(this.isInstalled) {
			return;
		}
		this.isInstalled = true;
		this.undelegateEvents();

		this.$el.html('')
				.append(this.$loader)
				.append(this.$player);

		this.$loader.show();

		this._install2();
	},

	// Install the Youtube Video
	_install2: function() {
		var that = this;

		// Check to see if script has loaded
		// If not onYouTubeIframeAPIReady yet, then
		// we need to show a 'loading' gif and continue to 
		// poll for ready flag
		if(!this.isYoutubeReady) {
			console.log('YT not yet loaded...');
			that.$el.append(that.$ytScript);
			setTimeout(function() {
				that.install2();
			}, 1000);
			return;
		}

		this.player = new YT.Player('player', {
			width: '1',
			height: '1',
			videoId: this.videoId,
			// https://developers.google.com/youtube/player_parameters
			playerVars: {
				autohide: 1,
				autoplay: 1,
				color: 'white',
				controls: 1,
				modestbranding: 1,
				origin: 'http://localhost:7000',
				rel: 0,
				showinfo: 0,
			},
			events: {
				'onReady': function(ev) {
					that._onPlayerReady(ev);
				},
				'onStateChange': function(ev) {
					that._onPlayerStateChange(ev);
				},
			}
		});

		this.$player = $('#player'); // XXX: YT changes tag with ID! 
		this.$el.html(this.$player);
		this.$player.show();

		this._fitVideo();
	},

	_fitVideo: function() {
		this.$player.width(this.$el.width());
		this.$player.height(this.$el.height());
	},

	_onPlayerReady: function(ev) {
		this.playerEl = ev.target;
	},

	_onPlayerStateChange: function(ev) {
	},
});

var PlayButtonView = Backbone.View.extend({
	events: {
		'click': 'click',
	},
	constructor: function() {
		this.$el = $('#watchvid button');
		this.delegateEvents();
	},
	click: function() {
		$.smoothScroll({
			offset: 0,
			afterScroll: function() {
				window.video.play();
			},
		});
		return false;
	},
});

