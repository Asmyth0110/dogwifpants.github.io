const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const body = JSON.parse(event.body);
    const { reference, name, email, address, country, size, color, token } = body;

    const heliusKey = "de9523b4-3c50-4337-ab9b-35be582e5607";
    const url = `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;

    const response = await fetch(HELIUS_URL);
    const transactions = await response.json();

    const paymentFound = transactions.some(tx => {
      return tx.memo && tx.memo.includes(reference);
    });

    if (!paymentFound) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, message: "Payment not found" })
      };
    }

    // You can log or store the order somewhere here (Google Sheets, database, etc.)
    // For now, just return success
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
