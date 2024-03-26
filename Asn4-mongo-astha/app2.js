const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const database = require('./config/database2');
const bodyParser = require('body-parser');
const path = require('path');


const port = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());


mongoose.set('strictQuery', false); // Add this line to suppress the warning

mongoose.connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const Product = require('./models/product');

const hbs = exphbs.create({
    extname: '.hbs', // Set the file extension for templates
    // Define your Handlebars helpers here
});


app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.get('/all', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('products', { products });
    } catch (error) {
        console.error('Error retrieving products:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Route to handle form submission for inserting a new product
app.post('/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send('Error inserting product');
    }
});


// Get all products from the database
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get a specific product by its ID
app.get('/api/products/:product_id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.product_id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Insert a new product
app.post('/api/products', async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});
// Route to get product titles and reviews
app.get('/reviews', async (req, res) => {
    try {
        const products = await Product.find({}, { title: 1, reviews: 1, _id: 0 });
        res.json(products);
    } catch (err) {
        console.error('Error fetching product titles and reviews:', err);
        res.status(500).json({ message: 'Error fetching product titles and reviews' });
    }
});
// Update an existing product by its ID
app.put('/api/products/:product_id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.product_id, req.body, { new: true });
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).send(err);
    }
});

// Delete a product by its ID
app.delete('/api/products/:product_id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.product_id);
        if (!deletedProduct) {
            return res.status(404).send('Product not found');
        }
        res.send('Product deleted successfully');
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
