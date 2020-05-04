$(window).load(function() {
	
	 loadPolyfills();

function _initLazy() {
	  /*
    DESCRIPTION: 
    Lazy loading of images using Intersection Observer API (https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)
    
    Each Image will be downloaded when it, at least, appears 25% in the viewport during the page scrolling.
    After all Images have been downloaded we instructs Intersection observer to not obeserve this images anymore
    (we can do this on per image way on disconnect Intersection Observer completely)
  */

  /// gets all images with data-img-src attribute on them
  const imgPlaceholders = Array.from(
    document.querySelectorAll("[data-img-src]")
  ); /// Array.from for IE
  /// gets last image (for the case when we want disconnect Intersection Observer completely after the last image has been downloaded)
  //const lastImg = imgPlaceholders[imgPlaceholders.length - 1];

  const IMG_SRC_ATTR = "data-img-src";
  const IMG_CONTAINER_PLACEHOLDER_CLASS = "productImage";
  const IMG_HIDDEN_CLASS = "is-hidden";

  const observerOptions = {
    // root: null,
    // rootMaring: "10rem",
    threshold: 0.25 // when visibility passes the N% mark, i.e. when observer element is visible within its parent on N% at least.
  }; 

  /// Initialize Observer object
   const observer = new IntersectionObserver(
    handleIntersection,
    observerOptions
  );

  imgPlaceholders.forEach(function (img) {
    /// Start observing
  
     observer.observe(img);
  });

  /*===============================
     IntersectionObserver Handler
    ===============================*/
  function handleIntersection(entries, observerObj) {
    entries.forEach(function (entry, i) {
      if (!entry.isIntersecting) return; /// the target is no longer as visible as the given threshold

      const img = entry.target; /// the real HTML Element

      loadImage(img);

      /// we can instruct Intersetion observer to stop observing particular image that has been already downloaded.
      observerObj.unobserve(img); /// instructs the IntersectionObserver to stop observing the specified target element

      /// we can check if this is the last image that should be downloaded, we can then disconnect Intersection observer completely.
      /*if(img === lastImg) {
          debugger; // disconnect observer
          observerObj.disconnect();
       }*/
    });
  }

  /*====================
     Utility Functions
  ======================*/
  /*
   * Load image according to it's data-img-src attribute,
   * removes class of hidden image from the image and from the parentElement
   */
  function loadImage(img) {
    const srcVal = img.getAttribute(IMG_SRC_ATTR);
    if (srcVal) {
      img.src = srcVal; // replace fake src to the original one
      img.onload = function () {
        this.removeAttribute(IMG_SRC_ATTR);
        this.style.opacity = 1;
        this.classList.remove(IMG_HIDDEN_CLASS);
        this.parentElement.classList.remove(IMG_CONTAINER_PLACEHOLDER_CLASS);
        this.parentElement.classList.remove('loading--shelf');
		    this.parentElement.classList.add("url-replaced");
      };
    }
  }  
}
 _initLazy();
/*
LINKS:


https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

polyfill:
https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill

*/

/*++++++++++++++++++++++++++++++++++++++++++++++++
  Polyfills for Intersection Observer and Array.from
++++++++++++++++++++++++++++++++++++++++++++++++++*/

function loadPolyfills() {  
  "use strict";
  
  _initLazy();

  const isIntersectionObserverSupported = "IntersectionObserver" in window;

  // If Intersection Observer doesn't supported we apply polyfill for support.
  if (!isIntersectionObserverSupported) {
    IntersectionObserverPolyfill();
  }

  /// minified version of the Intersection Observer polyfill from: https://github.com/WICG/IntersectionObserver/tree/gh-pages/polyfill
  function IntersectionObserverPolyfill() {
    /*START*/
    !(function (t, e) {
      "use strict";
      function n(t) {
        (this.time = t.time),
          (this.target = t.target),
          (this.rootBounds = t.rootBounds),
          (this.boundingClientRect = t.boundingClientRect),
          (this.intersectionRect = t.intersectionRect || u()),
          (this.isIntersecting = !!t.intersectionRect);
        var e = this.boundingClientRect,
          n = e.width * e.height,
          o = this.intersectionRect,
          i = o.width * o.height;
        this.intersectionRatio = n ? i / n : this.isIntersecting ? 1 : 0;
      }
      function o(t, e) {
        var n = e || {};
        if ("function" != typeof t) throw Error("callback must be a function");
        if (n.root && 1 != n.root.nodeType)
          throw Error("root must be an Element");
        (this._checkForIntersections = r(
          this._checkForIntersections.bind(this),
          this.THROTTLE_TIMEOUT
        )),
          (this._callback = t),
          (this._observationTargets = []),
          (this._queuedEntries = []),
          (this._rootMarginValues = this._parseRootMargin(n.rootMargin)),
          (this.thresholds = this._initThresholds(n.threshold)),
          (this.root = n.root || null),
          (this.rootMargin = this._rootMarginValues
            .map(function (t) {
              return t.value + t.unit;
            })
            .join(" "));
      }
      function i() {
        return t.performance && performance.now && performance.now();
      }
      function r(t, e) {
        var n = null;
        return function () {
          n ||
            (n = setTimeout(function () {
              t(), (n = null);
            }, e));
        };
      }
      function s(t, e, n, o) {
        "function" == typeof t.addEventListener
          ? t.addEventListener(e, n, o || !1)
          : "function" == typeof t.attachEvent && t.attachEvent("on" + e, n);
      }
      function h(t, e, n, o) {
        "function" == typeof t.removeEventListener
          ? t.removeEventListener(e, n, o || !1)
          : "function" == typeof t.detatchEvent && t.detatchEvent("on" + e, n);
      }
      function c(t, e) {
        var n = Math.max(t.top, e.top),
          o = Math.min(t.bottom, e.bottom),
          i = Math.max(t.left, e.left),
          r = Math.min(t.right, e.right),
          s = r - i,
          h = o - n;
        return (
          s >= 0 &&
          h >= 0 && {
            top: n,
            bottom: o,
            left: i,
            right: r,
            width: s,
            height: h
          }
        );
      }
      function a(t) {
        var e;
        try {
          e = t.getBoundingClientRect();
        } catch (n) {}
        return e
          ? ((e.width && e.height) ||
              (e = {
                top: e.top,
                right: e.right,
                bottom: e.bottom,
                left: e.left,
                width: e.right - e.left,
                height: e.bottom - e.top
              }),
            e)
          : u();
      }
      function u() {
        return { top: 0, bottom: 0, left: 0, right: 0, width: 0, height: 0 };
      }
      function l(t, e) {
        for (var n = e; n; ) {
          if ((11 == n.nodeType && n.host && (n = n.host), n == t)) return !0;
          n = n.parentNode;
        }
        return !1;
      }
      if (
        !(
          "IntersectionObserver" in t &&
          "IntersectionObserverEntry" in t &&
          "intersectionRatio" in t.IntersectionObserverEntry.prototype
        )
      ) {
        var p = [];
        (o.prototype.THROTTLE_TIMEOUT = 100),
          (o.prototype.POLL_INTERVAL = null),
          (o.prototype.observe = function (t) {
            if (
              !this._observationTargets.some(function (e) {
                return e.element == t;
              })
            ) {
              if (!t || 1 != t.nodeType)
                throw Error("target must be an Element");
              this._registerInstance(),
                this._observationTargets.push({ element: t, entry: null }),
                this._monitorIntersections();
            }
          }),
          (o.prototype.unobserve = function (t) {
            (this._observationTargets = this._observationTargets.filter(
              function (e) {
                return e.element != t;
              }
            )),
              this._observationTargets.length ||
                (this._unmonitorIntersections(), this._unregisterInstance());
          }),
          (o.prototype.disconnect = function () {
            (this._observationTargets = []),
              this._unmonitorIntersections(),
              this._unregisterInstance();
          }),
          (o.prototype.takeRecords = function () {
            var t = this._queuedEntries.slice();
            return (this._queuedEntries = []), t;
          }),
          (o.prototype._initThresholds = function (t) {
            var e = t || [0];
            return (
              Array.isArray(e) || (e = [e]),
              e.sort().filter(function (t, e, n) {
                if ("number" != typeof t || isNaN(t) || 0 > t || t > 1)
                  throw Error(
                    "threshold must be a number between 0 and 1 inclusively"
                  );
                return t !== n[e - 1];
              })
            );
          }),
          (o.prototype._parseRootMargin = function (t) {
            var e = t || "0px",
              n = e.split(/\s+/).map(function (t) {
                var e = /^(-?\d*\.?\d+)(px|%)$/.exec(t);
                if (!e)
                  throw Error(
                    "rootMargin must be specified in pixels or percent"
                  );
                return { value: parseFloat(e[1]), unit: e[2] };
              });
            return (
              (n[1] = n[1] || n[0]),
              (n[2] = n[2] || n[0]),
              (n[3] = n[3] || n[1]),
              n
            );
          }),
          (o.prototype._monitorIntersections = function () {
            this._monitoringIntersections ||
              ((this._monitoringIntersections = !0),
              this._checkForIntersections(),
              this.POLL_INTERVAL
                ? (this._monitoringInterval = setInterval(
                    this._checkForIntersections,
                    this.POLL_INTERVAL
                  ))
                : (s(t, "resize", this._checkForIntersections, !0),
                  s(e, "scroll", this._checkForIntersections, !0),
                  "MutationObserver" in t &&
                    ((this._domObserver = new MutationObserver(
                      this._checkForIntersections
                    )),
                    this._domObserver.observe(e, {
                      attributes: !0,
                      childList: !0,
                      characterData: !0,
                      subtree: !0
                    }))));
          }),
          (o.prototype._unmonitorIntersections = function () {
            this._monitoringIntersections &&
              ((this._monitoringIntersections = !1),
              clearInterval(this._monitoringInterval),
              (this._monitoringInterval = null),
              h(t, "resize", this._checkForIntersections, !0),
              h(e, "scroll", this._checkForIntersections, !0),
              this._domObserver &&
                (this._domObserver.disconnect(), (this._domObserver = null)));
          }),
          (o.prototype._checkForIntersections = function () {
            var t = this._rootIsInDom(),
              e = t ? this._getRootRect() : u();
            this._observationTargets.forEach(function (o) {
              var r = o.element,
                s = a(r),
                h = this._rootContainsTarget(r),
                c = o.entry,
                u = t && h && this._computeTargetAndRootIntersection(r, e),
                l = (o.entry = new n({
                  time: i(),
                  target: r,
                  boundingClientRect: s,
                  rootBounds: e,
                  intersectionRect: u
                }));
              c
                ? t && h
                  ? this._hasCrossedThreshold(c, l) &&
                    this._queuedEntries.push(l)
                  : c && c.isIntersecting && this._queuedEntries.push(l)
                : this._queuedEntries.push(l);
            }, this),
              this._queuedEntries.length &&
                this._callback(this.takeRecords(), this);
          }),
          (o.prototype._computeTargetAndRootIntersection = function (n, o) {
            if ("none" != t.getComputedStyle(n).display) {
              for (var i = a(n), r = i, s = n.parentNode, h = !1; !h; ) {
                var u = null;
                if (
                  (s == this.root ||
                  s == e.body ||
                  s == e.documentElement ||
                  1 != s.nodeType
                    ? ((h = !0), (u = o))
                    : "visible" != t.getComputedStyle(s).overflow && (u = a(s)),
                  u && ((r = c(u, r)), !r))
                )
                  break;
                s = s.parentNode;
              }
              return r;
            }
          }),
          (o.prototype._getRootRect = function () {
            var t;
            if (this.root) t = a(this.root);
            else {
              var n = e.documentElement,
                o = e.body;
              t = {
                top: 0,
                left: 0,
                right: n.clientWidth || o.clientWidth,
                width: n.clientWidth || o.clientWidth,
                bottom: n.clientHeight || o.clientHeight,
                height: n.clientHeight || o.clientHeight
              };
            }
            return this._expandRectByRootMargin(t);
          }),
          (o.prototype._expandRectByRootMargin = function (t) {
            var e = this._rootMarginValues.map(function (e, n) {
                return "px" == e.unit
                  ? e.value
                  : (e.value * (n % 2 ? t.width : t.height)) / 100;
              }),
              n = {
                top: t.top - e[0],
                right: t.right + e[1],
                bottom: t.bottom + e[2],
                left: t.left - e[3]
              };
            return (
              (n.width = n.right - n.left), (n.height = n.bottom - n.top), n
            );
          }),
          (o.prototype._hasCrossedThreshold = function (t, e) {
            var n = t && t.isIntersecting ? t.intersectionRatio || 0 : -1,
              o = e.isIntersecting ? e.intersectionRatio || 0 : -1;
            if (n !== o)
              for (var i = 0; i < this.thresholds.length; i++) {
                var r = this.thresholds[i];
                if (r == n || r == o || n > r != o > r) return !0;
              }
          }),
          (o.prototype._rootIsInDom = function () {
            return !this.root || l(e, this.root);
          }),
          (o.prototype._rootContainsTarget = function (t) {
            return l(this.root || e, t);
          }),
          (o.prototype._registerInstance = function () {
            p.indexOf(this) < 0 && p.push(this);
          }),
          (o.prototype._unregisterInstance = function () {
            var t = p.indexOf(this);
            -1 != t && p.splice(t, 1);
          }),
          (t.IntersectionObserver = o),
          (t.IntersectionObserverEntry = n);
      }
    })(window, document);
    /*END*/
  }

  /*Mini polyfill for Array.from without optional arguments (mapFunction [second argument], thisArg [third argument]) (https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/from)*/
  if (typeof Array.from !== "function") {
    Array.from = function (arrLikeObj) {
      return Array.prototype.slice.call(arrLikeObj, 0);
    };
  }
}


$('.section .section__links a').on('click', function() {
  setTimeout(function() {
     loadPolyfills();
 
    }, 0);

  });

});

