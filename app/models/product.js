const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image:{
      type: String,
      default: 'image.jpg'
    },
    isDeleted:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);


const ProductModel = mongoose.model('product', ProductSchema)

module.exports = ProductModel
