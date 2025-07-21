const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const {
    name, email, address, country,
    size, color, token, reference
  } = data;

  // === CONFIG ===
  const WALLET = 'AXLtJZAYju9E16nCuDhJzhwUCAhaoDUeEXzZBSafqqZk';
  const PANTS_MINT = 'BG6VWes7KRFNPXHbWbA95ZU7grnaob8JSsS7r181pump';
  const PRINTFUL_API_KEY = 'IUr0wprRrHiOxKs6GzTPPbhNaWdLdHDuxbvONVbY';
  const VARIANT_IDS = {
    'Black XS': '687e9efe348416',
    'Black S': '687e9efe3484c3',
    'Black M': '687e9efe348552',
    'Black L': '687e9efe3485e1',
    'Black XL': '687e9efe348669',
    'Steel Blue XS': '687e9efe3486f7',
    'Steel Blue S': '687e9efe348775',
    'Steel Blue M': '687e9efe3487f9',
    'Steel Blue L': '687e9efe348887',
    'Steel Blue XL': '687e9efe348908'
  };

  const variantKey = `${color} ${size}`;
  const variantId = VARIANT_IDS[variantKey];

  if (!variantId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Invalid shirt variant: ${variantKey}` })
    };
  }

  try {
    const printfulResponse = await fetch('https://api.printful.com/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PRINTFUL_API_KEY}`
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

    const result = await printfulResponse.json();
    if (!printfulResponse.ok) {
      throw new Error(result.error?.message || 'Printful order failed');
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, printfulOrder: result })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
