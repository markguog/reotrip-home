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

  // A product whose own date rules leave no selectable day is treated as not bookable.
  function hasSelectableDate(item) {
    if (!item || typeof item.bookableDays !== "number") return true;
    var range = dateWindow(item);
    if (!ISO_DATE.test(range.min) || !ISO_DATE.test(range.max) || range.min > range.max) return false;
    var cursor = range.min;
    var guard = 0;
    while (cursor <= range.max && guard < 400) {
      if (!isClosedWeekday(item, cursor) && !isClosedDate(item, cursor)) return true;
      cursor = addDays(cursor, 1);
      guard += 1;
    }
    return false;
  }

  function bookable(item) {
    return Boolean(item && PAYMENT_LINK.test(item.paymentLink || "") && hasSelectableDate(item));
  }

  // Today where the product is used, as YYYY-MM-DD.
  function localToday(timeZone) {
    var parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timeZone || "Asia/Tokyo",
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
    var today = localToday(item.timeZone);
    var min = addDays(today, typeof item.minDaysAhead === "number" ? item.minDaysAhead : 1);
    var max = addDays(today, item.bookableDays);
    if (ISO_DATE.test(item.lastDate || "") && item.lastDate < max) max = item.lastDate;
    return { min: min, max: max };
  }

  // Weekday of a calendar date in the product's time zone. Noon UTC stays on that
  // calendar date from UTC-11 through UTC+12, which covers Asia/Macau and Asia/Tokyo.
  function weekdayInZone(iso, timeZone) {
    var instant = new Date(iso + "T12:00:00Z");
    if (isNaN(instant.getTime())) return "";
    return new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone || "UTC",
      weekday: "long"
    }).format(instant);
  }

  function isClosedWeekday(item, value) {
    var closed = item && Array.isArray(item.closedWeekdays) ? item.closedWeekdays : [];
    if (!closed.length || !ISO_DATE.test(value || "")) return false;
    var name = weekdayInZone(value, item.timeZone).toLowerCase();
    if (!name) return false;
    for (var i = 0; i < closed.length; i += 1) {
      if (String(closed[i]).toLowerCase() === name) return true;
    }
    return false;
  }

  // Listed calendar dates only. Products that do not set closedDates are unchanged.
  function isClosedDate(item, value) {
    var closed = item && Array.isArray(item.closedDates) ? item.closedDates : [];
    if (!closed.length || !ISO_DATE.test(value || "")) return false;
    for (var i = 0; i < closed.length; i += 1) {
      if (closed[i] === value) return true;
    }
    return false;
  }

  function validDate(item, value) {
    if (!ISO_DATE.test(value || "")) return false;
    var parsed = new Date(value + "T00:00:00Z");
    if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
    if (isClosedWeekday(item, value)) return false;
    if (isClosedDate(item, value)) return false;
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

  // Fill a <ul data-list="name"> from an array of strings; hide its section when empty.
  function setList(root, name, lines) {
    var lists = root.querySelectorAll('[data-list="' + name + '"]');
    var items = Array.isArray(lines) ? lines : [];
    for (var i = 0; i < lists.length; i += 1) {
      lists[i].textContent = "";
      for (var j = 0; j < items.length; j += 1) {
        var li = document.createElement("li");
        li.textContent = String(items[j]);
        lists[i].appendChild(li);
      }
    }
    var sections = root.querySelectorAll('[data-list-section="' + name + '"]');
    for (var k = 0; k < sections.length; k += 1) sections[k].hidden = items.length === 0;
  }

  function show(root, name, visible) {
    var nodes = root.querySelectorAll('[data-state="' + name + '"]');
    for (var i = 0; i < nodes.length; i += 1) nodes[i].hidden = !visible;
  }

  // Home: the static product list is visible without JavaScript; the script removes any
  // card that cannot be paid for and hides the block when none is left.
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
    var closedError = form.querySelector("[data-booking-closed]");
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
    function showDateError() {
      var closed = isClosedWeekday(item, date.value);
      var blocked = isClosedDate(item, date.value);
      if (closedError) closedError.hidden = !closed;
      var blockedError = form.querySelector("[data-booking-closed-date]");
      if (blockedError) blockedError.hidden = !blocked;
      if (error) error.hidden = true;
      // A closed weekday or a listed closed date cannot continue.
      // Products that set neither are unchanged.
      var hasWeekdays = item.closedWeekdays && item.closedWeekdays.length;
      var hasDates = item.closedDates && item.closedDates.length;
      if (hasWeekdays || hasDates) submit.disabled = (hasWeekdays && closed) || (hasDates && blocked);
      return closed || blocked;
    }
    date.addEventListener("input", showDateError);
    date.addEventListener("change", showDateError);
    form.addEventListener("submit", function (event) {
      var closed = showDateError();
      if (closed || !validDate(item, date.value) || !ticket(item, select.value)) {
        event.preventDefault();
        if (!closed && error) error.hidden = false;
        return;
      }
      if (error) error.hidden = true;
      if (closedError) closedError.hidden = true;
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
    setList(root, "nextSteps", item.reviewNextSteps);
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
    setList(root, "nextSteps", item.confirmedNextSteps);
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
