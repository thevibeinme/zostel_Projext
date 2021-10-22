const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground') ;
const methodOverride = require('method-override') ;
const ejsMate = require('ejs-mate') ;
const catchAsync = require('./utils/catchAsync') ;
const ExpressError = require('./utils/ExpressError') ;
//const Joi = require('Joi') ;
const { campgroundSchema,reviewSchema} = require('./schemas') ;
const Review = require('./models/review');


const app = express();

const campground = require('./routes/campground') ;
const review = require('./routes/review') ;



mongoose.connect('mongodb://localhost:27017/Hostel',{
    useNewUrlParser:true, // basically if we find bug in new url parser than we refer back to old url parser
    useUnifiedTopology:true,
    
    // so these are basically to deal with deprication warning
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
}); // this is to validate mongoo side error 





app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true})) ;// this is used so that req.body in post is not empty
app.use(methodOverride('_method')) ;// as in from it support post and get,so to use put and delete we have to use method-override
app.use(express.static(path.join(__dirname,'public'))) ;

// Routes 

app.use('/campground',campground) ;
app.use('/campground/:id/review',review) ;







app.engine('ejs',ejsMate) ;

app.get('/', (req, res) => {
    //res.send("Hello from Zostel")
    res.render('home');
})

/*app.get('/makeCampground',async (req,res)=>{
    const campground = new Campground({title:"mYRoom",description:"FunWorkPlace"}) ;
    await campground.save() ;
    res.send(campground) ;
})*/




// If req that is made does not match any of route

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404)) ;
})

// middleware to handle error

app.use((err,req,res,next)=>{
    const {statusCode=500} = err ;
    if(!err.message) err.message = 'Something Went Wrong' ;
    res.status(statusCode).render('error',{err}) ;
})


app.listen(3000, () => {
    console.log("Listening on portal 3000");
})