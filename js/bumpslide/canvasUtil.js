/**
 * HTML5 Canvas and Image Utilities
 *
 * Many of these functions are small snippets gathered from the web.
 * Links are provided
 *
 */

define([], function () {

    // static methods
    var self = {

        /**
         * Create a canvas of the given width and height
         */
        create:function (width, height, scaleForRetina) {
            if (width == null) width = 64;
            if (height == null) height = 64;
            if (scaleForRetina == null) scaleForRetina = false;
            var canvas = document.createElement('canvas');
            var scale = (scaleForRetina && window && window.devicePixelRatio) ? window.devicePixelRatio : 1;
            canvas.width = width * scale;
            canvas.height = height * scale;
            canvas.style.width = width;
            canvas.style.height = height;
            return canvas;
        },

        /**
         * Off-screen rendering helper
         *
         * This makes it possible to create and render something to a canvas in one quick step without having to
         * retain a reference to the 2D drawing context.
         *
         * Original code at http://kaioa.com/node/103
         *
         * Example:
         * var bg = canvasUtil.render( 800, 600, function (ctx) {
         *    // draw some stuff
         * });
         */
        render:function (width, height, renderFunction) {
            var canvas = self.create(width, height);
            renderFunction(canvas.getContext('2d'));
            return canvas;
        },

        /**
         * Returns canvas with image cropped to fill
         *
         * @param img
         * @param width
         * @param height
         * @param alignment (default=.5,centered 0=top/left 1=bottom/right)
         */
        cropImage:function (img, width, height, alignment) {

            if (alignment == null) alignment = .5;
            width = Math.round(width);
            height = Math.round(height);

            var canvas = self.create(width, height);
            var ctx = canvas.getContext('2d');

            var target_aspect = width / height;
            var w = img.width;
            var h = img.height;
            var source_aspect = w / h;

            var sw, sh, sx, sy;

            if (source_aspect > target_aspect) {
                // wider, crop off edges
                sh = h;
                sw = target_aspect * h;
                sy = 0;
                sx = Math.round((w - sw) * alignment);
            } else {
                // tall, crop off top and bottom
                sw = w;
                sh = w / target_aspect;
                sx = 0;
                sy = Math.round((h - sh) * alignment);
            }

            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
            return canvas;
        },

        /**
         * Get image data for a loaded image,
         * optionally scale the image before draw to canvas
         *
         * @param img
         * @param sw scaled width
         * @param sh scaled height
         */
        getImagePixelData:function (img, sw, sh) {
            if (sw == null) sw = img.width;
            if (sh == null) sh = img.height;

            var image_data;
            self.render(sw, sh, function (ctx) {
                ctx.drawImage(img, 0, 0, sw, sh);
                image_data = ctx.getImageData(0, 0, sw, sh);
            });
            return image_data;
        },

        /**
         * Draws a rounded rectangle using the current state of the canvas.
         * If you omit the last three params, it will draw a rectangle
         * outline with a 5 pixel border radius
         *
         * http://js-bits.blogspot.com/2010/07/canvas-rounded-corner-rectangles.html
         *
         * @param {CanvasRenderingContext2D} ctx
         * @param {Number} x The top left x coordinate
         * @param {Number} y The top left y coordinate
         * @param {Number} width The width of the rectangle
         * @param {Number} height The height of the rectangle
         * @param {Number} radius The corner radius. Defaults to 5;
         * @param {Boolean} fill Whether to fill the rectangle. Defaults to false.
         * @param {Boolean} stroke Whether to stroke the rectangle. Defaults to true.
         */
        drawRoundRect:function (ctx, x, y, width, height, radius, fill, stroke) {
            if (typeof fill === "undefined") {
                fill = true;
            }
            if (typeof stroke === "undefined") {
                stroke = false;
            }
            if (typeof radius === "undefined") {
                radius = 3;
            }
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(x + radius, y);
            ctx.lineTo(x + width - radius, y);
            ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
            ctx.lineTo(x + width, y + height - radius);
            ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
            ctx.lineTo(x + radius, y + height);
            ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
            ctx.lineTo(x, y + radius);
            ctx.quadraticCurveTo(x, y, x + radius, y);
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }
            ctx.restore();
        },

        drawCircle:function (ctx, cx, cy, radius, fill, stroke) {
            if (typeof fill === "undefined") {
                fill = true;
            }
            if (typeof stroke === "undefined") {
                stroke = false;
            }
            if (typeof radius === "undefined") {
                radius = 3;
            }

            ctx.beginPath();
            ctx.arc(cx, cy, radius, 0, Math.PI * 2, true);
            ctx.closePath();
            if (stroke) {
                ctx.stroke();
            }
            if (fill) {
                ctx.fill();
            }
        },

        // draw image to canvas at native resolution or half size if on retina
        // if on retina, we assume that we are using a double-resolution image (@2x)
        // if this is not the case, then you have no need for this method
        drawImageX:function (ctx, img) {
            if (window !== undefined && window.devicePixelRatio !== undefined) {
                var r = window.devicePixelRatio;
                //console.log( 'window.devicePixelRatio:', r);//ctx.canvas, ctx.canvas.style );
                //var canvas_scale = (ctx.canvas.width/ctx.canvas.style.width);
                var scale = (r > 1 && img.src.indexOf('@2x')!=-1) ? .5 : 1; // accomodate double-resolution images
                //scale *= r/canvas_scale; // accomodate pixel ratio and canvas scale
                //console.log( 'scale:'+canvas_scale);
            }
            if(scale==0) scale=1;
            ctx.drawImage(img, 0, 0, img.width * scale, img.height * scale);
        },

        isRetina:function () {
            return window.devicePixelRatio > 1;
        }

    };

    return self;


})