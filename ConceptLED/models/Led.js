const mongoose = require('mongoose');

const LedSchema = new mongoose.Schema({

    id: {
        type: Object,
        required: true
    },

    name: {
        type: String,
        required: true
    },

    date: {
        type: Object,
        required: true
    },

    state: {
        type: Number,
        required: true
    }
});

const Led = mongoose.model("Led", LedSchema);
module.exports = Led;