const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  universityRollNumber: {
    type: String,
    required: true,
  },
});

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;
