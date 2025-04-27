import { Schema, model, Types } from "mongoose";


const blogPostSchema = new Schema({
title:{type:String, required:true, trim:true},
content:{type:String, required:true},
tags: {type: String, maxlenght:160},
image:{type:String, required:true},
status: {type:String, enum: ['draft', 'published'], default:'draft'},
author: {type: Types.ObjectId,
    ref:'Doctor',
    required:true
},
publisheAt:{
    type: Date,
    default: function(){
        return this.status === 'published' ? new Date() : null;
    }
}
}, {timestamps:true});


export const blogsModel = model('blogPosts', blogPostSchema)