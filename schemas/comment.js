const mongoose = require('mongoose');

const commentsSchema = new mongoose.Schema({
    _postId: {
        type: String,
        required: true
    },
    commentId: {
        type: String
    },
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

commentsSchema.pre('save', function (next) {
    this.commentId = this._id;
    next();
});

module.exports = mongoose.model('Comments', commentsSchema);