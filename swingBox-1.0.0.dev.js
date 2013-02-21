;(function ($) {
    "use strict";

    var SwingBox = function(input, options) {
        var pos = input.offset(),
            max = 0,
            px = "px",
            maps = [0, 0, 0, 0, 
                    2, 0, 3, 3, 
                    5, 2, -1, 6, 
                    5, 5, 5, -2],
            origins = [],
            i;

        function anim(input, origin, target) {
            var d = {},
                keys = Object.keys(origin),
                len = keys.length,
                i = 0,
                k;
            
            for(; i < len; i++) {
                k = keys[i];
                if (origin[k] !== target[k]) { d[k] = target[k] + px; }
            }

            if (Object.keys(d).length > 0) { input.stop().animate(d); }
        }

        function translate(index, column) {
            return index + maps[(index % 4) * 4 + column];
        }

        // Constructor
        input.children().each(function(index) {
            origins[index] = {
                left: pos.left + (index % 4) * options.Width,
                top: pos.top + parseInt(index / 4, 10) * options.Height,
                width: options.Width,
                height: options.Height
            };
            $(this).data("i", index).data("t", origins[index]).css({
                left: origins[index].left + px,
                top: origins[index].top + px,
                width: origins[index].width + px,
                height: origins[index].height + px,
                position: "absolute"
            });
            max = index;

        }).click(function () {
            var $src = $(this),
                src_index = $src.data("i"),
                src_column = src_index % 4;

            input.children().each(function () {
                var $this = $(this),
                    index = $this.data("i"),
                    delta_index = index - src_index,
                    target;

                if (delta_index === 0) {
                    target = $.extend({}, origins[translate(index, src_column)]);
                    target.width *= 3;
                    target.height *= 2;
                } else if (-src_column <= delta_index && delta_index < 4 - src_column) {
                    target = origins[translate(index, src_column)];
                } else if (delta_index < 0) {
                    target = origins[index];
                } else {
                    target = origins[index + 4 + 1];
                }
                
                anim($this, $this.data("t"), target);
                $this.data("t", target);
            });
        });

        for (i = max + 1; i <= max + 7; i++) {
            origins[i] = {
                left: pos.left + (i % 4) * options.Width,
                top: pos.top + parseInt(i / 4, 10) * options.Height,
                width: options.Width,
                height: options.Height
            };
        }
    };

    $.fn.swingBox = function (options) {
        options = $.extend({}, $.fn.swingBox.defaults, options);
        return this.each(function () {
            new SwingBox($(this), options);            
        });  
    };

    $.fn.swingBox.defaults = {
        Width: 200,
        Height: 200
    };
})(jQuery);
