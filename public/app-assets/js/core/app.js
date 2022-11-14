/*=========================================================================================
  File Name: app.js
  Description: Template related app JS.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy  - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: hhttp://www.themeforest.net/user/pixinvent
==========================================================================================*/
window.colors = {
    solid: {
        primary: '#7367F0',
        secondary: '#82868b',
        success: '#28C76F',
        info: '#00cfe8',
        warning: '#FF9F43',
        danger: '#EA5455',
        dark: '#4b4b4b',
        black: '#000',
        white: '#fff',
        body: '#f8f8f8'
    },
    light: {
        primary: '#7367F01a',
        secondary: '#82868b1a',
        success: '#28C76F1a',
        info: '#00cfe81a',
        warning: '#FF9F431a',
        danger: '#EA54551a',
        dark: '#4b4b4b1a'
    }
};
(function (window, document, $) {
    'use strict';
    var $html = $('html');
    var $body = $('body');
    var $textcolor = '#4e5154';
    var assetPath = '../../../app-assets/';

    if ($('body').attr('data-framework') === 'laravel') {
        assetPath = $('body').attr('data-asset-path');
    }

    // to remove sm control classes from datatables
    if ($.fn.dataTable) {
        $.extend($.fn.dataTable.ext.classes, {
            sFilterInput: 'form-control',
            sLengthSelect: 'form-select'
        });
    }

    $(window).on('load', function () {
        var rtl;
        var compactMenu = false;

        if ($body.hasClass('menu-collapsed') || localStorage.getItem('menuCollapsed') === 'true') {
            compactMenu = true;
        }

        if ($('html').data('textdirection') == 'rtl') {
            rtl = true;
        }

        setTimeout(function () {
            $html.removeClass('loading').addClass('loaded');
        }, 1200);

        $.app.menu.init(compactMenu);

        // Navigation configurations
        var config = {
            speed: 300 // set speed to expand / collapse menu
        };
        if ($.app.nav.initialized === false) {
            $.app.nav.init(config);
        }

        Unison.on('change', function (bp) {
            $.app.menu.change(compactMenu);
        });

        // Tooltip Initialization
        // $('[data-bs-toggle="tooltip"]').tooltip({
        //   container: 'body'
        // });
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });

        // Do not close cart or notification dropdown on click of the items
        $('.dropdown-notification .dropdown-menu, .dropdown-cart .dropdown-menu').on('click', function (e) {
            e.stopPropagation();
        });

        //  Notifications & messages scrollable
        $('.scrollable-container').each(function () {
            var scrollable_container = new PerfectScrollbar($(this)[0], {
                wheelPropagation: false
            });
        });

        // Add disabled class to input group when input is disabled
        $('input:disabled, textarea:disabled').closest('.input-group').addClass('disabled');

        // Add sidebar group active class to active menu
        $('.main-menu-content').find('li.active').parents('li').addClass('sidebar-group-active');

        // Add open class to parent list item if subitem is active except compact menu
        var menuType = $body.data('menu');
        if (menuType != 'horizontal-menu' && compactMenu === false) {
            $('.main-menu-content').find('li.active').parents('li').addClass('open');
        }
        if (menuType == 'horizontal-menu') {
            $('.main-menu-content').find('li.active').parents('li:not(.nav-item)').addClass('open');
            $('.main-menu-content').find('li.active').closest('li.nav-item').addClass('sidebar-group-active open');
            // $(".main-menu-content")
            //   .find("li.active")
            //   .parents("li")
            //   .addClass("active");
        }

        //  Dynamic height for the chartjs div for the chart animations to work
        var chartjsDiv = $('.chartjs'),
            canvasHeight = chartjsDiv.children('canvas').attr('height'),
            mainMenu = $('.main-menu');
        chartjsDiv.css('height', canvasHeight);

        if ($body.hasClass('boxed-layout')) {
            if ($body.hasClass('vertical-overlay-menu')) {
                var menuWidth = mainMenu.width();
                var contentPosition = $('.app-content').position().left;
                var menuPositionAdjust = contentPosition - menuWidth;
                if ($body.hasClass('menu-flipped')) {
                    mainMenu.css('right', menuPositionAdjust + 'px');
                } else {
                    mainMenu.css('left', menuPositionAdjust + 'px');
                }
            }
        }

        /* Text Area Counter Set Start */

        $('.char-textarea').on('keyup', function (event) {
            checkTextAreaMaxLength(this, event);
            // to later change text color in dark layout
            $(this).addClass('active');
        });

        /*
        Checks the MaxLength of the Textarea
        -----------------------------------------------------
        @prerequisite:  textBox = textarea dom element
                e = textarea event
                        length = Max length of characters
        */
        function checkTextAreaMaxLength(textBox, e) {
            var maxLength = parseInt($(textBox).data('length')),
                counterValue = $('.textarea-counter-value'),
                charTextarea = $('.char-textarea');

            if (!checkSpecialKeys(e)) {
                if (textBox.value.length < maxLength - 1) textBox.value = textBox.value.substring(0, maxLength);
            }
            $('.char-count').html(textBox.value.length);

            if (textBox.value.length > maxLength) {
                counterValue.css('background-color', window.colors.solid.danger);
                charTextarea.css('color', window.colors.solid.danger);
                // to change text color after limit is maxedout out
                charTextarea.addClass('max-limit');
            } else {
                counterValue.css('background-color', window.colors.solid.primary);
                charTextarea.css('color', $textcolor);
                charTextarea.removeClass('max-limit');
            }

            return true;
        }

        /*
        Checks if the keyCode pressed is inside special chars
        -------------------------------------------------------
        @prerequisite:  e = e.keyCode object for the key pressed
        */
        function checkSpecialKeys(e) {
            if (e.keyCode != 8 && e.keyCode != 46 && e.keyCode != 37 && e.keyCode != 38 && e.keyCode != 39 && e.keyCode != 40)
                return false;
            else return true;
        }

        $('.content-overlay').on('click', function () {
            $('.search-list').removeClass('show');
            var searchInput = $('.search-input-close').closest('.search-input');
            if (searchInput.hasClass('open')) {
                searchInput.removeClass('open');
                searchInputInputfield.val('');
                searchInputInputfield.blur();
                searchList.removeClass('show');
            }

            $('.app-content').removeClass('show-overlay');
            $('.bookmark-wrapper .bookmark-input').removeClass('show');
        });

        // To show shadow in main menu when menu scrolls
        var container = document.getElementsByClassName('main-menu-content');
        if (container.length > 0) {
            container[0].addEventListener('ps-scroll-y', function () {
                if ($(this).find('.ps__thumb-y').position().top > 0) {
                    $('.shadow-bottom').css('display', 'block');
                } else {
                    $('.shadow-bottom').css('display', 'none');
                }
            });
        }
    });

    // Hide overlay menu on content overlay click on small screens
    $(document).on('click', '.sidenav-overlay', function (e) {
        // Hide menu
        $.app.menu.hide();
        return false;
    });

    // Execute below code only if we find hammer js for touch swipe feature on small screen
    if (typeof Hammer !== 'undefined') {
        var rtl;
        if ($('html').data('textdirection') == 'rtl') {
            rtl = true;
        }

        // Swipe menu gesture
        var swipeInElement = document.querySelector('.drag-target'),
            swipeInAction = 'panright',
            swipeOutAction = 'panleft';

        if (rtl === true) {
            swipeInAction = 'panleft';
            swipeOutAction = 'panright';
        }

        if ($(swipeInElement).length > 0) {
            var swipeInMenu = new Hammer(swipeInElement);

            swipeInMenu.on(swipeInAction, function (ev) {
                if ($body.hasClass('vertical-overlay-menu')) {
                    $.app.menu.open();
                    return false;
                }
            });
        }

        // menu swipe out gesture
        setTimeout(function () {
            var swipeOutElement = document.querySelector('.main-menu');
            var swipeOutMenu;

            if ($(swipeOutElement).length > 0) {
                swipeOutMenu = new Hammer(swipeOutElement);

                swipeOutMenu.get('pan').set({
                    direction: Hammer.DIRECTION_ALL,
                    threshold: 250
                });

                swipeOutMenu.on(swipeOutAction, function (ev) {
                    if ($body.hasClass('vertical-overlay-menu')) {
                        $.app.menu.hide();
                        return false;
                    }
                });
            }
        }, 300);

        // menu close on overlay tap
        var swipeOutOverlayElement = document.querySelector('.sidenav-overlay');

        if ($(swipeOutOverlayElement).length > 0) {
            var swipeOutOverlayMenu = new Hammer(swipeOutOverlayElement);

            swipeOutOverlayMenu.on('tap', function (ev) {
                if ($body.hasClass('vertical-overlay-menu')) {
                    $.app.menu.hide();
                    return false;
                }
            });
        }
    }

    $(document).on('click', '.menu-toggle, .modern-nav-toggle', function (e) {
        e.preventDefault();

        // Toggle menu
        $.app.menu.toggle();

        setTimeout(function () {
            $(window).trigger('resize');
        }, 200);

        if ($('#collapse-sidebar-switch').length > 0) {
            setTimeout(function () {
                if ($body.hasClass('menu-expanded') || $body.hasClass('menu-open')) {
                    $('#collapse-sidebar-switch').prop('checked', false);
                } else {
                    $('#collapse-sidebar-switch').prop('checked', true);
                }
            }, 50);
        }

        // Save menu collapsed status in localstorage
        if ($body.hasClass('menu-expanded') || $body.hasClass('menu-open')) {
            localStorage.setItem('menuCollapsed', false);
        } else {
            localStorage.setItem('menuCollapsed', true);
        }

        // Hides dropdown on click of menu toggle
        // $('[data-bs-toggle="dropdown"]').dropdown('hide');

        return false;
    });

    // Add Children Class
    $('.navigation').find('li').has('ul').addClass('has-sub');
    // Update manual scroller when window is resized
    $(window).resize(function () {
        $.app.menu.manualScroller.updateHeight();
    });

    $('#sidebar-page-navigation').on('click', 'a.nav-link', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var $this = $(this),
            href = $this.attr('href');
        var offset = $(href).offset();
        var scrollto = offset.top - 80; // minus fixed header height
        $('html, body').animate(
            {
                scrollTop: scrollto
            },
            0
        );
        setTimeout(function () {
            $this.parent('.nav-item').siblings('.nav-item').children('.nav-link').removeClass('active');
            $this.addClass('active');
        }, 100);
    });

    // main menu internationalization
    
    // Waves Effect
    Waves.init();
    Waves.attach(
        ".btn:not([class*='btn-relief-']):not([class*='btn-gradient-']):not([class*='btn-outline-']):not([class*='btn-flat-'])",
        ['waves-float', 'waves-light']
    );
    Waves.attach("[class*='btn-outline-']");
    Waves.attach("[class*='btn-flat-']");

    $('.form-password-toggle .input-group-text').on('click', function (e) {
        e.preventDefault();
        var $this = $(this),
            inputGroupText = $this.closest('.form-password-toggle'),
            formPasswordToggleIcon = $this,
            formPasswordToggleInput = inputGroupText.find('input');

        if (formPasswordToggleInput.attr('type') === 'text') {
            formPasswordToggleInput.attr('type', 'password');
            if (feather) {
                formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye'].toSvg({class: 'font-small-4'}));
            }
        } else if (formPasswordToggleInput.attr('type') === 'password') {
            formPasswordToggleInput.attr('type', 'text');
            if (feather) {
                formPasswordToggleIcon.find('svg').replaceWith(feather.icons['eye-off'].toSvg({class: 'font-small-4'}));
            }
        }
    });

    // on window scroll button show/hide
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 400) {
            $('.scroll-top').fadeIn();
        } else {
            $('.scroll-top').fadeOut();
        }

        // On Scroll navbar color on horizontal menu
        if ($body.hasClass('navbar-static')) {
            var scroll = $(window).scrollTop();

            if (scroll > 65) {
                $('html:not(.dark-layout) .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#fff',
                    'box-shadow': '0 4px 20px 0 rgba(0,0,0,.05)'
                });
                $('.horizontal-menu.dark-layout .header-navbar.navbar-fixed').css({
                    background: '#161d31',
                    'box-shadow': '0 4px 20px 0 rgba(0,0,0,.05)'
                });
                $('html:not(.dark-layout) .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#fff');
                $('.dark-layout .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#161d31');
            } else {
                $('html:not(.dark-layout) .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#f8f8f8',
                    'box-shadow': 'none'
                });
                $('.dark-layout .horizontal-menu .header-navbar.navbar-fixed').css({
                    background: '#161d31',
                    'box-shadow': 'none'
                });
                $('html:not(.dark-layout) .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#fff');
                $('.dark-layout .horizontal-menu .horizontal-menu-wrapper.header-navbar').css('background', '#161d31');
            }
        }
    });

    // Click event to scroll to top
    $('.scroll-top').on('click', function () {
        $('html, body').animate({scrollTop: 0}, 75);
    });
})(window, document, jQuery);

// jQuery Validation Global Defaults
if (typeof jQuery.validator === 'function') {
    jQuery.validator.setDefaults({
        errorElement: 'span',
        errorPlacement: function (error, element) {
            if (
                element.parent().hasClass('input-group') ||
                element.hasClass('select2') ||
                element.attr('type') === 'checkbox'
            ) {
                error.insertAfter(element.parent());
            } else if (element.hasClass('form-check-input')) {
                error.insertAfter(element.parent().siblings(':last'));
            } else {
                error.insertAfter(element);
            }

            if (element.parent().hasClass('input-group')) {
                element.parent().addClass('is-invalid');
            }
        },
        highlight: function (element, errorClass, validClass) {
            $(element).addClass('error');
            if ($(element).parent().hasClass('input-group')) {
                $(element).parent().addClass('is-invalid');
            }
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass('error');
            if ($(element).parent().hasClass('input-group')) {
                $(element).parent().removeClass('is-invalid');
            }
        }
    });
}
