exports.UndefLit = function(){
    return {
        translate: function(e){
            return "undefined";
        }
    }
};

exports.NumberLit = function(n){
    return {
        translate: function(e){
            return "" + n;
        }
    };
};

exports.BoolLit = function(b){
    return {
        translate: function(e){
            return "" + b;
        }
    };
};

exports.StrLit = function(str){
    return {
        translate: function(e){
            return "\"" + str + "\"";
        }
    };
};

exports.Var = function(v){
    return {
        translate: function(e){
            return (e[v] ? "__event." : "") + v;
        }
    };
};

exports.ArrayLit = function(a){
    return {
        translate: function(e){
            return "[" + a.map(function(v){
                return v.translate(e);
            }).join(",") + "]";
        }
    };
};

exports.OpExp = function(l, op, r){
    return {
        translate: function(e){
            return "(" + l.translate(e) + ")" + op + "(" + r.translate(e) + ")";
        }
    };
};

exports.ObjLit = function(ve_list){
    return {
        translate: function(e){
            return "{" + ve_list.map(function(ve){
                return ve[0].translate(e) + ":" + ve[1].translate(e);
            }).join(",") + "}";
        }
    };
};

exports.AssignExp = function(isVar, v, exp){
    return {
        translate: function(e){
            return (isVar ? "var " : "") + v + " = " + exp.translate(e);
        }
    };
}

exports.IfExp = function(p, c, a){
    return {
        translate: function(e){
            return "if(" + p.translate(e) + "){" + c.translate(e) + 
                   (a ? ("}else{" + a.translate(e)) : "") + "}";
        }
    };
}

exports.InvokeExp = function(obj, m, args){
    return {
        translate: function(e){
            return "("+obj.translate(e) + ")[\"" + m + "\"](" + args.map(function(a){
                return a.translate(e);
            }).join(",") + ")";
        }
    };
}

exports.Lambda = function(args, body){
    return {
        translate: function(e){
            return "function(" + args.join(",") + "){return " + body.translate(e); + ";}";
        }
    };
};

exports.Call = function(fun, args){
    return {
        translate: function(e){
            return fun.translate(e) + "(" + args.map(function(a){
                return a.translate(e);
            }).join(",") + ")";
        }
    };
};

exports.Raise = function(event, immediate){
    return {
        translate: function(e){
            var message = immediate ? "fireEvent" : "queueEvent";
            return "__container." + message + "(" + event.translate(e) + ")";
        }
    };
};

exports.Alert = function(id, event, immediate){
    return {
        translate: function(e){
            var message = immediate ? "sendMessage" : "queueAlert";
            var dispatch = "{id: /" + id + "/, event: " + event.translate(e) + "}";
            return "__container." + message + "(" + dispatch + ")";
        }
    };
};

exports.Regex = function(re){
    return {
        translate: function(e){
            return "/" + re + "/";
        }
    };
};

var translateBlock = function(message, epat, exprs){
    var envVars = epat.getVariables();
    return {
        translate: function(e){
            return "__container.add" + message + "({"+
                     "event:" + epat.type + "," +
                     "cb: function(__event){" + exprs.map(function(x){
                         return x.translate(envVars);
                     }).join(";") + "}," +
                     "on: " + e.objectRef + "," +
                     "id: \"" + e.objectId  + "\"" +
                   "});";
        }
    };
};

exports.ReactBlock = function(epat, exprs){
    return translateBlock("Listener", epat, exprs);
};

exports.InterceptBlock = function(epat, exprs){
    return translateBlock("Intercept", epat, exprs);
}
exports.ObjectBlock = function(name, id, blocks){
    return {
        translate: function(e){
            return blocks.map(function(b){
                return b.translate({objectRef: id, objectId: name});
            }).join(";");
        }
    };
};

exports.EventPattern = function(fields){
    return {
        getVariables: function(){
            var env = {};
            fields.patterns.filter(function(field){
                return field[1] instanceof VarPattern;
            }).forEach(function(field){
                env[field[1].name] = true;
            });
            return env;
        },
        type: fields.type
    };
};

