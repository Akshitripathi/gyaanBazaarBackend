const Event = require('../models/event');
const path = require('path');





exports.addEvent = async (req, res) => {
  const { 
    eventName, eventDate, eventTime, eventPlace, invitedPeople, eventDescription, numberOfSpeakers, speakers 
  } = req.body;

  const eventImage = req.file ? req.file.path : '';

  const newEvent = new Event({
    eventName,
    eventDate,
    eventTime,
    eventPlace,
    invitedPeople,
    eventImage,
    eventDescription,
    numberOfSpeakers,
    speakers: JSON.parse(speakers),
  });

  try {
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



