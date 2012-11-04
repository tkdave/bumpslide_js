/**
 * This module defines a reusable "playable" interface
 *
 * Something like this...
 * _.extend( self, playable() );
 *
 * @author David Knape, http://bumpslide.com/
 */
define([], function () {

    return function () {

        var _playing = false;

        var self = {

            isPlaying: function () {
                return _playing;
            },

            play: function () {
                if(_playing) return;
                _playing = true;
                self.onPlayStateChange(_playing);
            },

            stop: function () {
                if(!_playing) return;
                _playing = false;
                self.onPlayStateChange(_playing);
            },

            onPlayStateChange: function ( play_state ) {
                // override this to monitor play state
                //console.log('play state change, Playing=', play_state);
            },

            togglePlayPause: function () {
                if(_playing)  self.stop();
                else self.play();
            }
        };

        return self;

    }


});