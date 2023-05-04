const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoSanitize=require('express-mongo-sanitize');
const helmet=require('helmet');
const xss=require('xss-clean');
const rateLimit=require('express-rate-limit');
const hpp=require('hpp');
const cors=require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
//Rate Limiting
const limiter=rateLimit({
  windowsMs:10*60*1000,//10 mins
  max: 100
  });
const swaggerOptions={
    swaggerDefinition:{
    openapi: '3.0.0',
    info: {
    title: 'Library API',
    version: '1.0.0',
    description: 'A simple Express VacQ API'
    },
    servers:[{url: 'http://localhost:5000/api/v1'}]
    },
    apis:['./routes/*.js'],
    };

// Route files 
const campgrounds = require('./routes/campgrounds');
const bookings = require('./routes/bookings');

const auth = require('./routes/auth');
const cookieParser = require('cookie-parser');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
const swaggerDocs=swaggerJsDoc(swaggerOptions);
app.use('/api-docs',swaggerUI.serve, swaggerUI.setup(swaggerDocs));
app.use(cors());
// Body parser 
app.use(express.json());
//Enable CORS
app.use(cors());
//Prevent http param pollutions 
app.use(hpp());
//Rate Limiting
app.use(limiter)
//Prevent XSS attacks
app.use(xss());
//Sanitize data
app.use(mongoSanitize());
//Set security headers
app.use(helmet())
// Cookie parser 
app.use(cookieParser());
// Mount routers 
app.use('/api/v1/campgrounds',campgrounds);
app.use('/api/v1/bookings', bookings);
app.use('/api/v1/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log('Server running in ', process.env.NODE_ENV, ' mode on port ', PORT));

process.on('unhandleRejection', (err, promise) => {
    console.log(`Error: ${(err, message)}`);
    server.close(() => process.exit(1));
  });
  