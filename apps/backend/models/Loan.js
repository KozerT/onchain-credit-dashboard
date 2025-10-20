import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    institution: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Institution",
      required: true,
    },
    loanId: {
      type: String,
      required: true,
      unique: true,
    },
    classId: {
      type: Number,
      required: true,
    },
    nonceId: {
      type: Number,
      required: true,
    },
    loanType: {
      type: String,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "PAID"],
      default: "ACTIVE",
    },
    principalOpenEur: {
      type: Number,
      required: true,
    },
    investedAmount: {
      type: Number,
      default: 0,
    },
    loanDate: {
      type: Date,
    },
    loanLastDate: {
      type: Date,
    },
    url: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
