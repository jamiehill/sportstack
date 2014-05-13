/**
 * Created by Jamie on 09/05/2014.
 */
(function($) {


	var SportStack = function(elem, options) {
		var $element = elem, plugin = this, stacks = {};
		var defaults = {
			childClass: 'child',
			expandedClass: 'xpanded',
	        hideSpeed: 1000,
	        showSpeed: 1000
		}

		/**
		 * Initialise the component
		 * @return {[type]} [description]
		 */
        var init = function() {
        	var metadata = $element.data( 'plugin-options' )
        	plugin.config = $.extend({}, defaults, options, metadata);
    		parseElement($element);
    	};

    	plugin.toggle = function(el, index) {
			var data = stacks[$(el).attr('id')];
			if (index >= 0 && index <= data.blocks.length - 1) {

				var settings = data.settings[index],
					method = settings.collapsed ? 'show' : 'hide';

				plugin[method].apply(plugin, [el, index]);
			}
    	};

    	/**
    	 * Show the specified element
    	 * @param  {[type]} el    [description]
    	 * @param  {[type]} index [description]
    	 * @return {[type]}       [description]
    	 */
    	plugin.show = function(el, index) {
    		var data = stacks[$(el).attr('id')];
    		if (index >= 0 && index <= data.blocks.length - 1) {

                var $header 	= $(data.headers[index]),
                    $block  	= $(data.blocks[index]),
                    settings   	= data.settings[index];

                if (!settings.collapsed) // toggle closed
                	return plugin.hide(el, index);

                $header.addClass(plugin.config.expandedClass);
                $block.addClass(plugin.config.expandedClass);
                settings.collapsed = false;
                // $block.css('display', 'block');
                // $block.stop();
                // $block.animate({
                //     'height': 		'auto',
                //     'padding': 		settings.padding,
                //     'margin': 		settings.margin
                // }, plugin.config.showSpeed);

                // $block.css({'display':'block'});
            }
    	};

    	/**
    	 * Hide the specified element
    	 * @param  {[type]} el    [description]
    	 * @param  {[type]} index [description]
    	 * @return {[type]}       [description]
    	 */
    	plugin.hide = function(el, index) {
    		var data = stacks[$(el).attr('id')];
    		if (index >= 0 && index <= data.blocks.length - 1) {

                var $header 	= $(data.headers[index]),
                    $block 		= $(data.blocks[index]),
                    settings	= data.settings[index];

                $header.removeClass(plugin.config.expandedClass);
                $block.removeClass(plugin.config.expandedClass);
                settings.collapsed = true;
                
                // $block.stop();
                // $block.css({'visibility': 'hidden'});

                // $block.animate({
                //     'height': 0,
                //     'padding': 0
                // }, plugin.config.hideSpeed, function() {
                //     $(this).css({
                //         'display':     'none',
                //         'visibility':  'hidden'
                //     });
                // });

				// $block.css({'display':'none'})
            }
    	};

    	/**
    	 * Parses a 'sportstack' element
    	 * @param  {[type]} el [description]
    	 * @return {[type]}    [description]
    	 */
    	var parseElement  = function(el) {
			var elementId = ensureUid(el),
    			content   = parseContent(el);

    		stacks[elementId] = {
				headers:  parseHeaders(el),
				blocks:   content.blocks,
				settings: content.settings
			}
    	}

    	/**
    	 * Walks all headers
    	 * @param  {[type]} el [description]
    	 * @return {[type]}    [description]
    	 */
    	var parseHeaders = function(el) {
    		var headers = $('dt', el);
    		headers.each(function(index) {
	        	$(this).bind('click', function() {
	                plugin.toggle(el, index);
	            });
	        });

	        return headers;
    	};

    	/**
    	 * Walks all content blocks
    	 * @param  {[type]} el [description]
    	 * @return {[type]}    [description]
    	 */
    	var parseContent = function(el) {
    		var blocks = $('dd', el),
				settings = [];

	        blocks.each(function(index) {
	            var $block = $(this);
	            settings.push({
	                'height':      $block.height(),
	                'outerHeight': $block.outerHeight(),
	                'padding':     zerofy($block.css('padding')),
	                'margin':      zerofy($block.css('margin')), 
	                'collapsed':   false            
	            });
	        });

	        return {blocks:blocks, settings:settings};
    	};

    	/**
    	 * Adds a unique id attribute to the element if it doesn't have an id already
    	 * @type {Number}
    	 */
    	var uid_counter = 0;
    	var ensureUid = function(el) {
    		var id = el.attr('id');
        	if (id === undefined) {
				id = ('sportstack'+uid_counter ++);
				el.attr('id', id);
			};
			return id;
		}

		/**
		 * Helper to zerofy a value
		 * @param  {[type]} value [description]
		 * @return {[type]}       [description]
		 */
    	var zerofy = function(value) {
	        value = parseInt(value, 10);
	        return isNaN(value) ? 0 : value;
	    };

	    init();
    };


    $.fn.sportstack = function(options) {
	    return this.each(function() {
	      	new SportStack($(this), options);
	    });
	};


}(jQuery));