import mongoose from "mongoose";

export class Validators {
  static isMondoID(id: string) {
    return mongoose.isValidObjectId(id);
  }
}
