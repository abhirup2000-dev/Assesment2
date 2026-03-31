const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
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


const CategoryModel = mongoose.model('category', CategorySchema)

module.exports = CategoryModel
