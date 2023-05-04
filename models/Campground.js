const mongoose = require('mongoose')

const CampgroundSchema= new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Please add a name'],
        unique: true,
        trim:true,
        maxlength:[50,'Name can not be more than 50 characters']
    },
    address:{
        type: String,
        required:[true,'Please add an address'],
    },
    district:{
        type: String,
        required:[true,'Please add a district'],
    },
    province: {
        type: String,
        required: [true, "Please add a province"],
    },
    postalcode:{
        type: String,
        required:[true,'Please add a postalcode'],
        maxlength:[5,'Postal Code can not be more than 5 digits']
    },
    tel:{
        type: String,
    },
    region:{
        type: String,
        required:[true,'Please add a region'],
    }        
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
}

);
// Cascade delete appointments when a hospital is deleted
CampgroundSchema.pre('remove', async function(next) {
    console.log(`Apppointments being removed from hostpital ${this._id}`);
  
    await this.model('Apppointment').deleteMany({ campground: this._id });
  
    next();
});

// Reverse Populate with Virtuals 
CampgroundSchema.virtual('appointments', {
    ref: 'Appointment',
    localField: '_id',
    foreignField: 'campground',
    justOne: false
  });


module.exports=mongoose.model('Campground',CampgroundSchema);