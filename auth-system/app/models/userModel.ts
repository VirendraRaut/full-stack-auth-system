import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

})

export const User = mongoose.models.User || mongoose.model("User", userSchema);