

/**
 * Plugin: jQuery Columns
 * Author: Kurtis Kemple
 * Email: kurtiskemple@gmail.com
 * Description: Grabs all children of the specified element and sets the children in columns for easier styling of "row" type layouts
 */

;(function( $, window, document ) {
	'use strict';

	//TODO: add callback functions


	//create our object that we will use for all instances of columns
	var Columns = function( opts ) {

		this.init( opts );
		return this;
	};

	Columns.prototype = {
		init: function( opts ) {

			if ( !this.options ) {
				//create default settings
				this.defaults = {
					el: '',
					columns: 3,
					className: 'column',
					duration: 1000,
					isHorizontal: true
				};

				//extend the default settings with end use settings
				this.options = $.extend( {}, this.defaults, opts );
			}

			//cache the el and wrap in jquery
			this.element = $( this.options.el );

			//set overflow to hidden to clear floated children
			this.element.css({
				'overflow' : 'hidden'
			});

			//grab and hide all children elements of the area selected for columns
			this.storeChildren();
		},

		storeChildren: function() {

			//cache the children and store on our object while hiding and removing them
			this.children = this.element.children().css( 'display', 'none' ).remove();
			this.clones = this.children.clone();

			//build out the columns
			this.buildColumns();
		},

		buildColumns: function() {

			//cache this so we don't lose scope later in the function
			var self = this;

			//set up our variables for the for loop
			var i = 0;
			var len = this.options.columns;

			//check to see if our className option is an array, if not assign class to all elements, else assign classes in order
			if ( !$.isArray( self.options.className ) ) {
				for ( ; i < len; i++ ) {
					$( '<div/>', {
						'class' : self.options.className
					}).appendTo( self.element ).css({
						'float' : 'left',
						'width' : (100 / len) + '%'
					});
				}
			} else {
				for ( ; i < len; i++ ) {
					$( '<div/>', {
						'class' : self.options.className[ i ]
					}).appendTo( self.element ).css({
						'float' : 'left',
						'width' : (100 / len) + '%'
					});
				}
			}

			if( this.options.isHorizontal ) {
				this.populateColumnsHorizontal();
			} else {
				this.populateColumnsVertical();
			}

		},

		populateColumnsHorizontal: function() {

			//cache the columns in an array
			this.columns = this.element.children();

			var i = 0;
			var z = 0;
			var len = this.children.length;
			var numColumns = this.options.columns;

			//for as many children that there are, loop over the columns and drop in a child element
			//resetting "i" when we hit the column limit
			for ( ; z < len; z++ ) {
				$( this.children[ z ] ).appendTo( this.columns [ i ]).fadeIn( this.options.duration );

				i++;

				//if we hit the last column reset "i" so we start back at first column
				if( i === numColumns ) {
					i = 0;
				}
			}

			this.options.columnsCompleted.call( this );
		},

		populateColumnsVertical: function() {

			//cache the columns in an array
			this.columns = this.element.children();

			//get the values we need to make the magic happen
			var numColumns = this.columns.length;
			var len = this.children.length;
			var remainder = len % numColumns;

			//get the number of items we need for each column, without remainders
			var numPerColumn = Math.floor( len / numColumns );

			//init our var for keeping track of how many items to pull from the array at a time
			var numToRemove = 0;

			//our container for the items we pull for appending
			var childrenToAdd = [];

			// i keeps track of over all iteration
			var i = 0;

			// x keeps track of remainders left
			var x = 0;


			//for as many columns as we have drop in the number of items needed with an extra
			//if we still have a remainder
			for ( ; i < numColumns; ) {
				//check to see if we have a remainder left, if so add an extra item to the column
				if ( x < remainder ) {
					numToRemove = numPerColumn + 1;
					x++;
				} else {
					numToRemove = numPerColumn;
				}

				//pull the items to add from our array
				childrenToAdd = this.children.splice( 0, numToRemove);

				//append the items to the current column and fade them in
				$( childrenToAdd ).appendTo( this.columns[ i ] ).fadeIn( this.options.duration );

				//increase our count
				i++;
			}

			this.options.columnsCompleted.call( this );
		},

		destroy: function() {
			this.element.children().remove();
			this.clones.appendTo( this.element ).show();
		},

		update: function( opts ) {
			for ( var opt in opts ) {
				if ( opts.hasOwnProperty( opt ) ) {
					this.options[opt] = opts[opt];
				}
			}
			this.destroy();
			this.init();
		}
	};

	window.Columns = Columns;

})( jQuery, window, document, undefined );
