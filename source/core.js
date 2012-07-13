(function(root, factory) {
  // Set up Liquid appropriately for the environment.
  if (typeof exports !== 'undefined') {
    // Node/CommonJS
    exports.Liquid = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define(factory);
  } else {
    // Browser globals
    root.Liquid = factory();
  }
}(this, function () {

  var Liquid = {

    author: '<%= AUTHOR %>',
    version: '<%= VERSION %>',

    readTemplateFile: function(path) {
      throw ('This liquid context does not allow includes.');
    },

    registerFilters: function(filters) {
      Liquid.Template.registerFilter(filters);
    },

    parse: function(src) {
      return Liquid.Template.parse(src);
    }

  };

  //= require "extensions"
  //= require "class"
  //= require "tag"
  //= require "block"
  //= require "document"
  //= require "strainer"
  //= require "context"
  //= require "template"
  //= require "variable"
  //= require "condition"
  //= require "drop"
  //= require "default_tags"
  //= require "default_filters"


  //= require <strftime>
  //= require <split>

  return Liquid;

}));