
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');

const dbConnect = require('./middlewares/dBConnect'); 

const userController = require('./controllers/userController');
const bookController = require('./controllers/bookController');
const eventController = require('./controllers/eventController');
const registrationController = require('./controllers/registrationController');

const Product= require('./models/products');

const path = require('path');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

dbConnect();

app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// User API
app.post('/api/users/register', userController.registerUser);
app.post('/api/users/login', userController.loginUser);
app.get('/api/users/:username', userController.getUserByUsername);
app.put('/api/users/:username', userController.updateUser);

// Book API
app.get('/api/books', bookController.getBooksBySubSubject);
app.get('/api/all-books', bookController.getAllBooks);
app.post('/api/create-book', bookController.createBook);
app.post('/api/seed-books', bookController.seedBooks);
app.post('/api/update-book/:id', bookController.updateBook);
app.post('/api/delete-book/:id', bookController.deleteBook);
app.post('/api/send-book', bookController.sendBookMail);

//Event API
app.post('/api/events', upload.single('eventImage'), eventController.addEvent);
app.get('/api/events', eventController.getAllEvents);
app.get('/api/events/:id', eventController.getEventById);

// Registration API
app.post('/api/registrations', registrationController.addRegistration);
app.get('/api/registrations/check', registrationController.checkRegistration);
app.post('/api/registrations/send-email', registrationController.sendRegistrationEmail);

// Product API
app.post('/api/products', upload.single('image'), async (req, res) => {
  const { productName, price, category, description } = req.body;
  const image = req.file ? req.file.path : '';

  const newProduct = new Product({
    productName,
    price,
    category,
    description,
    image,
  });

  try {
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
