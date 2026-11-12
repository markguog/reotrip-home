// Bookable products on reotrip.com. One entry per product; a product without a
// payment link is shown as not bookable. The payment link is a public Stripe
// Payment Link address (not a secret). Source of each link: reo-ops
// _cowork/codex_artifacts/REOTRIP-STRIPE-LINKS-<UTC>/links.json.
// To stop selling a product, set its paymentLink to "" and keep the entry: the
// order-status page needs the entry to show a returning guest's payment.
// Travel dates run from minDaysAhead (default 1) to bookableDays after today in the
// product's timeZone, and never past lastDate when one is set.
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
    }
  }
};
