var TrademcAPI = {};
(function (self) {
  var SCI_ADDRESS = "https://pay.trademc.org/",
    API_ADDRESS = "https://api.trademc.org/",
    API_VERSION = 3;

  var defaultStylesPath = API_ADDRESS + "/widgets/v1/",
    userStyles = [];

  self.GetOnline = function (params) {
    params = extend(params, {
      Shop: 1,
      TextMask: "Онлайн: {players} из {max_players}. Версия {version}",
      UIColor: "#333",
      Styles: defaultStylesPath + "online.css",
      PastPlaceID: "trademc-online",
    });

    loadCss(params.Styles);
    getJSON("getOnline", { shop: params.Shop }, function (data) {
      console.log(params);

      var message,
        container = document.getElementById(params.PastPlaceID),
        blockStatus = "";

      if (data.response) {
        message = params.TextMask.replace(/{players}/g, data.response.players)
          .replace(/{max_players}/g, data.response.max_players)
          .replace(/{version}/g, data.response.version);

        var perc = parseFloat(
          (data.response.players / data.response.max_players) * 100
        ).toFixed(2);

        blockStatus =
          '\
	                <div class="trademc-online-progressbar">\
				        <div class="trademc-online-progressbar-line" style="background-color:' +
          params.UIColor +
          "; width:" +
          perc +
          '%"></div>\
			        </div>';
      } else {
        message = data.error.message;
      }

      var html =
        '\
            	<div style="color:' +
        params.UIColor +
        '" class="trademc-online">\
			        <p class="trademc-online-description">' +
        message +
        "</p>\
			        " +
        blockStatus +
        "\
		        </div>";

      container.innerHTML = html;
    });
  };

  self.GetBuyForm = function (params) {
    params = extend(params, {
      Shop: 1,
      Title: "Купить донат",
      Nickname: "Введите ваш никнейм",
      Items: "Выберите товар",
      Coupon: "Промокод (если есть)",
      Button: ">> Далее",
      Success_URL: "https://trademc.org",
      Pending_URL: "https://trademc.org",
      Fail_URL: "https://trademc.org",
      Styles: defaultStylesPath + "buyform.css",
      PastPlaceID: "trademc-buyform",
    });

    loadCss(params.Styles);
    getJSON("getItems", { shop: params.Shop }, function (data) {
      var container = document.getElementById(params.PastPlaceID);

      if (data.error) {
        container.innerHTML = data.error.message;
        return;
      }

      var html = "",
        fieldsList = {};

      for (var i = 0; i < data.response.categories.length; i++) {
        var itemsHtml = "";

        for (var n = 0; n < data.response.categories[i].items.length; n++) {
          var item = data.response.categories[i].items[n];

          itemsHtml +=
            '<option value="' +
            item.id +
            '">' +
            item.name +
            (item.sale ? " (-" + item.sale.percent + "%)" : "") +
            " — " +
            item.cost +
            " Р</option>";

          if (item.fields) {
            fieldsList[item.id] = "";

            for (var j = 0; j < item.fields.length; j++) {
              fieldsList[item.id] +=
                '<input maxlength="64" name="user_fields[' +
                item.id +
                "][" +
                item.fields[j].id +
                ']" class="trademc-buyform-input" placeholder="' +
                item.fields[j].placeholder +
                '">';
            }
          }
        }

        if (
          data.response.categories.length == 1 &&
          data.response.categories[0].id == 0
        )
          html += itemsHtml;
        else
          html +=
            '<optgroup label="' +
            data.response.categories[i].name +
            '">' +
            itemsHtml +
            "</optgroup>";
      }

      html =
        '\
            	<div class="trademc-buyform">\
			        <div class="trademc-buyform-title">' +
        params.Title +
        '</div>\
			        <form class="trademc-buyform-form">\
				        <input name="buyer" class="trademc-buyform-input" placeholder="' +
        params.Nickname +
        '">\
				        <div class="trademc-buyform-select">\
					        <select name="items">\
					        	<option disabled selected>' +
        params.Items +
        "</option>\
					        	" +
        html +
        '\
					        </select>\
				        </div>\
				        <div class="trademc-buyform-userfields"></div>\
				        <input name="coupon" class="trademc-buyform-input" placeholder="' +
        params.Coupon +
        '">\
		                <button class="trademc-buyform-button" type="submit">' +
        params.Button +
        '</button>\
				        <div class="trademc-buyform-error"></div>\
			        </form>\
		        </div>';

      container.innerHTML = html;

      addEvent(".trademc-buyform-select > select", "change", function () {
        var userFields = this.parentNode.parentNode.querySelector(
          ".trademc-buyform-userfields"
        );
        userFields.innerHTML = "";

        var id = this.value;
        if (fieldsList.hasOwnProperty(id))
          userFields.innerHTML = fieldsList[id];
      });

      addEvent(".trademc-buyform-form", "submit", function (e) {
        e = e || window.event;
        e.preventDefault();

        var form = this,
          button = form.querySelector(".trademc-buyform-button"),
          errorBlock = form.querySelector(".trademc-buyform-error");

        if (button.classList.contains("load")) return;

        button.classList.add("load");
        errorBlock.innerHTML = "";

        getJSON("buyItems", serialize(form), function (data) {
          button.classList.remove("load");

          if (data.error) {
            errorBlock.innerHTML = data.error.message;
            return;
          }

          var formParams = {
            success_url: params.Success_URL,
            pending_url: params.Pending_URL,
            fail_url: params.Fail_URL,
            cart_id: data.response.cart_id,
          };

          var body = document.getElementsByTagName("body")[0];

          var form = document.createElement("form");
          form.method = "get";
          form.style.display = "none";
          form.action = SCI_ADDRESS;

          for (var key in formParams) {
            if (!formParams.hasOwnProperty(key)) continue;
            form.innerHTML +=
              '<input type="hidden" name="' +
              key +
              '" value="' +
              formParams[key] +
              '">';
          }

          body.appendChild(form);
          form.submit();
        });
      });

      function addEvent(element, event, callback) {
        element = document.querySelectorAll(
          "#" + params.PastPlaceID + " " + element
        );
        for (var i = 0; i < element.length; i++) {
          element[i].addEventListener(event, callback);
        }
      }
    });
  };

  function getJSON(method, params, callback) {
    params.v = API_VERSION;
    var stringParams = Object.keys(params)
      .map(function (key) {
        return key + "=" + encodeURIComponent(params[key]);
      })
      .join("&");

    var XHR = window.XDomainRequest || window.XMLHttpRequest;
    var xhr = new XHR();

    xhr.open("GET", API_ADDRESS + "shop." + method + "?" + stringParams, true);
    xhr.onload = function () {
      var answer = JSON.parse(xhr.responseText);
      callback(answer);
    };
    xhr.onerror = function () {
      callback({ error: { message: "Помилка." } });
    };
    xhr.send();
  }

  function extend(target, source) {
    if (!target) return source;

    for (var key in source) {
      if (typeof target[key] === "undefined") {
        target[key] = source[key];
      }
    }

    return target;
  }

  function loadCss(path) {
    if (userStyles.indexOf(path) != -1) return;

    var style = document.createElement("link");
    style.href = path;
    style.type = "text/css";
    style.rel = "stylesheet";
    style.async = true;
    document.getElementsByTagName("head")[0].appendChild(style);

    userStyles.push(path);
  }

  function serialize(form) {
    var opt = null,
      result = {};
    form = form || document.forms[0];

    for (var i = 0; i < form.elements.length; ++i) {
      var el = form.elements[i];
      switch (el.tagName) {
        case "INPUT": {
          switch (el.type.toLowerCase()) {
            case "checkbox":
            case "radio":
              if (el.checked) result[el.name] = el.value;
              break;

            case "text":
            case "password":
            case "hidden":
              result[el.name] = el.value;
              break;
          }
          break;
        }
        case "SELECT": {
          opt = el.options[el.selectedIndex];
          result[el.name] = opt.value || opt.innerText;
          break;
        }
        case "TEXTAREA": {
          result[el.name] = el.value;
          break;
        }
      }
    }

    return result;
  }
})(TrademcAPI);
