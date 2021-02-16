import mongoose from "mongoose"
mongoose.Promise = global.Promise;

const gameSaveSchema = new mongoose.Schema({
  data: {
    type: String,
    required: true,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("GameSave", gameSaveSchema);
