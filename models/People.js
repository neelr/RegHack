const mongoose = require("mongoose");

const peopleSchema = mongoose.Schema({
    "_id":mongoose.Schema.Types.ObjectId,
    "name": String,
    "age":Number,
    "email":String,
    "checked":Boolean

})

module.exports = mongoose.model('People',peopleSchema);