const mongoose = require("mongoose");
var config = require("../config.js");
var i;
var schema = config;
console.log(schema);
for (i in schema) {
    schema[i] = typeof(schema[i]);
}
const peopleSchema = mongoose.Schema(schema)

module.exports = mongoose.model('People',peopleSchema);