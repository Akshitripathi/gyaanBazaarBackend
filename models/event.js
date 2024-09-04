// // const mongoose = require('mongoose');

// // const eventSchema = new mongoose.Schema({
// //     name: { type: String, required: true },
// //     date: { type: Date, required: true },
// //     time: { type: String, required: true },
// //     place: { type: String, required: true },
// //     invitedPeople: { type: Number, required: true },
// //     image: { type: String },
// //     description: { type: String },
// //     speakers: [
// //         {
// //             name: { type: String },
// //             image: { type: String },
// //         }
// //     ]
// // }, {
// //     timestamps: true
// // });

// // const Event = mongoose.model('Event', eventSchema);

// // module.exports = Event;


// const mongoose = require('mongoose');



// const eventSchema = new mongoose.Schema({
//   eventName: String,
//   eventDate: Date,
//   eventTime: String,
//   eventPlace: String,
//   invitedPeople: Number,
//   eventImage: String,
//   eventDescription: String,
//   numberOfSpeakers: Number,
//   speakers: [
//     {
//       name: String,
//       image: String,
//     },
//   ],
 
// });


// module.exports = mongoose.model('Event', eventSchema);
// // module.exports = Event;




const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  eventTime: { type: String, required: true },
  eventPlace: { type: String, required: true },
  invitedPeople: { type: Number, required: true },
  eventImage: { type: String, required:true },
  eventDescription: { type: String, required: true },
  numberOfSpeakers: { type: Number, default: 0 },
  speakers: [
    {
      name: { type: String },
      designation: { type: String },
    },
  ],
}, {
  timestamps: true,
});

module.exports = mongoose.model('Event', eventSchema);
