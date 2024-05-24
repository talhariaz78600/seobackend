let mongoose = require('mongoose');
const bcrypt = require('bcrypt');
 let commentSchema=mongoose.Schema({
    name:{
        type:String
    },
    email:{
        type:String
    },
    comment:{
        type:String
    }
 })

let blogSchema = mongoose.Schema({
    title:{
        type:String,
    },
    category:{
        type:String
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    home:{
        type: Boolean,
        default: false,
    },
    comments:[commentSchema],
    data:{
        type: Date,
        default: Date.now
    }

}, { timestamps: true });
module.exports = mongoose.model('Blog', blogSchema);
