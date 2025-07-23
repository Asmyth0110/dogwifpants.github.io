  // ✅ FIXED VERSION
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const { reference, name, email, address, country, size, color, token } = req.body;

    // Replace with your actual Helius API key
    const heliusKey = "de9523b4-3c50-4337-ab9b-35be582e5607";
    const url = `https://mainnet.helius-rpc.com/?api-key=${heliusKey}`;

    const query = {
      jsonrpc: "2.0",
      id: "pants-check",
      method: "getTransactionsByMint",
      params: {
        mint: token === "SOL"
          ? "So11111111111111111111111111111111111111112"
          : token === "USDC"
          ? "Es9vMFrzaCERqFegU2h8FQk1NHX3VJUZ4zjvqG41wVLy"
          : "BG6VWes7KRFNPXHbWbA95ZU7grnaob8JSsS7r181pump",
        limit: 50,
      }
    };

    const fetchRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(query)
    });

    const json = await fetchRes.json();
    const txs = json.result || [];

    const match = txs.find(tx => tx.memo && tx.memo.includes(reference));

    if (match) {
      // Send order to Printful (mocked here)
      console.log("✅ Payment confirmed for:", email);

      return res.status(200).json({ success: true });
    } else {
      return res.status(200).json({ success: false });
    }

  } catch (err) {
    console.error("Order error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
