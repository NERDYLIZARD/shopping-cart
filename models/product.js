var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  image: {data: Buffer, contentType: String},
  title: {type: String, required: true},
  description: {type: String, required: true},
  price: {type: Number, required: true},
  seller: {type: Schema.Types.ObjectId, ref: 'User'},
});

module.exports = mongoose.model('Product', schema);