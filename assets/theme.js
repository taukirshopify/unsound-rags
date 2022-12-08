function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

(function ($) {
  var $ = jQuery = $;
  var cc = {
    sections: []
  };
  theme.cartNoteMonitor = {
    load: function load($notes) {
      $notes.on('change.themeCartNoteMonitor paste.themeCartNoteMonitor keyup.themeCartNoteMonitor', function () {
        theme.cartNoteMonitor.postUpdate($(this).val());
      });
    },
    unload: function unload($notes) {
      $notes.off('.themeCartNoteMonitor');
    },
    updateThrottleTimeoutId: -1,
    updateThrottleInterval: 500,
    postUpdate: function postUpdate(val) {
      clearTimeout(theme.cartNoteMonitor.updateThrottleTimeoutId);
      theme.cartNoteMonitor.updateThrottleTimeoutId = setTimeout(function () {
        $.post(theme.routes.cart_url + '/update.js', {
          note: val
        }, function (data) {}, 'json');
      }, theme.cartNoteMonitor.updateThrottleInterval);
    }
  }; // Turn a <select> tag into clicky boxes
  // Use with: $('select').clickyBoxes()
  $(document).on("click",".thumbsTrigger",function() {
  $(this).parents('.gallery-layout-beside').toggleClass('is-open');
  });
  $.fn.clickyBoxes = function (prefix) {
    if (prefix == 'destroy') {
      $(this).off('.clickyboxes');
      $(this).next('.clickyboxes').off('.clickyboxes');
    } else {
      return $(this).filter('select:not(.clickybox-replaced)').addClass('clickybox-replaced').each(function () {
        //Make sure rows are unique
        var prefix = prefix || $(this).attr('id'); //Create container

        var $optCont = $('<ul class="clickyboxes"/>').attr('id', 'clickyboxes-' + prefix).data('select', $(this)).insertAfter(this);
        var $label;

        if ($(this).is('[id]')) {
          $label = $('label[for="' + $(this).attr('id') + '"]'); // Grab real label
        } else {
          $label = $(this).siblings('label'); // Rough guess
        }

        if ($label.length > 0) {
          $optCont.addClass('options-' + removeDiacritics($label.text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, ''));
        } //Add options to container


        $(this).find('option').each(function () {
          $('<li/>').appendTo($optCont).append($('<a href="#"/>').attr('data-value', $(this).val()).html($(this).html()).addClass('opt--' + removeDiacritics($(this).text()).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, '')));
        }); //Select change event

        $(this).hide().addClass('replaced').on('change.clickyboxes keyup.clickyboxes', function () {
          //Choose the right option to show
          var val = $(this).val();
          $optCont.find('a').removeClass('active').filter(function () {
            return $(this).attr('data-value') == val;
          }).addClass('active');
        }).trigger('keyup'); //Initial value
        //Button click event

        $optCont.on('click.clickyboxes', 'a', function () {
          if (!$(this).hasClass('active')) {
            var $clicky = $(this).closest('.clickyboxes');
            $clicky.data('select').val($(this).data('value')).trigger('change');
            $clicky.trigger('change');
          }

          return false;
        });
      });
    }
  };

  theme.Shopify = {
    formatMoney: function formatMoney(t, r) {
      function e(t, r) {
        return void 0 === t ? r : t;
      }

      function a(t, r, a, o) {
        if (r = e(r, 2), a = e(a, ","), o = e(o, "."), isNaN(t) || null == t) return 0;
        t = (t / 100).toFixed(r);
        var n = t.split(".");
        return n[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + a) + (n[1] ? o + n[1] : "");
      }

      "string" == typeof t && (t = t.replace(".", ""));
      var o = "",
          n = /\{\{\s*(\w+)\s*\}\}/,
          i = r || this.money_format;

      switch (i.match(n)[1]) {
        case "amount":
          o = a(t, 2);
          break;

        case "amount_no_decimals":
          o = a(t, 0);
          break;

        case "amount_with_comma_separator":
          o = a(t, 2, ".", ",");
          break;

        case "amount_with_space_separator":
          o = a(t, 2, " ", ",");
          break;

        case "amount_with_period_and_space_separator":
          o = a(t, 2, " ", ".");
          break;

        case "amount_no_decimals_with_comma_separator":
          o = a(t, 0, ".", ",");
          break;

        case "amount_no_decimals_with_space_separator":
          o = a(t, 0, " ", "");
          break;

        case "amount_with_apostrophe_separator":
          o = a(t, 2, "'", ".");
          break;

        case "amount_with_decimal_separator":
          o = a(t, 2, ".", ".");
      }

      return i.replace(n, o);
    },
    formatImage: function formatImage(originalImageUrl, format) {
      return originalImageUrl.replace(/^(.*)\.([^\.]*)$/g, '$1_' + format + '.$2');
    },
    Image: {
      imageSize: function imageSize(t) {
        var e = t.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);
        return null !== e ? e[1] : null;
      },
      getSizedImageUrl: function getSizedImageUrl(t, e) {
        if (null == e) return t;
        if ("master" == e) return this.removeProtocol(t);
        var o = t.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

        if (null != o) {
          var i = t.split(o[0]),
              r = o[0];
          return this.removeProtocol(i[0] + "_" + e + r);
        }

        return null;
      },
      removeProtocol: function removeProtocol(t) {
        return t.replace(/http(s)?:/, "");
      }
    }
  };

  theme.Disclosure = function () {
    var selectors = {
      disclosureList: '[data-disclosure-list]',
      disclosureToggle: '[data-disclosure-toggle]',
      disclosureInput: '[data-disclosure-input]',
      disclosureOptions: '[data-disclosure-option]'
    };
    var classes = {
      listVisible: 'disclosure-list--visible'
    };

    function Disclosure($disclosure) {
      this.$container = $disclosure;
      this.cache = {};

      this._cacheSelectors();

      this._connectOptions();

      this._connectToggle();

      this._onFocusOut();
    }

    Disclosure.prototype = $.extend({}, Disclosure.prototype, {
      _cacheSelectors: function _cacheSelectors() {
        this.cache = {
          $disclosureList: this.$container.find(selectors.disclosureList),
          $disclosureToggle: this.$container.find(selectors.disclosureToggle),
          $disclosureInput: this.$container.find(selectors.disclosureInput),
          $disclosureOptions: this.$container.find(selectors.disclosureOptions)
        };
      },
      _connectToggle: function _connectToggle() {
        this.cache.$disclosureToggle.on('click', function (evt) {
          var ariaExpanded = $(evt.currentTarget).attr('aria-expanded') === 'true';
          $(evt.currentTarget).attr('aria-expanded', !ariaExpanded);
          this.cache.$disclosureList.toggleClass(classes.listVisible);
        }.bind(this));
      },
      _connectOptions: function _connectOptions() {
        this.cache.$disclosureOptions.on('click', function (evt) {
          evt.preventDefault();

          this._submitForm($(evt.currentTarget).data('value'));
        }.bind(this));
      },
      _onFocusOut: function _onFocusOut() {
        this.cache.$disclosureToggle.on('focusout', function (evt) {
          var disclosureLostFocus = this.$container.has(evt.relatedTarget).length === 0;

          if (disclosureLostFocus) {
            this._hideList();
          }
        }.bind(this));
        this.cache.$disclosureList.on('focusout', function (evt) {
          var childInFocus = $(evt.currentTarget).has(evt.relatedTarget).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);

          if (isVisible && !childInFocus) {
            this._hideList();
          }
        }.bind(this));
        this.$container.on('keyup', function (evt) {
          if (evt.which !== 27) return; // escape

          this._hideList();

          this.cache.$disclosureToggle.focus();
        }.bind(this));

        this.bodyOnClick = function (evt) {
          var isOption = this.$container.has(evt.target).length > 0;
          var isVisible = this.cache.$disclosureList.hasClass(classes.listVisible);

          if (isVisible && !isOption) {
            this._hideList();
          }
        }.bind(this);

        $('body').on('click', this.bodyOnClick);
      },
      _submitForm: function _submitForm(value) {
        this.cache.$disclosureInput.val(value);
        this.$container.parents('form').submit();
      },
      _hideList: function _hideList() {
        this.cache.$disclosureList.removeClass(classes.listVisible);
        this.cache.$disclosureToggle.attr('aria-expanded', false);
      },
      unload: function unload() {
        $('body').off('click', this.bodyOnClick);
        this.cache.$disclosureOptions.off();
        this.cache.$disclosureToggle.off();
        this.cache.$disclosureList.off();
        this.$container.off();
      }
    });
    return Disclosure;
  }();

  (function () {
    function throttle(callback, threshold) {
      var debounceTimeoutId = -1;
      var tick = false;
      return function () {
        clearTimeout(debounceTimeoutId);
        debounceTimeoutId = setTimeout(callback, threshold);

        if (!tick) {
          callback.call();
          tick = true;
          setTimeout(function () {
            tick = false;
          }, threshold);
        }
      };
    }

    var scrollEvent = document.createEvent('Event');
    scrollEvent.initEvent('throttled-scroll', true, true);
    window.addEventListener("scroll", throttle(function () {
      window.dispatchEvent(scrollEvent);
    }, 200));
  })(); // requires: throttled-scroll, debouncedresize


  theme.Sections = new function () {
    var _ = this;

    _._instances = [];
    _._deferredSectionTargets = [];
    _._sections = [];
    _._deferredLoadViewportExcess = 300; // load defferred sections within this many px of viewport

    _._deferredWatcherRunning = false;

    _.init = function () {
      $(document).on('shopify:section:load', function (e) {
        // load a new section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);

        if (target) {
          _.sectionLoad(target);
        }
      }).on('shopify:section:unload', function (e) {
        // unload existing section
        var target = _._themeSectionTargetFromShopifySectionTarget(e.target);

        if (target) {
          _.sectionUnload(target);
        }
      });
      $(window).on('throttled-scroll.themeSectionDeferredLoader debouncedresize.themeSectionDeferredLoader', _._processDeferredSections);
      _._deferredWatcherRunning = true;
    }; // register a type of section


    _.register = function (type, section, options) {
      _._sections.push({
        type: type,
        section: section,
        afterSectionLoadCallback: options ? options.afterLoad : null,
        afterSectionUnloadCallback: options ? options.afterUnload : null
      }); // load now


      $('[data-section-type="' + type + '"]').each(function () {
        if (Shopify.designMode || options && options.deferredLoad === false || !_._deferredWatcherRunning) {
          _.sectionLoad(this);
        } else {
          _.sectionDeferredLoad(this, options);
        }
      });
    }; // prepare a section to load later


    _.sectionDeferredLoad = function (target, options) {
      _._deferredSectionTargets.push({
        target: target,
        deferredLoadViewportExcess: options && options.deferredLoadViewportExcess ? options.deferredLoadViewportExcess : _._deferredLoadViewportExcess
      });

      _._processDeferredSections(true);
    }; // load deferred sections if in/near viewport


    _._processDeferredSections = function (firstRunCheck) {
      if (_._deferredSectionTargets.length) {
        var viewportTop = $(window).scrollTop(),
            viewportBottom = viewportTop + $(window).height(),
            loopStart = firstRunCheck === true ? _._deferredSectionTargets.length - 1 : 0;

        for (var i = loopStart; i < _._deferredSectionTargets.length; i++) {
          var target = _._deferredSectionTargets[i].target,
              viewportExcess = _._deferredSectionTargets[i].deferredLoadViewportExcess,
              sectionTop = $(target).offset().top - viewportExcess,
              doLoad = sectionTop > viewportTop && sectionTop < viewportBottom;

          if (!doLoad) {
            var sectionBottom = sectionTop + $(target).outerHeight() + viewportExcess * 2;
            doLoad = sectionBottom > viewportTop && sectionBottom < viewportBottom;
          }

          if (doLoad || sectionTop < viewportTop && sectionBottom > viewportBottom) {
            // in viewport, load
            _.sectionLoad(target); // remove from deferred queue and resume checks


            _._deferredSectionTargets.splice(i, 1);

            i--;
          }
        }
      } // remove event if no more deferred targets left, if not on first run


      if (firstRunCheck !== true && _._deferredSectionTargets.length === 0) {
        _._deferredWatcherRunning = false;
        $(window).off('.themeSectionDeferredLoader');
      }
    }; // load in a section


    _.sectionLoad = function (target) {
      var target = target,
          sectionObj = _._sectionForTarget(target),
          section = false;

      if (sectionObj.section) {
        section = sectionObj.section;
      } else {
        section = sectionObj;
      }

      if (section !== false) {
        var instance = {
          target: target,
          section: section,
          $shopifySectionContainer: $(target).closest('.shopify-section'),
          thisContext: {
            functions: section.functions
          }
        };

        _._instances.push(instance); //Initialise any components


        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(function (component) {
            $(document).trigger('cc:component:load', [component, target]);
          });
        }

        _._callWith(section, 'onSectionLoad', target, instance.thisContext);

        _._callWith(section, 'afterSectionLoadCallback', target, instance.thisContext); // attach additional UI events if defined


        if (section.onSectionSelect) {
          instance.$shopifySectionContainer.on('shopify:section:select', function (e) {
            _._callWith(section, 'onSectionSelect', e.target, instance.thisContext);
          });
        }

        if (section.onSectionDeselect) {
          instance.$shopifySectionContainer.on('shopify:section:deselect', function (e) {
            _._callWith(section, 'onSectionDeselect', e.target, instance.thisContext);
          });
        }

        if (section.onBlockSelect) {
          $(target).on('shopify:block:select', function (e) {
            _._callWith(section, 'onBlockSelect', e.target, instance.thisContext);
          });
        }

        if (section.onBlockDeselect) {
          $(target).on('shopify:block:deselect', function (e) {
            _._callWith(section, 'onBlockDeselect', e.target, instance.thisContext);
          });
        }
      }
    }; // unload a section


    _.sectionUnload = function (target) {
      var sectionObj = _._sectionForTarget(target);

      var instanceIndex = -1;

      for (var i = 0; i < _._instances.length; i++) {
        if (_._instances[i].target == target) {
          instanceIndex = i;
        }
      }

      if (instanceIndex > -1) {
        var instance = _._instances[instanceIndex]; // remove events and call unload, if loaded

        $(target).off('shopify:block:select shopify:block:deselect');
        instance.$shopifySectionContainer.off('shopify:section:select shopify:section:deselect');

        _._callWith(instance.section, 'onSectionUnload', target, instance.thisContext);

        _._callWith(sectionObj, 'afterSectionUnloadCallback', target, instance.thisContext);

        _._instances.splice(instanceIndex); //Destroy any components


        if ($(target).data('components')) {
          //Init each component
          var components = $(target).data('components').split(',');
          components.forEach(function (component) {
            $(document).trigger('cc:component:unload', [component, target]);
          });
        }
      } else {
        // check if it was a deferred section
        for (var i = 0; i < _._deferredSectionTargets.length; i++) {
          if (_._deferredSectionTargets[i].target == target) {
            _._deferredSectionTargets[i].splice(i, 1);

            break;
          }
        }
      }
    }; // helpers


    _._callWith = function (object, method, param, thisContext) {
      if (typeof object[method] === 'function') {
        if (thisContext) {
          object[method].bind(thisContext)(param);
        } else {
          object[method](param);
        }
      }
    };

    _._themeSectionTargetFromShopifySectionTarget = function (target) {
      var $target = $('[data-section-type]:first', target);

      if ($target.length > 0) {
        return $target[0];
      } else {
        return false;
      }
    };

    _._sectionForTarget = function (target) {
      var type = $(target).attr('data-section-type');

      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return _._sections[i];
        }
      }

      return false;
    };

    _._sectionAlreadyRegistered = function (type) {
      for (var i = 0; i < _._sections.length; i++) {
        if (_._sections[i].type == type) {
          return true;
        }
      }

      return false;
    };
  }(); // Loading third party scripts

  theme.scriptsLoaded = {};

  theme.loadScriptOnce = function (src, callback, beforeRun, sync) {
    if (typeof theme.scriptsLoaded[src] === 'undefined') {
      theme.scriptsLoaded[src] = [];
      var tag = document.createElement('script');
      tag.src = src;

      if (sync || beforeRun) {
        tag.async = false;
      }

      if (beforeRun) {
        beforeRun();
      }

      if (typeof callback === 'function') {
        theme.scriptsLoaded[src].push(callback);

        if (tag.readyState) {
          // IE, incl. IE9
          tag.onreadystatechange = function () {
            if (tag.readyState == "loaded" || tag.readyState == "complete") {
              tag.onreadystatechange = null;

              for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
                theme.scriptsLoaded[this][i]();
              }

              theme.scriptsLoaded[this] = true;
            }
          }.bind(src);
        } else {
          tag.onload = function () {
            // Other browsers
            for (var i = 0; i < theme.scriptsLoaded[this].length; i++) {
              theme.scriptsLoaded[this][i]();
            }

            theme.scriptsLoaded[this] = true;
          }.bind(src);
        }
      }

      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      return true;
    } else if (_typeof(theme.scriptsLoaded[src]) === 'object' && typeof callback === 'function') {
      theme.scriptsLoaded[src].push(callback);
    } else {
      if (typeof callback === 'function') {
        callback();
      }

      return false;
    }
  };

  theme.loadStyleOnce = function (src) {
    var srcWithoutProtocol = src.replace(/^https?:/, '');

    if (!document.querySelector('link[href="' + encodeURI(srcWithoutProtocol) + '"]')) {
      var tag = document.createElement('link');
      tag.href = srcWithoutProtocol;
      tag.rel = 'stylesheet';
      tag.type = 'text/css';
      var firstTag = document.getElementsByTagName('link')[0];
      firstTag.parentNode.insertBefore(tag, firstTag);
    }
  }; /// Show a short-lived text popup above an element


  theme.showQuickPopup = function (message, $origin) {
    var $popup = $('<div class="simple-popup"/>');
    var offs = $origin.offset();
    $popup.html(message).css({
      'left': offs.left,
      'top': offs.top
    }).hide();
    $('body').append($popup);
    $popup.css({
      marginTop: -$popup.outerHeight() - 10,
      marginLeft: -($popup.outerWidth() - $origin.outerWidth()) / 2
    });
    $popup.fadeIn(200).delay(3500).fadeOut(400, function () {
      $(this).remove();
    });
  };

  var ccPopup = /*#__PURE__*/function () {
    "use strict";

    function ccPopup($container, namespace) {
      _classCallCheck(this, ccPopup);

      this.$container = $container;
      this.namespace = namespace;
      this.cssClasses = {
        visible: 'cc-popup--visible',
        bodyNoScroll: 'cc-popup-no-scroll',
        bodyNoScrollPadRight: 'cc-popup-no-scroll-pad-right'
      };
    }
    /**
     * Open popup on timer / local storage - move focus to input ensure you can tab to submit and close
     * Add the cc-popup--visible class
     * Update aria to visible
     */


    _createClass(ccPopup, [{
      key: "open",
      value: function open(callback) {
        var _this = this;

        // Prevent the body from scrolling
        if (this.$container.data('freeze-scroll')) {
          $('body').addClass(this.cssClasses.bodyNoScroll); // Add any padding necessary to the body to compensate for the scrollbar that just disappeared

          var scrollDiv = document.createElement('div');
          scrollDiv.className = 'popup-scrollbar-measure';
          document.body.appendChild(scrollDiv);
          var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
          document.body.removeChild(scrollDiv);

          if (scrollbarWidth > 0) {
            $('body').css('padding-right', scrollbarWidth + 'px').addClass(this.cssClasses.bodyNoScrollPadRight);
          }
        } // Add reveal class


        this.$container.addClass(this.cssClasses.visible); // Track previously focused element

        this.previouslyActiveElement = document.activeElement; // Focus on the close button after the animation in has completed

        setTimeout(function () {
          _this.$container.find('.cc-popup-close')[0].focus();
        }, 500); // Pressing escape closes the modal

        $(window).on('keydown' + this.namespace, function (event) {
          if (event.keyCode === 27) {
            _this.close();
          }
        });

        if (callback) {
          callback();
        }
      }
    }, {
      key: "close",

      /**
       * Close popup on click of close button or background - where does the focus go back to?
       * Remove the cc-popup--visible class
       */
      value: function close(callback) {
        var _this2 = this;

        // Remove reveal class
        this.$container.removeClass(this.cssClasses.visible); // Revert focus

        if (this.previouslyActiveElement) {
          $(this.previouslyActiveElement).focus();
        } // Destroy the escape event listener


        $(window).off('keydown' + this.namespace); // Allow the body to scroll and remove any scrollbar-compensating padding

        if (this.$container.data('freeze-scroll')) {
          var transitionDuration = 500;
          var $innerModal = this.$container.find('.cc-popup-modal');

          if ($innerModal.length) {
            transitionDuration = parseFloat(getComputedStyle($innerModal[0])['transitionDuration']);

            if (transitionDuration && transitionDuration > 0) {
              transitionDuration *= 1000;
            }
          }

          setTimeout(function () {
            $('body').removeClass(_this2.cssClasses.bodyNoScroll).removeClass(_this2.cssClasses.bodyNoScrollPadRight).css('padding-right', '0');
          }, transitionDuration);
        }

        if (callback) {
          callback();
        }
      }
    }]);

    return ccPopup;
  }();

  ; // Manage videos

  theme.VideoManager = new function () {
    var _ = this; // Youtube


    _.youtubeVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="youtube"]:not(.video--init)'
    };

    _.youtubeApiReady = function () {
      _.youtubeVars.apiReady = true;

      _._loadYoutubeVideos();
    };

    _._loadYoutubeVideos = function (container) {
      if ($(_.youtubeVars.toProcessSelector, container).length) {
        if (_.youtubeVars.apiReady) {
          // play those videos
          $(_.youtubeVars.toProcessSelector, container).each(function () {
            // Don't init videos on mobile
            if (!($(this).hasClass('video-container--background') && $(window).outerWidth() < 768)) {
              $(this).addClass('video--init');
              _.youtubeVars.incrementor++;
              var containerId = 'theme-yt-video-' + _.youtubeVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
              var autoplay = $(this).data('video-autoplay');
              var player = new YT.Player(containerId, {
                height: '360',
                width: '640',
                videoId: $(this).data('video-id'),
                playerVars: {
                  iv_load_policy: 3,
                  modestbranding: 1,
                  autoplay: autoplay ? 1 : 0,
                  loop: $(this).data('video-loop') ? 1 : 0,
                  playlist: $(this).data('video-id'),
                  rel: 0,
                  showinfo: 0
                },
                events: {
                  onReady: _._onYoutubePlayerReady.bind({
                    autoplay: autoplay,
                    $container: $(this)
                  }),
                  onStateChange: _._onYoutubePlayerStateChange.bind(this)
                }
              });
              _.youtubeVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player
              };
            }
          });
        } else {
          // load api
          theme.loadScriptOnce('https://www.youtube.com/iframe_api');
        }
      }
    };

    _._onYoutubePlayerReady = function (event) {
      event.target.setPlaybackQuality('hd1080');

      if (this.autoplay) {
        event.target.mute();
        event.target.playVideo();
      }

      _._initBackgroundVideo(this.$container);
    };

    _._onYoutubePlayerStateChange = function (event) {
      if (event.data == YT.PlayerState.PLAYING) {
        $(this).addClass('video--play-started');
      }
    };

    _._unloadYoutubeVideos = function (container) {
      for (var dataKey in _.youtubeVars.videoData) {
        var data = _.youtubeVars.videoData[dataKey];

        if ($(container).find(data.container).length) {
          data.player.destroy();
          delete _.youtubeVars.videoData[dataKey];
          return;
        }
      }
    }; // Vimeo


    _.vimeoVars = {
      incrementor: 0,
      apiReady: false,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="vimeo"]:not(.video--init)'
    };

    _.vimeoApiReady = function () {
      _.vimeoVars.apiReady = true;

      _._loadVimeoVideos();
    };

    _._loadVimeoVideos = function (container) {
      if ($(_.vimeoVars.toProcessSelector, container).length) {
        if (_.vimeoVars.apiReady) {
          // play those videos
          $(_.vimeoVars.toProcessSelector, container).each(function () {
            // Don't init videos on mobile
            if (!($(this).hasClass('video-container--background') && $(window).outerWidth() < 768)) {
              $(this).addClass('video--init');
              _.vimeoVars.incrementor++;
              var $this = $(this);
              var containerId = 'theme-vi-video-' + _.vimeoVars.incrementor;
              $(this).data('video-container-id', containerId);
              var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
              var autoplay = !!$(this).data('video-autoplay');
              var player = new Vimeo.Player(containerId, {
                url: $(this).data('video-url'),
                width: 640,
                loop: $(this).data('video-autoplay'),
                autoplay: autoplay
              });
              player.on('playing', function () {
                $(this).addClass('video--play-started');
              }.bind(this));
              player.ready().then(function () {
                if (autoplay) {
                  player.setVolume(0);
                  player.play();
                }

                if (player.element && player.element.width && player.element.height) {
                  var ratio = parseInt(player.element.height) / parseInt(player.element.width);
                  $this.find('.video-container__video').css('padding-bottom', ratio * 100 + '%');
                }

                _._initBackgroundVideo($this);
              });
              _.vimeoVars.videoData[containerId] = {
                id: containerId,
                container: this,
                videoElement: videoElement,
                player: player,
                autoPlay: autoplay
              };
            }
          });
        } else {
          // load api
          if (window.define) {
            // workaround for third parties using RequireJS
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;

              _._loadVimeoVideos();

              window.define = window.tempDefine;
            }, function () {
              window.tempDefine = window.define;
              window.define = null;
            });
          } else {
            theme.loadScriptOnce('https://player.vimeo.com/api/player.js', function () {
              _.vimeoVars.apiReady = true;

              _._loadVimeoVideos();
            });
          }
        }
      }
    };

    _._unloadVimeoVideos = function (container) {
      for (var dataKey in _.vimeoVars.videoData) {
        var data = _.vimeoVars.videoData[dataKey];

        if ($(container).find(data.container).length) {
          data.player.unload();
          delete _.vimeoVars.videoData[dataKey];
          return;
        }
      }
    }; // Mp4


    _.mp4Vars = {
      incrementor: 0,
      videoData: {},
      toProcessSelector: '.video-container[data-video-type="mp4"]:not(.video--init)'
    };

    _._loadMp4Videos = function (container) {
      if ($(_.mp4Vars.toProcessSelector, container).length) {
        // play those videos
        $(_.mp4Vars.toProcessSelector, container).addClass('video--init').each(function () {
          _.mp4Vars.incrementor++;
          var $this = $(this);
          var containerId = 'theme-mp-video-' + _.mp4Vars.incrementor;
          $(this).data('video-container-id', containerId);
          var videoElement = $('<div class="video-container__video-element">').attr('id', containerId).appendTo($('.video-container__video', this));
          var $video = $('<video playsinline>');

          if ($(this).data('video-loop')) {
            $video.attr('loop', 'loop');
          }

          if ($(this).data('video-autoplay')) {
            $video.attr({
              autoplay: 'autoplay',
              muted: 'muted'
            });
            $video.on('loadeddata', function () {
              $(this).off('loadeddata');
              this.muted = true; // required by Chrome - ignores attribute

              this.play();
            });
          }

          $video.on('playing', function () {
            $(this).addClass('video--play-started');
          }.bind(this));
          $video.attr('src', $(this).data('video-url')).appendTo(videoElement);
        });
      }
    };

    _._unloadMp4Videos = function (container) {}; // background video placement for iframes


    _._initBackgroundVideo = function ($container) {
      if ($container.hasClass('video-container--background') && $container.find('.video-container__video iframe').length) {
        var assessBackgroundVideo = function assessBackgroundVideo() {
          var $container = this,
              cw = $container.width(),
              ch = $container.height(),
              cr = cw / ch,
              $frame = $('.video-container__video iframe', this),
              vr = $frame.attr('width') / $frame.attr('height'),
              $pan = $('.video-container__video', this),
              vCrop = 75; // pushes video outside container to hide controls

          if (cr > vr) {
            var vh = cw / vr + vCrop * 2;
            $pan.css({
              marginTop: (ch - vh) / 2 - vCrop,
              marginLeft: '',
              height: vh + vCrop * 2,
              width: ''
            });
          } else {
            var vw = cw * vr + vCrop * 2 * vr;
            $pan.css({
              marginTop: -vCrop,
              marginLeft: (cw - vw) / 2,
              height: ch + vCrop * 2,
              width: vw
            });
          }
        };

        assessBackgroundVideo.bind($container)();
        $(window).on('debouncedresize.' + $container.data('video-container-id'), assessBackgroundVideo.bind($container));
      }
    }; // Compatibility with Sections


    this.onSectionLoad = function (container) {
      // url only - infer type
      $('.video-container[data-video-url]:not([data-video-type])').each(function () {
        var url = $(this).data('video-url');

        if (url.indexOf('.mp4') > -1) {
          $(this).attr('data-video-type', 'mp4');
        }

        if (url.indexOf('vimeo.com') > -1) {
          $(this).attr('data-video-type', 'vimeo');
          $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
        }

        if (url.indexOf('youtu.be') > -1 || url.indexOf('youtube.com') > -1) {
          $(this).attr('data-video-type', 'youtube');

          if (url.indexOf('v=') > -1) {
            $(this).attr('data-video-id', url.split('v=').pop().split('&')[0]);
          } else {
            $(this).attr('data-video-id', url.split('?')[0].split('/').pop());
          }
        }
      });

      _._loadYoutubeVideos(container);

      _._loadVimeoVideos(container);

      _._loadMp4Videos(container);

      $(window).on('debouncedresize.video-manager-resize', function () {
        _._loadYoutubeVideos(container);

        _._loadVimeoVideos(container);
      }); // play button

      $('.video-container__play', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container'); // reveal

        $container.addClass('video-container--playing'); // play

        var id = $container.data('video-container-id');

        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.playVideo();
        } else {
          _.vimeoVars.videoData[id].player.play();
        }
      }); // modal close button

      $('.video-container__stop', container).on('click', function (evt) {
        evt.preventDefault();
        var $container = $(this).closest('.video-container'); // hide

        $container.removeClass('video-container--playing'); // play

        var id = $container.data('video-container-id');

        if (id.indexOf('theme-yt-video') === 0) {
          _.youtubeVars.videoData[id].player.stopVideo();
        } else {
          _.vimeoVars.videoData[id].player.pause();

          _.vimeoVars.videoData[id].player.setCurrentTime(0);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $('.video-container__play, .video-container__stop', container).off('click');
      $(window).off('.' + $('.video-container').data('video-container-id'));
      $(window).off('debouncedresize.video-manager-resize');

      _._unloadYoutubeVideos(container);

      _._unloadVimeoVideos(container);

      _._unloadMp4Videos(container);
    };
  }(); // Youtube API callback

  window.onYouTubeIframeAPIReady = function () {
    theme.VideoManager.youtubeApiReady();
  }; // Register the section


  cc.sections.push({
    name: 'video',
    section: theme.VideoManager
  });
  theme.MapSection = new function () {
    var _ = this;

    _.config = {
      zoom: 14,
      styles: {
        "default": [],
        silver: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f5f5"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#ffffff"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dadada"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e5e5e5"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#eeeeee"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#c9c9c9"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }],
        retro: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#523735"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#c9b2a6"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#dcd2be"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#ae9e90"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#93817c"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#a5b076"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#447530"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f1e6"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#fdfcf8"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f8c967"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#e9bc62"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e98d58"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#db8555"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#806b63"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8f7d77"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#ebe3cd"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dfd2ae"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#b9d3c2"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#92998d"
          }]
        }],
        dark: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#212121"
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#212121"
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9e9e9e"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#bdbdbd"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#181818"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1b1b1b"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#2c2c2c"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8a8a8a"
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#373737"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3c3c3c"
          }]
        }, {
          "featureType": "road.highway.controlled_access",
          "elementType": "geometry",
          "stylers": [{
            "color": "#4e4e4e"
          }]
        }, {
          "featureType": "road.local",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#616161"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#757575"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#000000"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3d3d3d"
          }]
        }],
        night: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#242f3e"
          }]
        }, {
          "featureType": "administrative.locality",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#263c3f"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6b9a76"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#38414e"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#212a37"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#9ca5b3"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#746855"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#1f2835"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#f3d19c"
          }]
        }, {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2f3948"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#d59563"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#17263c"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#515c6d"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#17263c"
          }]
        }],
        aubergine: [{
          "elementType": "geometry",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#8ec3b9"
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1a3646"
          }]
        }, {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#64779e"
          }]
        }, {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#4b6878"
          }]
        }, {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#334e87"
          }]
        }, {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#6f9ba5"
          }]
        }, {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#3C7680"
          }]
        }, {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [{
            "color": "#304a7d"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [{
            "color": "#2c6675"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#255763"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#b0d5ce"
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#023e58"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#98a5be"
          }]
        }, {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [{
            "color": "#1d2c4d"
          }]
        }, {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#283d6a"
          }]
        }, {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [{
            "color": "#3a4762"
          }]
        }, {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#0e1626"
          }]
        }, {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [{
            "color": "#4e6d70"
          }]
        }]
      }
    };
    _.apiStatus = null;

    this.geolocate = function ($map) {
      var deferred = $.Deferred();
      var geocoder = new google.maps.Geocoder();
      var address = $map.data('address-setting');
      geocoder.geocode({
        address: address
      }, function (results, status) {
        if (status !== google.maps.GeocoderStatus.OK) {
          deferred.reject(status);
        }

        deferred.resolve(results);
      });
      return deferred;
    };

    this.createMap = function (container) {
      var $map = $('.map-section__map-container', container);
      return _.geolocate($map).then(function (results) {
        var mapOptions = {
          zoom: _.config.zoom,
          styles: _.config.styles[$(container).data('map-style')],
          center: results[0].geometry.location,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          disableDefaultUI: true,
          zoomControl: true
        };
        _.map = new google.maps.Map($map[0], mapOptions);
        _.center = _.map.getCenter();
        var marker = new google.maps.Marker({
          map: _.map,
          position: _.center,
          clickable: false
        });
        google.maps.event.addDomListener(window, 'resize', function () {
          google.maps.event.trigger(_.map, 'resize');

          _.map.setCenter(_.center);
        });
      }.bind(this)).fail(function () {
        var errorMessage;

        switch (status) {
          case 'ZERO_RESULTS':
            errorMessage = theme.strings.addressNoResults;
            break;

          case 'OVER_QUERY_LIMIT':
            errorMessage = theme.strings.addressQueryLimit;
            break;

          default:
            errorMessage = theme.strings.addressError;
            break;
        } // Only show error in the theme editor


        if (Shopify.designMode) {
          var $mapContainer = $map.parents('.map-section');
          $mapContainer.addClass('page-width map-section--load-error');
          $mapContainer.find('.map-section__wrapper').html('<div class="errors text-center">' + errorMessage + '</div>');
        }
      });
    };

    this.onSectionLoad = function (target) {
      var $container = $(target); // Global function called by Google on auth errors

      window.gm_authFailure = function () {
        if (!Shopify.designMode) return;
        $container.addClass('page-width map-section--load-error');
        $container.find('.map-section__wrapper').html('<div class="errors text-center">' + theme.strings.authError + '</div>');
      }; // create maps


      var key = $container.data('api-key');

      if (typeof key !== 'string' || key === '') {
        return;
      } // load map


      theme.loadScriptOnce('https://maps.googleapis.com/maps/api/js?key=' + key, function () {
        _.createMap($container);
      });
    };

    this.onSectionUnload = function (target) {
      if (typeof window.google !== 'undefined' && typeof google.maps !== 'undefined') {
        google.maps.event.clearListeners(this.map, 'resize');
      }
    };
  }(); // Register the section

  cc.sections.push({
    name: 'map',
    section: theme.MapSection
  }); // A section that contains other sections, e.g. story page

  theme.NestedSectionsSection = new function () {
    this.onSectionLoad = function (container) {
      // load child sections
      $('[data-nested-section-type]', container).each(function () {
        var type = $(this).attr('data-nested-section-type');
        var section = null;

        for (var i = 0; i < theme.Sections._sections.length; i++) {
          if (theme.Sections._sections[i].type == type) {
            section = theme.Sections._sections[i].section;
          }
        }

        if (section) {
          var instance = {
            target: this,
            section: section,
            $shopifySectionContainer: $(this).closest('.shopify-section'),
            thisContext: {}
          };

          theme.Sections._instances.push(instance);

          $(this).data('themeSectionInstance', instance);
          section.onSectionLoad.bind(instance.thisContext)(this);
        }
      });
    };

    this.onSectionUnload = function (container) {
      // unload child sections
      $('[data-nested-section-type]', container).each(function () {
        theme.Sections.sectionUnload.bind($(this).data('themeSectionInstance').thisContext)(this);
      });
    };

    this.onBlockSelect = function (target) {
      // scroll to block
      $(window).scrollTop($(target).offset().top - 100);
    };
  }(); // Register the section

  cc.sections.push({
    name: 'nested-sections',
    section: theme.NestedSectionsSection
  });
  /**
  * StoreAvailability Section Script
  * ------------------------------------------------------------------------------
  *
  * @namespace StoreAvailability
  */

  theme.StoreAvailability = function (container) {
    var loadingClass = 'store-availability-loading';
    var initClass = 'store-availability-initialized';
    var storageKey = 'cc-location';

    this.onSectionLoad = function (container) {
      var _this3 = this;

      this.namespace = theme.namespaceFromSection(container);
      this.$container = $(container);
      this.productId = this.$container.data('store-availability-container');
      this.sectionUrl = this.$container.data('section-url');
      this.$modal;
      var firstRun = true; // Handle when a variant is selected

      $(window).on("cc-variant-updated".concat(this.namespace).concat(this.productId), function (e, args) {
        if (args.product.id === _this3.productId) {
          _this3.functions.updateContent.bind(_this3)(args.variant.id, args.product.title, firstRun, false, typeof args.variant.available !== "undefined");

          firstRun = false;
        }
      }); // Handle single variant products

      if (this.$container.data('single-variant-id')) {
        this.functions.updateContent.bind(this)(this.$container.data('single-variant-id'), this.$container.data('single-variant-product-title'), firstRun, this.$container.data('has-only-default-variant'), this.$container.data('single-variant-product-available'));
        firstRun = false;
      }
    };

    this.onSectionUnload = function () {
      $(window).off("cc-variant-updated".concat(this.namespace).concat(this.productId));
      this.$container.off('click');

      if (this.$modal) {
        this.$modal.off('click');
      }
    };

    this.functions = {
      // Returns the users location data (if allowed)
      getUserLocation: function getUserLocation() {
        return new Promise(function (resolve, reject) {
          var storedCoords;

          if (sessionStorage[storageKey]) {
            storedCoords = JSON.parse(sessionStorage[storageKey]);
          }

          if (storedCoords) {
            resolve(storedCoords);
          } else {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(function (position) {
                var coords = {
                  latitude: position.coords.latitude,
                  longitude: position.coords.longitude
                }; //Set the localization api

                fetch('/localization.json', {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify(coords)
                }); //Write to a session storage

                sessionStorage[storageKey] = JSON.stringify(coords);
                resolve(coords);
              }, function () {
                resolve(false);
              }, {
                maximumAge: 3600000,
                // 1 hour
                timeout: 5000
              });
            } else {
              resolve(false);
            }
          }
        });
      },
      // Requests the available stores and calls the callback
      getAvailableStores: function getAvailableStores(variantId, cb) {
        return $.get(this.sectionUrl.replace('VARIANT_ID', variantId), cb);
      },
      // Haversine Distance
      // The haversine formula is an equation giving great-circle distances between
      // two points on a sphere from their longitudes and latitudes
      calculateDistance: function calculateDistance(coords1, coords2, unitSystem) {
        var dtor = Math.PI / 180;
        var radius = unitSystem === 'metric' ? 6378.14 : 3959;
        var rlat1 = coords1.latitude * dtor;
        var rlong1 = coords1.longitude * dtor;
        var rlat2 = coords2.latitude * dtor;
        var rlong2 = coords2.longitude * dtor;
        var dlon = rlong1 - rlong2;
        var dlat = rlat1 - rlat2;
        var a = Math.pow(Math.sin(dlat / 2), 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.pow(Math.sin(dlon / 2), 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return radius * c;
      },
      // Updates the existing modal pickup with locations with distances from the user
      updateLocationDistances: function updateLocationDistances(coords) {
        var unitSystem = this.$modal.find('[data-unit-system]').data('unit-system');
        var self = this;
        this.$modal.find('[data-distance="false"]').each(function () {
          var _this4 = this;

          var thisCoords = {
            latitude: parseFloat($(this).data('latitude')),
            longitude: parseFloat($(this).data('longitude'))
          };

          if (thisCoords.latitude && thisCoords.longitude) {
            var distance = self.functions.calculateDistance(coords, thisCoords, unitSystem).toFixed(1);
            $(this).html(distance); //Timeout to trigger animation

            setTimeout(function () {
              $(_this4).closest('.store-availability-list__location__distance').addClass('-in');
            }, 0);
          }

          $(this).attr('data-distance', 'true');
        });
      },
      // Requests the available stores and updates the page with info below Add to Basket, and append the modal to the page
      updateContent: function updateContent(variantId, productTitle, firstRun, isSingleDefaultVariant, isVariantAvailable) {
        var _this5 = this;

        this.$container.off('click', '[data-store-availability-modal-open]');
        this.$container.off('click' + this.namespace, '.cc-popup-close, .cc-popup-background');
        $('.store-availabilities-modal').remove();

        if (firstRun) {
          this.$container.hide();
        } else if (!isVariantAvailable) {
          //If the variant is Unavailable (not the same as Out of Stock) - hide the store pickup completely
          this.$container.addClass(loadingClass).addClass(initClass);
          this.$container.css('height', '0px');
        } else {
          this.$container.addClass(loadingClass).addClass(initClass);
          this.$container.css('height', this.$container.outerHeight() + 'px');
        }

        if (isVariantAvailable) {
          this.functions.getAvailableStores.call(this, variantId, function (response) {
            if (response.trim().length > 0 && !response.includes('NO_PICKUP')) {
              _this5.$container.html(response);

              _this5.$container.html(_this5.$container.children().first().html()); // editor bug workaround


              _this5.$container.find('[data-store-availability-modal-product-title]').html(productTitle);

              if (isSingleDefaultVariant) {
                _this5.$container.find('.store-availabilities-modal__variant-title').remove();
              }

              _this5.$container.find('.cc-popup').appendTo('body');

              _this5.$modal = $('body').find('.store-availabilities-modal');
              var popup = new ccPopup(_this5.$modal, _this5.namespace);

              _this5.$container.on('click', '[data-store-availability-modal-open]', function () {
                popup.open(); //When the modal is opened, try and get the users location

                _this5.functions.getUserLocation().then(function (coords) {
                  if (coords && _this5.$modal.find('[data-distance="false"]').length) {
                    //Re-retrieve the available stores location modal contents
                    _this5.functions.getAvailableStores.call(_this5, variantId, function (response) {
                      _this5.$modal.find('.store-availabilities-list').html($(response).find('.store-availabilities-list').html());

                      _this5.functions.updateLocationDistances.bind(_this5)(coords);
                    });
                  }
                });

                return false;
              });

              _this5.$modal.on('click' + _this5.namespace, '.cc-popup-close, .cc-popup-background', function () {
                popup.close();
              });

              if (firstRun) {
                _this5.$container.slideDown(300);
              } else {
                _this5.$container.removeClass(loadingClass);

                var newHeight = _this5.$container.find('.store-availability-container').outerHeight() + 'px';

                _this5.$container.css('height', newHeight);
              }
            }
          });
        }
      }
    }; // Initialise the section when it's instantiated

    this.onSectionLoad(container);
  }; // Register section


  cc.sections.push({
    name: 'store-availability',
    section: theme.StoreAvailability
  });
  theme.Navigation = {
    init: function init(options) {
      if (options.nav.length == 0) {
        return;
      }

      var $nav = options.nav,
          navHoverDelay = 250,
          $navLastOpenDropdown = $(),
          navOpenTimeoutId = -1; // hover events

      $nav.on('mouseenter mouseleave', '.navigation__tier-1 > .navigation__item--with-children', function (evt) {
        var $dropdownContainer = $(this); // delay on hover-out

        if (evt.type == 'mouseenter') {
          clearTimeout(navOpenTimeoutId);
          clearTimeout($dropdownContainer.data('navCloseTimeoutId'));
          var $openSiblings = $dropdownContainer.siblings('.navigation__item--show-children'); // close all menus but last opened

          $openSiblings.not($navLastOpenDropdown).removeClass('navigation__item--show-children');
          $navLastOpenDropdown = $dropdownContainer; // show after a delay, based on first-open or not

          var timeoutDelay = $openSiblings.length == 0 ? 0 : navHoverDelay; // open it

          var newNavOpenTimeoutId = setTimeout(function () {
            $dropdownContainer.addClass('navigation__item--show-children').siblings('.navigation__item--show-children').removeClass('navigation__item--show-children');
          }, timeoutDelay);
          navOpenTimeoutId = newNavOpenTimeoutId;
          $dropdownContainer.data('navOpenTimeoutId', newNavOpenTimeoutId);
        } else {
          // cancel opening, close after delay, and clear transforms
          clearTimeout($dropdownContainer.data('navOpenTimeoutId'));
          $dropdownContainer.data('navCloseTimeoutId', setTimeout(function () {
            $dropdownContainer.removeClass('navigation__item--show-children');
          }, navHoverDelay));
        } // a11y


        $dropdownContainer.children('[aria-expanded]').attr('aria-expanded', evt.type == 'mouseenter');
      }); // touch events on desktop

      var touchHandler = function touchHandler(evt) {
        if ($(window).width() > 767) {
          if (evt.type == 'touchstart') {
            $(this).data('touchstartedAt', evt.timeStamp);
          } else if (evt.type == 'touchend') {
            // down & up in under a second - presume tap
            if (evt.timeStamp - $(this).data('touchstartedAt') < 1000) {
              $(this).data('touchOpenTriggeredAt', evt.timeStamp);

              if ($(this).parent().hasClass('navigation__item--show-children')) {
                // trigger close
                $(this).parent().trigger('mouseleave');
              } else {
                // trigger close on any open items
                $('.navigation:first .navigation__item--show-children').trigger('mouseleave'); // trigger open

                $(this).parent().trigger('mouseenter');
              } // prevent fake click


              return false;
            }
          } else if (evt.type == 'click') {
            // if touch open was triggered very recently, prevent click event
            if ($(this).data('touchOpenTriggeredAt') && evt.timeStamp - $(this).data('touchOpenTriggeredAt') < 1000) {
              return false;
            }
          }
        }
      };

      $nav.on('touchstart touchend click', '.navigation__tier-1 > .navigation__item--with-children > .navigation__link', touchHandler); // hit return on dropdown toggle

      var keydownHandler = function keydownHandler(evt) {
        if (evt.which == 13) {
          var $parent = $(this).parent();
          $parent.trigger($parent.hasClass('navigation__item--show-children') ? 'mouseleave' : 'mouseenter');
          return false;
        }
      };

      $nav.on('keydown', '.navigation__tier-1 > .navigation__item--with-children > .navigation__children-toggle', keydownHandler); // proxy for desktop nav interaction events

      if (options.proxyTier1Nav) {
        $(options.proxyTier1Nav).on('mouseenter mouseleave', '.navigation__tier-1 > .navigation__item--with-children', function (evt) {
          $($('.navigation__tier-1 > .navigation__item', $nav)[$(this).index()]).trigger(evt.type);
        }).on('touchstart touchend click', '.navigation__tier-1 > .navigation__item--with-children > .navigation__link', function (evt) {
          var response = touchHandler.bind($($('.navigation__tier-1 > .navigation__item', $nav)[$(this).parent().index()]).children('.navigation__link')[0])(evt);

          if (response === false) {
            return false;
          }
        }).on('keydown', '.navigation__tier-1 > .navigation__item--with-children > .navigation__children-toggle', function (evt) {
          if (evt.which == 13) {
            keydownHandler.bind($($('.navigation__tier-1 > .navigation__item', $nav)[$(this).parent().index()]).children('.navigation__children-toggle')[0])(evt);
            return false;
          }
        });
      } // mobile expansion


      $nav.on('click', '.navigation__children-toggle', function () {
        if ($(this).parent().toggleClass('navigation__item--mobile-open').hasClass('navigation__item--mobile-open')) {
          $(this).siblings('.navigation__child-tier').stop().slideDown(300, function () {
            $(this).parent().addClass('navigation__item--mobile-open-finished');
            $(this).removeAttr('style');
          });
        } else {
          $(this).siblings('.navigation__child-tier').stop().slideUp(300, function () {
            $(this).parent().removeClass('navigation__item--mobile-open-finished');
            $(this).removeAttr('style');
          });
        }

        return false;
      });
      $nav.on('click', '.navigation__link[href="#"][aria-haspopup="true"]', function () {
        $(this).siblings('.navigation__children-toggle').trigger('click');
        return false;
      });
    },
    destroy: function destroy($nav, $proxyTier1Nav) {
      $nav.add($proxyTier1Nav).off('click mouseenter mouseleave touchstart touchend keydown');
    }
  };
  theme.icons = {
    left: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_left + '</title><path d="M0 0h24v24H0z" fill="none"/><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
    right: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_right + '</title><path d="M0 0h24v24H0z" fill="none"/><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg>',
    close: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><title>' + theme.strings.icon_labels_close + '</title><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    chevronLeft: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-left"><title>' + theme.strings.icon_labels_left + '</title><polyline points="15 18 9 12 15 6"></polyline></svg>',
    chevronRight: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><title>' + theme.strings.icon_labels_right + '</title><polyline points="9 18 15 12 9 6"></polyline></svg>',
    chevronDown: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><title>' + theme.strings.icon_labels_down + '</title><path d="M7.41 7.84L12 12.42l4.59-4.58L18 9.25l-6 6-6-6z"/><path d="M0-.75h24v24H0z" fill="none"/></svg>',
    tick: '<svg fill="#000000" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
    label: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="feather feather-tag"><title>Label</title><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7" y2="7"></line></svg>'
  }; // Get Shopify feature support

  try {
    theme.Shopify.features = JSON.parse(document.documentElement.querySelector('#shopify-features').textContent);
  } catch (e) {
    theme.Shopify.features = {};
  }

  theme.namespaceFromSection = function (container) {
    return ['.', $(container).data('section-type'), $(container).data('section-id')].join('');
  };

  theme.buildGalleryViewer = function (config) {
    // create viewer
    var $allContainer = $('<div class="gallery-viewer gallery-viewer--pre-reveal">');
    var $zoomContainer = $('<div class="gallery-viewer__zoom">').appendTo($allContainer);
    var $thumbContainer = $('<div class="gallery-viewer__thumbs">').appendTo($allContainer);
    var $controlsContainer = $('<div class="gallery-viewer__controls">').appendTo($allContainer);
    var $close = $('<a class="gallery-viewer__button gallery-viewer__close" href="#">').html(config.close).appendTo($controlsContainer);
    var $right = $('<a class="gallery-viewer__button gallery-viewer__prev" href="#">').html(config.prev).appendTo($controlsContainer);
    var $left = $('<a class="gallery-viewer__button gallery-viewer__next" href="#">').html(config.next).appendTo($controlsContainer);
    var $currentZoomImage = null; // add images

    for (var i = 0; i < config.images.length; i++) {
      var img = config.images[i];
      $('<a class="gallery-viewer__thumb" href="#">').data('zoom-url', img.zoomUrl).html(img.thumbTag).appendTo($thumbContainer);
    }

    if (config.images.length === 1) {
      $allContainer.addClass('gallery-viewer--single-image');
    } // helper function for panning an image


    var panZoomImage = function panZoomImage(inputX, inputY) {
      // do nothing if the image fits, pan if not
      var doPanX = $currentZoomImage.width() > $allContainer.width();
      var doPanY = $currentZoomImage.height() > $allContainer.height();

      if (doPanX || doPanY) {
        var midX = $allContainer.width() / 2;
        var midY = $allContainer.height() / 2;
        var offsetFromCentreX = inputX - midX,
            offsetFromCentreY = inputY - midY; // the offsetMultipler ensures it can only pan to the edge of the image, no further

        var finalOffsetX = 0;
        var finalOffsetY = 0;

        if (doPanX) {
          var offsetMultiplierX = ($currentZoomImage.width() - $allContainer.width()) / 2 / midX;
          finalOffsetX = Math.round(-offsetFromCentreX * offsetMultiplierX);
        }

        if (doPanY) {
          var offsetMultiplierY = ($currentZoomImage.height() - $allContainer.height()) / 2 / midY;
          finalOffsetY = Math.round(-offsetFromCentreY * offsetMultiplierY);
        }

        $currentZoomImage.css('transform', ['translate3d(', finalOffsetX, 'px, ', finalOffsetY, 'px, 0)'].join(''));
      }
    }; // set up events
    // event: select thumbnail - zoom it


    $allContainer.on('click.galleryViewer select.galleryViewer', '.gallery-viewer__thumb', function (evt) {
      evt.preventDefault(); // set active

      $(this).addClass('gallery-viewer__thumb--active').siblings('.gallery-viewer__thumb--active').removeClass('gallery-viewer__thumb--active'); // replace zoom image

      $currentZoomImage = $('<img class="gallery-viewer__zoom-image" alt="" style="visibility: hidden">');
      $currentZoomImage.on('load', function () {
        $(this).off('load');
        $(this).css({
          visibility: '',
          top: $allContainer.height() / 2 - $(this).height() / 2,
          left: $allContainer.width() / 2 - $(this).width() / 2
        });
        panZoomImage(evt.clientX, evt.clientY);
      }).attr('src', $(this).data('zoom-url'));
      $zoomContainer.html($currentZoomImage);
    }); // event: pan

    $allContainer.on('mousemove.galleryViewer touchmove.galleryViewer', function (evt) {
      if (evt.type === 'touchmove') {
        var touch = evt.touches[0];
        panZoomImage(touch.clientX, touch.clientY);
      } else {
        panZoomImage(evt.clientX, evt.clientY);
      }
    }); // event: prevent pan while swiping thumbnails

    $allContainer.on('touchmove.galleryViewer', '.gallery-viewer__thumbs', function (evt) {
      evt.stopPropagation();
    }); // event: next thumbnail

    $allContainer.on('click.galleryViewer', '.gallery-viewer__next', function (evt) {
      evt.preventDefault();
      var $next = $thumbContainer.find('.gallery-viewer__thumb--active').next();

      if ($next.length === 0) {
        $next = $thumbContainer.find('.gallery-viewer__thumb:first');
      }

      $next.trigger('select');
    }); // event: previous thumbnail

    $allContainer.on('click.galleryViewer', '.gallery-viewer__prev', function (evt) {
      evt.preventDefault();
      var $prev = $thumbContainer.find('.gallery-viewer__thumb--active').prev();

      if ($prev.length === 0) {
        $prev = $thumbContainer.find('.gallery-viewer__thumb:last');
      }

      $prev.trigger('select');
    }); // event: close

    $allContainer.on('click.galleryViewer', '.gallery-viewer__close', function (evt) {
      evt.preventDefault(); // destroy events

      $allContainer.off('.galleryViewer'); // begin exit transition

      $allContainer.addClass('gallery-viewer--transition-out'); // remove after transition

      var transitionDelay = $allContainer.css('transition-duration');
      transitionDelay = transitionDelay.indexOf('ms') > -1 ? parseFloat(transitionDelay) : parseFloat(transitionDelay) * 1000;
      setTimeout(function () {
        $allContainer.remove();
        $('html').removeClass('gallery-viewer-open');
      }, transitionDelay);
    }); // initialise
    // - clear any remnants of failed previous closure

    $('html').removeClass('gallery-viewer-open');
    $('.gallery-viewer').remove(); // - insert into page

    $('html').addClass('gallery-viewer-open');
    $allContainer.appendTo('body'); // - select first thumbnail

    $thumbContainer.find('.gallery-viewer__thumb:eq(' + (config.current > 0 ? config.current : 0) + ')').trigger('select'); // - reveal

    setTimeout(function () {
      $allContainer.removeClass('gallery-viewer--pre-reveal');
    }, 10);
  };

  theme.FeaturedProductSection = new function () {
    this.onSectionLoad = function (target) {
      $('[name="id"]', target).trigger('optionate');
      theme.classUpTextLinks(target);
      theme.initProductGallery(target);
    };

    this.onSectionUnload = function (target) {
      theme.destroyProductGallery(target);
      theme.OptionManager.unloadProductOptions($('[name="id"]', target));
      $('.slideshow', target).slick('unslick');
    };
  }();
  /* Product Media
   *
   * Load and destroy:
   * theme.ProductMedia.init(galleryContainer, {
   *   onModelViewerPlay: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
   *   },
   *   onModelViewerPause: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
   *   },
   *   onPlyrPlay: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
   *   },
   *   onPlyrPause: function(e){
   *     $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
   *   },
   * });
   *
   * theme.ProductMedia.destroy(galleryContainer);
   *
   * Trigger mediaVisible and mediaHidden events based on UI
   * $slickSlideshow.on('afterChange', function(evt, slick, current){
   *   $('.product-media--activated').removeClass('product-media--activated').trigger('mediaHidden');
   *   $('.product-media', slick.$slides[current]).addClass('product-media--activated').trigger('mediaVisible');
   * });
   */

  theme.ProductMedia = new function () {
    var _ = this;

    _._setupShopifyXr = function () {
      if (!window.ShopifyXR) {
        document.addEventListener('shopify_xr_initialized', _._setupShopifyXr.bind(this));
        return;
      }

      window.ShopifyXR.addModels(JSON.parse($(this).html()));
      window.ShopifyXR.setupXRElements();
    };

    this.init = function (container, callbacks) {
      var callbacks = callbacks || {},
          _container = container; // set up video media elements with a controller

      $(container).find('.product-media--video').each(function (index) {
        var enableLooping = $(this).data('enable-video-looping'),
            element = $(this).find('iframe, video')[0];

        if (element.tagName === 'VIDEO') {
          // set up a controller for Plyr video
          window.Shopify.loadFeatures([{
            name: 'video-ui',
            version: '1.0',
            onLoad: function () {
              var playerObj = {
                playerType: 'html5',
                element: element
              };

              playerObj.play = function () {
                this.plyr.play();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.plyr.pause();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.plyr.destroy();
              }.bind(playerObj);

              playerObj.plyr = new Shopify.Plyr(element, {
                controls: ['play', 'progress', 'mute', 'volume', 'play-large', 'fullscreen'],
                loop: {
                  active: enableLooping
                },
                hideControlsOnPause: true,
                iconUrl: '//cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.svg',
                tooltips: {
                  controls: false,
                  seek: true
                }
              });
              $(this).data('player', playerObj).addClass('product-media--video-loaded'); // callbacks for Plyr playback

              if (callbacks.onPlyrPlay) {
                $(element).on('playing', callbacks.onPlyrPlay);
              }

              if (callbacks.onPlyrPause) {
                $(element).on('pause ended', callbacks.onPlyrPause);
              }

              if (callbacks.onPlyrInit) {
                callbacks.onPlyrInit(playerObj);
              }
            }.bind(this)
          }]);
          theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/shopify-plyr/v1.0/shopify-plyr.css');
        } else if (element.tagName === 'IFRAME') {
          if (/^(https?:\/\/)?(www\.)?(youtube\.com|youtube-nocookie\.com|youtu\.?be)\/.+$/.test(element.src)) {
            // set up a controller for YouTube video
            var temp = window.onYouTubeIframeAPIReady;

            var loadYoutubeVideo = function () {
              var playerObj = {
                playerType: 'youtube',
                element: element
              };
              var videoId = $(this).data('video-id');
              playerObj.player = new YT.Player(element, {
                videoId: videoId,
                events: {
                  onStateChange: function onStateChange(event) {
                    if (event.data === YT.PlayerState.ENDED && enableLooping) {
                      event.target.seekTo(0);
                    }
                  }
                }
              });

              playerObj.play = function () {
                this.player.playVideo();
              }.bind(playerObj);

              playerObj.pause = function () {
                this.player.pauseVideo();
              }.bind(playerObj);

              playerObj.destroy = function () {
                this.player.destroy();
              }.bind(playerObj);

              $(this).data('player', playerObj).addClass('product-media--video-loaded');

              if (callbacks.onYouTubeInit) {
                callbacks.onYouTubeInit(playerObj);
              }
            }.bind(this);

            window.onYouTubeIframeAPIReady = function () {
              temp();
              loadYoutubeVideo();
            };

            theme.loadScriptOnce('https://www.youtube.com/iframe_api');
          }
        }
      }); // when any media appears

      $(container).on('mediaVisible', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // autoplay all media on larger screens
        if ($(window).width() >= 768) {
          $(this).data('player').play();
        } // update view-in-space


        if ($(this).hasClass('product-media--model')) {
          $('.view-in-space', _container).attr('data-shopify-model3d-id', $(this).data('model-id'));
        }
      }); // when any media is hidden

      $(container).on('mediaHidden', '.product-media--video-loaded, .product-media--model-loaded', function () {
        // pause all media
        $(this).data('player').pause();
      }); // necessary callbacks

      if (callbacks.onVideoVisible) {
        $(container).on('mediaVisible', '.product-media--video-loaded', callbacks.onVideoVisible);
      }

      if (callbacks.onVideoHidden) {
        $(container).on('mediaHidden', '.product-media--video-loaded', callbacks.onVideoHidden);
      }

      $('model-viewer', container).each(function () {
        if (callbacks.onModelViewerPlay) {
          $(this).on('shopify_model_viewer_ui_toggle_play', callbacks.onModelViewerPlay);
        }

        if (callbacks.onModelViewerPause) {
          $(this).on('shopify_model_viewer_ui_toggle_pause', callbacks.onModelViewerPause);
        }
      }); // set up a 3d model when it first appears

      $(container).on('mediaVisible mediaVisibleInitial', '.product-media--model:not(.product-media--model-loaded)', function (e) {
        var element = $(this).find('model-viewer')[0],
            autoplay = e.type != 'mediaVisibleInitial'; // load viewer

        theme.loadStyleOnce('https://cdn.shopify.com/shopifycloud/model-viewer-ui/assets/v1.0/model-viewer-ui.css');
        window.Shopify.loadFeatures([{
          name: 'model-viewer-ui',
          version: '1.0',
          onLoad: function () {
            $(this).data('player', new Shopify.ModelViewerUI(element)); // set class and re-trigger visible event now loaded

            $(this).addClass('product-media--model-loaded');

            if (callbacks.onModelViewerInit) {
              callbacks.onModelViewerInit(element);
            }

            if (autoplay) {
              $(this).trigger('mediaVisible');
            }
          }.bind(this)
        }]);
      }); // load AR viewer

      if ($('.model-json', container).length) {
        window.Shopify.loadFeatures([{
          name: 'shopify-xr',
          version: '1.0',
          onLoad: _._setupShopifyXr.bind($('.model-json', container))
        }]);
      } // pause video when a 3d model is launched in AR


      $(document).on('shopify_xr_launch', function () {
        $('.product-media--video-loaded').each(function () {
          $(this).data('player').pause();
        });
      }); // 3d model in first place - start in paused mode

      setTimeout(function () {
        $('.product-media:first', this).filter('.product-media--model').trigger('mediaVisibleInitial');
      }.bind(container), 50);
    };

    this.destroy = function (container) {
      $(document).off('shopify_xr_launch');
      $(container).off('mediaVisible mediaVisibleInitial mediaHidden');
      $('.product-media--video-loaded, .product-media--model-loaded', container).each(function () {
        $(this).data('player').destroy();
      });
      $('.product-media--video video', container).off('playing pause ended');
      $('model-viewer', container).off('shopify_model_viewer_ui_toggle_play shopify_model_viewer_ui_toggle_pause');
    };
  }();

  theme.productGallerySlideshowTabFix = function (slides, current) {
    // tabindex everything to prevent tabbing into hidden slides
    $(slides[current]).find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
      if (typeof $(this).data('theme-slideshow-original-tabindex') !== 'undefined') {
        if ($(this).data('theme-slideshow-original-tabindex') === false) {
          $(this).removeAttr('tabindex');
        } else {
          $(this).attr('tabindex', $(this).data('theme-slideshow-original-tabindex'));
        }
      } else {
        $(this).removeAttr('tabindex');
      }
    });
    $(slides).not(slides[current]).find('a, input, button, select, iframe, video, model-viewer, [tabindex]').each(function () {
      if (typeof $(this).data('theme-slideshow-original-tabindex') === 'undefined') {
        $(this).data('theme-slideshow-original-tabindex', typeof $(this).attr('tabindex') !== 'undefined' ? $(this).attr('tabindex') : false);
        $(this).attr('tabindex', '-1');
      }
    });
  }; // container must be an element higher up the tree than the gallery


  theme.initProductGallery = function (container) {
    var $gallery = $('.gallery', container);

    if ($gallery.hasClass('gallery-initialised')) {
      return;
    }

    $gallery.addClass('gallery-initialised'); /// Init main image slideshow

    $('.product-slideshow', container).each(function () {
      var $slideshow = $(this).on('init', function (evt, slick) {
        $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
      }).on('beforeChange', function (evt, slick, current, next) {
        $($(this).closest('.gallery').find('.thumbnails a')[next]).trigger('selectFromSlick');
      }).slick({
  		slidesToShow: 2,
        infinite: false,
        arrows: true,
        appendArrows: $(this).siblings('.slideshow-controls').find('.slideshow-controls__arrows'),
        appendDots: $(this).siblings('.slideshow-controls').find('.slideshow-controls__dots'),
        prevArrow: '<button type="button" class="slick-product-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
        nextArrow: '<button type="button" class="slick-product-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
        responsive: [{
          breakpoint: 768,
          settings: {
            dots: true,
            arrows: true,
            fade: false,
            slidesToShow: 1
          }
        }]
        
      }); // media initialisation

      theme.ProductMedia.init($gallery, {
        onPlyrInit: function onPlyrInit(playerObj) {
          theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
        },
        onYoutubeInit: function onYoutubeInit(playerObj) {
          theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
        },
        onModelViewerInit: function onModelViewerInit(element) {
          theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
        },
        onVideoVisible: function onVideoVisible(e) {
          if ($(window).width() >= 768) {
            $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
          }
        },
        onVideoHidden: function onVideoHidden(e) {
          if ($(window).width() >= 768) {
            $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
          }
        },
        onPlyrPlay: function onPlyrPlay(e) {
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false);
        },
        onPlyrPause: function onPlyrPause(e) {
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
        },
        onModelViewerPlay: function onModelViewerPlay(e) {
          // prevent swiping
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', false); // prevent left/right key control

          $(e.target).closest('.slick-slider').slick('slickSetOption', 'accessibility', false);
        },
        onModelViewerPause: function onModelViewerPause(e) {
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'swipe', true);
          $(e.target).closest('.slick-slider').slick('slickSetOption', 'accessibility', true);
        }
      }); // fix tabindex for first slide

      theme.productGallerySlideshowTabFix($slideshow.slick('getSlick').$slides, $slideshow.slick('getSlick').currentSlide);
      $slideshow.on('afterChange', function (evt, slick, current) {
        // notify media of visibility
        $('.product-media--activated').removeClass('product-media--activated').trigger('mediaHidden');
        $('.product-media', slick.$slides[current]).addClass('product-media--activated').trigger('mediaVisible'); // fix tabbing

        theme.productGallerySlideshowTabFix(slick.$slides, current); // resize quickbuy

        $(this).closest('.quickbuy-container').trigger('changedsize');
      }); // if in quickbuy, trigger resize after slideshow change

      if ($(container).closest('.collection-listing').length > 0) {
        $slideshow.on('afterChange', function () {
          $(this).closest('.quickbuy-container').trigger('changedsize');
        });
      }
    });
    
    var $thumbnails = $('.thumbnails', container);

    if ($thumbnails.length) {
      var carouselVisibleItemCount = 6,
          isCarousel = false; /// Screen-width based initialisation of thumbnail carousels

      var assessCarousel = function assessCarousel() {
        if ($thumbnails.is(':visible')) {
          // thumbnails are visible (i.e. not mobile)
          if (Math.abs($thumbnails.outerWidth() - $thumbnails.parent().width()) > 20) {
            // thumbnail container is drastically different in size to main image - destroy carousel
            if (isCarousel) {
              isCarousel = false;
              theme.beforeCarouselUnloadEventBlockFix($thumbnails);
              $thumbnails.removeClass('owl-carousel').data('owl.carousel').destroy();
            }
          } else {
            // thumbnails are in a column - init carousel
            if (!isCarousel) {
              isCarousel = true; // fix for event propagation in nested owl carousels

              theme.beforeCarouselLoadEventBlockFix($thumbnails);
              $thumbnails.addClass('owl-carousel').on('initialized.owl.carousel', function () {
                $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
              }).owlCarousel({
                items: carouselVisibleItemCount,
                dots: false,
                margin: 7
              });
            }
          }
        }
      };

      $(window).on('debouncedresize.productGallery', assessCarousel);
      assessCarousel();
      $(container).data('assessCarouselCallback', assessCarousel); /// Thumbnail click - in carousel

      $('.gallery', container).on('click select selectFromSlick', '.thumbnails.owl-carousel a', function (e) {
        e.preventDefault();
        var $carouselItem = $(this).parent();

        if (e.type != 'selectFromSlick') {
          // from click or variant image? change main image
          $(this).closest('.gallery').find('.slideshow').slick('slickGoTo', $carouselItem.index());
        } else {
          // change to active state comes from the main slideshow change event
          // show the highlight
          $(this).addClass('selected').parent().siblings().find('a').removeClass('selected'); // adjust thumbnail carousel if not on-screen

          var shelfStart = $carouselItem.parent().children('.active:first').index();
          var shelfEnd = shelfStart + carouselVisibleItemCount - 1;
          var currentIndex = $carouselItem.index();

          if (currentIndex < shelfStart) {
            // selected is to left of shelf - move carousel right to show
            $carouselItem.closest('.owl-carousel').trigger('to.owl.carousel', currentIndex);
          } else if (currentIndex > shelfEnd) {
            // selected is to right of shelf - move carousel left to show
            $carouselItem.closest('.owl-carousel').trigger('to.owl.carousel', Math.max(0, currentIndex - carouselVisibleItemCount + 1));
          }
        }
      }); /// Thumbnail click - beside

      $('.gallery', container).on('click select selectFromSlick', ' .thumbnails:not(.owl-carousel) a', function (e) {
        e.preventDefault();

        if (e.type != 'selectFromSlick') {
          // from click or variant image? change main image
          $(this).closest('.gallery').find('.slideshow').slick('slickGoTo', $(this).index());
        } else {
          // change to active state comes from the main slideshow change event
          $(this).addClass('selected').siblings('.selected').removeClass('selected');
        }
      });
    }
  };

  theme.destroyProductGallery = function (container) {
    $(window).off('.productGallery');
    var $gallery = $('.gallery', container).off('click select selectFromSlick');
    theme.ProductMedia.destroy($gallery);
    $('.slick-slider', container).slick('unslick').off('init beforeChange afterChange');
    $('.owl-carousel', container).each(function () {
      theme.beforeCarouselUnloadEventBlockFix(this);
      $(this).data('owl.carousel').destroy();
    });
  };

  theme.CollectionTemplateSection = new function () {
    this.onSectionLoad = function (target) {
      theme.initToggleTargets();
      theme.classUpTextLinks(target); /// View modes for collection page

      $(target).on('click', '#view-as-tiles', function () {
        if (!$(this).hasClass('active')) {
          $(this).addClass('active');
          $('#view-as-stream').removeClass('active');
          theme.saveGridStreamChoice('grid');
          var $listing = $('.collection-listing-stream').addClass('collection-listing').removeClass('collection-listing-stream');
          $(window).trigger('debouncedresize');
        }

        return false;
      });
      $(target).on('click', '#view-as-stream', function () {
        if (!$(this).hasClass('active')) {
          $(this).addClass('active');
          $('#view-as-tiles').removeClass('active');
          theme.saveGridStreamChoice('stream');
          var $listing = $('.collection-listing').removeClass('collection-listing').addClass('collection-listing-stream'); // reset styling on blocks

          $(window).trigger('debouncedresize');
          $listing.find('.block-inner, .primary-image').removeAttr('style');
        }

        return false;
      }); /// Stream/grid view - saved setting

      if ($('#view-as-stream, #view-as-tiles', target).length > 0 && theme.getGridStreamChoice() != null) {
        if (theme.getGridStreamChoice() == 'stream') {
          $('#view-as-stream').trigger('click');
        } else {
          $('#view-as-tiles').trigger('click');
        }
      } /// Collection sorting


      var $sortBy = $('#sort-by', target);

      if ($sortBy.length > 0) {
        var queryParams = {};

        if (location.search.length) {
          for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
            aKeyValue = aCouples[i].split('=');

            if (aKeyValue.length > 1) {
              queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
            }
          }
        }

        $sortBy.on('change', function () {
          queryParams.sort_by = $(this).val();
          location.search = $.param(queryParams);
        });
      } /// If a tag is active in a group, other tags within that group must be links to that tag only, within that group.


      $('.multi-tag-row .tags', target).each(function () {
        var $active = $(this).find('li.active');
        $(this).find('li:not(.active) a').each(function () {
          var href = $(this).attr('href');
          $active.each(function () {
            var tag = $(this).data('tag');
            href = href.replace('+' + tag, '').replace(tag + '+', ''); //Collection

            href = href.replace('%2B' + tag, '').replace(tag + '%2B', ''); //Vendor
          });
          $(this).attr('href', href);
        });
      }); /// Style dropdowns

      theme.select2.init($('.filters .styled-select select', target));
      theme.ProductBlockManager.loadImages(target);
    };

    this.onSectionUnload = function (target) {
      theme.select2.destroyAllIn(target);
      $('#sort-by', target).off('change');
      $(target).off('click');
      theme.destroyProductGallery(target); // Clear grid/stream preference

      theme.saveGridStreamChoice(null);
    };
  }();
  theme.ProductTemplateSection = new function () {
    this.onSectionLoad = function (target) {
      theme.initToggleTargets();
      theme.classUpTextLinks(target); /// Init store availability if applicable

      if ($('[data-store-availability-container]', target).length) {
        this.storeAvailability = new theme.StoreAvailability($('[data-store-availability-container]', target)[0]);
      } /// Main product dropdown


      $('[name="id"]', target).trigger('optionate');
      theme.initProductGallery(target);
      theme.ProductBlockManager.loadImages(target); // click review rating under title

      $('.theme-product-reviews', target).on('click', 'a', function () {
        $('html,body').animate({
          scrollTop: $($(this).attr('href')).offset().top
        }, 1000);
        return false;
      });
    };

    this.onSectionUnload = function (target) {
      theme.destroyProductGallery(target);
      theme.OptionManager.unloadProductOptions($('[name="id"]', target));
      $('.theme-product-reviews', target).off('click');
      $('.size-chart-link', target).off('click');

      if (this.storeAvailability) {
        this.storeAvailability.onSectionUnload();
      }
    };
  }();
  theme.BlogTemplateSection = new function () {
    this.onSectionLoad = function (target) {
      theme.initToggleTargets();
      theme.classUpTextLinks(target);
    };
  }();
  theme.CartTemplateSection = new function () {
    var _ = this;

    this.updateCart = function (params, successCallback) {
      if (_.cartXhr) {
        _.cartXhr.abort();
      }

      if (_.cartRefreshXhr) {
        _.cartRefreshXhr.abort();
      }

      _.cartXhr = $.ajax({
        type: 'POST',
        url: theme.routes.cart_change_url + '.js',
        data: params,
        dataType: 'json',
        success: function success(data) {
          if (_.cartRefreshXhr) {
            _.cartRefreshXhr.abort();
          } // fetch new html for the page


          _.cartRefreshXhr = $.ajax({
            type: 'GET',
            url: theme.routes.cart_url + '?view=ajax',
            success: function success(data) {
              var toReplace = ['.cart-item-list', '.checkout-subtotal-container__right'];
              var $newDom = $('<div>' + data + '</div>');
              $newDom.find('.fade-in').removeClass('fade-in');

              for (var i = 0; i < toReplace.length; i++) {
                _.replacingContent = true; // to avoid triggering change events when focus is lifted before DOM replacement

                $('[data-section-type="cart-template"] ' + toReplace[i]).html($newDom.find(toReplace[i]).html());
                _.replacingContent = false;
              }

              successCallback();
            },
            error: function error(data) {
              if (data.statusText != 'abort') {
                console.log('Error refreshing page');
                console.log(data);
              }
            },
            complete: function complete() {
              _.cartRefreshXhr = null;
            }
          });
        },
        error: function error(data) {
          if (data.statusText != 'abort') {
            console.log('Error processing update');
            console.log(data);
          }
        },
        complete: function complete() {
          _.cartXhr = null;
        }
      });
    };

    this.onSectionLoad = function (container) {
      theme.classUpTextLinks(container); // terms and conditions checkbox

      if ($('#cartform input#terms', container).length > 0) {
        $(document).on('click.cartTemplateSection', '#cartform [name="checkout"], .additional-checkout-buttons input, a[href*="/checkout"]', function () {
          if ($('#cartform input#terms:checked').length == 0) {
            alert(theme.strings.cart_terms_confirmation);
            return false;
          }
        });
      }

      if ($(container).data('ajax-update')) {
        $(container).on('keyup.cartTemplateSection change.cartTemplateSection changeFromButton.cartTemplateSection', '.cart-item__quantity-input', function (evt) {
          if (_.replacingContent) {
            return;
          }

          if ($(this).data('initial-value') && $(this).data('initial-value') == $(this).val()) {
            return;
          }

          if ($(this).val().length == 0 || $(this).val() == '0') {
            return;
          } // focus on -/+ button or input, depending on source of event


          var toFocusId;

          if (evt.type === 'changeFromButton') {
            toFocusId = $(evt.data).attr('id');
          } else {
            toFocusId = $(this).attr('id');
          }

          _.updateCart({
            line: $(this).data('line'),
            quantity: $(this).val()
          }, function () {
            // after update, set focus
            $('#' + toFocusId).focus();
          });
        });
        $(container).on('click.cartTemplateSection', '.quantity-down, .quantity-up', function (evt) {
          var $input = $(this).closest('.quantity').find('input'),
              step = $input.attr('step') ? parseInt($input.attr('step')) : 1;

          if ($(this).hasClass('quantity-down')) {
            $input.val(parseInt($input.val()) - step).trigger('changeFromButton', {
              data: this
            });
          } else {
            $input.val(parseInt($input.val()) + step).trigger('changeFromButton', {
              data: this
            });
          }

          return false;
        });
      }

      theme.cartNoteMonitor.load($('.checkout-note [name="note"]', container));
      $(container).on('click.cartTemplateSection', 'button[data-toggle-shipping]', function () {
        $('#shipping-calculator').toggle();
        var alt = $(this).data('toggle-html');
        $(this).data('toggle-html', $(this).html());
        $(this).html(alt);
        return false;
      });
    };

    this.onSectionUnload = function (container) {
      $(document).off('.cartTemplateSection');
      $(container).off('.cartTemplateSection');
      theme.cartNoteMonitor.unload($('.checkout-note [name="note"]', container));
    };
  }();
  theme.ImageWithTextOverlaySection = new function () {
    var _ = this;

    _.checkForHeaderHeightSubtraction = function () {
      $('.section-image-with-text-overlay .height--full-minus-header-height').each(function () {
        $(this).height($(window).height() - $('.section-header').height());
      });
    };

    this.onSectionLoad = function (container) {
      $('.height--full', container).each(function () {
        if ($(this).closest('.section-image-with-text-overlay').index() == 0) {
          $(this).addClass('height--full-minus-header-height');

          _.checkForHeaderHeightSubtraction();

          $(window).off('debouncedresize.imageWithTextOverlaySection').on('debouncedresize.imageWithTextOverlaySection', _.checkForHeaderHeightSubtraction);
        }
      });
    };

    this.onSectionUnload = function (container) {
      $(window).off('.imageWithTextOverlaySection');
    };
  }();
  theme.SlideshowSection = new function () {
    var _ = this;

    _.checkForHeaderHeightSubtraction = function () {
      $('.section-slideshow .height--full-minus-header-height').each(function () {
        $(this).height($(window).height() - $('.section-header').height());
      });
    };

    this.onSectionLoad = function (target) {
      $('.slideshow', target).each(function () {
        if ($(this).find('.height--full').length && $(this).closest('.section-slideshow').index() == 0) {
          $(this).addClass('height--full-minus-header-height');

          _.checkForHeaderHeightSubtraction();

          $(window).off('debouncedresize.slideshowSection').on('debouncedresize.slideshowSection', _.checkForHeaderHeightSubtraction);
        }

        $(this).on('init', function () {
          $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
        }).slick({
          autoplay: $(this).data('autoplay'),
          fade: $(this).data('transition') != 'slide',
          speed: $(this).data('transition') == 'instant' ? 0 : 750,
          autoplaySpeed: $(this).data('autoplay-speed') * 1000,
          arrows: $(this).data('navigation') == 'arrows',
          dots: $(this).data('navigation') == 'dots',
          pauseOnHover: $(this).data('transition') != 'instant' || $(this).data('autoplay-speed') > 2,
          // no pause when quick & instant
          infinite: true,
          useTransform: true,
          prevArrow: '<button type="button" class="slick-prev" aria-label="' + theme.strings.previous + '">' + theme.icons.chevronLeft + '</button>',
          nextArrow: '<button type="button" class="slick-next" aria-label="' + theme.strings.next + '">' + theme.icons.chevronRight + '</button>',
          responsive: [{
            breakpoint: 768,
            settings: {
              fade: $(this).data('transition') == 'instant',
              // keep instant gif-style on mobile
              speed: $(this).data('transition') == 'instant' ? 0 : 750,
              arrows: false,
              dots: $(this).data('navigation') != 'none'
            }
          }]
        });
      });
    };

    this.onSectionUnload = function (target) {
      $('.slick-slider', target).slick('unslick').off('init');
      $(window).off('.slideshowSection');
    };

    this.onBlockSelect = function (target) {
      $(target).closest('.slick-slider').slick('slickGoTo', $(target).data('slick-index')).slick('slickPause');
    };

    this.onBlockDeselect = function (target) {
      $(target).closest('.slick-slider').slick('slickPlay');
    };
  }();
  theme.GallerySection = new function () {
    this.onSectionLoad = function (container) {
      var $carouselGallery = $('.gallery--mobile-carousel', container);

      if ($carouselGallery.length) {
        var assessCarouselFunction = function assessCarouselFunction() {
          var isCarousel = $carouselGallery.hasClass('slick-slider'),
              shouldShowCarousel = $(window).width() < 768;

          if (!shouldShowCarousel) {
            $('.lazyload--manual', $carouselGallery).removeClass('lazyload--manual').addClass('lazyload');
          }

          if (isCarousel && !shouldShowCarousel) {
            // Destroy carousel
            // - unload slick
            $carouselGallery.slick('unslick').off('init');
            $carouselGallery.find('a, .gallery__item').removeAttr('tabindex').removeAttr('role'); // - re-row items

            var rowLimit = $carouselGallery.data('grid');
            var $currentRow = null;
            $carouselGallery.find('.gallery__item').each(function (index) {
              if (index % rowLimit === 0) {
                $currentRow = $('<div class="gallery__row">').appendTo($carouselGallery);
              }

              $(this).appendTo($currentRow);
            });
          } else if (!isCarousel && shouldShowCarousel) {
            // Create carousel
            // - de-row items
            $carouselGallery.find('.gallery__item').appendTo($carouselGallery);
            $carouselGallery.find('.gallery__row').remove(); // - init carousel

            $carouselGallery.on('init', function () {
              $('.lazyload--manual', this).removeClass('lazyload--manual').addClass('lazyload');
            }).slick({
              autoplay: false,
              fade: false,
              infinite: true,
              useTransform: true,
              arrows: false,
              dots: true
            });
          }
        };

        assessCarouselFunction();
        $(window).on('debouncedresize.themeSection' + container.id, assessCarouselFunction);
      }
    };

    this.onSectionUnload = function (container) {
      $(window).off('.themeSection' + container.id);
      $('.slick-slider', container).each(function () {
        $(this).slick('unslick').off('init');
      });
    };

    this.onBlockSelect = function (block) {
      var blockSlideIndex = $(block).data('slick-index');
      $(block).closest('.slick-slider').each(function () {
        $(this).slick('slickGoTo', blockSlideIndex);
      });
    };
  }(); // Lightbox

  theme.fbOpts = function () {
    return {
      overlayColor: '#fff',
      padding: 1,
      margin: $(window).width() > 767 ? 40 : 20,
      overlayOpacity: 0.9,
      onComplete: function onComplete() {
        $('#fancybox-wrap').off('mousewheel.fb'); // do not block scrolling
      }
    };
  };

  theme.CustomRowSection = new function () {
    this.onSectionLoad = function (container) {
      theme.classUpTextLinks(container);
      theme.VideoManager.onSectionLoad(container);
    };

    this.onSectionUnload = function (container) {
      theme.VideoManager.onSectionUnload(container);
    };
  }();
  theme.FeaturedCollectionSection = new function () {
    this.onSectionLoad = function (container) {
      theme.loadCarousels(container);
      theme.ProductBlockManager.loadImages(container);
    };

    this.onSectionUnload = function (container) {
      theme.unloadCarousels(container);
    };
  }();
  theme.FeaturedCollectionsSection = new function () {
    this.onSectionLoad = function (container) {
      theme.loadCarousels(container);
      theme.ProductBlockManager.loadImages(container);
    };

    this.onSectionUnload = function (container) {
      theme.unloadCarousels(container);
    };
  }();
  theme.ListCollectionsTemplateSection = new function () {
    this.onSectionLoad = function (container) {
      theme.ProductBlockManager.loadImages(container);
    };
  }();

  theme.applyAjaxToProductForm = function ($form) {
    if (theme.settings.cart_type === 'drawer') {
      $form.filter('[data-ajax-add-to-cart="true"]').each(function () {
        var cartPopupTemplate = ['<div id="cart-summary-overlay" class="cart-summary-overlay">', '<div class="cart-summary-overlay__row-head">', '<div class="cart-summary-overlay__column-image">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_title, '</div>', '</div>', '<div class="cart-summary-overlay__column-item">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_item, '</div>', '</div>', '<div class="cart-summary-overlay__column-price-region">', '<div class="cart-summary-overlay__column-price">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_unit_price, '</div>', '</div>', '<div class="cart-summary-overlay__column-quantity">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_quantity, '</div>', '</div>', '<div class="cart-summary-overlay__column-total">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_total_price, '</div>', '</div>', '</div>', '<div class="cart-summary-overlay__column-subtotal">', '<div class="cart-summary-overlay__column-title">', theme.strings.products_added_notification_subtotal, '</div>', '</div>', '</div>', '<div class="cart-summary-overlay__row-body">', '<div class="cart-summary-overlay__column-image">', '<img src="[[image_url]]" alt="[[encoded-title]]" />', '</div>', '<div class="cart-summary-overlay__column-item">', '<div class="cart-summary-overlay__title">[[title]]</div>', '<div class="cart-summary-overlay__variants">[[variants]]</div>', '<div class="cart-summary-overlay__mobile-price-row">', '<div class="cart-summary-overlay__mobile-unit-price">[[unit_price]]</div>', '<div class="cart-summary-overlay__mobile-quantity">', theme.strings.products_added_notification_quantity, '<span class="cart-summary-overlay__quantity">[[quantity]]</span>', '</div>', '<div class="cart-summary-overlay__mobile-line-price">[[line_price]]</div>', '</div>', '</div>', '<div class="cart-summary-overlay__column-price-region">', '<div class="cart-summary-overlay__column-price">', '<span class="cart-summary-overlay__unit-price">[[unit_price]]</span>', '</div>', '<div class="cart-summary-overlay__column-quantity">', '<span class="cart-summary-overlay__quantity">[[quantity]]</span>', '</div>', '<div class="cart-summary-overlay__column-total">', '<div class="cart-summary-overlay__line-price">[[line_price]]</div>', '</div>', '[[line_discount]]', '</div>', '<div class="cart-summary-overlay__column-subtotal">', '<span class="cart-summary-overlay__subtotal">[[subtotal]]</span>', '<div class="cart-summary-overlay__note">', theme.strings.products_added_notification_shipping_note, '&nbsp;</div>', '</div>', '</div>', '<div class="cart-summary-overlay__actions">', '<a id="shop-more" class="button altcolour" href="#">', theme.strings.products_added_notification_keep_shopping, '</a>', '<a class="button to-cart" href="', theme.routes.cart_url, '">', theme.strings.products_added_notification_cart, '</a>', '</div>', '</div>'].join('');
        var shopifyAjaxAddURL = theme.routes.cart_add_url + '.js';
        var shopifyAjaxCartURL = theme.routes.cart_url + '.js';
        var shopifyAjaxStorePageURL = theme.routes.search_url;
        $(this).on('submit', function (evt) {
          evt.preventDefault();
          var $form = $(this); //Disable add button

          $form.find('input[type="submit"]').attr('disabled', 'disabled').each(function () {
            $(this).data('previous-value', $(this).val());
          }).val(theme.strings.products_product_adding_to_cart); //Hide any existing notifications

          $('#cart-summary-overlay #shop-more').triggerHandler('click'); //Add to cart

          $.post(shopifyAjaxAddURL, $form.serialize(), function (itemData) {
            //Enable add button
            $form.find('input[type="submit"]').removeAttr('disabled').each(function () {
              $btn = $(this); //Set to 'DONE', alter button style, wait a few secs, revert to normal

              $btn.val(theme.strings.products_product_added_to_cart).addClass('inverted');
              window.setTimeout(function () {
                $btn.removeClass('inverted').val($btn.data('previous-value'));
              }, 3000);
            }); //Get our data

            var addedDataJSON = $.parseJSON(itemData); //Get current cart state

            $.get(shopifyAjaxCartURL, function (cartData) {
              var cartDataJSON = $.parseJSON(cartData);
              var addedQty = addedDataJSON.quantity;
              var addedImage = addedDataJSON.image; //Variants require option names, which are not included in the cart

              var productData = theme.OptionManager.getProductData($form);
              var variantHtml = '';

              if (addedDataJSON.variant_title) {
                // catches default variant
                for (var i = 0; i < productData.options.length; i++) {
                  variantHtml += ['<div class="cart-summary-overlay__variant">', '<span class="cart-summary-overlay__variant-option">', productData.options[i].name, '</span>', '<span class="cart-summary-overlay__variant-value">', addedDataJSON.variant_options[i], '</span>', '</div>'].join('');
                }
              }

              if (addedDataJSON.selling_plan_allocation && addedDataJSON.selling_plan_allocation.selling_plan.name) {
                variantHtml += ['<div class="cart-summary-overlay__variant">', '<span class="cart-summary-overlay__variant-value">', addedDataJSON.selling_plan_allocation.selling_plan.name, '</span>', '</div>'].join('');
              }

              var unitPriceHtml = '';

              if (addedDataJSON.original_line_price > addedDataJSON.final_line_price) {
                unitPriceHtml += '<div class="struck-out-price"><span class="theme-money">' + theme.Shopify.formatMoney(addedDataJSON.original_price, theme.money_format) + '</span></div>';
              }

              unitPriceHtml += '<div><span class="theme-money">' + theme.Shopify.formatMoney(addedDataJSON.final_price, theme.money_format) + '</span></div>';
              var linePriceHtml = '';

              if (addedDataJSON.original_line_price != addedDataJSON.final_line_price) {
                linePriceHtml += '<div class="theme-money struck-out-price">' + theme.Shopify.formatMoney(addedDataJSON.original_line_price, theme.money_format) + '</div>';
                linePriceHtml += '<div class="theme-money">' + theme.Shopify.formatMoney(addedDataJSON.final_line_price, theme.money_format) + '</div>';
              } else {
                linePriceHtml += '<span class="theme-money">' + theme.Shopify.formatMoney(addedDataJSON.final_line_price, theme.money_format) + '</span>';
              }

              var lineDiscountHtml = '';

              if (addedDataJSON.line_level_discount_allocations && addedDataJSON.line_level_discount_allocations.length > 0) {
                lineDiscountHtml += '<ul class="cart-discount-list">';

                for (var i = 0; i < addedDataJSON.line_level_discount_allocations.length; i++) {
                  var discount_allocation = addedDataJSON.line_level_discount_allocations[i];
                  lineDiscountHtml += ['<li class="cart-discount cart-discount--inline">', '<span class="cart-discount__label">', '<span class="cart-discount__icon">', theme.icons.label, '</span>', '<span class="cart-discount__title">', discount_allocation.discount_application.title, '</span>', '</span>', '<span class="cart-discount__amount theme-money">', theme.Shopify.formatMoney(discount_allocation.amount, theme.money_format), '</span>', '</li>'].join('');
                }

                lineDiscountHtml += '</ul>';
              }

              var subtotalHtml = '';

              if (cartDataJSON.cart_level_discount_applications && cartDataJSON.cart_level_discount_applications.length > 0) {
                subtotalHtml += '<ul class="cart-discount-list">';

                for (var i = 0; i < cartDataJSON.cart_level_discount_applications.length; i++) {
                  var discount_application = cartDataJSON.cart_level_discount_applications[i];
                  subtotalHtml += ['<li class="cart-discount cart-discount--inline">', '<span class="cart-discount__label">', '<span class="cart-discount__icon">', theme.icons.label, '</span>', '<span class="cart-discount__title">', discount_application.title, '</span>', '</span>', '<span class="cart-discount__amount theme-money">', theme.Shopify.formatMoney(discount_application.total_allocated_amount, theme.money_format), '</span>', '</li>'].join('');
                }

                subtotalHtml += '</ul>';
              }

              subtotalHtml += '<span class="cart-summary-overlay__subtotal-mobile-title">' + theme.strings.products_added_notification_subtotal + ':</span> ';
              subtotalHtml += '<span class="cart-summary-overlay__subtotal-amount theme-money">' + theme.Shopify.formatMoney(cartDataJSON.total_price, theme.money_format) + '</span>'; //Now we have all the data, build the shade

              var cartShadeHTML = cartPopupTemplate;
              cartShadeHTML = cartShadeHTML.replace('[[title]]', addedDataJSON.product_title);
              cartShadeHTML = cartShadeHTML.replace('[[encoded-title]]', addedDataJSON.product_title.replace(/"/g, '&quot;').replace(/&/g, '&amp;'));
              cartShadeHTML = cartShadeHTML.replace('[[variants]]', variantHtml);
              cartShadeHTML = cartShadeHTML.replace(/\[\[quantity\]\]/g, addedQty);
              cartShadeHTML = cartShadeHTML.replace('[[image_url]]', theme.Shopify.formatImage(addedImage, '170x'));
              cartShadeHTML = cartShadeHTML.split('[[unit_price]]').join(unitPriceHtml);
              cartShadeHTML = cartShadeHTML.split('[[line_price]]').join(linePriceHtml);
              cartShadeHTML = cartShadeHTML.split('[[line_discount]]').join(lineDiscountHtml);
              cartShadeHTML = cartShadeHTML.replace('[[subtotal]]', subtotalHtml);
              var $cartShade = $(cartShadeHTML);
              $cartShade.find('#shop-more').bind('click', function () {
                $cartShade.animate({
                  top: -$cartShade.outerHeight()
                }, 500, function () {
                  $(this).remove();
                });
                return false;
              });
              $cartShade.prependTo('body').css('top', -$cartShade.outerHeight()).animate({
                top: 0
              }, 500);
            }, 'html'); //Update header summaries

            $.get(shopifyAjaxStorePageURL, function (data) {
              var cartSummarySelectors = ['#pageheader .cart-summary'];

              for (var i = 0; i < cartSummarySelectors.length; i++) {
                var $newCartObj = $('<div>' + data + '</div>').find(cartSummarySelectors[i]).first();
                var $currCart = $(cartSummarySelectors[i]);
                $currCart.html($newCartObj.html());
              }
            });
          }, 'text').fail(function (data) {
            //Enable add button
            $form.find('input[type="submit"]').removeAttr('disabled').each(function () {
              $(this).val($(this).data('previous-value'));
            }); //Not added, show message

            if (typeof data != 'undefined' && typeof data.status != 'undefined') {
              var jsonRes = $.parseJSON(data.responseText);
              theme.showQuickPopup(jsonRes.description, $form.find('input[type="submit"]:first'));
            } else {
              //Some unknown error? Disable ajax and add the old-fashioned way.
              $form.attr('ajax-add-to-cart', 'false').submit();
            }
          });
        });
      });
      $(window).off('.ajaxAddScroll').on('scroll.ajaxAddScroll', function () {
        // Hide notifications on scroll
        $('#cart-summary-overlay #shop-more').triggerHandler('click');
      });
    }
  };

  theme.removeAjaxFromProductForm = function ($form) {
    $form.off('submit');
  };

  theme.HeaderSection = new function () {
    this.onSectionLoad = function (container) {
      // block focus events targeted at the social icons
      $(container).on('focusin.headerSection focusout.headerSection', '.social-links', function (e) {
        return false;
      }); // asses focus, and handle transitioning between child elements with a timeout

      var searchFocusOutTimeoutId = -1;
      $(container).on('focusin.headerSection focusout.headerSection', '.search-box', function (e) {
        if (e.type == 'focusin') {
          clearTimeout(searchFocusOutTimeoutId);
          $(this).closest('.search-box').addClass('focus');
        } else {
          clearTimeout(searchFocusOutTimeoutId);
          searchFocusOutTimeoutId = setTimeout(function () {
            $(this).closest('.search-box').removeClass('focus');
          }.bind(this), 200);
        }
      }); // Toggle search

      $(container).on('click.headerSection', '.show-search-link, .main-search__close', function (e) {
        if ($('body').toggleClass('show-search').hasClass('show-search')) {
          setTimeout(function () {
            $('.main-search__input:first').focus();
          }, 500);
        } else {
          $('.show-search-link:first').focus();
        }

        return false;
      }); // Close search on escape

      $(container).on('keyup.headerSection', '.main-search__input', function (e) {
        if (e.keyCode == 27) {
          $('.main-search__close').click();
        }
      }); /// Live search

      var $liveSearchContainer = $('.main-search[data-live-search="true"]', container);

      if ($liveSearchContainer.length) {
        var searchTimeoutThrottle = 500,
            searchTimeoutID = -1,
            currReqObj = null,
            showPrice = $liveSearchContainer.data('live-search-price'),
            showVendor = $liveSearchContainer.data('live-search-vendor'),
            includeMeta = $liveSearchContainer.data('live-search-meta'),
            productImageShape = $liveSearchContainer.data('product-image-shape'),
            detailMode = $liveSearchContainer.data('hover-detail-mode'),
            showSoldOutLabel = $liveSearchContainer.data('show-sold-out-label'),
            showSaleLabel = $liveSearchContainer.data('show-sale-label');
        $(container).on('keyup.headerSection change.headerSection', '.main-search__input', function () {
          var $searchContainer = $('.main-search'),
              $resultsBox = $searchContainer.find('.main-search__results'),
              valueToSearch = $(this).val(); //Only search if search string longer than 2, and it has changed

          if (valueToSearch.length > 2 && valueToSearch != $(this).data('oldval')) {
            //Reset previous value
            $(this).data('oldval', valueToSearch); // Kill outstanding ajax request

            if (currReqObj != null) {
              currReqObj.abort();
            } // Kill previous search


            clearTimeout(searchTimeoutID); // Create URL for full search results

            var $form = $(this).closest('form');
            var linkURL = $form.attr('action') + ($form.attr('action').indexOf('?') > -1 ? '&' : '?') + $form.serialize(); //Show loading

            $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--no-results').addClass('main-search--loading');

            if ($('.main-search__results-spinner').length === 0) {
              $resultsBox.html('<div class="main-search__results-spinner"><div class="loading-spinner"></div></div>');
            } // Do next search (in X milliseconds)


            searchTimeoutID = setTimeout(function () {
              var ajaxUrl, ajaxData;

              if (theme.Shopify.features.predictiveSearch) {
                // use the API
                ajaxUrl = theme.routes.search_url + '/suggest.json';
                ajaxData = {
                  "q": valueToSearch,
                  "resources": {
                    "type": $form.find('input[name="type"]').val(),
                    "limit": 8,
                    "options": {
                      "unavailable_products": "last",
                      "fields": includeMeta ? "title,product_type,variants.title,vendor,tag,variants.sku" : "title,product_type,variants.title,vendor"
                    }
                  }
                };
              } else {
                // use the theme template fallback
                ajaxUrl = linkURL + '&view=json';
                ajaxData = null;
              } //Ajax hit on search page


              currReqObj = $.ajax({
                url: ajaxUrl,
                data: ajaxData,
                dataType: "json",
                success: function success(response) {
                  currReqObj = null;
                  $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--no-results');
                  $resultsBox.empty();
                  var $resultsProducts = $('<div class="main-search__results__products collection-listing"><div class="product-list product-list--per-row-4 product-list--image-shape-natural"></div></div>');
                  var $resultsPages = $('<div class="main-search__results__pages">');

                  if (response.resources.results.products) {
                    for (var i = 0; i < response.resources.results.products.length; i++) {
                      var result = response.resources.results.products[i];
                      var $item = $(['<div class="product-block main-search-result">', '<div class="block-inner">', '<div class="block-inner-inner">', '<div class="image-cont">', '<a class="product-link">', '<div class="image-label-wrap">', '<div class="primary-image"></div>', '</div>', '</a>', '</div>', '<div class="product-info">', '<div class="inner">', '<div class="innerer">', '<a class="product-link">', '<div class="product-block__title"></div>', '<div class="dash">-</div>', '</a>', '</div>', '</div>', '</div>', '</div>', '</div>', '</div>'].join(''));
                      $item.addClass('detail-mode-' + detailMode);
                      $item.find('.product-link').attr('href', result.url);

                      if (result.featured_image && result.featured_image.url) {
                        var $img = $('<div class="rimage-outer-wrapper"><div class="rimage-wrapper lazyload--placeholder"><img class="rimage__image lazyload fade-in"></div></div>').appendTo($item.find('.primary-image'));
                        $img.find('.rimage-wrapper').css('padding-top', 1 / Math.max(result.featured_image.aspect_ratio, 0.6) * 100 + '%');
                        $img.find('.rimage__image').attr('data-src', theme.Shopify.formatImage(result.featured_image.url, '512x') + ' 512w');
                      }

                      var $itemInfoCont = $item.find('.product-info .product-link');
                      $itemInfoCont.find('.product-block__title').html(result.title);

                      if (showVendor) {
                        $('<div class="vendor">').html(result.vendor).prependTo($itemInfoCont);
                      }

                      if (showPrice) {
                        var $price = $('<div class="product-price">').appendTo($itemInfoCont);

                        if (result.price_max != result.price_min) {
                          $('<span class="product-price__from">').html(theme.strings.products_listing_from).appendTo($price);
                          $price.append(' ');
                        }

                        if (parseFloat(result.compare_at_price_min) > parseFloat(result.price_min)) {
                          $('<span class="product-price__amount product-price__amount--on-sale theme-money">').html(theme.Shopify.formatMoney(result.price_min, theme.money_format)).appendTo($price);
                          $price.append(' ');
                          $('<span class="product-price__compare theme-money">').html(theme.Shopify.formatMoney(result.compare_at_price_min, theme.money_format)).appendTo($price);
                        } else {
                          $('<span class="product-price__amount theme-money">').html(theme.Shopify.formatMoney(result.price_min, theme.money_format)).appendTo($price);
                        }
                      }

                      if (showSoldOutLabel && !result.available) {
                        $('<span class="productlabel soldout"><span></span></span>').appendTo($item.find('.image-label-wrap')).find('span').html(theme.strings.products_labels_sold_out);
                      } else if (showSaleLabel && parseFloat(result.compare_at_price_min) > parseFloat(result.price_min)) {
                        $('<span class="productlabel sale"><span></span></span>').appendTo($item.find('.image-label-wrap')).find('span').html(theme.strings.products_labels_sale);
                      }

                      $resultsProducts.children().append($item);
                    }
                  }

                  if (response.resources.results.pages) {
                    for (var i = 0; i < response.resources.results.pages.length; i++) {
                      var result = response.resources.results.pages[i];
                      var $item = $('<a class="main-search-result main-search-result--page">').attr('href', result.url);
                      $('<div class="main-search-result__text">').html(result.title).appendTo($item);
                      $resultsPages.append($item);
                    }
                  }

                  if (response.resources.results.articles) {
                    for (var i = 0; i < response.resources.results.articles.length; i++) {
                      var result = response.resources.results.articles[i];
                      var $item = $('<a class="main-search-result main-search-result--article">').attr('href', result.url);
                      $('<div class="main-search-result__text">').html(result.title).appendTo($item);
                      $resultsPages.append($item);
                    }
                  }

                  $searchContainer.removeClass('main-search--loading');
                  var areProducts = $resultsProducts.find('.main-search-result:first').length > 0,
                      arePages = $resultsPages.find('.main-search-result:first').length > 0;

                  if (areProducts || arePages) {
                    // Numerous results
                    $searchContainer.addClass('main-search--has-results');
                    $searchContainer.toggleClass('main-search--results-on-multiple-lines', $resultsProducts.find('.product-block').length > 4);

                    if (areProducts) {
                      $resultsBox.append($resultsProducts);
                    }

                    if (arePages) {
                      $('<h6 class="main-search-result__heading">').html(theme.strings.general_quick_search_pages).prependTo($resultsPages);
                      $resultsBox.append($resultsPages);
                    }

                    $('<a class="main-search__results-all-link button altcolour">').attr('href', linkURL).html(theme.strings.layout_live_search_see_all).appendTo($resultsBox);
                  } else {
                    // No results - show nothing
                    $searchContainer.addClass('main-search--no-results');
                    $('<div class="main-search__empty-message">').html(theme.strings.general_quick_search_no_results).appendTo($resultsBox);
                  }
                },
                error: function error(response) {
                  console.log('Error fetching results');
                }
              });
            }, searchTimeoutThrottle);
          } else if ($(this).val().length <= 2) {
            // Deleted text? Abandon search-in-progress
            $(this).data('oldval', valueToSearch);

            if (currReqObj != null) {
              currReqObj.abort();
            }

            clearTimeout(searchTimeoutID); // Clear results

            $searchContainer.removeClass('main-search--has-results main-search--results-on-multiple-lines main-search--loading');
            $resultsBox.empty();
          }
        });
      } // account / localization


      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      }); // nav

      theme.Navigation.init({
        nav: $('.navigation--main', container),
        proxyTier1Nav: $('.navigation--left', container)
      });

      if (theme.inlineNavigationCheck) {
        theme.inlineNavigationCheck();
        $(window).on('debouncedresize.headerSection', theme.inlineNavigationCheck);
      }
    };

    this.onSectionUnload = function (container) {
      $(container).off('.headerSection');
      $(window).off('.headerSection');
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
      theme.Navigation.destroy($('.navigation', container), $('.navigation--left', container));
    };
  }();
  theme.FooterSection = new function () {
    this.onSectionLoad = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.onSectionUnload = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }();
  theme.AnnouncementBarSection = new function () {
    this.onSectionLoad = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure', new theme.Disclosure($(this)));
      });
    };

    this.onSectionUnload = function (container) {
      $('.disclosure', container).each(function () {
        $(this).data('disclosure').unload();
      });
    };
  }(); // Manage option dropdowns

  theme.productData = {};
  theme.OptionManager = new function () {
    var _ = this;

    _._getVariantOptionElement = function (variant, $container) {
      return $container.find('select[name="id"] option[value="' + variant.id + '"]');
    };

    _.selectors = {
      container: '.product-detail',
      gallery: '.gallery',
      priceArea: '.price-area',
      submitButton: 'input[type=submit], button[type=submit]',
      multiOption: '.option-selectors'
    };
    _.strings = {
      priceNonExistent: theme.strings.products_variant_non_existent,
      buttonDefault: theme.strings.products_product_add_to_cart,
      buttonNoStock: theme.strings.products_variant_no_stock,
      buttonNoVariant: theme.strings.products_variant_non_existent,
      unitPriceSeparator: theme.strings.products_product_unit_price_separator,
      inventoryNotice: theme.strings.onlyXLeft
    };

    _._getString = function (key, variant) {
      var string = _.strings[key];

      if (variant) {
        string = string.replace('[PRICE]', '<span class="theme-money">' + theme.Shopify.formatMoney(variant.price, theme.money_format) + '</span>');
      }

      return string;
    };

    _.getProductData = function ($form) {
      var productId = $form.data('product-id');
      var data = null;

      if (!theme.productData[productId]) {
        theme.productData[productId] = JSON.parse(document.getElementById('ProductJson-' + productId).innerHTML);
      }

      data = theme.productData[productId];

      if (!data) {
        console.log('Product data missing (id: ' + $form.data('product-id') + ')');
      }

      return data;
    };

    _.getBaseUnit = function (variant) {
      return variant.unit_price_measurement.reference_value === 1 ? variant.unit_price_measurement.reference_unit : variant.unit_price_measurement.reference_value + variant.unit_price_measurement.reference_unit;
    }, _.addVariantUrlToHistory = function (variant) {
      if (variant) {
        var newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?variant=' + variant.id;
        window.history.replaceState({
          path: newurl
        }, '', newurl);
      }
    };

    _.updateSku = function (variant, $container) {
      $container.find('.sku .sku__value').html(variant ? variant.sku : '');
      $container.find('.sku').toggleClass('sku--no-sku', !variant || !variant.sku);
    };

    _.updateBarcode = function (variant, $container) {
      $container.find('.barcode .barcode__value').html(variant ? variant.barcode : '');
      $container.find('.barcode').toggleClass('barcode--no-barcode', !variant || !variant.barcode);
    };

    _.updateInventoryNotice = function (variant, $container) {
      var inventoryData = _._getVariantOptionElement(variant, $container).data('inventory');

      if (inventoryData) {
        $container.find('.product-inventory-notice').removeClass('product-inventory-notice--no-inventory').html(_._getString('inventoryNotice').replace('[[ quantity ]]', inventoryData));
      } else {
        $container.find('.product-inventory-notice').addClass('product-inventory-notice--no-inventory').empty();
      }
    };

    _.updateBackorder = function (variant, $container) {
      var $backorder = $container.find('.backorder');

      if ($backorder.length) {
        if (variant && variant.available) {
          if (variant.inventory_management && _._getVariantOptionElement(variant, $container).data('stock') == 'out') {
            var productData = _.getProductData($backorder.closest('form'));

            $backorder.find('.backorder__variant').html(productData.title + (variant.title.indexOf('Default') >= 0 ? '' : ' - ' + variant.title));
            $backorder.show();
          } else {
            $backorder.hide();
          }
        } else {
          $backorder.hide();
        }
      }
    };

    _.updatePrice = function (variant, $container) {
      var $priceArea = $container.find(_.selectors.priceArea);
      $priceArea.removeClass('on-sale');

      if (variant) {
        var $newPriceArea = $('<div>');
        var $price = $('<div class="price h4-style">').appendTo($newPriceArea);
        $('<span class="current-price theme-money">').html(theme.Shopify.formatMoney(variant.price, theme.money_format)).appendTo($price);

        if (variant.compare_at_price > variant.price) {
          $price.append(' ');
          $('<span class="was-price theme-money">').html(theme.Shopify.formatMoney(variant.compare_at_price, theme.money_format)).appendTo($price);
          $price.addClass('on-sale');
        }

        if (variant.unit_price_measurement) {
          var $newUnitPriceArea = $('<div class="unit-price">').appendTo($newPriceArea);
          $('<span class="unit-price__price theme-money">').html(theme.Shopify.formatMoney(variant.unit_price, theme.money_format)).appendTo($newUnitPriceArea);
          $('<span class="unit-price__separator">').html(_._getString('unitPriceSeparator')).appendTo($newUnitPriceArea);
          $('<span class="unit-price__unit">').html(_.getBaseUnit(variant)).appendTo($newUnitPriceArea);
        }

        $priceArea.html($newPriceArea.html());
      } else {
        $priceArea.html(_._getString('priceNonExistent', variant));
      }
    };

    _._updateButtonText = function ($button, string, variant) {
      $button.each(function () {
        var newVal;
        newVal = _._getString('button' + string, variant);

        if (newVal !== false) {
          if ($(this).is('input')) {
            $(this).val(newVal);
          } else {
            $(this).html(newVal);
          }
        }
      });
    };

    _.updateButtons = function (variant, $container) {
      var $button = $container.find(_.selectors.submitButton);

      if (variant && variant.available == true) {
        $button.removeAttr('disabled');

        _._updateButtonText($button, 'Default', variant);
      } else {
        $button.attr('disabled', 'disabled');

        if (variant) {
          _._updateButtonText($button, 'NoStock', variant);
        } else {
          _._updateButtonText($button, 'NoVariant', variant);
        }
      }
    };

    _.updateContainerStatusClasses = function (variant, $container) {
      $container.toggleClass('variant-status--unavailable', variant && !variant.available);
      $container.toggleClass('variant-status--backorder', variant && variant.available && variant.inventory_management && _._getVariantOptionElement(variant, $container).data('stock') == 'out');
      $container.toggleClass('variant-status--on-sale', variant && variant.available && variant.compare_at_price > variant.price);
    };

    _.initProductOptions = function (originalInput) {
      $(originalInput).not('.theme-init').addClass('theme-init').each(function () {
        var $originalInput = $(this);

        if ($originalInput.is('select')) {
          var productData = _.getProductData($originalInput.closest('form')); // change state for original dropdown


          $originalInput.on('change.themeProductOptions firstrun.themeProductOptions', function (e, variant) {
            if ($(this).is('input[type=radio]:not(:checked)')) {
              return; // handle radios - only update for checked
            }

            var variant = variant;

            if (!variant && variant !== false) {
              for (var i = 0; i < productData.variants.length; i++) {
                if (productData.variants[i].id == $(this).val()) {
                  variant = productData.variants[i];
                }
              }
            }

            var $container = $(this).closest(_.selectors.container); // update price

            _.updatePrice(variant, $container); // update buttons


            _.updateButtons(variant, $container); // emit an event to broadcast the variant update


            $(window).trigger('cc-variant-updated', {
              variant: variant,
              product: productData
            }); // variant images

            if (variant && variant.featured_media) {
              $container.find(_.selectors.gallery).trigger('variantImageSelected', variant);
            } // extra details


            _.updateBarcode(variant, $container);

            _.updateSku(variant, $container);

            _.updateInventoryNotice(variant, $container);

            _.updateBackorder(variant, $container);

            _.updateContainerStatusClasses(variant, $container); // variant urls


            var $form = $(this).closest('form');

            if ($form.data('enable-history-state') && e.type == 'change') {
              _.addVariantUrlToHistory(variant);
            } // allow other things to hook on


            $(this).trigger('variantChanged', variant);
          }); // split-options wrapper

          $originalInput.closest(_.selectors.container).find(_.selectors.multiOption).on('change.themeProductOptions', 'select', function () {
            var selectedOptions = [];
            $(this).closest(_.selectors.multiOption).find('select').each(function () {
              selectedOptions.push($(this).val());
            }); // find variant

            var variant = false;

            for (var i = 0; i < productData.variants.length; i++) {
              var v = productData.variants[i];
              var matchCount = 0;

              for (var j = 0; j < selectedOptions.length; j++) {
                if (v.options[j] == selectedOptions[j]) {
                  matchCount++;
                }
              }

              if (matchCount == selectedOptions.length) {
                variant = v;
                break;
              }
            } // trigger change


            if (variant) {
              $originalInput.val(variant.id);
            }

            $originalInput.trigger('change', variant);
          }); // first-run

          $originalInput.trigger('firstrun');
        } // ajax


        theme.applyAjaxToProductForm($originalInput.closest('form'));
      });
    };

    _.unloadProductOptions = function (originalInput) {
      $(originalInput).removeClass('theme-init').each(function () {
        $(this).trigger('unloading').off('.themeProductOptions');
        $(this).closest(_.selectors.container).find(_.selectors.multiOption).off('.themeProductOptions');
        theme.removeAjaxFromProductForm($(this).closest('form'));
      });
    };
  }();
  theme.owlCarouselEventList = ['to', 'next', 'prev', 'destroy', 'initialized', 'resized', 'refreshed'].join('.owl.carousel ') + '.owl.carousel';

  theme.beforeCarouselLoadEventBlockFix = function (carouselEls) {
    $(carouselEls).on(theme.owlCarouselEventList, function (evt) {
      evt.stopPropagation();
    });
  };

  theme.beforeCarouselUnloadEventBlockFix = function (carouselEls) {
    $(carouselEls).off(theme.owlCarouselEventList);
  };

  theme.loadCarousels = function (container) {
    /// Carousels
    $('.carousel', container).each(function () {
      var $this = $(this);

      function getTotalProductBlockWidth() {
        var productBlockTotalWidth = 0;
        $this.find($this.hasClass('owl-loaded') ? '.owl-item:not(.cloned)' : '.product-block').each(function () {
          productBlockTotalWidth += $(this).outerWidth(true);
        });
        return productBlockTotalWidth;
      } // next & prev arrows


      $this.closest('.collection-slider').on('click.themeCarousel', '.prev, .next', function (e) {
        e.preventDefault();
        var carousel = $(this).closest('.collection-slider').find('.owl-carousel').data('owl.carousel');

        if ($(this).hasClass('prev')) {
          carousel.prev();
        } else {
          carousel.next();
        }
      }); // create options

      var carouselOptions, isLooping;
      var fixedMode = !$(this).closest('.container--no-max').length;
      $this.toggleClass('carousel--fixed-grid-mode', fixedMode);

      if (fixedMode) {
        var desktopNumPerRow = parseInt($(this)[0].className.match(/per-row-(.)/)[1]);
        carouselOptions = {
          margin: 0,
          loop: false,
          autoWidth: false,
          items: 5,
          center: false,
          nav: false,
          dots: false,
          responsive: {
            0: {
              items: desktopNumPerRow < 4 ? 1 : 2
            },
            480: {
              items: Math.min(2, desktopNumPerRow - 2)
            },
            767: {
              items: desktopNumPerRow - 1
            },
            1000: {
              items: desktopNumPerRow
            }
          }
        };
      } else {
        isLooping = getTotalProductBlockWidth() > $this.width();
        carouselOptions = {
          margin: 0,
          loop: isLooping,
          autoWidth: true,
          items: Math.min($this.children().length, 8),
          center: true,
          nav: false,
          dots: false
        };
      } // init carousel


      var loadCarousel = function loadCarousel() {
        // remove data-src as not in correct format for Owl to parse
        $this.find('[data-src]').each(function () {
          $(this).attr('data-src-temp', $(this).attr('data-src')).removeAttr('data-src');
        }); // fix for event propagation in nested owl carousels

        theme.beforeCarouselLoadEventBlockFix($this); // run after carousel is initialised

        $this.on('initialized.owl.carousel', function () {
          // restore data-src
          $this.find('[data-src-temp]').each(function () {
            $(this).attr('data-src', $(this).attr('data-src-temp')).removeAttr('data-src-temp');
          }); // lazysizes

          $this.find('.lazyload--manual').removeClass('lazyload--manual').addClass('lazyload'); // ensure clones are processed from scratch

          theme.ProductBlockManager.loadImages($this.closest('[data-section-type]')); // recalculate widths, after the above's async calls

          setTimeout(function () {
            $this.data('owl.carousel').invalidate('width');
            $this.trigger('refresh.owl.carousel');
          }, 10);
        }); // run after carousel is initialised or resized

        $this.on('initialized.owl.carousel resized.owl.carousel', function (evt) {
          // only loop if items do not all fit on screen, in non-fixed mode
          if (!fixedMode && evt.type == 'resized') {
            var shouldLoop = getTotalProductBlockWidth() > $this.width();

            if (shouldLoop != isLooping) {
              // destroy and rebuild carousel with appropriate loop setting
              carouselOptions.loop = shouldLoop;
              isLooping = shouldLoop; // destroy function

              $(evt.target).data('owl.carousel').destroy(); // build again

              $(evt.target).owlCarousel(carouselOptions); // do no more in this callback

              return;
            }
          } // layout fixes


          setTimeout(function () {
            // fixes
            var currentWidth = $this.find('.owl-stage').width();
            var stageIsPartiallyOffScreen = currentWidth > $this.width();

            if (stageIsPartiallyOffScreen) {
              // more elements than fit in viewport
              // resize stage to avoid rounding-error wrapping
              var newWidth = 0;
              $this.find('.owl-item').each(function () {
                newWidth += $(this).outerWidth(true) + 1;
              });
              $this.find('.owl-stage').css({}).removeClass('owl-stage--items-fit');
            } else {
              // all elements fit inside viewport
              // centre-align using css, if not full
              $this.find('.owl-stage').addClass('owl-stage--items-fit').css({});
            } // previous/next button visibility


            $this.closest('.collection-slider').find('.prev, .next').toggleClass('owl-btn-disabled', !stageIsPartiallyOffScreen);
          }, 10);
        }); // run when the contents change, for any reason

        theme.carouselInputIncrementer = theme.carouselInputIncrementer || 0;
        $this.on('refreshed.owl.carousel', function () {
          // set a11y attrs to avoid clone items giving duplication errors
          $('.owl-item', this).removeAttr('aria-hidden');
          $('.owl-item.cloned', this).attr('aria-hidden', 'true').each(function () {
            theme.carouselInputIncrementer++;
            var uniquenessSuffix = '_' + theme.carouselInputIncrementer;
            $(this).find('form[id]:not([data-id-altered]), :input[id]:not([data-id-altered])').each(function () {
              $(this).attr('id', $(this).attr('id') + uniquenessSuffix);
            }).attr('data-id-altered', true);
            $(this).find('label[for]:not([data-id-altered])').each(function () {
              $(this).attr('for', $(this).attr('for') + uniquenessSuffix);
            }).attr('data-id-altered', true);
          });
        }).addClass('owl-carousel').owlCarousel(carouselOptions);
      };

      loadCarousel();
    });
  };

  theme.unloadCarousels = function (container) {
    $('.collection-slider', container).off('.themeCarousel');
    $('.slick-slider', container).slick('unslick');
    theme.beforeCarouselUnloadEventBlockFix($('.owl-carousel', container));
    $('.owl-carousel', container).each(function () {
      $(this).data('owl.carousel').destroy();
    });
  };

  theme.saveGridStreamChoice = function (type) {
    var cfg = {
      expires: 1,
      path: '/',
      domain: window.location.hostname
    };
    $.cookie('gridstream', type, cfg);
  };

  theme.getGridStreamChoice = function () {
    return $.cookie('gridstream');
  }; // Enables any images inside a container


  theme.awakenImagesFromSlumber = function ($cont) {
    $cont.find('.lazyload--manual:not(.lazyload)').addClass('lazyload');
  }; // Process product block layout


  theme.ProductBlockManager = new function () {
    var _ = this;

    _.loadImages = function (container) {
      var container = container;

      if (typeof container === 'undefined') {
        container = $('body');
      }

      _.afterImagesResized(container);
    };

    _.afterImagesResized = function (container) {
      var container = container;

      if (typeof container === 'undefined') {
        container = $('body');
      } // All titles must line up


      $('.collection-listing .product-list.product-list--image-shape-natural', container).each(function () {
        if ($(window).width() >= 768 || $(this).closest('.carousel').length > 0) {
          var tallest = 0;
          $(this).find('.product-block.detail-mode-permanent .image-cont .primary-image img').each(function () {
            if ($(this).height() > tallest) tallest = $(this).height();
          });
          $(this).find('.product-block.detail-mode-permanent .image-cont .primary-image').css('min-height', tallest);
        } else {
          $(this).find('.product-block.detail-mode-permanent .image-cont .primary-image').css('min-height', '');
        }
      }); // undo for list view

      $('.collection-listing-stream .product-list .product-block.detail-mode-permanent .image-cont .primary-image').css('min-height', '');

      _.alignProductBlockHeights(container);
    };

    _.alignProductBlockHeights = function (container) {
      var container = container;

      if (typeof container === 'undefined') {
        container = $('body');
      } // All product blocks must be the same height, for quick-buy alignment


      $('.collection-listing .product-list', container).each(function () {
        if ($(window).width() >= 768 || $(this).closest('.carousel').length > 0) {
          var tallest = 0;
          $(this).find('.product-block .block-inner .block-inner-inner').each(function () {
            if ($(this).height() > tallest) tallest = $(this).height();
          });
          $(this).find('.product-block .block-inner').css('min-height', tallest);
        } else {
          $(this).find('.product-block .block-inner').css('min-height', '');
        }
      });
    };
  }();

  theme.initToggleTargets = function (container) {
    $('a[data-toggle-target]:not(.toggle-init)', container).addClass('toggle-init').each(function () {
      var $target = $($(this).data('toggle-target'));
      $(this).find('.state').html($target.is(':visible') && !$target.hasClass('height-hidden') ? '-' : '+');
    });
  }; // Style any text-only links nicely


  theme.classUpTextLinks = function (container) {
    $('.user-content a:has(img)', container).addClass('image-link');
  }; /// Select2 with swatches


  theme.select2 = {
    transitionOutDelay: 250,
    // match CSS transition for transition out
    init: function init($els, config) {
      var standardSelectOptions = {
        minimumResultsForSearch: Infinity,
        width: 'computedstyle'
      };
      var swatchSelectOptions = {
        minimumResultsForSearch: Infinity,
        templateResult: theme.select2.swatchSelect2OptionTemplate,
        templateSelection: theme.select2.swatchSelect2OptionTemplate,
        width: 'computedstyle'
      };

      if (typeof config !== 'undefined') {
        standardSelectOptions = $.extend(standardSelectOptions, config);
        swatchSelectOptions = $.extend(swatchSelectOptions, config);
      }

      $els.not('.select2-hidden-accessible').each(function () {
        // init
        $(this).select2($(this).data('colour-swatch') ? swatchSelectOptions : standardSelectOptions);
      }).on('select2:open', function (e) {
        // transition in
        var $resCon = $(this).data('select2').$results.closest('.select2-dropdown').addClass('select2-dropdown--pre-reveal');
        setTimeout(function () {
          $resCon.addClass('select2-dropdown--enable-trans');
          setTimeout(function () {
            $resCon.removeClass('select2-dropdown--pre-reveal');
          }, 10);
        }, 10);
      }).on('select2:closing', function (e) {
        // handle transitions
        var $select = $(this);
        var $resCon = $select.data('select2').$results.closest('.select2-dropdown'); // ensure no other transitions in progress

        clearTimeout($select.data('select2TransOutTimeoutId')); // first time through, begin transition and trigger again

        if (!$resCon.hasClass('select2-dropdown--pre-close')) {
          $resCon.addClass('select2-dropdown--pre-close');
          $select.data('select2TransOutTimeoutId', setTimeout(function () {
            $select.select2('close');
          }, theme.select2.transitionOutDelay));
          return false;
        }
      }).on('select2:close', function (e) {
        // reset transitions
        $(this).data('select2').$results.closest('.select2-dropdown').removeClass('select2-dropdown--enable-trans select2-dropdown--pre-close');
      });
    },
    destroyAllIn: function destroyAllIn($container) {
      theme.select2.destroy($('select[data-select2-id]', $container));
    },
    destroy: function destroy($els) {
      $els.select2('destroy').off('select2:open select2:closing select2:close');
    },
    swatchSelect2OptionTemplate: function swatchSelect2OptionTemplate(state) {
      if (state.id) {
        var colourKey = removeDiacritics(state.id).toLowerCase().replace(/'/g, '').replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/-*$/, '');
        return $(['<div class="swatch-option">', '<span class="swatch-option__nugget bg-', colourKey, '"></span>', '<span class="swatch-option__label">', state.text, '</span>', '</div>'].join(''));
      } else {
        return $(['<div class="swatch-option swatch-option--all">', '<span class="swatch-option__label">', state.text, '</span>', '</div>'].join(''));
      }
    }
  }; // dom ready

  $(function ($) {
    var $ = $; // keep this ref local

    $(document).on('keyup.themeTabCheck', function (evt) {
      if (evt.keyCode === 9) {
        $('body').addClass('tab-used');
        $(document).off('keyup.themeTabCheck');
      }
    }); //Return elements that have an ancestor/parent matching the supplied selector

    $.fn.hasAncestor = function (a) {
      return this.filter(function () {
        return $(this).closest(a).length > 0;
      });
    }; //Side up and remove


    $.fn.slideUpAndRemove = function (speed) {
      if (typeof speed == 'undefined') speed = 200;
      $(this).each(function () {
        $(this).slideUp(speed, function () {
          $(this).remove();
        });
      });
    }; /// Reusable function to expand/contract a div


    $(document).on('click', 'a[data-toggle-target]', function (e) {
      var $target = $($(this).data('toggle-target'));

      if ($target.hasClass('height-hidden')) {
        $target.hide().removeClass('height-hidden');
      }

      $(this).find('.state').html($target.is(':visible') ? '+' : '-');
      $target.slideToggle(200);
      e.preventDefault();
    }); //Redirect dropdowns

    $(document).on('change', 'select.navdrop', function () {
      window.location = $(this).val();
    }); //General purpose lightbox

    $('a[rel="fancybox"]').fancybox($.extend({}, theme.fbOpts(), {
      titleShow: false
    })); /// Mobile nav

    $(document).on('click', '.mobile-nav-toggle', function (e) {
      e.preventDefault();
      $('body').toggleClass('reveal-mobile-nav');
    }); /// General window shade

    $('<a href="#" class="page-shade" aria-label="' + theme.strings.general_navigation_menu_toggle_aria_label + '"></a>').on('click', function () {
      $('body').removeClass('reveal-mobile-nav show-search');
      return false;
    }).appendTo('body');

    if (theme.settings.prod_thumb_detail_show) {
      // utility function for quickbuy (closes all quickbuys in passed blocks, in a collection grid)
      var contractDetail = function contractDetail($blocks, speed) {
        if ($blocks.length > 0) {
          $blocks.removeClass('expanded');
          $blocks.find('.quickbuy-container').stop().animate({
            height: 0
          }, speed, function () {
            $(this).find('.inner').empty();
          });
          $blocks.stop().each(function () {
            $(this).animate({
              paddingBottom: 0
            }, speed);
          });
        }
      }; // quick buy - managing slide-down quickbuy in both grids and carousels


      //You also need to know where to scroll to
      var saveCollectionPageData = function saveCollectionPageData() {
        $('.collection-listing-stream .product-block').each(function () {
          $(this).data('offsetTop', $(this).offset().top);
        });
        $('.collection-listing').each(function () {
          var $blocks = $(this).find('.product-block');
          if ($blocks.length <= 1) return true; // Skip for empty colls

          var row = 0;
          var currTop = 0; //Heights are fixed. Check two in case somebody has expanded one...

          var blockHeight = Math.min($blocks.first().outerHeight(), $($blocks[1]).outerHeight());
          var blockPageOffset = $blocks.first().offset().top;
          $blocks.each(function (index) {
            var currOffsetTop = $(this).offset().top;

            if (index == 0) {
              currTop = currOffsetTop;
            } else {
              if (currOffsetTop > currTop) {
                row++;
                currTop = currOffsetTop;
              }
            }

            $(this).data({
              offsetTop: blockPageOffset + row * blockHeight
            });
          });
        });
      }; //End of code specific to collection-page slide-downs


      var droppyDownAnimSpeed = 500;
      $(document).on('click', '.product-list .product-block:not(.collection-block):not(.main-search-result) .product-link:not(product-link--no-qb)', function () {
        var pageWidth = $(window).width(),
            productUrl = $(this).attr('href'); //Only show dropdown if screen is large enough for it to be useful

        if (pageWidth > 767) {
          // cancel current request if one exists
          if (theme.currentQuickbuyRequest) {
            theme.currentQuickbuyRequest.abort();
          }

          var $block = $(this).closest('.product-block'),
              $detailCont = null,
              $quickbuyCont = null,
              $slider = $(this).closest('.collection-slider'),
              $sliderRow = null; // do different things if it's inside a slideshow

          if ($slider.length > 0) {
            $sliderRow = $slider.closest('.collection-slider-row'); // slider without detail

            if ($sliderRow.find('.quickbuy-container').length === 0) {
              return;
            }

            $quickbuyCont = $sliderRow.find('.quickbuy-container');
          } else {
            $quickbuyCont = $block.find('.quickbuy-container');
          }

          $detailCont = $quickbuyCont.find('.inner'); // toggle active class on block

          if ($block.toggleClass('expanded').hasClass('expanded')) {
            // expanding
            if ($slider.length > 0) {
              // if another block is expanded, remove its expanded class
              var noneExpanded = $slider.find('.product-block.expanded').not($block).removeClass('expanded').length === 0; // if expanding from empty, set initial detail container height to 0

              if (noneExpanded) {
                $quickbuyCont.height(0);
              } else {
                // unload existing quickbuy
                theme.OptionManager.unloadProductOptions($('[name="id"]', $quickbuyCont));
                $('.gallery', $quickbuyCont).off(this.namespace);
                $('.slideshow', $quickbuyCont).slick('unslick');
              } // what to adjust when details change size


              $quickbuyCont.off('changedsize').on('changedsize', function () {
                $quickbuyCont.stop().animate({
                  height: $detailCont.outerHeight()
                }, droppyDownAnimSpeed);
              });
            } else {
              // close expanded siblings
              var $expandedSiblings = $block.siblings('.expanded');
              $expandedSiblings.each(function () {
                contractDetail($(this), 0); // unload existing quickbuy

                theme.OptionManager.unloadProductOptions($('[name="id"]', this));
                theme.destroyProductGallery(this);
              }); // what do adjust when details change size

              $quickbuyCont.off('changedsize').on('changedsize', function () {
                // check expanded class in case it's mid close transition
                if ($block.hasClass('expanded')) {
                  var targetHeight = $detailCont.outerHeight(); // slide down instantly if a neighbour is expanded

                  var speed = $expandedSiblings.length > 0 ? 0 : droppyDownAnimSpeed;
                  $block.stop().animate({
                    paddingBottom: targetHeight + 20
                  }, speed); // extra for gap underneath

                  $quickbuyCont.stop().animate({
                    height: targetHeight
                  }, speed);
                }
              });
            } // a little hack to make sure everything lines up


            if (window.SPR) {
              theme.ProductBlockManager.alignProductBlockHeights();
            } // add spinner


            $detailCont.html('<div class="loading-spinner"></div>');
            $quickbuyCont.trigger('changedsize'); // load in content

            var url = $(this).attr('href');
            url += url.indexOf('?') >= 0 ? '&view=_lightbox' : '?view=_lightbox';
            theme.currentQuickbuyRequest = $.get(url, function (response) {
              var $newDetail = $('<div>' + response + '</div>').find('.product-detail'); // convert to quickbuy content

              $newDetail.find('.more').attr('href', productUrl);
              $newDetail.find('.detail .title').wrapInner($('<a>').attr('href', productUrl));
              $newDetail.find('.show-gallery').removeClass('show-gallery').attr('href', productUrl);
              $detailCont.html($newDetail); // dpb if present

              if (Shopify.PaymentButton && $quickbuyCont.find('.shopify-payment-button').length) {
                // resize after loading extra payment buttons
                var _f = null;

                _f = function f() {
                  document.removeEventListener('shopify:payment_button:loaded', _f);
                  $quickbuyCont.trigger('changedsize');
                };

                document.addEventListener('shopify:payment_button:loaded', _f);
                Shopify.PaymentButton.init();
              } // the order of these is important:


              theme.initProductGallery($quickbuyCont); // 1

              $quickbuyCont.find('[name="id"]').trigger('optionate') // 2
              .on('variantChanged', function () {
                $quickbuyCont.trigger('changedsize'); // (4)
              });
              $quickbuyCont.trigger('changedsize'); // 3
            }).always(function () {
              theme.currentQuickbuyRequest = false;
            }); // enable close button

            $quickbuyCont.find('.close-detail').removeAttr('tabindex'); // scroll to appropriate position
            // qb: top of quick buy
            // bl: top of product block

            var scrollMode = 'qb';
            var scrollOffset = -120;

            if ($('.section-header').css('position') == 'sticky') {
              scrollOffset -= $('.section-header').height();
            }

            if (scrollMode == 'qb') {
              $('html:not(:animated),body:not(:animated)').animate({
                scrollTop: $quickbuyCont.offset().top + scrollOffset
              }, 500);
            } else {
              if ($slider.length > 0) {
                // simple for slider
                $('html:not(:animated),body:not(:animated)').animate({
                  scrollTop: $block.offset().top
                }, 500);
              } else {
                // need to use top of block when no quickbuys are visible
                saveCollectionPageData();
                var offsetTop = typeof $block.data('offsetTop') != 'undefined' ? $block.data('offsetTop') : $block.offset().top;
                $('html:not(:animated),body:not(:animated)').animate({
                  scrollTop: offsetTop + scrollOffset
                }, 500);
              }
            }
          } else {
            // close
            if ($slider.length > 0) {
              // collapse detail container
              $quickbuyCont.stop().animate({
                height: 0
              }, droppyDownAnimSpeed, function () {
                // remove details
                $detailCont.empty();
              });
            } else {
              contractDetail($block, droppyDownAnimSpeed);
            } // scroll to top of closing block


            var scrollUpOffset = -140;
            $('html:not(:animated),body:not(:animated)').animate({
              scrollTop: $block.offset().top + scrollUpOffset
            }, 500); // disable close button

            $quickbuyCont.find('.close-detail').attr('tabindex', '-1');
          }

          return false;
        }
      }); //Close button event

      $(document).on('click', '.quickbuy-container .close-detail', function () {
        var $slider = $(this).closest('.collection-slider-row');

        if ($slider.length) {
          $slider.find('.product-block.expanded .product-link:first').trigger('click');
        } else {
          $(this).closest('.product-block').find('.product-link:first').trigger('click');
        }

        return false;
      });
    } /// Collection slider


    jQuery.fn.reverse = [].reverse; //Genius deserves credit: http://stackoverflow.com/questions/1394020/jquery-each-backwards
    /// Event for initialising options

    $(document).on('optionate', '[name="id"]', function (e) {
      // no product data? fetch using json now
      var $form = $(this).closest('form');
      var productId = $form.data('product-id');

      if (theme.productData[productId] || document.getElementById('ProductJson-' + productId)) {
        // reveal dynamic checkout buttons
        if ($(this).closest('form').find('.dynamic-checkout-buttons').each(function () {
          $(this).before($(this).html()).remove();
        }).length > 0 && window.Shopify && Shopify.PaymentButton) {
          Shopify.PaymentButton.init();
        }
      } else {
        console.log('Product data missing');
      } // events on option change


      $(this).on('variantChanged', function (evt, variant) {
        var $labelCont = $form.closest('.detail').find('.productlabel-container');
        $labelCont.find('.productlabel').remove();
        $labelCont.append($('#variant-label-' + variant.id).html());
      });
      theme.OptionManager.initProductOptions(this); // show box-style options

      var $clickies = $form.find('[data-make-box]').addClass('has-clickyboxes').find('select').clickyBoxes(); // If we have clicky boxes, add the disabled-state to options that have no valid variants

      if ($clickies.length > 0) {
        // product form may have changed height. If in quick buy, resize container
        $(this).closest('.quickbuy-container').trigger('changedsize');
        var productData = theme.OptionManager.getProductData($form); // each option

        for (var optionIndex = 0; optionIndex < productData.options.length; optionIndex++) {
          // list each value for this option
          var optionValues = {};

          for (var variantIndex = 0; variantIndex < productData.variants.length; variantIndex++) {
            var variant = productData.variants[variantIndex];

            if (typeof optionValues[variant.options[optionIndex]] === 'undefined') {
              optionValues[variant.options[optionIndex]] = false;
            } // mark true if an option is available


            if (variant.available) {
              optionValues[variant.options[optionIndex]] = true;
            }
          } // mark any completely unavailable options


          for (var key in optionValues) {
            if (!optionValues[key]) {
              $('.selector-wrapper:eq(' + optionIndex + ') .clickyboxes li a', $form).filter(function () {
                return $(this).attr('data-value') == key;
              }).addClass('unavailable');
            }
          }
        }
      } // select2


      $form.find('.selector-wrapper:not([data-make-box]) select').each(function () {
        theme.select2.init($(this));
      }); // unload clickies & select2

      $(this).on('unloading', function () {
        $(this).off('unloading variantChanged'); // unload clickyboxes

        $form.find('.selector-wrapper select.clickybox-replaced').clickyBoxes('destroy'); // unload select2

        theme.select2.destroyAllIn($form.find('.selector-wrapper'));
      });
    }); /// Galleries (inc. product page)
    // when variant changes, and the variant has an image

    $(document).on('variantImageSelected', '.gallery', function (e, data) {
      // get image src
      var mediaId = data.featured_media.id; // locate matching thumbnail

      $(this).find('.thumbnails a[data-media-id="' + mediaId + '"]:first').trigger('select');
    }); // click main product image (launch gallery)

    $(document).on('click', '.product-detail .gallery .main-image a.show-gallery', function () {
      var images = [],
          currentIndex = 0;
      var $thumbs = $(this).closest('.gallery').find('.thumbnails .thumbnail--media-image');

      if ($thumbs.length) {
        $thumbs.each(function () {
          var $imgThumb = $(this).find('.rimage-outer-wrapper').clone();
          $imgThumb.find('.lazyloaded').removeClass('lazyloaded').addClass('lazyload').parent().addClass('lazyload--placeholder');
          images.push({
            thumbTag: $imgThumb,
            zoomUrl: $(this).attr('href')
          });
        });
        $thumbs.each(function (thisIndex) {
          if ($(this).hasClass('selected')) {
            currentIndex = thisIndex;
            return false;
          }
        });
      } else {
        var $imgThumb = $(this).find('.rimage-outer-wrapper').clone();
        $imgThumb.find('.lazyloaded').removeClass('lazyloaded').addClass('lazyload').parent().addClass('lazyload--placeholder');
        images.push({
          thumbTag: $imgThumb,
          zoomUrl: $(this).attr('href')
        });
      }

      theme.buildGalleryViewer({
        images: images,
        current: currentIndex,
        prev: theme.icons.chevronLeft,
        next: theme.icons.chevronRight,
        close: theme.icons.close
      });
      return false;
    }); // load any images that aren't inside a section

    var $nonSectionedProductLists = $('.product-list, .collection-listing').filter(function () {
      return $(this).closest('[data-section-type]').length == 0;
    });

    if ($nonSectionedProductLists.length) {
      theme.ProductBlockManager.loadImages($nonSectionedProductLists);
    }

    $(window).on('debouncedresize', function () {
      setTimeout(function () {
        theme.ProductBlockManager.afterImagesResized(); // empty param req
      }, 100); // after third party stuff
    });

    if (theme.settings.show_size_chart) {
      // size chart link
      $(document).on('click', '.size-chart-link', function () {
        $.fancybox($.extend({}, theme.fbOpts(), {
          showNavArrows: false,
          content: $(this).closest('.size-chart-container').find('.size-chart-content').html()
        }));
        return false;
      });
    } /// Style text-only links


    theme.classUpTextLinks(document); // forms don't all have correct label attributes

    $('#template label').each(function () {
      var $sibinputs = $(this).siblings('input:not([type="submit"]), textarea');

      if ($sibinputs.length == 1 && $sibinputs.attr('id').length > 0) {
        $(this).attr('for', $sibinputs.attr('id'));
      }
    }); /// Custom share buttons

    $(document).on('click', '.sharing a', function (e) {
      var $parent = $(this).parent();

      if ($parent.hasClass('twitter')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 575,
            height = 450,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, 'Twitter', opts);
      } else if ($parent.hasClass('facebook')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 626,
            height = 256,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, 'Facebook', opts);
      } else if ($parent.hasClass('pinterest')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 700,
            height = 550,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, 'Pinterest', opts);
      } else if ($parent.hasClass('google')) {
        e.preventDefault();
        var url = $(this).attr('href');
        var width = 550,
            height = 450,
            left = ($(window).width() - width) / 2,
            top = ($(window).height() - height) / 2,
            opts = 'status=1, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0' + ',width=' + width + ',height=' + height + ',top=' + top + ',left=' + left;
        window.open(url, 'Google+', opts);
      }
    });
    $(document).on('click', '.quantity-wrapper [data-quantity]', function () {
      var adj = $(this).data('quantity') == 'up' ? 1 : -1;
      var $qty = $(this).closest('.quantity-wrapper').find('[name=quantity]');

      if ($qty.attr('step')) {
        adj *= parseInt($qty.attr('step'));
      }

      $qty.val(Math.max(1, parseInt($qty.val()) + adj)).trigger('change');
      return false;
    }); /// Responsive tables

    $('.responsive-table').on('click', '.responsive-table__cell-head', function () {
      if ($(window).width() < 768) {
        $(this).closest('tr').toggleClass('expanded');
        return false;
      }
    }); /// Register all sections

    theme.Sections.init();
    theme.Sections.register('slideshow', theme.SlideshowSection);
    theme.Sections.register('gallery', theme.GallerySection);
    theme.Sections.register('image-with-text-overlay', theme.ImageWithTextOverlaySection);
    theme.Sections.register('featured-collection', theme.FeaturedCollectionSection);
    theme.Sections.register('featured-collections', theme.FeaturedCollectionsSection);
    theme.Sections.register('map', theme.MapSection);
    theme.Sections.register('background-video', theme.VideoManager, {
      deferredLoadViewportExcess: 800
    });
    theme.Sections.register('custom-row', theme.CustomRowSection);
    theme.Sections.register('featured-product', theme.FeaturedProductSection);
    theme.Sections.register('header', theme.HeaderSection, {
      deferredLoad: false
    });
    theme.Sections.register('announcement-bar', theme.AnnouncementBarSection, {
      deferredLoad: false
    });
    theme.Sections.register('footer', theme.FooterSection);
    theme.Sections.register('product-template', theme.ProductTemplateSection, {
      deferredLoad: false
    });
    theme.Sections.register('collection-template', theme.CollectionTemplateSection, {
      deferredLoad: false
    });
    theme.Sections.register('blog-template', theme.BlogTemplateSection, {
      deferredLoad: false
    });
    theme.Sections.register('cart-template', theme.CartTemplateSection, {
      deferredLoad: false
    });
    theme.Sections.register('list-collections-template', theme.ListCollectionsTemplateSection, {
      deferredLoad: false
    });
    theme.Sections.register('page-list-collections-template', theme.ListCollectionsTemplateSection, {
      deferredLoad: false
    });
  }); //Register dynamically pulled in sections

  $(function ($) {
    if (cc.sections.length) {
      cc.sections.forEach(function (section) {
        try {
          theme.Sections.register(section.name, section.section);
        } catch (err) {
          console.error("Unable to register section ".concat(section.name, "."), err);
        }
      });
    } else {
      console.warn('Barry: No common sections have been registered.');
    }
  });
})(theme.jQuery);  
/* Built with Barry v1.0.7 */