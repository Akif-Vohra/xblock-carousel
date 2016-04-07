/*! Responsive Carousel - v0.1.0 - 2013-07-15
 * https://github.com/filamentgroup/responsive-carousel
 * Copyright (c) 2013 Filament Group, Inc.; Licensed MIT, GPL */
(function(e) {
    var t = "carousel",
        n = "." + t,
        r = "data-transition",
        i = t + "-transitioning",
        prevAttr = "data-prev",
        prevTitleAttr = "data-prev-title",
        nextAttr = "data-next",
		nextTitleAttr = "data-next-title",
        s = t + "-item",
        o = t + "-active",
        u = t + "-item-prev",
        a = t + "-item-next",
        f = t + "-in",
        l = t + "-out",
        c = t + "-nav",
        h = function() {
            var e = "webkit Moz O Ms".split(" "),
                t = !1,
                n;
            while (e.length) {
                n = e.shift() + "Transition";
                if (n in document.documentElement.style !== undefined && n in document.documentElement.style != 0) {
                    t = !0;
                    break
                }
            }
            return t
        }(),
        p = {
            _create: function() {
                e(this).trigger("beforecreate." + t)[t]("_init")[t]("_addNextPrev").trigger("create." + t)
            },
            _init: function() {
                var n = e(this).attr(r);
                n || (h = !1), e(this).addClass(t + " " + (n ? t + "-" + n : "") + " ").children().addClass(s).first().addClass(o), e(this)[t]("_addNextPrevClasses")
            },
            _addNextPrevClasses: function() {
                var t = e(this).find("." + s),
                    n = t.filter("." + o),
                    r = n.next("." + s),
                    i = n.prev("." + s);
                r.length || (r = t.first().not("." + o)), i.length || (i = t.last().not("." + o)), t.removeClass(u + " " + a), i.addClass(u), r.addClass(a)
            },
            next: function() {
                e(this)[t]("goTo", "+1")
            },
            prev: function() {
                e(this)[t]("goTo", "-1")
            },
            goTo: function(n) {
                var i = e(this),
                    u = i.attr(r),
                    a = " " + t + "-" + u + "-reverse";
                e(this).find("." + s).removeClass([l, f, a].join(" "));
                var c = e(this).find("." + o),
                    p = c.index(),
                    d = (p < 0 ? 0 : p) + 1,
                    v = typeof n == "number" ? n : d + parseFloat(n),
                    m = e(this).find(".carousel-item").eq(v - 1),
                    g = typeof n == "string" && !parseFloat(n) || v > d ? "" : a;
                m.length || (m = e(this).find("." + s)[g.length ? "last" : "first"]()), h ? i[t]("_transitionStart", c, m, g) : (m.addClass(o), i[t]("_transitionEnd", c, m, g)), i.trigger("goto." + t, m)
            },
            update: function() {
                return e(this).children().not("." + c).addClass(s), e(this).trigger("update." + t)
            },
            _transitionStart: function(n, r, i) {
                var s = e(this);
                r.one(navigator.userAgent.indexOf("AppleWebKit") > -1 ? "webkitTransitionEnd" : "transitionend otransitionend", function() {
                    s[t]("_transitionEnd", n, r, i)
                }), e(this).addClass(i), n.addClass(l), r.addClass(f)
            },
            _transitionEnd: function(n, r, i) {
                e(this).removeClass(i), n.removeClass(l + " " + o), r.removeClass(f).addClass(o), e(this)[t]("_addNextPrevClasses")
            },
            _bindEventListeners: function() {
                var n = e(this).bind("click", function(r) {
                    var i = e(r.target).closest("a[href='#next'],a[href='#prev']");
                    i.length && (n[t](i.is("[href='#next']") ? "next" : "prev"), r.preventDefault())
                });
                return this
            },
            _addNextPrev: function() {
                var previous = e(this).attr( prevAttr ) || "MyPrev",
					next = e(this).attr( nextAttr ) || "MyNext",
					prevTitle = e(this).attr( prevTitleAttr) || "MyPrevious",
					nextTitle = e(this).attr( nextTitleAttr) || "MyNext";
                return e(this).append("<nav class='" + c + "'><a href='#prev' class='prev' aria-hidden='true' title='"+prevTitle+"'>"+previous+"</a><a href='#next' class='next' aria-hidden='true' style='float: right;' title='"+nextTitle+""'>"+next+"</a></nav>")[t]("_bindEventListeners")
            },
            destroy: function() {}
        };
    e.fn[t] = function(n, r, i, s) {
        return this.each(function() {
            if (n && typeof n == "string") return e.fn[t].prototype[n].call(this, r, i, s);
            if (e(this).data(t + "data")) return e(this);
            e(this).data(t + "active", !0), e.fn[t].prototype._create.call(this)
        })
    }, e.extend(e.fn[t].prototype, p)
})(jQuery),
function(e) {
    var t = "carousel",
        n = "." + t,
        r = t + "-no-transition",
        i = /iPhone|iPad|iPod/.test(navigator.platform) && navigator.userAgent.indexOf("AppleWebKit") > -1,
        s = {
            _dragBehavior: function() {
                var t = e(this),
                    s, o = {},
                    u, a, f = function(t) {
                        var r = t.touches || t.originalEvent.touches,
                            i = e(t.target).closest(n);
                        t.type === "touchstart" && (s = {
                            x: r[0].pageX,
                            y: r[0].pageY
                        }), r[0] && r[0].pageX && (o.touches = r, o.deltaX = r[0].pageX - s.x, o.deltaY = r[0].pageY - s.y, o.w = i.width(), o.h = i.height(), o.xPercent = o.deltaX / o.w, o.yPercent = o.deltaY / o.h, o.srcEvent = t)
                    },
                    l = function(t) {
                        f(t), o.touches.length === 1 && e(t.target).closest(n).trigger("drag" + t.type.split("touch")[1], o)
                    };
                e(this).bind("touchstart", function(t) {
                    e(this).addClass(r), l(t)
                }).bind("touchmove", function(e) {
                    f(e), l(e), i || (e.preventDefault(), window.scrollBy(0, -o.deltaY))
                }).bind("touchend", function(t) {
                    e(this).removeClass(r), l(t)
                })
            }
        };
    e.extend(e.fn[t].prototype, s), e(document).on("create." + t, n, function() {
        e(this)[t]("_dragBehavior")
    })
}(jQuery),
function(e) {
    var t = "carousel",
        n = "." + t,
        r = t + "-active",
        i = t + "-item",
        s = function(e) {
            return Math.abs(e) > 4
        },
        o = function(e, n) {
            var r = e.find("." + t + "-active"),
                s = r.prevAll().length + 1,
                o = n < 0,
                u = s + (o ? 1 : -1),
                a = e.find("." + i).eq(u - 1);
            return a.length || (a = e.find("." + i)[o ? "first" : "last"]()), [r, a]
        };
    e(document).on("dragmove", n, function(t, n) {
        if (!s(n.deltaX)) return;
        var r = o(e(this), n.deltaX);
        r[0].css("left", n.deltaX + "px"), r[1].css("left", n.deltaX < 0 ? n.w + n.deltaX + "px" : -n.w + n.deltaX + "px")
    }).on("dragend", n, function(n, i) {
        if (!s(i.deltaX)) return;
        var u = o(e(this), i.deltaX),
            a = Math.abs(i.deltaX) > 45;
        e(this).one(navigator.userAgent.indexOf("AppleWebKit") ? "webkitTransitionEnd" : "transitionEnd", function() {
            u[0].add(u[1]).css("left", ""), e(this).trigger("goto." + t, u[1])
        }), a ? (u[0].removeClass(r).css("left", i.deltaX > 0 ? i.w + "px" : -i.w + "px"), u[1].addClass(r).css("left", 0)) : (u[0].css("left", 0), u[1].css("left", i.deltaX > 0 ? -i.w + "px" : i.w + "px"))
    })
}(jQuery),
function(e, t) {
    var n = "carousel",
        r = "." + n + "[data-paginate]",
        i = n + "-pagination",
        s = n + "-active-page",
        o = {
            _createPagination: function() {
                var t = e(this).find("." + n + "-nav"),
                    r = e(this).find("." + n + "-item"),
                    s = e("<ol class='" + i + "'></ol>"),
                    o, u, a;
                t.find("." + i).remove(), r.each(function(t) {
                    o = t + 1, u = e(this).attr("data-thumb"), a = o, u && (a = "<img src='" + u + "' alt=''>"), s.append("<li><a href='#" + o + "' title='Go to slide " + o + "'>" + a + "</a>")
                }), u && s.addClass(n + "-nav-thumbs"), t.addClass(n + "-nav-paginated").find("a").first().after(s)
            },
            _bindPaginationEvents: function() {
                e(this).bind("click", function(t) {
                    var r = e(t.target);
                    t.target.nodeName === "IMG" && (r = r.parent()), r = r.closest("a");
                    var s = r.attr("href");
                    r.closest("." + i).length && s && (e(this)[n]("goTo", parseFloat(s.split("#")[1])), t.preventDefault())
                }).bind("goto." + n, function(t, n) {
                    var r = n ? e(n).index() : 0;
                    e(this).find("ol." + i + " li").removeClass(s).eq(r).addClass(s)
                }).trigger("goto." + n)
            }
        };
    e.extend(e.fn[n].prototype, o), e(document).on("create." + n, r, function() {
        e(this)[n]("_createPagination")[n]("_bindPaginationEvents")
    }).on("update." + n, r, function() {
        e(this)[n]("_createPagination")
    })
}(jQuery),
function(e) {
    e(function() {
        e(".carousel").carousel()
    })
}(jQuery);