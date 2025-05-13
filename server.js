const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const { restClient } = require('@polygon.io/client-js');

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const rest = restClient(process.env.POLYGON_API_KEY);

app.use(express.static(path.resolve(__dirname, 'public')));

app.get('/api/stock/:ticker', async (req, res) => {
    try {
        const ticker = req.params.ticker.toUpperCase();
        const data = await rest.stocks.aggregates(ticker, 1, 'day', '2024-01-01', '2025-05-11');

        if (!data.results) {
            return res.status(404).json({ error: 'No stock data found' });
        }
        res.json(data);
    } catch (e) {
        console.error('Error fetching stock data:', e);
        res.status(500).json({ error: 'Server Error: ' + e.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
