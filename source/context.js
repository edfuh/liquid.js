Liquid.Context = Class.extend({

  init: function (assigns, registers, rethrowErrors) {
    this.scopes = [ assigns ? assigns : {} ];
    this.registers = registers ? registers : {};
    this.errors = [];
    this.rethrowErrors = rethrowErrors;
    this.strainer = Liquid.Strainer.create(this);
  },

  get: function (varname) {
    return this.resolve(varname);
  },

  set: function (varname, value) {
    this.scopes[0][varname] = value;
  },

  hasKey: function (key) {
    return (this.resolve(key)) ? true : false;
  },

  push: function () {
    var scpObj = {};
    this.scopes.unshift(scpObj);
    return scpObj; // Is this right?
  },

  merge: function (newScope) {
    // HACK Apply from Liquid.extensions.object; extending Object sad.
    //return this.scopes[0].update(newScope);
    return Liquid.extensions.object.update.call(this.scopes[0], newScope);
  },

  pop: function () {
    if (this.scopes.length === 1) {
      throw "Context stack error";
    }
    return this.scopes.shift();
  },

  stack: function (lambda, bind) {
    var result = null;
    this.push();
    try {
      result = lambda.apply(bind ? bind : this.strainer);
    } finally {
      this.pop();
    }
    return result;
  },

  invoke: function (method, args) {
    if ( this.strainer.respondTo(method) ) {
      // console.log('found method '+ method);
      // console.log("INVOKE: "+ method);
      // console.log('args', args);
      var result = this.strainer[method].apply(this.strainer, args);
      // console.log("result: "+ result);
      return result;
    } else {
      return (args.length === 0) ? null : args[0]; // was: $pick
    }
  },

  resolve: function (key) {
    switch (key) {
      case null:
      case 'nil':
      case 'null':
      case '':
        return null;

      case 'true':
        return true;

      case 'false':
        return false;

      // Not sure what to do with (what would be) Symbols
      case 'blank':
      case 'empty':
        return '';

      default:
        if ((/^'(.*)'$/).test(key))      // Single quoted strings
          { return key.replace(/^'(.*)'$/, '$1'); }

        else if ((/^"(.*)"$/).test(key)) // Double quoted strings
          { return key.replace(/^"(.*)"$/, '$1'); }

        else if ((/^(\d+)$/).test(key)) // Integer...
          { return parseInt( key.replace(/^(\d+)$/ , '$1') ); }

        else if ((/^(\d[\d\.]+)$/).test(key)) // Float...
          { return parseFloat( key.replace(/^(\d[\d\.]+)$/, '$1') ); }

        else if ((/^\((\S+)\.\.(\S+)\)$/).test(key)) {// Ranges
          // JavaScript doesn't have native support for those, so I turn 'em
          // into an array of integers...
          var range = key.match(/^\((\S+)\.\.(\S+)\)$/),
              left  = parseInt(range[1]),
              right = parseInt(range[2]),
              arr   = [];
          // Check if left and right are NaN, if so try as characters
          if (isNaN(left) || isNaN(right)) {
            // TODO Add in error checking to make sure ranges are single
            // character, A-Z or a-z, etc.
            left = range[1].charCodeAt(0);
            right = range[2].charCodeAt(0);

            var limit = right - left + 1;
            for (var i = 0; i < limit; i++) arr.push(String.fromCharCode(i + left));
          } else { // okay to make array
            var limit = right - left + 1;
            for (var i = 0; i < limit; i++) arr.push(i + left);
          }
          return arr;
        } else {
          var result = this.variable(key);
          // console.log("Finding variable: "+ key)
          // console.log(Object.inspect(result))
          return result;
        }
    }
  },

  findVariable: function (key) {
    for (var i = 0; i < this.scopes.length; i++) {
      var scope = this.scopes[i];
      if ( scope && !!scope[key] ) {
        var variable = scope[key];
        if (typeof(variable) === 'function') {
          variable = variable.apply(this);
          scope[key] = variable;
        }
        if (variable && typeof(variable) === 'object') {
          if (variable.toLiquid) {
            variable = variable.toLiquid();
          }
          if (variable.setContext) {
            variable.setContext(self);
          }
        }
        return variable;
      }
    }
//    console.log('findVariable("'+ key +'") is returning NULL')
    return null;
  },

  variable: function (markup) {
    //return this.scopes[0][key] || ''
    if (typeof markup !== 'string') {
    //  console.log('markup('+ Object.inspect(markup) +') was unexpected, returning NULL')
      return null;
    }

    var self        = this,
        parts       = markup.match( /\[[^\]]+\]|(?:[\w\-]\??)+/g ),
        firstPart   = parts.shift(),
        squareMatch = firstPart.match(/^\[(.*)\]$/),
        object;

    if (squareMatch) {
      firstPart = this.resolve( squareMatch[1] );
    }

    object = this.findVariable(firstPart);

    // Does 'pos' need to be scoped up here?
    if (object) {
      parts.forEach(function (part) {
        // If object is a hash we look for the presence of the key and if its available we return it
        var squareMatch = part.match(/^\[(.*)\]$/);
        if (squareMatch) {
          var part = self.resolve( squareMatch[1] );
          if (typeof(object[part]) === 'function') {
            object[part] = object[part].apply(this); // Array?
          }
          object = object[part];
          if (object != null && typeof(object) === 'object' && object.toLiquid) {
            object = object.toLiquid();
          }
        } else {
          // Hash
          if ( typeof(object) === 'object' && (part in object) ) {
            // if its a proc we will replace the entry in the hash table with the proc
            var res = object[part];
            if (typeof(res) === 'function') {
              res = object[part] = res.apply(self);
            }
            if ( res != null && typeof(res) === 'object' && res.toLiquid ) {
              object = res.toLiquid();
            } else {
              object = res;
            }
          }
          // Array
          else if ( (/^\d+$/).test(part) ) {
            var index = parseInt(part, 10);
            if (typeof(object[index]) === 'function') {
              object[index] = object[index].apply(self);
            }
            if ( object[index] != null && typeof(object[index]) === 'object' && object[index].toLiquid ) {
              object = object[index].toLiquid();
            } else {
              object = object[index];
            }
          }
          // Some special cases. If no key with the same name was found we interpret following calls
          // as commands and call them on the current object if it exists
          else if ( object && typeof(object[part]) === 'function' && ['length', 'size', 'first', 'last'].include(part) ) {
            object = object[part].apply(part);
            if (object.toLiquid) {
              object = object.toLiquid();
            }
          }
          // No key was present with the desired value and it wasn't one of the directly supported
          // keywords either. The only thing we got left is to return nil
          else {
            object = null;
          }
          if (object != null && typeof(object) === 'object' && object.setContext) {
            object.setContext(self);
          }
        }
      });
    }
    return object;
  },

  addFilters: function (filters) {
    filters = filters.flatten();
    filters.forEach(function (f){
      if (typeof(f) !== 'object') {
        // TODO : TypeError
        throw ("Expected object but got: "+ typeof(f))
      }
      this.strainer.addMethods(f);
    });
  },

  handleError: function (err) {
    this.errors.push(err);
    if (this.rethrowErrors) {
      throw err;
    }
    return "Liquid error: " + (err.message ? err.message : (err.description ? err.description : err));
  }

});
