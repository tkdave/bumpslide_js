define(['bumpslide/animation'], function (animation) {

    /**
     * Re-imagining of FTween for Javascript
     *
     * http://bumpslide.com/blog/2006/11/24/target-based-tweening-with-ftween/
     *
     * You can tween a property or a getter/setter function using
     * natural easing and springing behavior.
     *
     * A getter/setter is a single function that both accesses and mutates a property.
     *
     * Examples:
     * ftween.ease( obj, 'prop', 1.0)
     * $body = $(body)
     * ftween.ease( $body, $body.width, 960 )
     *
     * obj = property host or scope
     * prop = property name or "getterSetter" function
     * target = destination value
     * options = {
     *   gain: .15  // percentage to move towards target
     * }
     */

    // currently running tweens
    var activeTweens = [];

    // our render/update loop
    var anim = animation(loop);

    var DefaultOptions = {
        gain: .2,
        minDelta: .01, // cutoff
        minVelocity: .01, // cutoff
        ignoreVelocity: true,
        maxVelocity: 0,
        keepRounded: false,
        onComplete: null,
        onUpdate: null,
        easing: EaseOut
    };

    function ftween(obj, prop, target, options) {

        var tween;

        // tween instances are re-used, get active tween for this object property if it exists
        for (var n in activeTweens) {
            tween = activeTweens[n];
            if (tween.obj == obj && tween.prop == prop) {
                // update options and target on exisiting tween
                _.extend(tween.options, options);
                tween.target = target;
                tween.isTweening = true;
                return tween;
            }
        }

        tween = {
            isFresh: true,
            isTweening: true,
            obj: obj,
            prop: prop,
            target: target,
            options: _.defaults(options || {}, DefaultOptions),
            stop: function () {
                this.isTweening = false;
            }
        };

        activeTweens.push(tween);

        // we should be able to intantly stop a tween. wait for a just a bit before we start
        setTimeout(function () {
            //console.log('enabling tween', tween.prop, tween.target);
            tween.isFresh = false;
            if(!anim.isPlaying()) anim.play();
        }, 1);

        return tween;
    }


    function loop(time) {

        // remove dead tweens
        activeTweens = activeTweens.filter(function (tween) {
            return tween.isTweening;
        });

        if (activeTweens.length == 0) {
            console.log('all tweens done, stopping animation loop');
            anim.stop();
            return;
        }

        // update active tweens
        _.each(activeTweens, function (tween) {

            if (tween.isFresh) {
                return;
            }

            if (tween.velocity === undefined) {
                tween.velocity = 0;
            }
            var options = tween.options;
            var current = getPropertyValue(tween.obj, tween.prop);
            var ease = _.isFunction(tween.options.easing) ? tween.options.easing : EaseOut;
            var velocity = ease(current, tween.target, tween.velocity, tween.options);

            if (options.maxVelocity > 0) {
                if (velocity > 0) {
                    velocity = Math.min(options.maxVelocity, velocity);
                } else {
                    velocity = Math.max(-options.maxVelocity, velocity);
                }
            }

            current += velocity;

            // set the property and round if necessary
            if (options.keepRounded) {
                current = Math.round(current);
            }

            // if result is to be rounded, no need to get too precise
            if (options.keepRounded) {
                options.minDelta = Math.max(options.minDelta, .5);
            }

            var dist_from_target = Math.abs(tween.target - current);
            var close_enough = dist_from_target <= options.minDelta;
            var slow_enough = options.ignoreVelocity || (Math.abs(velocity) <= options.minVelocity);
            var stopped = velocity == 0 && tween.velocity == 0;

            tween.velocity = velocity;
            tween.current = current;

            setPropertyValue(tween.obj, tween.prop, current);

            // trace
            //console.log('updated tween.  current:' + current + ' target:' + tween.target + ' veloc:' + velocity);

            // call onUpdate callback
            if (_.isFunction(options.onUpdate)) {
                options.onUpdate.call(null, tween);
            }

            // if we are close and not moving very fast, or if we aren't moving anymore, then finish up
            if (close_enough && slow_enough) {
                //console.log('close enough, distance=' + dist_from_target);
                finish(tween);
            } else if (stopped) {
                //console.log('no longer moving, distance=' + dist_from_target);
                finish(tween);
            }
        });
    }

    function finish(tween) {
        tween.isTweening = false;
        setPropertyValue(tween.obj, tween.prop, tween.target);
        if (_.isFunction(tween.options.onComplete)) {
            tween.options.onComplete.call(null, tween);
        }
    }

    function setPropertyValue(obj, prop, val) {
        if (_.isFunction(prop)) {
            // prop is a function
            prop.call(obj, val);
        } else if (_.isFunction(obj[prop])) {
            // prop is the name of a function
            obj[prop].call(obj, val);
        } else {
            // prop is the name of a property
            obj[prop] = val;
        }
    }

    function getPropertyValue(obj, prop) {
        if (_.isFunction(prop)) {
            // prop is a function
            return prop.call(obj);
        } else if (_.isFunction(obj[prop])) {
            // prop is the name of a function
            return obj[prop].call(obj);
        } else {
            // prop is the name of a property
            return obj[prop];
        }
    }


    /**
     * Default Ease Out - Nice and Clean
     */
    function EaseOut(current, target, veloc, options) {
        return (target - current) * options.gain;
    }


    ftween.getActiveTweens = function () {
        return activeTweens.filter(function (tween) {
            return tween.isTweening;
        });
    };

    ftween.stop = function (obj, prop) {
        var tweens = activeTweens.filter(function (tween) {
            if (prop !== undefined) {
                return tween.obj === obj && tween.prop === prop;
            } else {
                return tween.obj === obj;
            }
        });

        // signal for removal
        _.each(tweens, function (tween) {
            tween.isTweening = false;
        });
    };

    ftween.stopAll = function () {
        activeTweens = [];
        anim.stop();
    };

    return ftween;


});