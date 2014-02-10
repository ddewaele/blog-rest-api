var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;


var WRAP_ELEMS = false;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});

db = new Db('blogdb', server, {safe:false});
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'blogdb' database");
        db.collection('blogs', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'blogs' collection doesn't exist yet.");
            }
        });
    } else {
        console.log("Error while connecting to the blogdb : " + err);
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving blog with _id = [ ' + id + ']');
    
    db.collection('blogs', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            if (WRAP_ELEMS) {
                res.json({blog:item});   
            } else {
                res.json(item);    
            }
            
        });
    });
};
 
exports.findAll = function(req, res) {

    console.log('Retrieving all blogs');

    db.collection('blogs', function(err, collection) {
        collection.find().toArray(function(err, items) {
            // Wrap the array in a root element called blogs.
            
            if (WRAP_ELEMS) {
                var allBlogs = {
                    blogs:items
                };
            } else {
                allBlogs = items;
            }
            res.send(allBlogs);
        });
    });
};
 
exports.addBlog = function(req, res) {
    
console.log("Body = " + JSON.stringify(req.body));
console.log("req.body.blog = " + JSON.stringify(req.body.blog));



    var blog;
    if (WRAP_ELEMS) {
        blog = req.body.blog;
    } else {
        blog = req.body;
    }
    
    console.log('Adding blog: ' + JSON.stringify(blog));

    db.collection('blogs', function(err, collection) {
        collection.insert(blog, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({blog:record});
            }
        });
    });
}
 
exports.updateBlog = function(req, res) {
    
    var id = req.params.id;

    var blog;
    if (WRAP_ELEMS) {
        blog = req.body.blog;
    } else {
        blog = req.body;
    }
    
    console.log('Updating blog with id [' + id + ']');
    console.log('Blog payload = ' + JSON.stringify(blog));
    
    //delete blog._id;

    db.collection('blogs', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, blog, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating blog: ' + err);
                res.send({'error':'An error has occurred : ' + err});
            } else {
                console.log('' + result + ' document(s) updated');
                blog._id = id;
                res.json({blog:blog});
            }
        });
    });
}
 
exports.deleteBlog = function(req, res) {
    var id = req.params.id;
    console.log('Deleting blog: ' + id);
    db.collection('blogs', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.json({});
            }
        });
    });
}
