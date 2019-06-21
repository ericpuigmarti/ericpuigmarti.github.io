jQuery(document).ready(function($){

	// Global cached variables
	var $win = $(window),
		$winWidth = $(window).width(),
		$winHeight = $(window).height(),
		$body = $('body'),
		$wrapper = $('#main'),
    	$header = $('#header');

	// pages controller
	var pageLoader = (function() {
		var prevPageName;

		function initializePage() {
			var pageName = $body.data('page');
			if (Pages[pageName]) {
				Pages.regular.init();
				prevPageName = pageName;
				Pages[pageName].init();
			}
		}

		function unloadPage() {
			Pages.regular.destroy();
			if (prevPageName && Pages[prevPageName] && Pages[prevPageName].destroy) {
				Pages[prevPageName].destroy();
			}
		}

		jQuery(initializePage);

		return {
			initializePage: initializePage,
			unloadPage: unloadPage
		};
	}());

	var $ = jQuery.noConflict();

/*
  Collect main functions w/nmspcs
----------------------------------- */
  window.mainScripts = function () {
    "use strict";
      window.Core = {

          ui : {
          	// removes the preloader once the CSS generated animation ends
			removePreloader: function(){
				var preloadeOverlay = $("#preloader");
				preloadeOverlay.one('webkitAnimationEnd oAnimationEnd animationend animationend', function(e) {
					$(this).remove();
				});
			},
			setMenuLinks: function(){
				// these are the links that receive the page transition on click
				var nav = $(".navbar-nav > li > a, .logo a, .prjct-item a, .post-article a, .links-section .pag a"),
				    container = $('#page-title');

				nav.click(function(event) {

				   event.preventDefault();

				   container.fadeOut(10).remove();

				   var elm = $(this);				   
				   var url = elm.prop("href");

				   setTimeout(function() {
				   	if (event.which === 2 || event.metaKey || event.shiftKey || navigator.platform.toUpperCase().indexOf('WIN') !== -1 && event.ctrlKey) {
			              window.open(url, '_blank');
			            } else {
			              $body.addClass("fadeOut");
			              window.location = url;
			        }
				   }, 333);
				});
			},
			// set lazy loading
			setlzl : function(){
				$('.lazy').unveil({
			        offset: 777,
			        throttle: 350,
			        breakpoints: [
			            {
			                minWidth: 768,
			                attribute: 'data-src-md'
			            },
			            {
			                minWidth: 1200,
			                attribute: 'data-src-lg'
			            }
			        ],
			        debug: false
			    }).on('loading.unveil', function () {
			        console.log('Unveiling', this);
			    }).on('loaded.unveil', function () {
			        console.log('Unveiled', this);
			    });
			},
			// set main link behavior
          	setAnchors: function() {
				$(function() {
				  $('a[href*="#"]:not([href="#"])').click(function() {
				    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
				      var target = $(this.hash);
				      target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
				      if (target.length) {
				        $('html, body').animate({
				          scrollTop: target.offset().top
				        }, {
						  duration: 777,
						  easing: "easeInOutExpo"
						});
				        return false;
				      }
				    }
				  });
				});
			},
			setFixedScrollBlock: function() {
				if( !$body.find(".big-heading").length ){
					//fixes title on blog entries when selected
					$('.post-entry').fixedScrollBlock({
						slideBlock: '.header',
						extraTop: 150
					});
				}
				//fixes comments area when scroll
				$('.comments-section').fixedScrollBlock({
					slideBlock: '.comments-col',
					extraTop: 99
				});
			},
			// controls the width in elements
			// that change to fixed
			setFixedWidthElmnts: function(elm) {
				var selectors = elm;
				$(selectors).each(function(index, item){
					var $cache = $(this);
					var $width = $cache.parent().width();
					$cache.css({
						'width': $width
					});
				});
			},
			// controls parallax elements
			setParallax : function(){
				var scrollControl = false;
				var $parElm = $('.bg-parallax');
				
				$(window).scroll(function() {
				    scrollControl = true;
				});

				setInterval(function() {
				    if ( scrollControl ) {
				        scrollControl = false;
				        window.scrollPos = $(window).scrollTop();        
			        	$parElm.each(function(index, key) {
							var elmPos = $(this).offset().top;
					        var elmH = $(this).height();
					        var parVal = (scrollPos - (elmPos + elmH - $winHeight)) * .5;
							$(this).css({ transform: "translate3d(0px," + parVal + "px, 0px)" });
						});
				    }
				}, 11);
            },
            // parallax in headings
            setHeadingParallax : function(){
				var scrollControl = false;
				var $parElm = $('.parallax'),
					$parElmH = $parElm.outerHeight();
				
				$(window).scroll(function() {
				    scrollControl = true;
				});

				setInterval(function() {
				    if ( scrollControl ) {
				        scrollControl = false;
				        //change the factor number to control parallax speed
				        window.scrolled = $(window).scrollTop()*0.9;
			        	
			        	$parElm.each(function(index, key) {
							 //the factor controls parallax speed
							$(this).css({ transform: "translate3d(0px," + (scrolled*0.21) + "px, 0px)" });
							//starts the fade with scrollFac, just modify this value
							//to controls the moment to start with the fadeout
							var scrollFac = window.scrollY-275;
							var scrollPercent = (($parElmH - scrollFac) / $parElmH);
						    $(this).css('opacity', scrollPercent);
						});
				    }
				}, 5);
            },
            // function that adds numeration
            // to the last entries blog widget
			setWdgtLastNumber: function(){
		        var elm = $(".widget_recent_entries ul li");
	        	$(elm).each(function(index) {
					var item = $(this);
					$( "<span class='wdgt-counter'>"+(index+1)+"</span>" ).prependTo(item);
				});
			},
			// function that calculates
			// sidebar size and position
			setBlogSidebar: function(){
				var sideBG = $("#sidebar-bg"),
		        	post = $("#the-post"),
		        	postH = $(".post-body").outerHeight(),
		        	wdgtH = $(".blog-sidebar").outerHeight(),
		        	pageH = $("#main").outerHeight(),
		        	pageW = $("#the-post").outerWidth(),
		        	sideW = $(".blog-sidebar").outerWidth(),
		        	pageMargin = (($winWidth - pageW)/2)+sideW,
		            outerElms = $(".link-area").outerHeight() + $(".comments-section").outerHeight() + $("#footer").outerHeight(),
		            sideH = pageH - outerElms;
		            sideBG.hide();
		            sideBG.fadeIn(999);
	            sideBG.css({
				   'height' : sideH * 1.05,
				   'width' : pageMargin + (sideW) * 0.15
				});

	            if( postH > wdgtH ){
	            	$(post).fixedScrollBlock({
						slideBlock: '.blog-sidebar',
						extraTop: 100
					});
	            }
			},
			// set the filters trigger (default eye icon)
			setFiltersTrgr: function(){
				//eye filters trigger
				var header = $('.filters-icon'),
					prjctGrid = $('.projects');

		        var scrolled = $(window).scrollTop(),
		        	gridPos = $(prjctGrid).offset();

		        // we need to check if the grid is short
		        // specially when a filtered category is enabled
		        // and this category has some few items
		        if( $winHeight < prjctGrid.height() ){
		        	if (scrolled >= (gridPos.top - 350)  && !$body.hasClass('near-bottom')) {
				        $(header).addClass('animated').removeClass('fix');
				    } else {
				        $(header).removeClass('animated').addClass('fix');
				    }
		        }else{
		        	if (scrolled >= (gridPos.top - 555) ) {
				        $(header).addClass('animated').removeClass('fix');
				    } else {
				        $(header).removeClass('animated').addClass('fix');
				    }
		        }
			},
			// enables responsive menu
			setCompactMenu: function(){
				if( $win.width() <= 768 ){
					if( !$('.cpct-cls-btn').length > 0 ){ $body.append("<a href='#' class='cpct-cls-btn'></a>"); }
					var menu = $(".navbar-nav"),
						clsBtn = $(".cpct-cls-btn"),
					    trigger = $(".navbar-toggle, #overlay, .cpct-cls-btn"),
					    navBurger = $(".navbar-toggle");
					
					// class toggle open/close
					var state = false;
					$(trigger).on('click', function(e){
						if(!state){
							$(navBurger).hide();
							$body.addClass("compact-menu-opened");
							$(navBurger).removeClass('collapsed');
							if( $(navBurger).attr('aria-expanded') == 'false') {
								$(navBurger).attr('aria-expanded') == 'true';
							}
							document.ontouchmove = function(e){ e.preventDefault(); }
							var mEl = $('#compact-menu').find('ul');
							$(mEl).on('touchmove', function (e) {
							     e.stopPropagation();
							});
						} else {
							$(navBurger).fadeIn('slow');
							$body.removeClass("compact-menu-opened");
							$(navBurger).addClass('collapsed');
							if( $(navBurger).attr('aria-expanded') == 'true') {
								$(navBurger).attr('aria-expanded') == 'false';
							}
							document.ontouchmove = function(e){ return true; }
							var mEl = $('#compact-menu').find('ul');
							$(mEl).on('touchmove', function (e) {
							     e.stopPropagation();
							});
						}
						state = !state;
						e.preventDefault();
					});

					// create the 'new menu'
					if(!$body.hasClass("compact-menu-enabled")){
						$body.addClass("compact-menu-enabled");
						$body.append("<div id='compact-menu'></div>");
						$(menu).appendTo('#compact-menu');
						$(clsBtn).appendTo('#compact-menu');
						// add the menu numbers
						var elm = $("body > #compact-menu > ul > li"),
							mobNav = $("body > #compact-menu");
						$(elm).each(function(index) {
							var item = $(this);
							$( "<span class='menu-counter'>"+'0'+(index+1)+"</span>" ).prependTo(item);
						});
					}
				}else{
					var compactMenu = $("body > #compact-menu"),
					    theMenu = compactMenu.find(".nav"),
					    toggler = $(".navbar-toggle");
					// in case the menu is opened and active we reset when resize
					// when the stage is 770 and bigger
					$body.removeClass("compact-menu-enabled compact-menu-opened");
					// reset the menu button
					toggler.addClass("collapsed");
					if( toggler.attr('aria-expanded') == 'true') {
						toggler.trigger('click');
					}

					var menuWrapper = $(".navbar-collapse");
					// remove the collapsed menu and restore
					// the original one
					if( !$(menuWrapper).find(compactMenu).length > 0 ){
						$(theMenu).appendTo(menuWrapper);
						compactMenu.remove();
						$(".menu-counter").remove();
					}
				}
			},
			// set Google Maps when it is in use
			setMap : function(){
                var map;
                function initialize() {
                var styles=[
				    {
				        "featureType": "all",
				        "elementType": "labels.text.fill",
				        "stylers": [
				            {
				                "saturation": 36
				            },
				            {
				                "color": "#333333"
				            },
				            {
				                "lightness": 40
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.text.stroke",
				        "stylers": [
				            {
				                "visibility": "on"
				            },
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "all",
				        "elementType": "labels.icon",
				        "stylers": [
				            {
				                "visibility": "off"
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#fefefe"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "administrative",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#fefefe"
				            },
				            {
				                "lightness": 17
				            },
				            {
				                "weight": 1.2
				            }
				        ]
				    },
				    {
				        "featureType": "administrative.locality",
				        "elementType": "labels.text",
				        "stylers": [
				            {
				                "color": "#8d8d8d"
				            },
				            {
				                "weight": "0.35"
				            }
				        ]
				    },
				    {
				        "featureType": "landscape",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f5f5f5"
				            },
				            {
				                "lightness": 20
				            }
				        ]
				    },
				    {
				        "featureType": "poi",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f5f5f5"
				            },
				            {
				                "lightness": 21
				            }
				        ]
				    },
				    {
				        "featureType": "poi.park",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#dedede"
				            },
				            {
				                "lightness": 21
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.fill",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    },
				    {
				        "featureType": "road.highway",
				        "elementType": "geometry.stroke",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 29
				            },
				            {
				                "weight": 0.2
				            }
				        ]
				    },
				    {
				        "featureType": "road.arterial",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 18
				            }
				        ]
				    },
				    {
				        "featureType": "road.local",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#ffffff"
				            },
				            {
				                "lightness": 16
				            }
				        ]
				    },
				    {
				        "featureType": "transit",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#f2f2f2"
				            },
				            {
				                "lightness": 19
				            }
				        ]
				    },
				    {
				        "featureType": "water",
				        "elementType": "geometry",
				        "stylers": [
				            {
				                "color": "#e9e9e9"
				            },
				            {
				                "lightness": 17
				            }
				        ]
				    }
				];
                    //add here your location via latitude and longitud
                    var styledMap = new google.maps.StyledMapType(styles, {name: "Styled Map"});
                    var latlng = new google.maps.LatLng(37.075474,15.286586);
                    var mapOptions = {
                        zoom: 13,
                        center: latlng,
                        mapTypeId: google.maps.MapTypeId.ROADMAP,
                        navigationControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                        scaleControl: false,
                        scrollwheel: false,
                        disableDefaultUI: true,
                        draggable: !("ontouchend" in document)
                    };
                    //add here your location via latitude and longitud for your map poi/image   
                    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
                    map.mapTypes.set('map_style', styledMap);
                    map.setMapTypeId('map_style');
                    var myLatlng = new google.maps.LatLng(37.075474,15.286586);
                    var image = new google.maps.MarkerImage(
                      'images/map-logo.png',
                        new google.maps.Size(58,65),
                        new google.maps.Point(0,0),
                        new google.maps.Point(24,62)
                    );
                    
                    var marker = new google.maps.Marker({
                        position: myLatlng,
                        map: map,
                        clickable: false,
                        title: 'Buro',
                        icon: image
                    });
                }
                //initialize the map on load
                google.maps.event.addDomListener(window, 'load', initialize);

                $(function(){
                  $(".zoom-in").click(function(){
                    var zoom = map.getZoom();
                    map.setZoom(zoom+1);
                    return false;
                  });
                  $(".zoom-out").click(function(){
                    var zoom = map.getZoom();
                    map.setZoom(zoom-1);
                    return false;
                  });
                });
            },
            // controls the map´s height
            setMapHeight: function(){
            	var map = $("#map-canvas"),
            		mapHeight = $body.find(".map-container").data("map-height");
					map.css("height", mapHeight);
            }
          },//ui
          tweaks : {
          	// function to control hovering in touch devices
			setTouchNav: function() {
				$('.nav.navbar-nav').each(function() {
					/* global TouchNav */
					new TouchNav({
						navBlock: this
					});
				});
			},
			setCustomHover: function() {
				$('.post-article .img-holder a').touchHover();
				$('.block-holder .img-holder').touchHover();
			},
			setMobileNavHover: function() {
				if( $winWidth < 769 ) {
					if( !$body.hasClass('mobile') ){
						// mouse events for small screens
						var navItms = $("#compact-menu > ul > li");
							window.mar = parseInt(navItms.css("margin-bottom"));
						$(navItms).hoverIntent(function(e){
							var $cache = $(this),
								$height = $cache.find(".dropdown-menu").outerHeight(),
								listItem = $cache.find('li'),
								listNum = listItem.length,
								listH = listItem.height(),
								listTotH = listNum * listH;

							if( $(this).find('.dropdown-menu').length ){
								$cache.animate({
									marginBottom: listTotH+window.mar
								}, 333);
							}

						}, function(index, item){
							var $cache = $(this),
								$height = $cache.find(".dropdown-menu").outerHeight();
							$cache.animate({
								'marginBottom': window.mar
							}, 333);
						});
					}else{
						// touch events for mobile devices
						var navLinks = $("#compact-menu > ul > li > a");
						$(navLinks).on("touchstart", function (e) {
						    var link = $(this), //preselect the link
						    	linkPar = $(this).parent(); //preselect the list (parent)
						    // if the items is already opened or has not submenus
						    // then these items will proceed with the regular click behavior
						    if (link.hasClass('hover') || !linkPar.find('.dropdown-menu').length) {
								return true;
						    } else {
						        link.addClass("hover");
						        $(navLinks).not(this).removeClass("hover");
						        if(link.hasClass('hover')){
						        	var $cache = $(navLinks).not(this).parent();
									$cache.animate({
										'marginBottom': window.mar
									}, 500);
						        }
						        e.preventDefault();

						        var $cache = $(this).parent(),
									$height = $cache.find(".dropdown-menu").outerHeight(),
									listItem = $(this).parent().find('ul').find('li'),
									listNum = listItem.length,
									listH = listItem.height(),
									listTotH = listNum * listH;
								window.mar = parseInt($cache.css("margin-bottom"));

								$cache.animate({
									marginBottom: listTotH+$height+15
								}, 500);
						        return false; //extra, and to make sure the function has consistent return points
						    }
						});
						// this part controls the click out the nav area
						var navWrap = $("#compact-menu, #overlay");
						$(navWrap).on('touchstart', function(e) {
							var target = $(e.target);
							if (target.is(navWrap)) {
								$(navLinks).removeClass("hover");
								$(navLinks).parent().animate({
									'marginBottom': window.mar
								}, 500);
							}
						});
					}
				}
			},
			// function that creates the big titles
			// when hovering the main menu navigation
			setDropOverlay: function() {
				if( !$body.hasClass("no-menu-hover") ){
					var wrapper = $('#wrapper'),
					container = $('#page-title'),
					hoveredClass = 'link-hovered',
					pageTitle = container.find('.title'),
					pageSubTitle = container.find('.subtitle');

					$('#navbar > ul > li').each(function() {
						var item = $(this),
							link = item.find('a').data('title'),
							linkSubTitle = item.find('a').data('subtitle');

						item.on('itemhover', function() {
							if (item.hasClass('hover')){
								wrapper.addClass(hoveredClass);
								pageTitle.text(link);
								pageSubTitle.text(linkSubTitle);
							}
						}).on('itemleave', function() {
							if (!item.hasClass('hover')){
								wrapper.removeClass(hoveredClass);
								pageTitle.text('');
								pageSubTitle.text('');
							}
						});
					});
				}
			},
			// controls when 'to top' button is enabled
			setShowScrollLink: function() {
				$body.addClass("top-page");
				//var to set the scroll ratio when the arrow appears
				window.winRatio = winHeight / 4;
				var win = $(window),
					winHeight = win.outerHeight();

				$('.js-link').each(function() {
					var link = $(this);
					link.addClass("disabled");

					function scrollWindow() {
						$docHeight = $(document).height();
						var winTop = win.scrollTop(),
							footH = $("#footer").outerHeight(),
							difTem = (winTop + $winHeight) - $docHeight,
							winBottom = $docHeight - footH;

						if( winTop === 0 ){
							$body.addClass("top-page");
						}else{
							$body.removeClass("top-page");
						}

						if (winTop > winRatio) {

							link.removeClass("disabled").addClass("enabled");
							//checking the bottom to place correctly the arrow
							//when arriving near to the footer

							if( (winTop + $winHeight) > (winBottom - 50) ){
								$body.addClass("near-bottom");
							}else{
								$body.removeClass("near-bottom");
							}

						} else {
							link.removeClass("enabled").addClass("disabled");
						}
					}

					function resizeWindow() {
						winHeight = win.outerHeight();
						winRatio = winHeight / 4;
					}
					resizeWindow();

					win.on('scroll', scrollWindow);
					win.on('resize orientationchange', resizeWindow);
				});
			},
			setScrollLinks: function(){
				var scrollItm = $(".btn-top"),
		        	gridW = $("#main").find('.container').outerWidth(),
		        	pageMargin = (($winWidth - gridW)/2);

		        if( $winWidth <= 480 ){
		        	scrollItm.css('right', pageMargin + 5);
		        }else{
		        	scrollItm.css('right', pageMargin - 7);
		        }
			},
			// form validation
			setValidation: function() {
				var errorClass = 'error';
				var successClass = 'success';
				var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
				var regPhone = /^[0-9]+$/;

				$('form.validate-form').each(function() {
					var form = $(this).attr('novalidate', 'novalidate');
					var successFlag = true;
					var inputs = form.find('input, textarea, select');

					// form validation function
					function validateForm(e) {
						successFlag = true;

						inputs.each(checkField);

						if (!successFlag) {
							e.preventDefault();
						}else {
							Core.tweaks.submitForm();
							e.preventDefault();
						}
					}

					// check field
					function checkField(i, obj) {
						var currentObject = $(obj);
						var currentParent = currentObject.closest('.input-row');

						// not empty fields
						if (currentObject.hasClass('required-field')) {
							setState(currentParent, currentObject, !currentObject.val().length || currentObject.val() === currentObject.prop('defaultValue'));
						}
						// correct email fields
						if (currentObject.hasClass('required-email')) {
							setState(currentParent, currentObject, !regEmail.test(currentObject.val()));
						}
						// correct number fields
						if (currentObject.hasClass('required-number')) {
							setState(currentParent, currentObject, !regPhone.test(currentObject.val()));
						}
						// something selected
						if (currentObject.hasClass('required-select')) {
							setState(currentParent, currentObject, currentObject.get(0).selectedIndex === 0);
						}
					}

					// set state
					function setState(hold, field, error) {
						hold.removeClass(errorClass).removeClass(successClass);
						if (error) {
							hold.addClass(errorClass);
							field.one('focus', function() {hold.removeClass(errorClass).removeClass(successClass);});
							successFlag = false;
						} else {
							hold.addClass(successClass);
						}
					}

					// form event handlers
					form.off('submit'); //prevents submiting twice -> TODO:improve this
					form.on('submit', validateForm);
				});
			},
			setValidateNews: function() {
				var errorClass = 'error';
				var successClass = 'success';
				var regEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

				$('form.validate-news').each(function() {
					var news = $(this).attr('novalidate', 'novalidate');
					var successFlag = true;
					var input = news.find('input');

					// form validation function
					function validateForm(e) {
						successFlag = true;

						input.each(checkField);

						if (!successFlag) {
							e.preventDefault();
						}else {
							Core.tweaks.submitNews();
							e.preventDefault();
						}
					}

					// check field
					function checkField(i, obj) {
						var currentObject = $(obj);
						var currentParent = currentObject.closest('.input-row');

						// correct email fields
						if (currentObject.hasClass('required-email')) {
							setState(currentParent, currentObject, !regEmail.test(currentObject.val()));
						}
					}

					// set state
					function setState(hold, field, error) {
						hold.removeClass(errorClass).removeClass(successClass);
						if (error) {
							hold.addClass(errorClass);
							field.one('focus', function() {hold.removeClass(errorClass).removeClass(successClass);});
							successFlag = false;
						} else {
							hold.addClass(successClass);
						}
					}

					// form event handlers
					news.off('submit'); //prevents submiting twice -> TODO:improvement
					news.on('submit', validateForm);
				});
			},
			submitForm: function(){
				// Initiate Variables With Form Content
			    var name = $("#name").val();
			    var email = $("#mail").val();
			    var phone = $("#phone").val();
			    var topic = $("#topic").val();
			    var message = $("#message").val();
			 
			    $.ajax({
			        type: "POST",
			        url: "php/form-process.php",
			        data: "name=" + name + "&email=" + email + "&topic=" + topic + "&message=" + message,
			        success : function(text){
			            if (text == "success"){
			                formSuccess();
			            }
			        }
			    });
			    function formSuccess(){
				    $( "#msg-submit-form" ).removeClass( "hidde" );
				}
			},
			submitNews: function(){
				// Initiate Variables With Form Content
			    var email = $("#news-mail").val();
			 
			    $.ajax({
			        type: "POST",
			        url: "php/newsletter-process.php",
			        data: "email=" + email,
			        success : function(text){
			            if (text == "success"){
			                formSuccess();
			            }
			        }
			    });
			    function formSuccess(){
				    $( "#msg-submit-news" ).removeClass( "hidde" );
				    $(".validate-news").unbind('submit');
            	
				}
				 
			},
			// removes the big titles when
			// main menu options are hovered
			setDropOverlayDestroy: function() {
				var wrapper = $('#wrapper');
				var container = $('#page-title');
				var hoveredClass = 'link-hovered';
				$('#navbar > ul > li').each(function() {
					var item = $(this);
					wrapper.removeClass(hoveredClass);
					item.off('itemhover');
					item.off('itemleave');
				});
			}

          },//tweeks
          third : {
			setTwitter: function() {
				var twtCount = $(".twitter-feed").data('twt-counter');
				if (twtCount > 1){
					$('.twitter-feed').twittie({
			            dateFormat: '%b. %d, %Y',
			            template: '<div class="carousel-caption"><div class="twt-meta"><div class="date">{{date}}&nbsp;&mdash;</div><div class="twt-id">&nbsp;{{screen_name}}</div></div>{{tweet}}</div>',
			            count: 25,
			            hideReplies: true
			        }, function() {
					    $(".twitter-feed").find(".item").first().addClass("active");
					    //modify the markup to fit the carousel requirements
					    $(".twitter-feed > ul > .item").appendTo(".twitter-feed");
					    $(".twitter-feed > ul").remove();
					});
				}else{
					$('.twitter-feed').twittie({
			            dateFormat: '%b. %d, %Y',
			            template: '<div class="twt-meta"><div class="date">{{date}}&nbsp;&mdash;</div><div class="twt-id">&nbsp;{{screen_name}}</div></div>{{tweet}}',
			            count: twtCount,
			            hideReplies: true
			        }, function() {
					    $(".twitter-feed").find(".item").first().addClass("active");
					    //modify the markup to fit the carousel requirements
					    $(".twitter-feed > ul > .item").appendTo(".twitter-feed");
					    $(".twitter-feed > ul").remove();
					});
				}
			},
			setInfiniteScroll: function() {
				var container = $('.portfolio-list');
				// infinite scroll
				// TODO: vars to avoid 404 infinite scroll bug
				//var curPage = 1;

		        container.infinitescroll({
		                debug: false,
		                nextSelector : ".next-post a",
		                navSelector: ".grid-pag",
		                itemSelector: ".prjct-item",
		                animate: false,
		                bufferPx: 777
		            },

		            // call Isotope as a callback
		            function(newElements) {

		            	// this is part of the workaround
		            	// for fixing the infscr 404 bug

						// setTimeout(function() {
						// 	curPage++;
						// 	var pagesNum = 3; // Number of pages

						// 	console.log("Current Page - ", curPage);
						// 	console.log("Total pages - ", pagesNum);

						// 	if(curPage == pagesNum) {

						// 		$(window).unbind('.infscr');
						// 		console.log("No more pages");

						// 	}
						// }, 999);

						// hide elements when new load
		                var $newElems = $(newElements).hide();
		                Core.ui.setFiltersTrgr();
		                // ensure that images load before adding to masonry layout
		                $newElems.imagesLoaded( function() {
		                	// show images when loaded
		                    container.isotope( 'appended', $($newElems)); 
		                    setColumns();
		                    $newElems.fadeIn();
		                    container.isotope( 'layout' );
		                });
		        });
			},
			setIsotopeFilter: function() {
				var activeClass = 'active';
				var items = $('.filter-nav li');
				var container = $('.js-ajax-container');

				setTimeout(function() {
					container.isotope('layout');
				}, 100);

				items.each(function() {
					var item = $(this);
					var link = item.find('a');
					var filter = link.attr('data-filter');
					function refreshItems() {
						var filteredItems = filter === 'all' ? '*' : '[data-filter*="' + filter + '"]';
						items.removeClass(activeClass);
						item.addClass(activeClass);
						container.isotope({
							filter: filteredItems
						});
					}
					link.on('click', function(e) {
						e.preventDefault();
						if (!item.hasClass(activeClass)){
							refreshItems();
						}
					});

					if (item.hasClass(activeClass)){
						refreshItems();
					}
				});
			},
			setFilterActions: function() {
				var stateCM = false,
					trigger = $(".fltrs-trggr, #fltrs-overlay");
				trigger.click(function(e){
					if(!stateCM){
						$body.addClass("filters-open");
						$('.filter-nav, #fltrs-overlay').addClass('hi');
						$('.fltrs-trggr').hide();
					} else {
						$body.removeClass("filters-open");
						$('.filter-nav, #fltrs-overlay').removeClass('hi').addClass('bye');
						$('.fltrs-trggr').show();
						setTimeout(function() {
							$('#fltrs-overlay').addClass('interstitial');
						}, 303);
						setTimeout(function() {
							$('.filter-nav, #fltrs-overlay').removeClass('bye');
							$('#fltrs-overlay').removeClass('interstitial');
						}, 335);
					}
					stateCM = !stateCM;
					e.preventDefault();
				});
			},
			setIsotopeLayout : function(){
			  if( $wrapper.hasClass('portfolio-page') ) {

			  	// Isotope layout
	              var $container = $('.portfolio-list'),
	                  $prjct = $('.prjct-item');

	              var colClass = $('.projects').attr('class'),
	                  colSplit = colClass.split("cols-"),
	                  columnsNumber = colSplit[1];

	              var columns = 5,
	                  iniCols = columnsNumber;

	              window.setColumns = function() {
	                  
	                  if($winWidth > 800){
	                      columns = iniCols;
	                  }
	                  else if($winWidth > 420){
	                      columns = 2;
	                  }
	                  else{
	                      columns = 1;
	                  }

	                  var theWidth = 100/columns - 0.21;

	                  $('.prjct-item').css('width', getWidth);
	                  function getWidth(){
	                      return theWidth +'%';
	                  }
	              };
	              setColumns();

	              $prjct.find("img").addClass("img-responsive");

					$container.imagesLoaded( function() {
						$container.isotope({
							itemSelector: '.prjct-item',
							percentPosition: true,
							masonry: {
							columnWidth: $container.width() / columns
							}
						});
						$container.addClass("fadeit");
					});
			  }

            },
            destroyIsotopeLayout: function() {
				var container = $('.portfolio-list');
				    container.isotope('destroy');
			},
			setStickyPanel: function() {
				var stickyHeader = $('#wrapper');
				var slider = $('.slider');
				ResponsiveHelper.addRange({
					'168..': {
						on: function() {
							if (slider.length) {
								stickyHeader.stickyPanel({
									slickyClass: 'fixedheader',
									extraOffset: 9999999,
									fakeBlock: false,
									scrollClasses: true
								});
							} else {
								stickyHeader.stickyPanel({
									slickyClass: 'fixedheader',
									extraOffset: 35,
									fakeBlock: false,
									scrollClasses: true
								});
							}
						},
						off: function() {
							if (stickyHeader.data('StickyPanel')){
								stickyHeader.data('StickyPanel').destroy();
							}
						}
					}
				});
			},
			setPlaceholder: function() {
				$('input, textarea').placeholder();
			}

          }//third
      };

      // Check for mobile devices
      if( navigator.userAgent.match(/Android/i) ||
       navigator.userAgent.match(/webOS/i) ||
       navigator.userAgent.match(/iPhone/i) ||
       navigator.userAgent.match(/iPad/i) ||
       navigator.userAgent.match(/iPod/i)
       ){
        window.mobileDevice = true;
    	$body.addClass("mobile");
      } else {
        window.mobileDevice = false;
      }
      // Check if iOS device
      if( navigator.userAgent.match(/iPhone/i) ||
       navigator.userAgent.match(/iPad/i) ||
       navigator.userAgent.match(/iPod/i) ) { $("body").addClass("iosdevice"); }

      // this method is used to prevent the hover default action on main menu
      var isTouch =  !!("ontouchstart" in window) || window.navigator.msMaxTouchPoints > 0;
      if( !isTouch ){ }

      // hide for the iPhone´s search bar to minimize fixed back with scroll issue
      /mobi/i.test(navigator.userAgent) && !location.hash && setTimeout(function () {
        if (!pageYOffset) window.scrollTo(0, 1);
      }, 999);

      // fix for bfcache Safari Browser
	  var is_safari = navigator.userAgent.indexOf("Safari") > -1;
	  if ((is_safari) && (navigator.userAgent.indexOf('Mac')>1) || (/iphone|ipod|ipad.*os 5/gi).test(navigator.appVersion)) {
	    window.onpageshow = function(evt) {
	      if (evt.persisted) {
	        location.reload();
	      }
	    };
	  }

  };

  mainScripts();

  if (Function('/*@cc_on return document.documentMode===10@*/')()){
    document.documentElement.className+=' ie';
  }

var Pages = {
	regular: {
		init: function() {
			Core.ui.removePreloader();
			Core.ui.setlzl();
			Core.ui.setMenuLinks();
			Core.ui.setAnchors();
			Core.ui.setCompactMenu();
			Core.ui.setHeadingParallax();
			Core.ui.setParallax();
			if( $body.find(".map-container").length > 0 ) {
				Core.ui.setMap();
				Core.ui.setMapHeight();
			}
			Core.tweaks.setTouchNav();
			Core.tweaks.setMobileNavHover();
			Core.tweaks.setScrollLinks();
			Core.tweaks.setDropOverlay();
			Core.tweaks.setValidation();
			Core.tweaks.setValidateNews();
			Core.third.setStickyPanel();
			if( $body.find(".twitter-feed").length > 0 ) {
				Core.third.setTwitter();
			}
		},
		destroy: function() {
			Core.tweaks.setDropOverlayDestroy();
		}
	},
	portfolio: {
		init: function() {
			Core.third.setInfiniteScroll();
			Core.third.setIsotopeFilter();
			Core.third.setFilterActions();
		},
		destroy: function() {
			Core.third.destroyIsotopeLayout();
		}
	},
	singleProjectPage: {
		init: function() {
		}
	},
	blogPage: {
		init: function() {
			Core.tweaks.setCustomHover();
		}
	},
	singleBlogPage: {
		init: function() {
			Core.ui.setFixedWidthElmnts(".header, .comments-col, .blog-sidebar ul");
			Core.ui.setWdgtLastNumber();
			Core.third.setPlaceholder();
		}
	},
	contactPage: {
		init: function() {
		}
	}
};

// on page LOAD
$win.on("load", function() {
	$docHeight= $(document).height();
	Core.third.setIsotopeLayout();
	Core.tweaks.setShowScrollLink();
	Core.ui.setFixedScrollBlock();
	if( $wrapper.hasClass("portfolio-page") ) {
    	Core.ui.setFiltersTrgr();
    }
	if( $body.hasClass("single-post") ){
		Core.ui.setBlogSidebar();
	};
});

// on page RESIZE controls for some dependant functions
var resizeControl = false;

$win.on("resize orientationchange", function() {
    resizeControl = true;
});

setInterval(function() {
    if ( resizeControl ) {
        resizeControl = false;
        $winWidth = $(window).width();
        Core.ui.setCompactMenu();
        Core.tweaks.setMobileNavHover();
        Core.tweaks.setScrollLinks();
		if( $wrapper.hasClass("portfolio-page") ) {
	    	Core.third.setIsotopeLayout();
	    	Core.ui.setFiltersTrgr();
	    }
	    if( $body.hasClass("single-post") ){
			// we need to scroll to top because when the sidebar is fixed
			// it looses its original width and breaks the sizes
			// in this way we can reset the sidebar to a relative
			// position and get the values correctly again when
			if( !$body.hasClass('mobile') ){ $(window).scrollTop(0); }
	    	Core.ui.setBlogSidebar();
	    	Core.ui.setFixedWidthElmnts(".header, .comments-col, .blog-sidebar ul");
	    };
    }
}, 35);

// on SCROLL page controls for some dependant functions
var scrollControl = false;
 
$win.on("scroll", function() {
    scrollControl = true;
});
 
setInterval(function() {
    if ( scrollControl ) {
        scrollControl = false;
        Core.ui.setFixedWidthElmnts(".header, .comments-col");
        if($body.hasClass('portfolio-page')){
        	Core.ui.setFiltersTrgr();
        }
    }
}, 35);

}); // end document.ready



/*-----------------------------------------------------------------------------------*/
/*	08. SMOOTH SCROLLING
/*-----------------------------------------------------------------------------------*/
	
// $('.goto').click(function(e){
//     $('html,body').scrollTo(this.hash,this.hash,  {'axis':'y'});
//     e.preventDefault();
// });


/*-----------------------------------------------------------------------------------*/
/*	09. BLOB ANIMATE
/*-----------------------------------------------------------------------------------*/
	
// anime({
//   targets: 'path',
//   d: [
//     {value: 'M173.308594,511.746094 C320.216337,511.746094 532,401.556181 532,254.648438 C532,107.740694 460.251493,0 313.34375,0 C166.436007,0 0,107.740694 0,254.648438 C0,401.556181 26.4008503,511.746094 173.308594,511.746094 Z'},
//     {value: 'M298.208419,412.08091 C445.116162,412.08091 449,345.556181 449,198.648438 C449,51.7406941 445.116162,11.1443284 298.208419,11.1443284 C151.300676,11.1443284 0.335366775,-45.5463138 0.335366775,101.36143 C0.335366775,248.269173 151.300676,412.08091 298.208419,412.08091 Z'},
//     {value: 'M173.308594,389.746094 C320.216337,389.746094 502.569783,279.556181 502.569783,132.648437 C502.569783,-14.2593059 412.907743,1.20970841 266,1.20970841 C119.092257,1.20970841 0,-14.2593059 0,132.648437 C0,279.556181 26.4008503,389.746094 173.308594,389.746094 Z'}
//   ],
//   easing: 'easeInOutSine',
//   duration: 15000,
//   loop: true,
//   direction: 'alternate'
// });

