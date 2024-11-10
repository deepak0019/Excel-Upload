import mongoose from "mongoose";

const dataSchema = new mongoose.Schema({
  "Name of the Candidate": {
    type: String,
    required: true,
    default: "",
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  "Mobile No.": String,
  "Date of Birth": {
    type: String,
    default:"",
  },
  "Work Experience": {
    type: String,
    default: "",
  },
  "Resume Title": {
    type: String,
    default: "",
  },
  "Current Location": {
    type: String,
    default: "",
  },
  "Postal Address": {
    type: String,
    default: "",
  },
  "Current Employer": {
    type: String,
    default: "",
  },
  "Current Designation": {
    type: String,
    default: "",
  },
});

const ExcelData = mongoose.model("ExcelData", dataSchema);
export default ExcelData;
