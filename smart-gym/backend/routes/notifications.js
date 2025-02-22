const express = require('express');
const router = express.Router();

router.post('/send', (req, res) => {
    const { message } = req.body;
    // Integrate real notification message.
    console.log(`Sending notification: ${message}`);
    res.status(200).send({ success: true, message: "Notification sent successfully!" });
});

module.exports = router;