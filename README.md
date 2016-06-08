# RSVP
###There's no method to this madness

RSVP is an object-oriented language that translates to JavaScript. RSVP has no methods on its objects: all message passing is abstracted out as events. In this manner, certain aspects of software construction can be made trivial: a cross-cutting concern like logging is the same as receiving a message. 

##Simplified grammar

    Program = Declaration*
   
    Declaration = Map | Object
    
    Map = transformk identifier ">>|" Expression
   
    Object = objectk identifier (":" identifier)? "{" ReactBlock* "}"
    
    ReactBlock = reactk eventId (":" EventPattern)? "{" Statement* "}
    
    EventPattern = "{" FieldPattern ("," FieldPattern)* "}"
    
    FieldPattern = identifier ":" pattern
    
    pattern = regex | identifier | literal | "_"
        
    Statement = raisek Event
              | alertk identifier Event
              | (any statement)
          
    Event = eventId ":" "{" Field ("," Field)* "}"
    
    Field = identifier ":" Expression
    
    Expression = Expression ">>|" identifier
               | (any expression)
        
    raisek     = "raise" ~alnum
    alertk     = "alert" ~alnum
    objectk    = "object" ~alnum
    identifier = alphabet (alnum*)
    transformk = "transform" ~alnum
    eventId    = identifier ("::" identifier)*

##The Language 

![Quick look at an event](http://i.imgur.com/1Par345.png)

RSVP's execution is modelled as a group of objects that dispatch events to and receive events from an IoC container. Events are raised using `raise` and `alert` statements. All objects (that are interested in an event) are alerted when an event is `raise`d, and `alert` allows you to target specific objects, based on the identifier used to register them with the container. Objects declare what events they are interested in through `react` blocks, where events are specified as patterns. Any event that matches the pattern is dispatched to the object.

RSVP allows for functions as purely functional transforms of inputs to outputs. Transforms do not allow side-effects: side-effects can be caused within an event block by updating a member variable or `raise`ing an event the container understands. 

RSVP translates to ECMAScript 5, and aims to be run under the Nashorn JavaScript Engine to allow interperability with other JVM languages. 

## Code examples

    //Objects are not tied to classes
    object server{
        //React to an HTTP/GET request seeking a userID
        react IO::Network::HTTPRequest : {method: "GET", userID: id} {
            //Forward this to any object listening to DB::Requests for the table users
            raise DB::Request : {table: "users", ID: id, from: "server"}
        }
        
        //Responses are not tied to requests
        //No callbacks, no callback hell
        react DB::Response : {fname: fn, lname: ln}{
            raise IO::Network::Response : {data : [{fname: fn, lname: ln}]}
        }
    }

    object log: lg2console{
        //Intercepts receive events 'in transit' before they are dispatched to react blocks
        intercept DB::Request : {ID: id} {
            console.log(id)
        }
    }
