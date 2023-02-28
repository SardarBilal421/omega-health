const mongoose = require("mongoose");

const doctorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A doctor must have name"],
    },
    qualification: {
      type: String,
      required: [true, "A Doctor must have Qualifications"],
    },
    experiance: {
      type: String,
      required: [true, "Doctor must need to enter Experinace"],
    },
<<<<<<< HEAD
    picture: [String],
=======
    picture: {
      data: Buffer,
      contentType: String,
    },
>>>>>>> origin/main
    isActive: {
      type: Boolean,
      default: true,
      select: false,
    },
    hospital: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Hospital",
      },
    ],
    department: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Department",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

doctorSchema.pre(/^find/, function (next) {
  // this points to the current Query

  this.find({ isActive: { $ne: false } });
  next();
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
