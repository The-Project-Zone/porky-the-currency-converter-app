(function ($mainRoot, w, d) {
  /* top level vars */
  var hasWebpSupport = false;

  var PageHandler = (function() {
    function Constructor() {
      this.form = $mainRoot.find("#currencyForm");
      this.apiHost = "https://api.frankfurter.app";
      this.data = {
        to: null,
        from: null,
        value: 0
      };
    }
    Constructor.prototype.init = function() {
      var $this = this;
      $this.getAndRenderCurrencyList();
      $this.formSubmitHandler();
    };
    /* fetches data - currencies */
    Constructor.prototype.getAndRenderCurrencyList = function() {
      var $this = this;
      $.ajax({
        url: $this.apiHost + "/currencies",
        method: "get"
      })
      .done(function(response) {
        $this.renderCurrencyLists(response, function() {
          $this.formDataHandler();
        });
      })
      .fail(function(error) {
        console.log(error);
      });
    };
    /* renders currency options for both 'from' and 'to' currencies select list */
    Constructor.prototype.renderCurrencyLists = function(listOfCurrencies, callback) {
      if (Object.keys(listOfCurrencies).length > 0) {
        var $this = this;
        var toListElement = $this.form.find("#toCurrency");
        var fromListElement = $this.form.find("#fromCurrency");

        for (var prop in listOfCurrencies) {
          if (listOfCurrencies.hasOwnProperty(prop)) {
            var optionElement = $('<option></option>');
            optionElement.text(listOfCurrencies[prop]);
            optionElement.attr("value", prop);

            /* append */
            toListElement.append(optionElement.clone());
            fromListElement.append(optionElement.clone());
          }
        }

        /* next ... */
        callback();
      }
    };
    /* handles how form data is recorded */
    Constructor.prototype.formDataHandler = function() {
      var $this = this;
      var toCurrencyElement = $this.form.find("#toCurrency");
      var fromCurrencyElement = $this.form.find("#fromCurrency");
      var inputAmountElement = $this.form.find("#currencyAmount");

      toCurrencyElement.on("change", function() {
        var value = $(this).val();
        $this.data.to = (value === "") ? null : value;

        /* show update here */
        $mainRoot.find(".resultCurrencyCode").text(value);
        $mainRoot.find(".resultCurrencyCode").removeClass("hide");
      });

      fromCurrencyElement.on("change", function() {
        var value = $(this).val();
        $this.data.from = (value === "") ? null : value;

        /* show update here */
        $this.form.find(".fromCurrencyCode").text(value);
        $this.form.find(".fromCurrencyCode").removeClass("hide");
      });

      inputAmountElement.on("change keyup paste", function() {
        var value = $(this).val();
        $this.data.value = (value === "") ? 0 : value;
      });
    };
    /* form submission to fetch data */
    Constructor.prototype.formSubmitHandler = function() {
      var $this = this;
      $this.form.on("submit", function(event) {
        event.preventDefault();
        $this.showProcessing();
        $this.hideAllFormErrors();

        var statusObj = {
          fromCurrency: false,
          toCurrency: false,
          currencyAmount: false
        };
        var overallFormStatus = true;

        /* validate and apply status */
        statusObj.fromCurrency = ($this.data.from === null) ? false : true;
        statusObj.toCurrency = ($this.data.to === null) ? false : true;
        statusObj.currencyAmount = ($this.data.value <= 0) ? false : true;

        for (var prop in statusObj) {
          if (statusObj.hasOwnProperty(prop)) {
            if (statusObj[prop] === false) {
              overallFormStatus = false;
              $this.showFormElementError($("#" + prop));
            }
          }
        }

        if (!overallFormStatus) {
          $this.hideProcessing();
        }
        else {
          $this.fetchConversionRate($this.data, function(response) {
            if (response.code === "api-ok") {
              thisapp.smoothScrollToTarget($mainRoot.find("#resultSection"));
              setTimeout(function() {
                $this.renderConversionData(response.payload);
              }, 500);
            }
            else {
              console.log(response);
            }
            setTimeout(function() {
              $this.hideProcessing();
            }, 800);
          });
        }
      });
    };
    /* submit button - show processing */
    Constructor.prototype.showProcessing = function() {
      var $this = this;
      var buttonElement = $this.form.find("#submitButton");
      buttonElement.addClass("processing");
      buttonElement.prop("disabled", true);
    };
    /* submit button - hide processing */
    Constructor.prototype.hideProcessing = function() {
      var $this = this;
      var buttonElement = $this.form.find("#submitButton");
      buttonElement.removeClass("processing");
      buttonElement.prop("disabled", false);
    };
    /* form element error: activate */
    Constructor.prototype.showFormElementError = function(element) {
      element.parent().addClass("error");
    };
    /* form element error: de-activate */
    Constructor.prototype.hideFormElementError = function(element) {
      element.parent().removeClass("error");
    };
    /* form element error: hide all */
    Constructor.prototype.hideAllFormErrors = function() {
      var $this = this;
      $this.form.find(".form-group").removeClass("error");
    };
    /* gets the rates through conversion */
    Constructor.prototype.fetchConversionRate = function(payload, callback) {
      var $this = this;
      var requestUrl = $this.apiHost + "/latest?amount=" + payload.value + "&from=" + payload.from + "&to=" + payload.to;
      $.ajax({
        url: requestUrl,
        method: "get",
      })
      .done(function(response) {
        callback({code: "api-ok", payload: response});
      })
      .fail(function(error) {
        callback({code: "api-fail", payload: error});
      });
    };
    /* renders the result */
    Constructor.prototype.renderConversionData = function(result) {
      var $this = this;
      var keys = Object.keys(result.rates);
      var resultElement = $mainRoot.find("#resultAmount");
      var start = 0;
      var end = (result.rates[keys[0]]).toFixed(2);

      $({value: start}).animate({value: Number(end)}, {
        duration: 1500,
        easing: "linear",
        step: function() {
          resultElement.val(this.value.toFixed(2));
        },
        complete: function() {
          resultElement.val(end);
        }
      });
    };

    return Constructor;
  })();

  function pageControl() {
    new PageHandler().init();
  }

  /* starts here */
  (function() {
    var pagecss = "/assets/css/home/style.css";
    thisapp.loadDeferredCSS(pagecss, function() {
      thisapp.checkWebpSupport(function(webpSupportStatus) {
        hasWebpSupport = webpSupportStatus;
        pageControl();
        setTimeout(function() {
          $("#appLoader").addClass("hide");
          $mainRoot.find("#appRoot").removeClass("hide");
        }, 2500);
      });
    });
  })();
})($("#homePage"), window, document);
