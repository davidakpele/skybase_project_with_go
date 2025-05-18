
import $ from "jquery"

var pubsui = {}; window.pubsui = { $handler: {} };
var eCommerceGetOrderItemCountUrl, brandingBarUrl, hideNotificationMessageUrl;

var re = document.querySelectorAll(".nav-item-last")
console.log(re);

pubsui.ready = function ()
{
    "use strict"; var u = $("#a11y-announcer"),
        f = { ctrl: "body, .pubs-ui" },
        e = { ctrl: ".pubs-ui .viewport" },
        i = {
            ctrl: ".pubs-search-control",
            clickTrigger: ".pubs-search__input", focusTrigger: ".input__search-submit, .pubs-search__input"
        },
        n = {
            ctrl: ".pubs-nav-drawer",
            clickTrigger: ".pubs-header__btn--open",
            closeTrigger: ".pubs-nav__close",
            focusTrigger: ".pubs-nav__title, .pubs-nav__link",
            drawerBody: ".pubs-nav__body"
        },
        t = {
            ctrl: ".alp-request-permissions",
            clickTrigger: ".alp-request-permissions__open-btn",
            closeTrigger: ".alp-request-permissions__close-btn.btn__enter-popup",
            exitTrigger: ".alp-request-permissions__close-btn.btn__exit-popup"
        },
        r = null; r = {
            announcer: {
                loading: function () {
                    u.text("Loading")
                },
                update: function (n) {
                    u.text(n)
                }
            },
            body: function () {
                $(f.ctrl).on("click", function () {
                    $(i.ctrl).removeClass("open");
                    $(n.ctrl).removeClass("open").attr("aria-hidden", !0);
                    $(n.focusTrigger).attr("tabindex", "-1");
                    $(n.closeTrigger).attr("tabindex", "-1")
                });
                $(e.ctrl).on("click", function () {
                    $(i.ctrl).removeClass("open");
                    $(n.ctrl).removeClass("open").attr("aria-hidden", !0);
                    $(n.focusTrigger).attr("tabindex", "-1");
                    $(n.closeTrigger).attr("tabindex", "-1")
                })
            },
            header_search: function () {
                $(i.ctrl).on("click",
                    i.clickTrigger, function () {
                    $(i.ctrl).addClass("hilite")
                }).focusin(function (n) {
                    n.stopPropagation()
                }).focusout(function () {
                    $(i.ctrl).removeClass("hilite")
                });
                $(i.focusTrigger).focusin(function (n) {
                    $(this).closest(i.ctrl).addClass("hilite");
                    n.stopPropagation()
                })
            }, nav_drawer: function () {
                $(n.ctrl).on("click",
                    n.closeTrigger, function (t) {
                        $(n.ctrl).removeClass("open").attr("aria-hidden", !0);
                        $(n.clickTrigger).focus();
                        setTimeout(function () {
                            $(n.clickTrigger).focus()
                        }, 100);
                        t.preventDefault()
                }).focusin(function () {
                    $(n.focusTrigger).attr("tabindex", "0")
                }); $(n.clickTrigger).on("click", function (t) {
                    $(n.ctrl).addClass("open").attr("aria-hidden", !1);
                    $(n.closeTrigger).focus();
                    $(n.focusTrigger).attr("tabindex", "0");
                    $(n.closeTrigger).attr("tabindex", "0");
                    setTimeout(function () {
                        $(n.closeTrigger).focus()
                    }, 100);
                    t.preventDefault(); t.stopPropagation()
                }); $(n.focusTrigger).on("click", function (n) { n.stopPropagation() })
            },
            alpPermissions: function () {
                $(t.ctrl).on("click", t.clickTrigger, function (n) {
                    var i = $(this).closest(t.ctrl);
                    $(i).find(".alp-request-permissions__content").fadeToggle(150).toggleClass("open");
                    setTimeout(function () { $(t.closeTrigger).focus() }, 100); n.preventDefault();
                    n.stopPropagation()
                }).keydown(function (n) {
                    var i; n.which === 27 && ($(this).removeClass("open"),
                        i = $(this).closest(t.ctrl),
                        $(i).find(".alp-request-permissions__content").fadeOut(150).removeClass("open"),
                        setTimeout(function () { $(t.clickTrigger).focus() }, 100));
                    n.stopPropagation(); n.stopImmediatePropagation()
                }); $(t.closeTrigger).on("click", function (n) {
                    var i = $(this).closest(t.ctrl);
                    $(i).find(".alp-request-permissions__content").fadeOut(150).removeClass("open");
                    setTimeout(function () { $(t.clickTrigger).focus() }, 100); n.preventDefault()
                }); $(t.exitTrigger).on("click", function (n) {
                    var i = $(this).closest(t.ctrl);
                    $(i).find(".alp-request-permissions__content").fadeOut(150).removeClass("open");
                    setTimeout(function () {
                        $(t.clickTrigger).focus()
                    }, 100);
                    n.preventDefault()
                }); $(t.exitTrigger).focusout(function (n) {
                    var i = $(this).closest(t.ctrl);
                    $(i).find(".alp-request-permissions__content").fadeOut(150).removeClass("open");
                    setTimeout(function () { $(t.clickTrigger).focus() }, 100); n.preventDefault()
                })
            }
    }; window.pubsui.$handler = r;
    r.body();
    r.header_search();
    r.nav_drawer(); r.alpPermissions()
}; $(document).ready(pubsui.ready);
    var getCookie = function (n) {
        var t = document.cookie, i = t.indexOf(" " + n + "="),
            r; return i === -1 && (i = t.indexOf(n + "=")), i === -1 ? t = null : (i = t.indexOf("=", i) + 1,
                r = t.indexOf(";", i), r === -1 && (r = t.length), t = unescape(t.substring(i, r))), t
    }, SetOrderItemCount = function (n) {
        var t = parseInt(n); t < 0 && (t = 0); t !== null && t !== undefined && t > 0 ? ($(".badge--count").show(), $(".badge--count").html(n)) : $(".badge--count").hide()
        }, GetOrderItemCount = function () {
            var n = getCookie("BasketCookieGuid");            n && $.ajax({
                type: "GET", url: eCommerceGetOrderItemCountUrl,
                data: "orderToken=" + n + "&isAjaxCall=True&registeredurl=",
                cache: !1, async: !1, crossDomain: !0,
                dataType: "jsonp",
                success: function (n) {
                    SetOrderItemCount(n)
                }
            })
        }, CloseNotificationMessages = function (n) {
    $.ajax({
        type: "POST", url: hideNotificationMessageUrl,
        data: { hashSet: $(n).attr("data-val") }, success: function () {
            return $(n).closest("#divPlatform").slideUp(250), !1
        }
    })
}; $(document).ready(function () {
    $.ajax({
        url: brandingBarUrl, cache: !1, success: function (n) {
            $("#divWelcomeUser").html(n)
        }, error: function (n) {
            $("#divWelcomeUser").html(n)
        }, dataType: "html"
    }); GetOrderItemCount();
    $("#SimpleSearch-form").on("submit", function () {
        var n = $("#SearchText").val();
        return n = $.trim(n),
            n.indexOf("'") !== -1 && n.replace("'", "'"),
            n === "" ? (
                // alert("Please specify search criteria"),
                $("#SearchText").focus(),
                !1) : void 0
    }); $("#SimpleSearch-formMobile").on("submit", function () {
        var n = $("#SearchTextMobile").val();
        return n = $.trim(n),
        n.indexOf("'") !== -1 && n.replace("'", "'"), n === "" ? (
            // alert("Please specify search criteria"),
            $("#SearchTextMobile").focus(),
            !1) : void 0
    }); $(".close-notification-msg").click(function (n) {
        n.preventDefault();
        CloseNotificationMessages(this)
    }); $(".pubs-nav__item a").last().addClass("nav-item-last")
}); document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".nav-item-first")[0]
});


$("document").ready(function () {
    const searchTrigger = document.getElementById('mobileSearchTrigger');
    const searchPanel = document.getElementById('mobileSearchPanel');

    // Toggle the panel when search icon is clicked
    searchTrigger.addEventListener('click', function (e) {
      e.preventDefault(); // prevent link navigation
      e.stopPropagation(); // stop click from bubbling to document
      searchPanel.classList.toggle('open');
    });

    // Close the panel when anything else on the page is clicked
    document.addEventListener('click', function (e) {
      const isClickInsidePanel = searchPanel.contains(e.target);
      const isClickOnTrigger = searchTrigger.contains(e.target);
      if (!isClickInsidePanel && !isClickOnTrigger) {
        searchPanel.classList.remove('open');
      }
    });
  });