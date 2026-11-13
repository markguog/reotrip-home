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
      if (!isClosedWeekday(item, cursor) && !isClosedDate(item, cursor)) {
        if (!datePriceTiers(item) || tierForDate(item, cursor)) return true;
      }
      cursor = addDays(cursor, 1);
      guard += 1;
    }
    return false;
  }

  function bookable(item) {
    if (!item) return false;
    // A tiered product is for sale when one of its tiers has a day the guest can pay for.
    if (datePriceTiers(item)) return hasSelectableDate(item);
    return Boolean(PAYMENT_LINK.test(item.paymentLink || "") && hasSelectableDate(item));
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

  // Absent, or not an array, means the product has one price. An empty list is a
  // product whose dates are not for sale.
  function datePriceTiers(item) {
    return item && Array.isArray(item.datePrices) ? item.datePrices : null;
  }

  function tierCovers(tier, iso) {
    var ranges = tier && Array.isArray(tier.ranges) ? tier.ranges : [];
    for (var i = 0; i < ranges.length; i += 1) {
      var span = ranges[i];
      if (!Array.isArray(span) || span.length < 2) continue;
      if (iso >= span[0] && iso <= span[1]) return true;
    }
    return false;
  }

  // The tier that actually sells this date. A tier with an empty payment link
  // does not sell its dates, and the product's own paymentLink is not a fallback.
  function tierForDate(item, iso) {
    var tiers = datePriceTiers(item);
    if (!tiers || !ISO_DATE.test(iso || "")) return null;
    for (var i = 0; i < tiers.length; i += 1) {
      if (tierCovers(tiers[i], iso) && PAYMENT_LINK.test(tiers[i].paymentLink || "")) return tiers[i];
    }
    return null;
  }

  function priceAmount(label) {
    var match = String(label || "").match(/(\d+\.\d{2})/);
    return match ? Number(match[1]) : Infinity;
  }

  function lowestTierLabel(item) {
    var tiers = datePriceTiers(item);
    if (!tiers) return "";
    var best = "";
    var bestAmount = Infinity;
    for (var i = 0; i < tiers.length; i += 1) {
      var amount = priceAmount(tiers[i].priceLabel);
      if (amount < bestAmount) {
        bestAmount = amount;
        best = tiers[i].priceLabel || "";
      }
    }
    return best;
  }

  function tierHasSelectableDay(item, tier) {
    if (!tier || !PAYMENT_LINK.test(tier.paymentLink || "")) return false;
    var range = dateWindow(item);
    if (!ISO_DATE.test(range.min) || !ISO_DATE.test(range.max) || range.min > range.max) return false;
    var cursor = range.min;
    var guard = 0;
    while (cursor <= range.max && guard < 400) {
      if (tierCovers(tier, cursor) && !isClosedWeekday(item, cursor) && !isClosedDate(item, cursor)) return true;
      cursor = addDays(cursor, 1);
      guard += 1;
    }
    return false;
  }

  // Lowest tier that still has a day the guest can choose in the current window.
  function lowestOpenTierLabel(item) {
    var tiers = datePriceTiers(item);
    if (!tiers) return "";
    var best = "";
    var bestAmount = Infinity;
    for (var i = 0; i < tiers.length; i += 1) {
      if (!tierHasSelectableDay(item, tiers[i])) continue;
      var amount = priceAmount(tiers[i].priceLabel);
      if (amount < bestAmount) {
        bestAmount = amount;
        best = tiers[i].priceLabel || "";
      }
    }
    return best;
  }

  function validDate(item, value) {
    if (!ISO_DATE.test(value || "")) return false;
    var parsed = new Date(value + "T00:00:00Z");
    if (isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) return false;
    if (isClosedWeekday(item, value)) return false;
    if (isClosedDate(item, value)) return false;
    var range = dateWindow(item);
    if (value < range.min || value > range.max) return false;
    if (datePriceTiers(item) && !tierForDate(item, value)) return false;
    return true;
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

  function paymentHref(item, reference, visitDate) {
    if (!bookable(item)) return null;
    var link = item.paymentLink;
    if (datePriceTiers(item)) {
      var tier = tierForDate(item, visitDate);
      if (!tier) return null;
      link = tier.paymentLink;
    }
    if (!PAYMENT_LINK.test(link || "")) return null;
    return link + "?client_reference_id=" + encodeURIComponent(reference) + "&locale=en";
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
      var cardItem = product(nodes[i].getAttribute("data-shop-card"));
      if (!bookable(cardItem)) {
        nodes[i].remove();
        continue;
      }
      if (datePriceTiers(cardItem)) {
        var openLabel = lowestOpenTierLabel(cardItem);
        var priceNode = nodes[i].querySelector(".shop-card-price");
        if (priceNode && openLabel) priceNode.textContent = "From " + openLabel;
      }
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
    function paintVisitPrice() {
      if (!datePriceTiers(item)) return;
      var tier = validDate(item, date.value) ? tierForDate(item, date.value) : null;
      var shown = tier ? tier.priceLabel : ("From " + lowestTierLabel(item));
      var lede = document.querySelector("p.shop-lede");
      if (lede) lede.textContent = shown;
      var terms = document.querySelectorAll("dt");
      for (var i = 0; i < terms.length; i += 1) {
        if (terms[i].textContent === "Price" && terms[i].nextElementSibling) {
          terms[i].nextElementSibling.textContent = shown;
        }
      }
      var options = select.querySelectorAll("option");
      for (var j = 0; j < options.length; j += 1) {
        var text = options[j].textContent;
        var cut = text.lastIndexOf(" · ");
        if (cut >= 0) options[j].textContent = text.slice(0, cut) + " · " + shown;
      }
    }
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
      var untiered = Boolean(datePriceTiers(item) && ISO_DATE.test(date.value || "") && !tierForDate(item, date.value) && !closed && !blocked);
      if (hasWeekdays || hasDates) submit.disabled = (hasWeekdays && closed) || (hasDates && blocked) || untiered;
      else if (datePriceTiers(item)) submit.disabled = untiered;
      if (untiered && error) error.hidden = false;
      paintVisitPrice();
      return closed || blocked || untiered;
    }
    date.addEventListener("input", showDateError);
    date.addEventListener("change", showDateError);
    if (datePriceTiers(item)) showDateError();
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
    var dayTier = datePriceTiers(item) ? tierForDate(item, date) : null;
    setText(root, "price", dayTier ? dayTier.priceLabel : chosen.priceLabel);
    setText(root, "cancellation", item.cancellation);
    setText(root, "payment", item.payment);
    setList(root, "nextSteps", item.reviewNextSteps);
    backLinks(root, item);
    var href = paymentHref(item, referenceId(code, date, chosen.code), date);
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
