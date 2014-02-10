var express = require('express'),
    blogmgr = require('./blogmgr');
 
// Create the express app. 
var app = express();
 
 // ## CORS middleware
// see: http://stackoverflow.com/questions/7067966/how-to-allow-cors-in-express-nodejs
var allowCrossDomain = function(req, res, next) {
    console.log("writing cross domain headers...");

    res.header('access-control-allow-origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('access-control-allow-headers', 'X-Requested-With, Content-Type, Authorization');



    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
});

// Create our supported routes. 
app.get('/blogs', blogmgr.findAll);
app.get('/blogs/:id', blogmgr.findById);
app.post('/blogs', blogmgr.addBlog);
app.put('/blogs/:id', blogmgr.updateBlog);
app.delete('/blogs/:id', blogmgr.deleteBlog);
 
// Starting listening 
app.listen(3000);
console.log('Listening on port 3000...');