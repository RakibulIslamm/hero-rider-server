const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('colors');
const stripe = require('stripe')('sk_test_51L3apqGfM7t0biYBu0t455QFB9FnyfGlNR70wHfryUFvKDc1F0wYJ0TRirITOp9g5K1BqVKn8tDNEyo4uiIAUsRN00UDZA2mLO')

const connectDB = require('./config/db');
const User = require('./models/user');
const Package = require('./models/package');
const BookedPackage = require('./models/BookedPackage');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

connectDB();

app.get('/', (req, res) => {
    res.send('Hello from Hero Rider')
})

const run = () => {

    app.post('/users', async (req, res) => {
        const newUser = req.body;
        console.log(newUser);
        try {
            const user = await User.create(newUser);
            res.send(user);
        }
        catch (err) {
            console.log(err.message)
        }
    });


    app.get('/users', async (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;
        const age = parseInt(req.query.age);
        const email = req.query.email;
        const name = req.query.name;
        const phone = req.query.phone;

        const search = email ? { email: { $regex: email, $options: 'i' } } : name ? { name: { $regex: name, $options: 'i' } } : phone ? { phone: { $regex: phone, $options: 'i' } } : {}

        try {
            let query = User.find(search);
            let count = await User.countDocuments(search);

            if (age >= 18 && age <= 25) {
                query = query.where('age').gte(18).lte(25);
                count = await User.countDocuments().where('age').gte(18).lte(25)
            }
            else if (age >= 26 && age <= 30) {
                query = query.where('age').gte(26).lte(30);
                count = await User.countDocuments().where('age').gte(26).lte(30)
            }
            const users = await query.skip(offset * limit).limit(limit);
            res.send({ users, count });
        }
        catch (err) {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving users."
            });
        }
        finally { }

    });

    app.get('/user/:email', async (req, res) => {
        // console.log(req.params.email)
        const user = await User.findOne({ email: req.params.email })
        // console.log(user)
        res.send(user);
    })

    app.get('/packages', async (req, res) => {
        const packages = await Package.find();
        res.send(packages);
    })
    app.get('/package/:id', async (req, res) => {
        const package = await Package.findById(req.params.id);
        res.send(package);
    })

    app.post('/create-payment-intent', async (req, res) => {
        const { price: amount } = req.body;
        if (!amount) {
            return res.send({ message: 'Loading' });
        }
        // console.log(amount);
        const convertedAmount = parseInt(amount * 100);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: convertedAmount,
            currency: "usd",
            payment_method_types: ['card']
        });
        res.send({ clientSecret: paymentIntent.client_secret });
    })

    app.post('/booking', async (req, res) => {
        const packageInfo = req.body;
        const bookedPackage = await BookedPackage.create(packageInfo);
        res.send(bookedPackage);
    })
    app.get('/booked-packages', async (req, res) => {
        const { email } = req.query;
        const bookedPackage = await BookedPackage.find().where('email').equals(email).populate('package');
        res.send(bookedPackage);
    })

    app.put('/block-users', async (req, res) => {
        const ids = req.body;
        const update = { $set: { blocked: true } };
        const result = await User.updateMany({ _id: { $in: ids } }, update);
        res.send(result);
    })
    app.put('/unblock-users', async (req, res) => {
        const update = { $set: { blocked: false } };
        const ids = req.body;
        const result = await User.updateMany({ _id: { $in: ids } }, update);
        res.send(result);
    })
}

run();





app.listen(PORT, () => console.log('Server running on port ' + PORT))