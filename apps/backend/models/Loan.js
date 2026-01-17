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
      enum: ["ACTIVE", "EXPIRED", "PAID", "DEFAULTED"],
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
    yield: {
      type: Number,
      required: true,
      default: 0,
    },
    term: {
      type: Number, // months
      required: true,
    },
    creditScore: {
      type: Number,
      required: true,
    },
    collateralType: {
      type: String,
      required: false,
    },
    contractAddress: {
      type: String,
      required: false,
    },
    ltv: {
      type: Number,
      required: false,
      default: 65,
    },
  },
  {
    timestamps: true,
  }
);

const Loan = mongoose.model("Loan", loanSchema);

export default Loan;
