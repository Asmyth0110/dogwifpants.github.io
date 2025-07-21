// Netlify Function: verifyAndOrder.js
// Location: /netlify/functions/verifyAndOrder.js

const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {
    name,
    email,
    address,
    country,
    size,
    color,
    token,
    reference
  } = JSON.parse(event.body);

  const HELIUS_API_KEY = "de9523b4-3c50-4337-ab9b-35be582e5607";
  const WALLET = "AXLtJZAYju9E16nCuDhJzhwUCAhaoDUeEXzZBSafqqZk";
  const PRINTFUL_API_KEY = "IUr0wprRrHiOxKs6GzTPPbhNaWdLdHDuxbvONVbY";
  const VARIANT_IDS = {
    "Black XS": "687e9efe348416",
    "Black S": "687e9efe3484c3",
    "Black M": "687e9efe348552",
    "Black L": "687e9efe3485e1",
    "Black XL": "687e9efe348669",
    "Steel Blue XS": "687e9efe3486f7",
    "Steel Blue S": "687e9efe348775",
    "Steel Blue M": "687e9efe3487f9",
    "Steel Blue L": "687e9efe348887",
    "Steel Blue XL": "687e9efe348908"
  };

  const variantKey = `${color} ${size}`;
  const variantId = VARIANT_IDS[variantKey];
  if (!variantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid shirt variant: ${variantKey}` })
    };
  }

  // === 1. Check Helius for matching payment ===
  const heliusUrl = `https://api.helius.xyz/v0/addresses/${WALLET}/transactions?api-key=${HELIUS_API_KEY}&limit=20`;
  try {
    const txRes = await fetch(heliusUrl);
    const txJson = await txRes.json();

    const match = txJson.find((tx) => {
      return tx.memo && tx.memo.includes(reference);
    });

    if (!match) {
      return {
        statusCode: 402,
        body: JSON.stringify({ error: "Payment not found yet. Try again later." })
      };
    }

    // === 2. Submit Printful Order ===
    const printfulRes = await fetch("https://api.printful.com/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PRINTFUL_API_KEY}`
      },
      body: JSON.stringify({
        recipient: {
          name,
          address1: address,
          country_code: country
        },
        items: [
          {
            variant_id: variantId,
            quantity: 1,
            name: `OG Teddy Tee (${color} ${size})`
          }
        ]
      })
    });

    const result = await printfulRes.json();
    if (!printfulRes.ok) {
      throw new Error(result.error?.message || "Printful order failed");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, printful: result })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
