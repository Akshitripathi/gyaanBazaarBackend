const Book = require('../models/bookSchema');
const nodemailer = require('nodemailer');
const path = require('path');
const crd = require('../Config/credentials');


exports.createBook = async (req, res) => {
  const { title, author, publicationYear, coverImage, rating, subSubject, filePath } = req.body;

  if (!title || !author || !subSubject) {
    return res.status(400).json({ error: 'Title, author, and subSubject are required fields.' });
  }

  const newBook = new Book({
    title,
    author,
    publicationYear,
    coverImage,
    rating,
    subSubject,
    filePath,
  });

  try {
    await newBook.save();
    res.status(201).json({ message: 'Book created successfully', book: newBook });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ error: 'An error occurred while creating the book' });
  }
};


exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ error: 'An error occurred while fetching books' });
  }
};


exports.getBookById = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json(book);
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ error: 'An error occurred while fetching the book' });
  }
};


exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const book = await Book.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book updated successfully', book });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ error: 'An error occurred while updating the book' });
  }
};


exports.deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findByIdAndDelete(id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ error: 'An error occurred while deleting the book' });
  }
};



exports.getBooksBySubSubject = async (req, res) => {
  const { subSubject } = req.query;
  try {
    const books = await Book.find({ subSubject: { $regex: new RegExp(subSubject, 'i') } });

    if (!books || books.length === 0) {
      res.status(404).json({ error: 'No books found for this sub-subject' });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json(books);
    }
  } catch (err) {
    console.error('Error fetching books:', err);
    res.status(500).json({ error: 'An error occurred while fetching books' });
  }
};

exports.seedBooks = async (req, res) => {
  const books = [
  ];

  try {
    const existingBooks = await Book.find({ subSubject: { $in: books.map(book => book.subSubject) } });
    const existingSubSubjects = existingBooks.map(book => book.subSubject);

    const newBooks = books.filter(book => !existingSubSubjects.includes(book.subSubject));

    if (newBooks.length > 0) {
      await Book.insertMany(newBooks);
      console.log('New books seeded successfully');
    } else {
      console.log('No new books to seed');
    }

    res.status(200).json({ message: 'Books seeded successfully' });
  } catch (error) {
    console.error('Error seeding books:', error);
    res.status(500).json({ error: 'An error occurred while seeding books' });
  }
};

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465, // Use 465 for SSL
  secure: true, // true for 465, false for other ports
  auth: {
    user: crd.user1, // Your email address
    pass: crd.pass1, // Your email password or app-specific password
  },
});

exports.sendBookMail = async (req, res) => {
  const { email, bookTitle, bookFilePath } = req.body;

  if (!email || !bookTitle || !bookFilePath) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await transporter.sendMail({
      from: 'akshi1233.be22@chitkara.edu.in',
      to: [email],
      subject: `Here is your requested book: ${bookTitle}`,
      text: `Dear User,\n\nPlease find attached the book "${bookTitle}".\n\nBest regards,\nGyaanBazaar Team`,
      attachments: [
        {
          filename: `${bookTitle}.pdf`,
          path: bookFilePath, 
        },
      ],
    });

    console.log(`Book sent to ${email}`);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error(`Error sending email: ${error}`);
    res.status(500).json({ error: 'Failed to send email' });
  }
};

