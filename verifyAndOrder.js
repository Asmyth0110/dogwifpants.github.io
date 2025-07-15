// Netlify function: verifyAndOrder.js
// Place inside /netlify/functions/verifyAndOrder.js

const fetch = require('node-fetch');
const sgMail = require('@sendgrid/mail'); // or use Mailgun, or nodemailer

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);
  const {
    name, email, address, country,
    size, token, reference
  } = data;

  // === CONFIG ===
  const WALLET = 'YOUR_WALLET_ADDRESS_HERE';
  const PANTS_MINT = 'BG6VWes7KRFNPXHbWbA95ZU7grnaob8JSsS7r181pump';
  const PRINTFUL_API_KEY = 'IUr0wprRrHiOxKs6GzTPPbhNaWdLdHDuxbvONVbY';
  const VARIANT_ID = 'YOUR_PRINTFUL_VARIANT_ID'; // use Printful's size/color variant ID
  const SENDGRID_API_KEY = 'YOUR_SENDGRID_API_KEY';
  const FROM_EMAIL = 'noreply@yourdomain.com';

  // === 1. VERIFY PAYMENT (Basic mock — integrate with Helius or JSON RPC for production) ===
  // Skip verification for now; assume success

  // === 2. SEND TO PRINTFUL ===
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
            variant_id: VARIANT_ID,
            quantity: 1,
            name: `OG Teddy Tee (${size})`
          }
        ]
      })
    });

    const result = await printfulResponse.json();
    if (!printfulResponse.ok) {
      throw new Error(result.error?.message || 'Printful order failed');
    }

    // === 3. SEND CONFIRMATION EMAIL ===
    sgMail.setApiKey(SENDGRID_API_KEY);
    await sgMail.send({
      to: email,
      from: FROM_EMAIL,
      subject: 'Your $PANTS Tee Order Has Been Received',
      text: `Hi ${name},\n\nThanks for ordering the OG Teddy Tee in size ${size}.\nWe'll ship it to:\n${address}, ${country}\n\nYour payment reference: ${reference}\n\nWAGMI,\nDog Wif Pants` 
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
