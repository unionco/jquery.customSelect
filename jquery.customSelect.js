/*!
 * jquery.customSelect() - v0.5.1
 * http://adam.co/lab/jquery/customselect/
 * 2014-03-19
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

(function ($) {
    'use strict';

    $.fn.extend({
        customSelect: function (options) {
            // filter out <= IE6
            if (typeof document.body.style.maxHeight === 'undefined') {
                return this;
            }
            var defaults = {
                    customClass: 'custom-select',
                    mapClass:    true,
                    mapStyle:    true,
                    camelCase:   true
            },
            options = $.extend(defaults, options),
            prefix = options.customClass,
            changed = function ($select,customSelectSpan) {
                var currentSelected = $select.find(':selected'),
                customSelectSpanInner = customSelectSpan.children(':first'),
                html = currentSelected.html() || '&nbsp;';

                customSelectSpanInner.html(html);
                
                if (currentSelected.attr('disabled')) {
                    customSelectSpan.addClass(getClass('disabled-option'));
                } else {
                    customSelectSpan.removeClass(getClass('disabled-option'));
                }

                setTimeout(function () {
                    customSelectSpan.removeClass(getClass('open'));
                    $(document).off('mouseup.customSelect');
                }, 60);
            },
            camelCase = function(str) {
                return str.replace(/-([a-z])/gi, function(s, group1) {
                    return group1.toUpperCase();
                });
            },
            getClass = function(suffix){
                var className = prefix + '-' + suffix;
                if (options.camelCase) {
                    className = camelCase(className);
                }
                return className;
            };

            return this.each(function () {
                var $select = $(this),
                    customSelectWrapper = $('<div />').addClass(getClass('wrapper')),
                    customSelectInnerSpan = $('<div />').addClass(getClass('inner')),
                    customSelectSpan = $('<span />').addClass(prefix);

                $select
                    .after(customSelectWrapper)
                    .appendTo(customSelectWrapper)
                    .after(customSelectSpan.append(customSelectInnerSpan))
                    ;

                if (options.mapClass) {
                    customSelectSpan.addClass($select.attr('class'));
                }
                if (options.mapStyle) {
                    customSelectSpan.attr('style', $select.attr('style'));
                }

                $select
                    .addClass(options.camelCase ? camelCase('has-' + prefix) : ('has-' + prefix))
                    .on('render.customSelect', function () {
                        changed($select,customSelectSpan);
                        $select.css('width','');
                        var selectBoxWidth = parseInt($select.outerWidth(), 10) -
                                (parseInt(customSelectSpan.outerWidth(), 10) -
                                    parseInt(customSelectSpan.width(), 10));
                        

                        var selectBoxHeight = customSelectSpan.outerHeight();

                        if ($select.attr('disabled')) {
                            customSelectSpan.addClass(getClass('disabled'));
                        } else {
                            customSelectSpan.removeClass(getClass('disabled'));
                        }

                        $select.css({
                            height:               selectBoxHeight
                        });
                    })
                    .on('change.customSelect', function () {
                        customSelectSpan.addClass(getClass('changed'));
                        changed($select,customSelectSpan);
                    })
                    .on('keyup.customSelect', function (e) {
                        if(!customSelectSpan.hasClass(getClass('open'))){
                            $select.trigger('blur.customSelect');
                            $select.trigger('focus.customSelect');
                        }else{
                            if(e.which==13||e.which==27){
                                changed($select,customSelectSpan);
                            }
                        }
                    })
                    .on('mousedown.customSelect', function () {
                        customSelectSpan.removeClass(getClass('changed'));
                    })
                    .on('mouseup.customSelect', function (e) {

                        if( !customSelectSpan.hasClass(getClass('open'))){
                            // if FF and there are other selects open, just apply focus
                            if($('.'+getClass('open')).not(customSelectSpan).length>0 && typeof InstallTrigger !== 'undefined'){
                                $select.trigger('focus.customSelect');
                            }else{
                                customSelectSpan.addClass(getClass('open'));
                                e.stopPropagation();
                                $(document).one('mouseup.customSelect', function (e) {
                                    if( e.target != $select.get(0) && $.inArray(e.target,$select.find('*').get()) < 0 ){
                                        $select.trigger('blur.customSelect');
                                    }else{
                                        changed($select,customSelectSpan);
                                    }
                                });
                            }
                        }
                    })
                    .on('focus.customSelect', function () {
                        customSelectSpan.removeClass(getClass('changed'));
                    })
                    .on('blur.customSelect', function () {
                        customSelectSpan.removeClass(getClass('open'));
                    })
                    .trigger('render.customSelect');
            });
        }
    });
})(jQuery);
