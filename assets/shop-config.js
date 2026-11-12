// Bookable products on reotrip.com. One entry per product; a product without a
// payment link is shown as not bookable. The payment link is a public Stripe
// Payment Link address (not a secret). Source of each link: reo-ops
// _cowork/codex_artifacts/REOTRIP-STRIPE-LINKS-<UTC>/links.json.
// To stop selling a product, set its paymentLink to "" and keep the entry: the
// order-status page needs the entry to show a returning guest's payment.
// Travel dates run from minDaysAhead (default 1) to bookableDays after today in the
// product's timeZone, and never past lastDate when one is set.
// closedWeekdays, when set, lists English weekday names in that same time zone.
// A date on one of those weekdays cannot be booked.
// closedDates, when set, lists YYYY-MM-DD values in that same window.
// A listed date cannot be booked. Products that do not set it are unchanged.
// A product with a payment link but no selectable day in its own window is not bookable.
// reviewNextSteps / confirmedNextSteps fill "What happens next" on the review and
// order-status pages.
window.REOTRIP_SHOP = {
  products: {
    harukas300: {
      name: "Osaka Abeno Harukas 300 Observatory Ticket",
      path: "en/japan/osaka-abeno-harukas-300-observatory-ticket-p162/",
      location: "Osaka, Japan",
      priceLabel: "HKD 121.15",
      tickets: [{ code: "adult", label: "Observatory Ticket, Adult", priceLabel: "HKD 121.15" }],
      cancellation: "Non-refundable rate: no refund on cancellation",
      payment: "Card payment in HKD",
      // Travel dates: from tomorrow (Japan time) through this many days ahead,
      // inside the voucher's validity of about six months from purchase.
      timeZone: "Asia/Tokyo",
      bookableDays: 180,
      reviewNextSteps: [
        "After payment, your e-voucher is sent by email from order@reotrip.com as a PDF attachment.",
        "The e-voucher is valid for about six months from the date of purchase."
      ],
      confirmedNextSteps: [
        "Your e-voucher is sent by email from order@reotrip.com as a PDF attachment, to the address you gave at checkout.",
        "The e-voucher is valid for about six months from the date of purchase.",
        "Redeem it at the HARUKAS 300 observatory information counter on the 16th floor (16F) of Abeno Harukas."
      ],
      paymentLink: "https://buy.stripe.com/cNi6oI88mdnW46vgCjgfu04"
    },
    teamlabmacao: {
      name: "TeamLab SuperNature Macao Admission Ticket",
      path: "en/hongkong-macau/teamlab-supernature-macao-admission-ticket-p54/",
      location: "Macao",
      priceLabel: "HKD 396.15",
      tickets: [{ code: "adult", label: "Adult, age 13-100", priceLabel: "HKD 396.15" }],
      cancellation: "Non-refundable. The booking cannot be changed for any reason, and a cancellation or change request does not refund the amount paid.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      // Visit dates: 5 days ahead in Macao, for 60 days, not after the last listed opening day.
      // Wednesdays are not available for this ticket.
      timeZone: "Asia/Macau",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-05-30",
      closedWeekdays: ["Wednesday"],
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "Show the official e-ticket to enter. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to the address you gave at checkout. Check your spam folder.",
        "Show the official e-ticket to enter. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/8x2aEYewK6ZyauT1Hpgfu05"
    },
    shanghaihappyvalley: {
      name: "Shanghai Happy Valley One Day Adventure Pass",
      path: "en/china/shanghai-happy-valley-one-day-adventure-pass-p251/",
      location: "Shanghai, China",
      priceLabel: "HKD 451.00",
      tickets: [{ code: "adult", label: "Adult, age 18-59", priceLabel: "HKD 451.00" }],
      cancellation: "Non-refundable. A sold ticket cannot be refunded or changed.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Shanghai",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-11-02",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails your mobile admission voucher. Check your spam folder. A payment receipt and our order confirmation email are not entry tickets.",
        "Show a valid identity document and the admission code on the voucher."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails your mobile admission voucher to the address you gave at checkout. Check your spam folder. A payment receipt and our order confirmation email are not entry tickets.",
        "Show a valid identity document and the admission code on the voucher."
      ],
      paymentLink: "https://buy.stripe.com/6oU00k60e5VuauTcm3gfu0b"
    },
    yugardenmorning: {
      name: "Shanghai Yu Garden Admission Ticket - Morning Session",
      path: "en/china/shanghai-yu-garden-admission-ticket-p437/",
      location: "Shanghai, China",
      priceLabel: "HKD 74.00",
      tickets: [{ code: "adult", label: "Adult, age 18-99", priceLabel: "HKD 74.00" }],
      cancellation: "Non-refundable. A sold ticket cannot be refunded or changed.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Shanghai",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-11-02",
      closedWeekdays: ["Monday"],
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The official electronic ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "Show the official electronic ticket and your original passport or identity document to staff. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The official electronic ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to the address you gave at checkout. Check your spam folder.",
        "Show the official electronic ticket and your original passport or identity document to staff. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/8x25kE1JYfw46eD2Ltgfu0c"
    },
    keio1day: {
      name: "Keio and Inokashira Lines 1-Day Ticket",
      path: "en/japan/keio-and-inokashira-lines-1-day-ticket/",
      location: "Tokyo, Japan",
      priceLabel: "HKD 53.48",
      tickets: [{ code: "adult", label: "Adult, age 12 and above", priceLabel: "HKD 53.48" }],
      cancellation: "Cancel for a full refund at least 24 hours before the visit date (Japan time) by emailing order@reotrip.com before that deadline. Used or expired tickets are not refunded. A cancellation that is not requested before the deadline is not refunded.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Tokyo",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-01-16",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails the link to your electronic ticket. Check your spam folder. A payment receipt and our order confirmation email are not the ticket.",
        "Open the link in a browser on a phone that is online, and show the live QR code at the ticket gate. Screenshots and printouts cannot be used."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails the link to your electronic ticket to the address you gave at checkout. Check your spam folder. A payment receipt and our order confirmation email are not the ticket.",
        "Open the link in a browser on a phone that is online, and show the live QR code at the ticket gate. Screenshots and printouts cannot be used."
      ],
      paymentLink: "https://buy.stripe.com/6oU14o60e6ZybyX5XFgfu0d"
    },
    kyototower: {
      name: "Nidec Kyoto Tower Ticket",
      path: "en/japan/nidec-kyoto-tower-ticket/",
      location: "Kyoto, Japan",
      priceLabel: "HKD 49.91",
      tickets: [{ code: "adult", label: "Adult", priceLabel: "HKD 49.91" }],
      cancellation: "This ticket cannot be cancelled and cannot be refunded.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Tokyo",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-02-03",
      closedDates: ["2027-01-01"],
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails your mobile voucher. Check your spam folder. A payment receipt and our order confirmation email are not entry tickets.",
        "Show the mobile voucher to enter. Do not open the redemption link in your voucher before you arrive. Opening it uses the ticket.",
        "The ticket is valid for 90 days from the date we confirm your order, until 20:30 on the last day."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "order@reotrip.com emails your mobile voucher to the address you gave at checkout. Check your spam folder. A payment receipt and our order confirmation email are not entry tickets.",
        "Show the mobile voucher to enter. Do not open the redemption link in your voucher before you arrive. Opening it uses the ticket.",
        "The ticket is valid for 90 days from the date we confirm your order, until 20:30 on the last day."
      ],
      paymentLink: "https://buy.stripe.com/8x200k4WagA846v1Hpgfu0e"
    },
    seoulsky: {
      name: "Seoul: Sky Lotte World Tower Ticket",
      path: "en/korea/seoul-sky-lotte-world-tower-ticket-p21/",
      location: "Seoul, South Korea",
      priceLabel: "HKD 192.79",
      tickets: [{ code: "adult", label: "Adult, age 3-99", priceLabel: "HKD 192.79" }],
      cancellation: "Non-refundable. The booking cannot be changed for any reason, and a cancellation or change request does not refund the amount paid.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Seoul",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2026-12-31",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before the visit date. The same terms also say it is sent 3 to 5 days before the visit. When it is issued, order@reotrip.com emails it. Check your spam folder.",
        "Show the official e-ticket and your passport. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before the visit date. The same terms also say it is sent 3 to 5 days before the visit. When it is issued, order@reotrip.com emails it. Check your spam folder.",
        "Show the official e-ticket and your passport. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/eVq00k0FU0Ba5az2Ltgfu07"
    },
    lotteworldsky: {
      name: "Seoul Lotte World Day Pass and Seoul Sky Ticket",
      path: "en/korea/seoul-lotte-world-day-pass-and-seoul-sky-ticket-p9/",
      location: "Seoul, South Korea",
      priceLabel: "HKD 462.00",
      tickets: [{ code: "adult", label: "Adult, age 3-99", priceLabel: "HKD 462.00" }],
      cancellation: "Non-refundable. The booking cannot be changed for any reason, and a cancellation or change request does not refund the amount paid.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Seoul",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-02-28",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "At Lotte World, 240 Olympic-ro, Songpa-gu, Seoul, show the official e-ticket from the email. Bring proof of age; a passport is accepted. The order confirmation and the code on it are not tickets, and a payment receipt is not an entry ticket."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued within 7 days before your visit date. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "At Lotte World, 240 Olympic-ro, Songpa-gu, Seoul, show the official e-ticket from the email. Bring proof of age; a passport is accepted. The order confirmation and the code on it are not tickets, and a payment receipt is not an entry ticket."
      ],
      paymentLink: "https://buy.stripe.com/7sY5kE0FUdnWbyX5XFgfu08"
    },
    oceanparkhk: {
      name: "Ocean Park Hong Kong Ticket",
      path: "en/hongkong-macau/ocean-park-hong-kong-ticket/",
      location: "Hong Kong",
      priceLabel: "HKD 556.60",
      tickets: [{ code: "adult", label: "Adult, age 12 and above", priceLabel: "HKD 556.60" }],
      cancellation: "This ticket cannot be cancelled and cannot be refunded.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Hong_Kong",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2026-12-31",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The e-ticket with a QR code is emailed by order@reotrip.com. Check the spam folder. It is not sent immediately.",
        "Show this ticket at the park entrance, on your phone or printed on A4 paper. The QR code must be clear and scannable. A valid identity document may be checked at entry. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The e-ticket with a QR code is emailed by order@reotrip.com. Check the spam folder. It is not sent immediately.",
        "Show this ticket at the park entrance, on your phone or printed on A4 paper. The QR code must be clear and scannable. A valid identity document may be checked at entry. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/8x26oI3S6es0gTh99Rgfu09"
    },
    madametussaudshk: {
      name: "Madame Tussauds Hong Kong Ticket",
      path: "en/hongkong-macau/madame-tussauds-hong-kong-ticket/",
      location: "Hong Kong",
      priceLabel: "HKD 236.90",
      tickets: [{ code: "adult", label: "Adult", priceLabel: "HKD 236.90" }],
      cancellation: "This ticket cannot be cancelled and cannot be refunded. If the operator cancels because of an unforeseen event or extreme weather, the booking can be rescheduled or fully refunded.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Hong_Kong",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-02-03",
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The e-voucher is emailed by order@reotrip.com. Check the spam folder. The e-voucher is not sent immediately.",
        "Show the e-voucher and a valid identity document. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The e-voucher is emailed by order@reotrip.com. Check the spam folder. The e-voucher is not sent immediately.",
        "Show the e-voucher and a valid identity document. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/28E9AU2O26ZybyX1Hpgfu0a"
    },
    landmark81: {
      name: "Landmark 81 Saigon Skyview Ticket in Ho Chi Minh",
      path: "en/vietnam/landmark-81-saigon-skyview-ticket-in-ho-chi-minh-p57/",
      location: "Ho Chi Minh City, Vietnam",
      priceLabel: "HKD 205.00",
      tickets: [{ code: "adult", label: "Adult, age 5-100", priceLabel: "HKD 205.00" }],
      cancellation: "Non-refundable. The booking cannot be changed for any reason, and a cancellation or change request does not refund the amount paid.",
      payment: "The cards and wallets shown on the payment page are the ones you can use.",
      timeZone: "Asia/Ho_Chi_Minh",
      minDaysAhead: 5,
      bookableDays: 60,
      lastDate: "2027-11-29",
      closedWeekdays: ["Saturday", "Sunday"],
      reviewNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued 3 to 5 days before the visit date, and at the earliest within 7 days before the visit. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "At Landmark 81, 720A Dien Bien Phu, Ho Chi Minh City, Vietnam, show the official e-ticket and follow the presentation instructions on that e-ticket. A payment receipt and our order confirmation email are not entry tickets."
      ],
      confirmedNextSteps: [
        "After payment, we confirm your order by email.",
        "The official e-ticket is issued 3 to 5 days before the visit date, and at the earliest within 7 days before the visit. When it is issued, order@reotrip.com emails it to you. Check your spam folder.",
        "At Landmark 81, 720A Dien Bien Phu, Ho Chi Minh City, Vietnam, show the official e-ticket and follow the presentation instructions on that e-ticket. A payment receipt and our order confirmation email are not entry tickets."
      ],
      paymentLink: "https://buy.stripe.com/9B64gAagugA8eL91Hpgfu06"
    }
  }
};
