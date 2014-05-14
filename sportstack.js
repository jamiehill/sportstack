/**
 * Created by Jamie on 09/05/2014.
 */
 (function($) {


 	var SportStack = function(elem, options) {
 		var $element = elem, plugin = this, stacks = {};
 		var defaults = {
 			childClass: 'child',
 			expandCls: 'xpanded',
            collapseCls: 'collapsed',
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

		 /**
		  * Toggle the block open/closed
		  * @param  {[type]} el    [description]
		  * @param  {[type]} index [description]
		  * @return {[type]}       [description]
		  */
		 plugin.toggle = function(el, index) {
		 	var data = stacks[$(el).attr('id')],
		 		settings = data.settings[index],

		 		method = settings.collapsed ? 'show' : 'hide';
		 		plugin[method].apply(plugin, [el, index]);
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
    	 			$settings  	= data.settings[index];

                $block.css({ "max-height": $block.innerHeight() + 'px' });

                toggleClass($header, $block, true);
                $settings.collapsed = false;
                $block.stop();
            }
        };

        var toggleClass = function(hdr, blk, xpd) {
            var add = plugin.config.expandCls,
                rm = plugin.config.collapseCls;

            // hdr.toggleClass(plugin.config.expandCls);
            // blk.toggleClass(plugin.config.expandCls);

            hdr.addClass(xpd?add:rm); blk.addClass(xpd?add:rm);
            hdr.removeClass(xpd?rm:add); blk.removeClass(xpd?rm:add);
        }

    	/**
    	 * Hide the specified element
    	 * @param  {[type]} el    [description]
    	 * @param  {[type]} index [description]
    	 * @return {[type]}       [description]
    	 */
    	 plugin.hide = function(el, index) {
    	 	var data = stacks[$(el).attr('id')];
    	 	if (index >= 0 && index <= data.blocks.length - 1) {
    	 		var $header  = $(data.headers[index]),
    	 			$block 	 = $(data.blocks[index]),
    	 			settings = data.settings[index];

                $block.css({ "max-height": '0px' });

    	 		toggleClass($header, $block, false);
    	 		settings.collapsed = true;
    	 		$block.stop();
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
    	 		$(this).addClass(plugin.config.expandCls);
    	 		$(this).bind('click', function(e) {
                    e.preventDefault();
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
                $(this).addClass(plugin.config.expandCls);
    	 		settings.push({
    	 			'height':      $(this).height(),
    	 			'outerHeight': $(this).outerHeight(),
    	 			'padding':     zerofy($(this).css('padding')),
    	 			'margin':      zerofy($(this).css('margin')), 
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