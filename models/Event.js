const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  shortDescription: { type: String, required: true },  // From <input name="shortDescription" />
  fullDetails: { type: String, required: true },       // From <textarea name="fullDetails" />
  date: { type: String, required: true },              // From <input type="date" />
  time: { type: String, required: true },              // From <input type="time" />
  imageUrl: { type: String },                          // From <input name="imageUrl" />
});

module.exports = mongoose.model('Event', eventSchema);
