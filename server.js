const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const uuid = require('uuid');
const cors = require('cors');

const app = express();
const port = 3000;

// GA4 Measurement Protocol details
const MEASUREMENT_ID = 'G-8LT2WWTHY6';  // Replace with your GA4 Measurement ID
const API_SECRET = 'h8xBnaQqSQOmed3VaQwScg';    // Replace with your API Secret from GA4

app.use(cors()); // Enable CORS to allow frontend to communicate with the server
app.use(bodyParser.json());  // To parse JSON bodies

// Endpoint to handle form submission
app.post('/submit', async (req, res) => {
    const { name } = req.body;

    // Generate a unique client ID (you can use the actual user ID if needed)
    const client_id = uuid.v4();

    // Prepare event data to send to GA4
    const eventData = {
        client_id: client_id,
        events: [
            {
                name: 'user_submission',  // Event name
                params: {
                    user_name: name,  // Add the submitted name as a parameter
                },
            },
        ],
    };

    try {
        // Send the event data to GA4 using Measurement Protocol
        await axios.post(
            `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
            eventData
        );

        // Respond to the frontend with a success message
        res.json({ message: 'Event sent to GA4 successfully!' });
    } catch (error) {
        console.error('Error sending data to GA4:', error);
        res.status(500).json({ message: 'Error sending data to GA4' });
    }
});

// Start the Node.js server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
