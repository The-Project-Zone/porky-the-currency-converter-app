function ThisApp() {
  this.approot = $("#appRoot");
}
ThisApp.prototype.init = function() {
  var $this = this;
};
/* load js files on the fly */
ThisApp.prototype.fetchThisJavascriptFile = function(scriptSrc, scriptId, callback) {
  try {
    if(!("getElementsByTagName") in document) {
      throw new Error("document.getElementsByTagName() method not supported by Browser. Please upgrade your Browser to continue...");
      return;
    }
    else if(typeof callback !== "function") {
      throw new Error("callbackSuccess needs to be of function type");
      return;
    }
    else {
      var s = document.createElement("script");
      var h = document.getElementsByTagName("head")[0];
      scriptSrc = scriptSrc;
      s.setAttribute("type", "text/javascript");
      s.setAttribute("src", scriptSrc);
      s.setAttribute("id", scriptId);
      h.appendChild(s);

      s.onload = function() {
        callback();
      };
      s.onerror = function() {
        throw new Error("Required Javascript file did not load, please check and try again. Maybe Internet connection is down?");
        return;
      };
    }
  }
  catch(thisError) {
    console.error(thisError);
  }
};
/* load css files on the fly */
ThisApp.prototype.loadDeferredCSS = function(stylesLinkUrl, executeNextFunction, argsForFunc) {
  var cssLink = stylesLinkUrl;
  var linkTag = document.createElement("link");
  var documentHeadTag = document.getElementsByTagName("head")[0];
  var baseUrl;

  linkTag.setAttribute("rel", "stylesheet");
  linkTag.setAttribute("href", cssLink);
  linkTag.setAttribute("type", "text/css");
  documentHeadTag.appendChild(linkTag);
  linkTag.addEventListener("load", function() {
    if (!!executeNextFunction && typeof executeNextFunction === "function") {
      if (!!argsForFunc) {
        executeNextFunction(argsForFunc);
      } else {
        executeNextFunction();
      }
    }
  });
};
/* smooth scroll functionality */
ThisApp.prototype.smoothScrollToTarget = function(targetElement) {
  $("html, body").stop()
  .animate({scrollTop: targetElement.offset().top}, 800);
}
/* smooth scroll post on click hash target */
ThisApp.smoothScrollToHash = function(event) {
  event.preventDefault();
  var hashValue = $(this.hash);
  $("html, body")
    .stop()
    .animate(
      {
        scrollTop: $(hashValue).offset().top
      },
      800
    );
  return false;
};
/* check the string value if its a valid email format */
ThisApp.prototype.isValidEmailFormat = function(emailString) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailString);
};
ThisApp.prototype.isOnlyNumerical = function(thisStr) {
  var regexPattern = /^\d+$/;
  return regexPattern.test(thisStr);
}
/* regex to check if there are any html tags in the string */
ThisApp.prototype.stringHasHtmlChars = function(string) {
  var htmlTagRe = /<\/?[\w\s="/.':;#-\/\?]+>/gi;
  return htmlTagRe.test(string);
};
/* regex to check if string has special characters */
ThisApp.prototype.stringHasSpecialChars = function(string) {
  var re = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return re.test(string);
}
/* web vibration api */
ThisApp.prototype.createVibes = function() {
  if(window.navigator.vibrate) {
    window.navigator.vibrate(100);
  }
};
/* app scroll lock - on */
ThisApp.prototype.activateScrollLock = function() {
  var $websiteRoot = thisapp.approot;
  var currentScrollPos = 0;
  currentScrollPos = $(window).scrollTop();
  $websiteRoot.addClass("restrictScrollActive");
  $websiteRoot.scrollTop(0);
  if($websiteRoot.scrollTop() !== currentScrollPos) {
    $websiteRoot.scrollTop(currentScrollPos);
  }
};
/* app scroll lock - off */
ThisApp.prototype.removeScrollLock = function() {
  var $websiteRoot = thisapp.approot;
  var YScrollPos = $websiteRoot.scrollTop();
  $websiteRoot.removeClass("restrictScrollActive");
  $(window).scrollTop(YScrollPos);
};
/* checks for webp support */
ThisApp.prototype.checkWebpSupport = function(callback) {
  var webP = new Image();
  webP.src =
    "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
  webP.onload = webP.onerror = function () {
    var hasWebpSupport = webP.height === 2;
    if (hasWebpSupport) {
      $("body").addClass("hasWebpSupport");
    } else {
      $("body").addClass("noWebpSupport");
    }

    if (typeof callback === "function") {
      callback(hasWebpSupport);
    }
  };
};

function centralControl() {
  /* always first */
  window.thisapp = new ThisApp();
  thisapp.init();
}
centralControl();
