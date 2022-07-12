const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title: {type: String, minlength: 5, maxlength: 400, required: true},
    subtitle: {type: String, minlength: 5},
    description: {type: String, minlength: 5, maxlength: 5000, required: true},
    owner: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    category: {enum: ['sport', 'games', 'history']}
    }, 
    {timestamps: true});

module.exports = mongoose.model('Article', ArticleSchema);