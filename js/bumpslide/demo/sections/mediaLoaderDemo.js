define(['underscore', 'bumpslide/mediaLoader', 'bumpslide/animation', 'bumpslide/view' ], function (_, mediaLoader, animation, view) {

    /**
     * Media Demo
     */

    return function () {

        var video;
        var videoReady = false;

        var startVideo = _.debounce(doStartVideo, 500);

        return _.extend( view(), {
            onShow:onShow,
            onHide:onHide,
            onInit:function () {
                video = mediaLoader.getVideo( 'pinch_your_head', true, onVideoReady, onVideoError);
                video.width = 640;
                video.height = 480;
                video.controls = true;
            }
        });

        function onVideoReady() {
            videoReady = true;
            startVideo();
        }

        function onVideoError() {
            console.log('video error');
        }

        function onShow() {
            this.el.append( video );
            startVideo();

        }

        function onHide() {
            video.paused = true;
            this.el.children().remove();
        }

        function doStartVideo() {
            if(videoReady && self.visible) {
                video.currentTime = .01;
                video.play();
            }
        }
    }


});