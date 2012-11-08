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

        var self = {


            _playing: false,

            isPlaying: function () {
                return this._playing;
            },

            play: function () {
                if(this._playing) return;
                this._playing = true;
                this.onPlayStateChange(this._playing);
            },

            stop: function () {
                if(!this._playing) return;
                this._playing = false;
                this.onPlayStateChange(this._playing);
            },

            onPlayStateChange: function ( play_state ) {
                // override this to monitor play state
                //console.log('play state change, Playing=', play_state);
            },

            togglePlayPause: function () {
                if(this._playing)  this.stop();
                else this.play();
            }
        };

        return self;

    }


});