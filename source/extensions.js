// Array.indexOf
// not to spec, but super fast
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement) {
    "use strict";
    var
      t = this,
      length = t.length,
      i = 0
    ;

    while (i < length) {
      if (t[i] === searchElement) {
        return i;
      }
      i++;
    }
    return -1;
  };
}

// Array.include
if (!Array.prototype.include) {
  Array.prototype.include = function (arg) {
    return !!~this.indexOf(arg);
  };
}

// Array.clear
if (!Array.prototype.clear) {
  Array.prototype.clear = function () {
    this.length = 0;
  };
}

// Array.map
if (!Array.prototype.map) {
  Array.prototype.map = function (fun, context) {
    "use strict";
    if (typeof fun !== 'function') {
      throw new TypeError(fun + ' is not a function');
    }

    var
      len = this.length,
      res = new Array(len),
      thisp = context || this,
      i
    ;
    for (i = 0; i < len; i++) {
      if (typeof this[i] !== 'undefined') {
        res[i] = fun.call(thisp, this[i], i, this);
      }
    }

    return res;
  };
}

// Array.first
if (!Array.prototype.first) {
  Array.prototype.first = function () {
    return this[0];
  };
}

// Array.last
if (!Array.prototype.last) {
  Array.prototype.last = function () {
    return this[this.length - 1];
  };
}

// Array.flatten
if (!Array.prototype.flatten) {
  Array.prototype.flatten = function () {
    "use strict";
    var
      len = this.length,
      arr = [],
      i
    ;
    for (i = 0; i < len; i++) {
      // TODO This supposedly isn't safe in multiple frames;
      // http://stackoverflow.com/questions/767486/how-do-you-check-if-a-variable-is-an-array-in-javascript
      // http://stackoverflow.com/questions/4775722/javascript-check-if-object-is-array
      if (this[i] instanceof Array) {
        arr = arr.concat(this[i]);
      } else {
        arr.push(this[i]);
      }
    }

    return arr;
  };
}

// Array.forEach
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function (fun, context) {
    "use strict";
    if (typeof fun !== 'function') {
      throw new TypeError(fun + ' is not a function');
    }

    var
      len = this.length,
      thisp = context || this,
      i
    ;
    for (i = 0; i < len; i++) {
      if (typeof this[i] !== 'undefined') {
        fun.call(thisp, this[i], i, this);
      }
    }

    return null;
  };
}

// String.capitalize
if (!String.prototype.capitalize) {
  String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.substring(1).toLowerCase();
  };
}

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, '');
  };
}


// NOTE Having issues conflicting with jQuery stuff when setting Object
// prototype settings; instead add into Liquid.Object.extensions and use in
// the particular location; can add into Object.prototype later if we want.
Liquid.extensions = {};
Liquid.extensions.object = {};

// Object.update
Liquid.extensions.object.update = function (newObj) {
  var p;
  for (p in newObj) {
    this[p] = newObj[p];
  }

  return this;
};
//if (!Object.prototype.update) {
//  Object.prototype.update = Liquid.extensions.object.update
//}

// Object.hasKey
Liquid.extensions.object.hasKey = function (arg) {
  return !!this[arg];
};
//if (!Object.prototype.hasKey) {
//  Object.prototype.hasKey = Liquid.extensions.object.hasKey
//}

// Object.hasValue
Liquid.extensions.object.hasValue = function (arg) {
  var p;
  for (p in this) {
    if (this[p] == arg) {
      return true;
    }
  }

  return false;
};
//if (!Object.prototype.hasValue) {
//  Object.prototype.hasValue = Liquid.extensions.object.hasValue
//}

