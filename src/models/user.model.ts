import {
  emailRegexPattern,
  formattedDate,
  formattedTime,
  passwordRegexPattern,
} from "@/lib/utilities";
import mongoose, { Document, Model } from "mongoose";

export interface IAttendance extends Document {
  name: string;
  email: string;
  usn: string;
  uid: string;
  entryDate: string;
  entryTime: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  uid: string;
  usn: string;
  attendanceData: IAttendance[];
}

const attendanceSchema = new mongoose.Schema<IAttendance>({
  name: {
    type: String,
    required: [true, "Please enter your name"],
    trim: true,
    maxLength: [30, "Your name cannot exceed 30 characters"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    unique: true,
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "Please enter a valid email",
    },
  },
  usn: {
    type: String,
    required: [true, "Please enter your USN"],
    minLength: [10, "Your USN must be 10 characters long"],
  },
  uid: {
    type: String,
    required: true,
  },
  entryDate: {
    type: String,
    default: formattedDate,
  },
  entryTime: {
    type: String,
    default: formattedTime,
  },
});

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please enter your name"],
      trim: true,
      maxLength: [30, "Your name cannot exceed 30 characters"],
    },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      unique: true,
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      minLength: [6, "Your password must be longer than 6 characters"],
      required: [true, "Please enter your password"],
      select: false,
      validate: {
        validator: function (value: string) {
          return passwordRegexPattern.test(value);
        },
        message: "Please enter a valid password",
      },
    },
    role: {
      type: String,
      default: "user",
      required: true,
    },
    uid: {
      type: String,
      default: "",
    },
    usn: {
      type: String,
      required: [true, "Please enter your USN"],
      minLength: [10, "Your USN must be 10 characters long"],
    },
    attendanceData: [attendanceSchema],
  },
  { timestamps: true }
);

const UserModel: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
