const Registration = require('../models/registration');
const mailService = require('../helper/mailService');

exports.addRegistration = async (req, res) => {
  const { eventId, email, universityRollNumber } = req.body;

  try {
    // Check if the email is already registered for this specific event
    const existingRegistrationForEvent = await Registration.findOne({ email, eventId });

    if (existingRegistrationForEvent) {
      return res.status(400).json({ error: 'You are already registered for this event.' });
    }

    // Check if the email is registered for any other event
    const existingRegistrationForAnyEvent = await Registration.findOne({ email });

    // Create a new registration
    const newRegistration = new Registration({
      eventId,
      email,
      universityRollNumber,
    });

    await newRegistration.save();

    // If the email was not registered for any event, send confirmation email
    if (!existingRegistrationForAnyEvent) {
      const subject = 'Event Registration Confirmation';
      const message = mailService.getConfirmationMessage(); 

      await mailService.sendMail(email, subject, message); 
    }

    res.status(201).json(newRegistration);
  } catch (err) {
    console.error('Error adding registration:', err);
    res.status(400).json({ error: err.message });
  }
};

exports.checkRegistration = async (req, res) => {
  const { email, eventId } = req.query;

  try {
    const existingRegistration = await Registration.findOne({ email, eventId });
    if (existingRegistration) {
      return res.json({ isRegistered: true });
    }
    res.json({ isRegistered: false });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendRegistrationEmail = async (req, res) => {
  const { email } = req.body;

  try {
    const subject = 'Event Registration Confirmation';
    const message = mailService.getConfirmationMessage();

    await mailService.sendMail(email, subject, message);
    res.status(200).json({ message: 'Confirmation email sent.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to send email' });
  }
};