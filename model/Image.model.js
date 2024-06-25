import mongoose from 'mongoose';

const imageSchema = new mongoose.Schema({
  originalName: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  // descriptions: {
  //   type: String,
  //   required: true,
  // },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
});

const Image = mongoose.model('Image', imageSchema);
export default Image;
