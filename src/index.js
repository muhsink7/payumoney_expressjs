const express = require('express');
const bodyParser = require('body-parser');
const payumoney = require('payumoney-nodejs');

const app = express();
const port = 3000;

// Parse incoming requests with JSON payloads
app.use(bodyParser.json());

// Set your PayUmoney credentials
const PAYU_MERCHANT_KEY = 'Rd3iUs';
const PAYU_MERCHANT_SALT = 'IKtjXMKG';

// Set the success and failure URLs for the payment
const SUCCESS_URL = 'http://localhost:3000/success';
const FAILURE_URL = 'http://localhost:3000/failure';

// Initialize PayUmoney with your credentials
payumoney.init(PAYU_MERCHANT_KEY, PAYU_MERCHANT_SALT, 'test');

// Handle the payment request
app.post('/makePayment', (req, res) => {
  const paymentData = {
    amount: req.body.amount,
    productinfo: req.body.productinfo,
    firstname: req.body.firstname,
    email: req.body.email,
    phone: req.body.phone,
    surl: SUCCESS_URL,
    furl: FAILURE_URL,
    hash: '', // You need to calculate and set the hash here
  };

  // Calculate the hash for paymentData
  paymentData.hash = payumoney.generatePaymentHash(paymentData);

  // Make the payment request to PayUmoney
  payumoney.makePayment(paymentData, (error, response) => {
    if (error) {
      console.error('Payment error:', error);
      res.status(500).send('Payment failed');
    } else {
      console.log('Payment response:', response);
      res.status(200).send(response);
    }
  });
});

// Handle the success callback
app.post('/success', (req, res) => {
  // Handle the success callback here
  console.log('Payment success:', req.body);
  res.status(200).send('Payment successful');
});

// Handle the failure callback
app.post('/failure', (req, res) => {
  // Handle the failure callback here
  console.error('Payment failed:', req.body);
  res.status(500).send('Payment failed');
});

// Start the Express.js server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
