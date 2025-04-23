import mongoose from "mongoose";

const GithubUserSchema = new mongoose.Schema({
    username: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
    githubId: {
        type: mongoose.Schema.Types.String,
        require: true,
        unique: true,
    },
    email: {
        type: mongoose.Schema.Types.String,
        required: true,
        unique: true,
    },
});

export const GithubUser = mongoose.model("GithubUser", GithubUserSchema);
