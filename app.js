const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;


const API_KEY = '4c6d1a79ca96ca3c0dc4eb69fac9fb81';


app.get('/convert', async (req, res) => {
  const sourceCurrency = req.query.from;
  const amount = parseFloat(req.query.amount);

  if (!sourceCurrency || !amount) {
    return res.status(400).json({ error: 'Invalid request parameters' });
  }

  const targetCurrencies = req.query.to;

  if (!Array.isArray(targetCurrencies)) {
    return res.status(400).json({ error: 'Invalid target currencies' });
  }

  try {
    const response = await axios.get(`http://api.exchangeratesapi.io/v1/latest?access_key=4c6d1a79ca96ca3c0dc4eb69fac9fb81`);
    const exchangeRates = response.data.rates;

    const results = {};

    for (const targetCurrency of targetCurrencies) {
      if (exchangeRates[targetCurrency]) {
        const rate = exchangeRates[targetCurrency];
        const convertedAmount = amount * rate;
        results[targetCurrency] = convertedAmount;
      }
    }

    res.json({
      sourceCurrency,
      amount,
      convertedAmounts: results,
    });
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Currency conversion app listening at http://localhost:${port}`);
});
