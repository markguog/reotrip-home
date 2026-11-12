// reotrip.com static shop. Pure front end: no storage, no cookies, no network
// requests. Guest details (quantity, name, email, phone, card) are entered only on
// the Stripe payment page.
(function () {
  "use strict";

  var shop = window.REOTRIP_SHOP;
  var products = shop && shop.products && typeof shop.products === "object" ? shop.products : {};
  var PAYMENT_LINK = /^https:\/\/buy\.stripe\.com\/[A-Za-z0-9]+$/;
  var ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
  // The Payment Link is in live mode, so a real return carries a live Checkout Session id.
  var SESSION_ID = /^cs_live_[A-Za-z0-9]{20,}$/;

  function product(code) {
    return Object.prototype.hasOwnProperty.call(products, code) ? products[code] : null;
  }

  function bookable(item) {
    return Boolean(item && PAYMENT_LINK.test(item.paymentLink || ""));
  }

  // Today in Japan, as YYYY-MM-DD.
  function japanToday() {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).formatToParts(new Date());
    var get = function (type) {
      for (var i = 0; i < parts.length; i += 1) if (parts[i].type === type) return parts[i].value;
      return "";
    };
    return get("year") + "-" + get("month") + "-" + get("day");
  }

  function addDays(iso, days) {
    var date = new Date(iso + "T00:00:00Z");
    date.setUTCDate(date.getUTCDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function dateWindow(item) {
    var today = japanToday();
    return { min: addDays(today, 1), max: addDays(today, item.bookableDays) };
  }

  function validDate(item, value) {
    if (!ISO_DATE.test(value || "")) return false;
    var parsed = new Date(value + "T00:00:00Z");
    if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
    var range = dateWindow(item);
    return value >= range.min && value <= range.max;
  }

  function ticket(item, code) {
    for (var i = 0; i < item.tickets.length; i += 1) if (item.tickets[i].code === code) return item.tickets[i];
    return null;
  }

  function longDate(iso) {
    return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", {
      timeZone: "UTC",
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  // Letters, digits and underscores only, e.g. harukas300_20261120_adult.
  function referenceId(code, date, ticketCode) {
    return code + "_" + date.replace(/-/g, "") + "_" + ticketCode;
  }

  function paymentHref(item, reference) {
    if (!bookable(item)) return null;
    return item.paymentLink + "?client_reference_id=" + encodeURIComponent(reference) + "&locale=en";
  }

  function setText(root, name, value) {
    var nodes = root.querySelectorAll('[data-field="' + name + '"]');
    for (var i = 0; i < nodes.length; i += 1) nodes[i].textContent = value;
  }

  function show(root, name, visible) {
    var nodes = root.querySelectorAll('[data-state="' + name + '"]');
    for (var i = 0; i < nodes.length; i += 1) nodes[i].hidden = !visible;
  }

  // Home: the products block ships hidden; it is shown only with a card that can be paid for.
  function cards() {
    var nodes = document.querySelectorAll("[data-shop-card]");
    for (var i = 0; i < nodes.length; i += 1) {
      if (!bookable(product(nodes[i].getAttribute("data-shop-card")))) nodes[i].remove();
    }
    var blocks = document.querySelectorAll("[data-shop-products]");
    for (var j = 0; j < blocks.length; j += 1) {
      blocks[j].hidden = !blocks[j].querySelector("[data-shop-card]");
    }
  }

  // Product page: date and ticket go to the review page in the URL.
  function bookingForm() {
    var form = document.querySelector("form[data-shop-booking]");
    if (!form) return;
    var item = product(form.getAttribute("data-shop-booking"));
    var date = form.querySelector('input[name="date"]');
    var select = form.querySelector('select[name="ticket"]');
    var submit = form.querySelector('button[type="submit"]');
    var error = form.querySelector("[data-booking-error]");
    // The controls ship disabled and are enabled only for a product that can be paid for.
    if (!bookable(item)) {
      show(document, "unavailable", true);
      return;
    }
    var range = dateWindow(item);
    date.min = range.min;
    date.max = range.max;
    date.disabled = false;
    select.disabled = false;
    submit.disabled = false;
    form.addEventListener("submit", function (event) {
      if (!validDate(item, date.value) || !ticket(item, select.value)) {
        event.preventDefault();
        error.hidden = false;
        return;
      }
      error.hidden = true;
    });
  }

  function backLinks(root, item) {
    var nodes = root.querySelectorAll("[data-back]");
    for (var i = 0; i < nodes.length; i += 1) nodes[i].setAttribute("href", "../../" + item.path);
  }

  // Review page: everything comes from the URL and the product data.
  function review() {
    var root = document.querySelector("[data-shop-review]");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var code = params.get("p") || "";
    var item = product(code);
    var date = params.get("date") || "";
    var chosen = item ? ticket(item, params.get("ticket") || "") : null;
    var pay = root.querySelector("[data-pay]");
    show(root, "fallback", false);
    if (!item || !chosen || !validDate(item, date)) {
      show(root, "summary", false);
      show(root, "invalid", true);
      if (item) backLinks(root, item);
      return;
    }
    show(root, "invalid", false);
    show(root, "summary", true);
    setText(root, "name", item.name);
    setText(root, "location", item.location);
    setText(root, "date", longDate(date));
    setText(root, "ticket", chosen.label);
    setText(root, "price", chosen.priceLabel);
    setText(root, "cancellation", item.cancellation);
    setText(root, "payment", item.payment);
    backLinks(root, item);
    var href = paymentHref(item, referenceId(code, date, chosen.code));
    if (href) {
      pay.setAttribute("href", href);
      pay.removeAttribute("aria-disabled");
      pay.classList.remove("disabled");
    } else {
      show(root, "unavailable", true);
    }
  }

  // Confirmation: "Payment received" only on a return from Stripe with a session id.
  function confirmed() {
    var root = document.querySelector("[data-shop-confirmed]");
    if (!root) return;
    var params = new URLSearchParams(window.location.search);
    var item = product(params.get("p") || "");
    var session = params.get("session_id") || "";
    if (!item || !SESSION_ID.test(session)) {
      show(root, "paid", false);
      show(root, "unknown", true);
      return;
    }
    show(root, "unknown", false);
    show(root, "paid", true);
    setText(root, "name", item.name);
    // The trailing part of the Checkout Session id, case kept (Stripe ids are case-sensitive).
    setText(root, "reference", session.slice(-10));
  }

  // Each page uses one of these; a failure in one leaves its page in the closed state.
  [cards, bookingForm, review, confirmed].forEach(function (run) {
    try {
      run();
    } catch (err) {
      // Nothing is enabled or revealed when a step fails.
    }
  });
})();
