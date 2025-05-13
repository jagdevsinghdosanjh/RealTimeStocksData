module.exports = async (req, res) => {
    try {
        const { ticker } = req.query;
        const data = await rest.stocks.aggregates(ticker, 1, 'day', '2024-01-01', '2025-05-11');

        if (!data.results) {
            return res.status(404).json({ error: 'No stock data found' });
        }
        res.json(data);
    } catch (e) {
        console.error('Error fetching stock data:', e);
        res.status(500).json({ error: 'Server Error: ' + e.message });
    }
};