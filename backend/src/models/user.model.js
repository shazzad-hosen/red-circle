import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
      required: true,
      index: true,
      uppercase: true,
    },

    location: {
      city: {
        type: String,
        index: true,
        required: [true, "City is required"],
        lowercase: true,
      },

      area: {
        type: String,
        lowercase: true,
      },
    },

    phone: {
      type: String,
      required: true,
    },

    isAvailable: {
      type: Boolean,
      default: false,
      index: true,
    },

    lastDonationAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Donor Eligibility Logic
userSchema.virtual("isEligible").get(function () {
  if (!this.lastDonationAt) return true;

  const days =
    (Date.now() - this.lastDonationAt.getTime()) / (1000 * 60 * 60 * 24);

  return days >= 90;
});

userSchema.index({
  bloodGroup: 1,
  "location.city": 1,
  "location.area": 1,
});

export const User = mongoose.model("User", userSchema);
