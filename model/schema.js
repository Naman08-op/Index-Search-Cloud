const mongoose = require ("mongoose")

const driveSchema = new mongoose.Schema({
    
        fileName:{type: String,index: true},
        fileId:{type:String,index: true},
        fileLink:{type:String,index: true},
        fileContent:{type:String,index: true}

})


driveSchema.index({'$**': 'text'});

module.exports = mongoose.model("Drive",driveSchema)
