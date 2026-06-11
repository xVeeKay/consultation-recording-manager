import mongoose from "mongoose";

const consultationSchema = new mongoose.Schema(
  {
    astrologerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },

    consultationDate: {
      type: Date,
      required: true,
    },

    recordingUrl: {
      type: String,
      default: null,
    },

    recordingPublicId: {
      type: String,
      default: null,
    },

    duration: {
      type: Number,
      default: 0,
    },

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Consultation = mongoose.model("Consultation", consultationSchema);
