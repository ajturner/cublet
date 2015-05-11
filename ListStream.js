var util = require('util');
var fs = require('fs');
var path = require('path');
var stream = require('stream');
 
function ListStream (directory) {
    directory = path.resolve(process.cwd(), directory);
    
    stream.Stream.apply(this);
    this.readable = true;
    this.writable = false;
 
    var self = this;
    fs.readdir(directory, function(err, files) {
        files.sort();
        if(err) return self.emit('error', err);
 
        files.forEach(function(e) {
           self.emit('data', path.resolve(directory, e));
        })
        self.emit('end');
    })
}
util.inherits(ListStream, stream.Stream);
 
module.exports = ListStream;