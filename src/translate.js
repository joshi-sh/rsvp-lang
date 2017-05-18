//Translate a given RSVP program into a javascript file
//Currently, I have no translator so I simply paste them together into one single .js file

var fs = require('fs');

exports.translate = function(sources, externals, dest){
    var result = fs.read('./container.js') +
    //Preamble: Add all external objects
    externals.
      forEach(fs.read).
      join('\n') +
    //Main document: all business objects
    sources.
      forEach(fs.readFileSync).
      //map((f) => f). //No translation implemented yet
      join('\n') +
    //App Main: Fire the System::Kickoff event
    fs.readFileSync('./appmain.js');
}