const Order = require('../../models/Order');

app.get('/order-confirmation/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) {
            return res.status(404).send('Order not found');
        }
        res.render('order-confirmation', { order });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


router.get('/order-confirmation/:orderId', async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);
        if (!order) return res.status(404).send('Order not found');
        res.render('order-confirmation', { order });
    } catch (err) {
        res.status(500).send('Server error');
    }
});
