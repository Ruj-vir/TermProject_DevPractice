const Campground = require('../models/Campground')
const vacCenter = require("../models/VacCenter");

//@desc     Get vaccine centers
//@route    GET /api/v1/hospitals/vacCenters/
//@access   Public
exports.getVacCenters = (req, res, next) => {
  vacCenter.getAll((err, data) => {
    if(err) {
      res.status(500).send({
        message: 
          err.message || "Some error occured while retrieving Vaccine Centers"
      });
    } else res.send(data);
  });
};

//@desc     Get all hospitals
//@route    GET/api/v1/hospitals
//@access   Public
exports.getCampgrounds = async (req, res, next) => {
    let query;
    // Copy req.query 
    const reqQuery = {...req.query};
    // field to exclude 
    const removeFields = ['select', 'sort','page','limit'];
    // Loop over remove fields and delere them from reqQuery 
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(req.query);
    // Crete Operator (gt,gte,etc) 
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // finding resource 
    query = Campground.find(JSON.parse(queryStr)).populate('bookings');

    //Select Fields
    if(req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    //sort
    if(req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
     //Pagination
     const page = parseInt(req.query.page, 10) || 1;
     const limit = parseInt(req.query.limit, 10) || 25;
     const total = await Campground.countDocuments();
     const startIndex = (page - 1) * limit;
     const endIndex = page * limit;
     query = query.skip(startIndex).limit(limit);
    try {
      // Executing Query 
      const campgrounds = await query;

      

      //Pagination result
      const pagination = {};
      if(endIndex < total) {
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if(startIndex > 0) {
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

      res.status(200).json({
        success: true,
        count:campgrounds.length,
        data: campgrounds,
        
      });
    } catch (err) {
      res.status(400).json({success: false,});
    }
  };

//@desc     Get single hospital
//@route    GET /api/v1/hospitals/:id
//@access   Public
exports.getCampground = async (req, res, next) => {
    try {
      const campground = await Campground.findById(req.params.id);
      if(!campground){
        return res.status(400).json({success:flase});
      }
      res.status(200).json({success: true,data: campground,});
    } catch (err) {
      res.status(400).json({success: false,});
    }
  };
  

//@desc     Create new hospital
//@route    POST /api/v1/hospitals
//@access   Private
exports.createCampground = async (req, res, next) => {
    const campground = await Campground.create(req.body);
    res.status(201).json({
      success: true,
      data: campground,
    });
  };

//@desc     Update hospital
//@route    PUT /api/v1/hospitals/:id
//@access    Private
exports.updateCampground = async (req, res, next) => {
  console.log('start update');

    try {
      const campground = await Campground.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      console.log('query item', campground);
      if (!campground) {
        res.status(400).json({success: false,});
      }
  
      res.status(200).json({success: true,data: campground,});
    } catch (err) {
      console.log(err.message)
      res.status(400).json({success: false,});
    }
  };

//@desc     Delete hospital
//@route    DELETE /api/v1/hospitals/:id
//@access   Private
exports.deleteCampground = async (req, res, next) => {
    try {
      const campground = await Campground.findById(req.params.id);
  
      if (!campground) {
        res.status(400).json({success: false,});
      }
      campground.remove();
      res.status(200).json({success: true,data: {},});
    } catch (err) {
      res.status(400).json({success: false,});
    }
  };