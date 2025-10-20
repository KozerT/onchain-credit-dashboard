import mongoose from "mongoose";

const institutionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    country: {
      type: String,
      required: true,
    },
    foundingYear: {
      type: Number,
      required: true,
    },
    totalPortfolio: {
      type: Number,
      default: 0,
    },
    creditRiskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    productType: {
      type: String,
      enum: ["Mortgage", "Private", "Business"],
      required: true,
    },
    websiteUrl: {
      type: String,
    },
    contacts: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Institution = mongoose.model("Institution", institutionSchema);

export default Institution;
