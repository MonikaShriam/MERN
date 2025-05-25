const mongoose =require("mongoose");

const watchSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    genre:{
        type:String,
        required:true,
    },
    year:{
        type:Number,
        required:true,
    },
    Watched:{
        type:Boolean,
        required:false,
    }
})

module.exports=mongoose.model('watch_list',watchSchema);