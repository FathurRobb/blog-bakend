const mongoose = require('mongoose');
// const autoIncrement = require('mongoose-sequence')(mongoose);

const postsSchema = new mongoose.Schema({
    postId : {
        type: String,
    },
    user: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    title : {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    }
},{
    timestamps: true
});

// postsSchema.plugin(autoIncrement, {inc_field: 'postId'});
postsSchema.pre('save', function (next) {
    this.postId = this._id;
    next();
});

module.exports = mongoose.model('Posts', postsSchema);