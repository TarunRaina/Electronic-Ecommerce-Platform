const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const seedDB = require('./seed/productSeeds');
const productRoutes = require('./routes/products');
const checkoutRoutes = require('./routes/checkout');
const authRoutes = require('./routes/auth');
const { swaggerUi, swaggerSpec, setupSwaggerUi } = require('./docs/swagger');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect DB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Middleware
app.use(cors({
  origin: 'https://electronic-ecommerce-platform-frontend.onrender.com'
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Redirect to API Docs
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Swagger setup
setupSwaggerUi(app);

// Routes
app.use('/api/products', productRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/search', require('./routes/search'));
app.use('/api/auth', authRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Seed then start
seedDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server ready on port ${PORT}.`);
  });
});
