

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const {
    name, email, address, country, size, color, token, reference
  } = JSON.parse(event.body);

  const HELIUS_API_KEY = "de9523b4-3c50-4337-ab9b-35be582e5607";
  const WALLET = "AXLtJZAYju9E16nCuDhJzhwUCAhaoDUeEXzZBSafqqZk";

  const heliusUrl = `https://api.helius.xyz/v0/addresses/${WALLET}/transactions?api-key=${HELIUS_API_KEY}&limit=20`;

  let match = null;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(heliusUrl);
    const txs = await res.json();
    match = txs.find(tx => tx.memo && tx.memo.includes(reference));
    if (match) break;
    await new Promise(r => setTimeout(r, 1500));
  }

  if (!match) {
    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, message: "No match found." }),
    };
  }

  // Submit to Printful
  const PRINTFUL_KEY = "IUr0wprRrHiOxKs6GzTPPbhNaWdLdHDuxbvONVbY";
  const variantIdMap = {
    "Black-XS": "687e9efe348416",
    "Black-S": "687e9efe3484c3",
    "Black-M": "687e9efe348552",
    "Black-L": "687e9efe3485e1",
    "Black-XL": "687e9efe348669",
    "Steel Blue-XS": "687e9efe3486f7",
    "Steel Blue-S": "687e9efe348775",
    "Steel Blue-M": "687e9efe3487f9",
    "Steel Blue-L": "687e9efe348887",
    "Steel Blue-XL": "687e9efe348908"
  };

  const variantId = variantIdMap[`${color}-${size}`];
  if (!variantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false, message: "Variant not found" })
    };
  }

  const order = {
    recipient: {
      name,
      address1: address,
      country_code: country,
      email
    },
    items: [
      {
        variant_id: variantId,
        quantity: 1
      }
    ]
  };

  const resp = await fetch("https://api.printful.com/orders", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PRINTFUL_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(order)
  });

  const data = await resp.json();

  if (!resp.ok) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: "Printful error", detail: data })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true, data })
  };
};
