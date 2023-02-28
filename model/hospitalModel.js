const mongoose = require("mongoose");

const hospitalSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Hospital must have name"],
<<<<<<< HEAD
      unique: true,
=======
>>>>>>> origin/main
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    department: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Department",
      },
    ],
<<<<<<< HEAD
    picture: [String],
=======
    picture: {
      data: Buffer,
      contentType: String,
    },
>>>>>>> origin/main
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

hospitalSchema.pre(/^find/, function (next) {
  // this points to the current Query

  this.find({ isActive: { $ne: false } });
  next();
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
