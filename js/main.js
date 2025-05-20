$(document).ready(function () {
  SmoothScroll({
    animationTime: 700,
    stepSize: 75,
    accelerationDelta: 20,
    accelerationMax: 2,
    keyboardSupport: true,
    arrowScroll: 70,
    pulseAlgorithm: true,
    pulseScale: 4,
    pulseNormalize: 1,
    touchpadSupport: true,
  });

  var scene = document.getElementById("parallax_scene");
  var parallax = new Parallax(scene);

  $(function () {
    var last_id;
    var $top_menu = $(".side_bar__menu");
    var menu_height = $top_menu.outerHeight(true);
    var $menu_items = $top_menu.find("a");
    var $scroll_items = $menu_items.map(function () {
      var item = $($(this).attr("href"));
      if (item.length) {
        return item;
      }
    });

    $(window).scroll(function () {
      var from_top = $(this).scrollTop() + menu_height;
      var mar = parseInt($top_menu.css("margin-bottom"));
      var cur = $scroll_items.map(function () {
        if ($(this).offset().top < from_top + mar) {
          return this;
        }
      });
      cur = cur[cur.length - 1];
      var id = cur && cur.length ? cur[0].id : "";
      if (last_id !== id) {
        last_id = id;
        $menu_items
          .parent()
          .removeClass("side_bar__menu_active_link")
          .end()
          .filter("[href='#" + id + "']")
          .parent()
          .addClass("side_bar__menu_active_link");
      }
    });
  });

  $(function () {
    $(".check").click(function () {
      $(".side_bar").toggleClass("active");
    });
    $("#menu").on("click", "a", function () {
      if ($(window).width() <= 1310) {
        $(".side_bar").toggleClass("active");
        $('[name^="menu"]').prop({ checked: false });
      }
    });
  });

  $("#menu").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1200);
  });

  $("#offer").on("click", "a", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 1200);
  });

  $(function () {
    function copyToClipboard(element) {
      var $temp = $("<input>");
      $("body").append($temp);
      $temp.val($(element).text()).select();
      document.execCommand("copy");
      $temp.remove();
    }

    $(".header__server").on("click", function () {
      copyToClipboard("#server_ip");
      $(".header__server_ip_copy_alert").animate({ opacity: 1 }, "slow");
      $(".header__server_ip_copy_alert").animate({ opacity: 0 }, "slow");
    });
  });

  var target = $(".about__content_title");
  var targetPos = target.offset().top;
  var winHeight = $(window).height();
  var scrollToElem = targetPos - winHeight;
  $(window).scroll(function () {
    var winScrollTop = $(this).scrollTop();
    if (winScrollTop > scrollToElem) {
      $(".side_bar__logo").css("transform", "translateX(0%)");
      $(".side_bar__logo").css("opacity", "1");
    } else {
      $(".side_bar__logo").css("transform", "translateX(-160%)");
      $(".side_bar__logo").css("opacity", "0");
    }
  });

  var xhr = new XMLHttpRequest();
  var url = "https://api.minetools.eu/ping/your_ip";

  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var jsonData = JSON.parse(xhr.responseText);
      showOnline(jsonData);
    }
  };

  xhr.open("GET", url, true);
  xhr.send();

  function showOnline(data) {
    var output = "Онлайн: " + data.players.online + "/" + data.players.max;

    document.getElementById("server_online").innerHTML = output;
  }

  $(function () {
    $(".bottom_alert_button").click(function () {
      document.getElementById("bottom_alert").style.display = "none";
    });
  });
  $(window).scroll(function () {
    if ($(this).scrollTop() > 900) {
      document.getElementById("bottom_alert").style.bottom = "2%";
    }
  });

  $(document).ready(function () {
    $(".faq__content_question_spoiler .block").show();
    $(".close .block").hide();
    $(".faq__content_question_spoiler h2").click(function () {
      $(this).toggleClass("icon").next().slideToggle(400);
    });
  });

  function reveal() {
    var reveals = document.querySelectorAll(".reveal");

    for (var i = 0; i < reveals.length; i++) {
      var windowHeight = window.innerHeight;
      var elementTop = reveals[i].getBoundingClientRect().top;
      var elementVisible = 120;

      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add("active");
      } else {
        reveals[i].classList.remove("active");
      }
    }
  }

  window.addEventListener("scroll", reveal);

  var modal = document.getElementById("modal_window");
  var survival = document.getElementById("survival_modal_button");
  var economy = document.getElementById("economy_modal_button");
  var dungeons = document.getElementById("dungeons_modal_button");
  var battlepass = document.getElementById("events_modal_button");
  var agreement = document.getElementById("agreement_modal_button");
  var close = document.getElementsByClassName("close_modal")[0];
  const prevent = (ev) => ev.preventDefault();

  survival.onclick = function () {
    $(".funs__content_overlay_info_box h2").html("Сайт Россия");
    $(".funs__content_overlay_info_box p").html(
      'Сайт необычный, подходит для РЖД, создан чтобы тренироваться на своих знаниях. <a href="https://www.senyer7.site/sites/russia" target="_blank" style="text-decoration: underline; color: blue;">https://www.senyer7.site/sites/russia</a>'
    );
    $(".funs__content_overlay").fadeIn();
    $(".funs__content_overlay_info").addClass("modal-show-animation");
  };

  economy.onclick = function () {
    $(".funs__content_overlay_info_box h2").html("Сайт Закрывающий Тег");
    $(".funs__content_overlay_info_box p").html(
      'Мой восхитительный проект по окончании лета, показывает то, как я могу делать сайты. <a href="https://www.senyer7.site/sites/teg-main" target="_blank" style="text-decoration: underline; color: blue;">https://www.senyer7.site/sites/teg-main</a>'
    );
    $(".funs__content_overlay").fadeIn();
    $(".funs__content_overlay_info").addClass("modal-show-animation");
  };

  dungeons.onclick = function () {
    $(".funs__content_overlay_info_box h2").html("Сайт Место");
    $(".funs__content_overlay_info_box p").html(
      'Место - не всегда что мы имеем ввиду, это может быть проект, а могут быть удивительные места на нашей планете. <br /> <a href="https://www.senyer7.site/sites/mesto" target="_blank" style="text-decoration: underline; color: blue;">https://www.senyer7.site/sites/mesto</a>'
    );
    $(".funs__content_overlay").fadeIn();
    $(".funs__content_overlay_info").addClass("modal-show-animation");
  };

  battlepass.onclick = function () {
    $(".funs__content_overlay_info_box h2").html("Сайт Посмотри в Окно");
    $(".funs__content_overlay_info_box p").html(
      'Данное произведение создано мной в качестве показать как видео могут нас вдохновлять и как можно это преобразить в интересный формат. <a href="https://www.senyer7.site/sites/okno" target="_blank" style="text-decoration: underline; color: blue;">https://www.senyer7.site/sites/okno</a>'
    );
    $(".funs__content_overlay").fadeIn();
    $(".funs__content_overlay_info").addClass("modal-show-animation");
  };

  agreement.onclick = function () {
    $(".funs__content_overlay_info_box h2").html("Соглашение");
    $(".funs__content_overlay_info_box p").html(
      "Покупка доната является исключительно вашей инициативой. Возврат израсходованных средств не предоставляется ни при каких условиях. Покупая донат вы автоматически подписываетесь под этим соглашением. <br><br>При грубом нарушении правил (многочисленные оскорбления, читы, гриферство и т.п.) донатер может потерять свою привилегию без возможности возврата израсходованных средств."
    );
    $(".funs__content_overlay").fadeIn();
    $(".funs__content_overlay_info").addClass("modal-show-animation");
  };

  close.onclick = function () {
    $(".funs__content_overlay").fadeOut("fast");
    $(".funs__content_overlay_info").removeClass("modal-show-animation");
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      $(".funs__content_overlay").fadeOut("fast");
      $(".funs__content_overlay_info").removeClass("modal-show-animation");
    }
  };
});

// ЗИМА WINTER

const canvas = document.getElementById("snowCanvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas(); // Установить начальный размер канваса

let snowflakes = [];

function createSnowflake() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  const radius = Math.random() * 4 + 1;
  const speed = Math.random() * 1 + 0.5;

  snowflakes.push({ x, y, radius, speed });
}

function updateSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snowflakes.length; i++) {
    const flake = snowflakes[i];
    flake.y += flake.speed;

    if (flake.y > canvas.height) {
      flake.y = -flake.radius;
      flake.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  requestAnimationFrame(updateSnowflakes);
}

// Устанавливаем количество снежинок в зависимости от ширины экрана
const numberOfSnowflakes =
  window.innerWidth < 600 ? 30 : window.innerWidth < 900 ? 50 : 100;

for (let i = 0; i < numberOfSnowflakes; i++) {
  createSnowflake();
}

updateSnowflakes();

// Добавляем обработчик события для изменения размера окна
window.addEventListener("resize", () => {
  resizeCanvas();
  // Обновляем количество снежинок при изменении размера
  snowflakes = [];
  const newNumberOfSnowflakes =
    window.innerWidth < 600 ? 30 : window.innerWidth < 900 ? 50 : 100;
  for (let i = 0; i < newNumberOfSnowflakes; i++) {
    createSnowflake();
  }
});
