(function(ct){
    var fs = require('fs');
    var fio = {};
    
    ct.addListener({
        event    : {name: new RegExp("FileIO::ReadFile")},
        callback : function(e){
                       fs.readFile(e.filePath, (err, data) => {
                           if(err){
                               ct.queueRaise({name: "FileIO::ReadFailed", err: err});
                           }else{
                               ct.queueRaise({name: "FileIO::FileRead", data: data});
                           }
                       });
                   },
        thisArg  : fio,
        id       : "fileIO"
    });
    
    ct.addListener({
        event    : {name: new RegExp("FileIO::WriteFile")},
        callback : function(e){
                       fs.writeFile(e.file, e.data, (err) => {
                           if(err){
                               ct.queueRaise({name: "FileIO::WriteFailed", err: err});
                           }else{
                               ct.queueRaise({name: "FileIO::WroteFile", file:e.file});
                           }
                       });
                   },
        thisArg  : fio,
        id       : "fileIO"
    })
    
}(container));