(*Isn't this a standard type?*)
type ('a, 'b) either = Either of 'a  | Or of 'b

type  var   = string

type op = string

type  value = Number    of float (*Worked well for JavaScript*)
            | Boolean   of bool 
            | String    of string
            | Function  of (var list) * expr (*Arguments * body, not an interpreter so no closure*)
            | Array     of value list (*Converts to JS array, so linear access is still slow*)
            | Dict      of (var * expr) list
            | Regexp    of string
            | Variable  of var

and  expr   = UndefLit  (*WHAT IS AN OPTION MONAD*)
            | NumberLit of float (*Whatever I translate this to JavaScript*)
            | BoolLit   of bool
            | StrLit    of string
            | Var       of var
            | ArrayLit  of expr list
            | OpExp     of expr * op * expr
            | ObjLit    of (var * expr) list
            | AssignExp of bool * var * expr (*Do we include the var keyword in the translation?*)
            | IfExp     of expr * expr * (expr option)
            | InvokeExp of expr * var * (expr list) (*Raise an error: You really shouldn't invoke a method in a language with no methods*)
            | Lambda    of (var list) * expr
            | Call      of expr * (expr list)
            | Raise     of event * bool
            | Alert     of string * event * bool
            | Regex     of string 
(*WHAT IS A TYPE SYSTEM*)
and   react     = epattern * expr list
and   intercept = epattern * expr list
and   obj       = var * var * ((react, intercept) either list)
(*The big guy*)
and   epattern  = string * ((var * pattern) list)
and   pattern   = Any
                | ExactNum  of float
                | ExactBool of bool
                | ExactStr  of string
                | RegexPat  of string
                | ArrayPat  of pattern list
                | ObjectPat of (var * pattern) list
and   event     = (var * value) list  

