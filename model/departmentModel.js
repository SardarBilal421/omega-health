const mongoose = require("mongoose");
const Doctor = require("./doctorModel");

const departmentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A department must have name"],
    },
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
    doctor: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Doctor",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// departmentSchema.pre("save", async function (next) {
//   const doctorPromise = this.doctor.map(
//     async (id) => await Doctor.findById(id)
//   );
//   this.doctor = await Promise.all(doctorPromise);
//   next();
// });

departmentSchema.pre(/^find/, function (next) {
  // this points to the current Query

  this.find({ isActive: { $ne: false } });
  next();
});

const Department = mongoose.model("Department", departmentSchema);

module.exports = Department;
