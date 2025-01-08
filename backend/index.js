const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const admin = {};
const getAdmin = () => {
    return admin;
}

app.post('/api/admin/login', async (req, res) => {
    const { lat, lng } = req.body;
    admin.location = {
        lat, lng
    };
    // await Admin.updateOne({}, { location: { lat, lng } }, { upsert: true });
    res.status(200).send({ message: 'Admin location stored successfully' });
});

app.post('/api/customer/distance', async (req, res) => {
    const { lat, lng } = req.body;

    const admin = getAdmin();;
    if (!admin.location) {
        return res.status(404).send({ message: 'Admin location not found.' });
    }

    const adminLocation = admin.location;
    const customerLocation = { lat, lng };
    console.log(admin);console.log(adminLocation);
    const apiKey = 'AlzaSy1CNB2pWpVJupbtTf3WMpqRGDdW_q0Ec2Z';
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${adminLocation.lat},${adminLocation.lng}&destinations=${customerLocation.lat},${customerLocation.lng}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        const distance = response.data.rows[0].elements[0].distance.text;
        res.status(200).send({ distance });
    } catch (error) {
        res.status(500).send({ message: 'Failed to calculate distance.' });
    }
});


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})