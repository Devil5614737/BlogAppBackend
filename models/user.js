const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');

const userSchema=new mongoose.Schema({
    username:String,
    email:String,
    password:String,
    displayPic:String,
    followers:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followings:[{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});


userSchema.methods.generateAuthToken=function(){
    const token=jwt.sign({_id:this._id},process.env.PRIVATE_KEY);
    return token
}

const User=mongoose.model("User",userSchema);


module.exports=User;
