// Standard Filters
Liquid.Template.registerFilter({

  size: function (iterable) {
    return (iterable['length']) ? iterable.length : 0;
  },

  downcase: function (input) {
    return input.toString().toLowerCase();
  },

  upcase: function (input) {
    return input.toString().toUpperCase();
  },

  capitalize: function (input) {
    return input.toString().capitalize();
  },

  escape: function (input) {
    // FIXME: properly HTML escape input...
    return input.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
  },

  h: this.escape,

  truncate: function (input, length, string) {
    if (!input) {
      return '';
    }
    length = length || 50;
    string = string || '...';

    return (input.length > length ?
            input.slice(0, length) + string :
            input);
  },

  truncatewords: function (input, words, string) {
    if (!input) {
      return '';
    }
    words = parseInt(words || 15, 10);
    string = string || '...';
    var wordlist = input.toString().split(' '),
        l = Math.max(words, 0);
    return (wordlist.length > l) ? wordlist.slice(0, l).join(' ') + string : input;
  },

  truncate_words: this.truncatewords,

  strip_html: function (input) {
    return input.toString().replace(/<.*?>/g, '');
  },

  strip_newlines: function (input) {
    return input.toString().replace(/\n/g, '');
  },

  join: function (input, separator) {
    separator = separator || ' ';
    return input.join(separator);
  },

  sort: function (input) {
    return input.sort();
  },

  reverse: function (input) {
    return input.reverse();
  },

  replace: function (input, string, replacement) {
    replacement = replacement || '';
    return input.toString().replace(new RegExp(string, 'g'), replacement);
  },

  replace_first: function (input, string, replacement) {
    replacement = replacement || '';
    return input.toString().replace(new RegExp(string, ''), replacement);
  },

  newline_to_br: function (input) {
    return input.toString().replace(/\n/g, '<br/>\n');
  },

  date: function (input, format) {
    var date;
    if (input instanceof Date) {
      date = input;
    }
    if (!(date instanceof Date) && input == 'now') {
      date = new Date();
    }
    if (!(date instanceof Date)) {
      date = new Date(input);
    }
    if (!(date instanceof Date)) {
      date = new Date(Date.parse(input));
    }
    // Eff it, I tried
    if (!(date instanceof Date)) {
      return input;
    }
    return date.strftime(format);
  },

  first: function (input) {
    return input[0];
  },

  last: function (input) {
    return input[input.length - 1];
  }
});
