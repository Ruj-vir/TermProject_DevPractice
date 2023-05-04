const Booking = require('../models/Booking');
const Campground = require('../models/Campground');
// @desc Get all appointments 
// @route GET /api/v1/appointments 
// @access Public 
exports.getBookings = async (req, res, next) => {
  let query;
//   General users can see only their appiontments 
  if (req.user.role === 'admin') {
    query = Booking.find({ user: req.user.id }).populate({
      path: 'campground',
      select: 'name province tel',
    });
  } else { 
    // If you are an this.addBooking, you can see all! 
    query = Booking.find().populate({
      path: 'campground',
      select: 'name province tel',
    });;
  }
  try {
    const bookings = await query;
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Cannot find Booking' });
  }
};
//@desc     Get single campground
//@route    GET /api/v1/campgrounds/:id
//@access   Public
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: 'campground',
      select: 'name province tel',
    });

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.id}`,
        });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Cannot find Booking',
    });
  }
};

exports.addBooking = async (req, res, next) => {
  try {
    req.body.campground = req.params.campgroundId;
    const campground = await Campground.findById(req.params.campgroundId);
    console.log(req.params.campgroundId);
    if (!campground) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No campground with the id of ${req.params.campgroundId}`,
        });
    }

    req.body.user = req.user.id;

    const existedBookings = await Booking.find({ user: req.user.id });

    if(existedBookings.length >= 3 && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: `The user with ID ${req.user.id} has already made 3 Bookings`})
    }

    const booking = await Booking.create(req.body);
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Cannot create Booking' });
  }
};

exports.updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.campgroundId}`,
        });
    }

    if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to update this Booking`})
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Cannot update Booking' });
  }
};

exports.deleteBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res
        .status(404)
        .json({
          success: false,
          message: `No booking with the id of ${req.params.campgroundId}`,
        });
    }

    if(booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, message: `User ${req.user.id} is not authorized to delete this booking`})
    }

    await booking.remove();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Cannot update Booking' });
  }
};

