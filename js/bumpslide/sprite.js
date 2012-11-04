/**
 * basic sprite sheet animation
 */
define(['bumpslide/mediaLoader'], function (mediaLoader) {

    return function (sheet_src, w, h, frames) {

        if (frames == undefined) frames = Number.MAX_VALUE;

        var self = {

            loaded:false,

            drawFrame:function (ctx, frameNumber) {

                if (!this.loaded) return;

                frameNumber = Math.max(0, Math.min(frameNumber, frames - 1));

                var cols = Math.floor(img.width / w);
                var c = frameNumber % cols;
                var r = Math.floor(frameNumber / cols);

                ctx.drawImage(img, c * w, r * h, w, h, 0, 0, w, h);
            }

        };

        var img = mediaLoader.getImage(sheet_src, function () {
            self.loaded = true;
        });

        return self;
    }


});