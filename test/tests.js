// render helper
function render(src, ctx) {
  return Liquid.parse(src).renderWithErrors(ctx);
}

test('Verify API', function() {
  notEqual( typeof Liquid, 'undefined', 'Liquid is missing. Run `rake build` first.' );
  notEqual( typeof Liquid.Template, 'undefined', 'Liquid.Template is missing' );
  notEqual( typeof Liquid.Drop, 'undefined', 'Liquid.Drop is missing' );
  notEqual( typeof Liquid.Tag, 'undefined', 'Liquid.Tag is missing' );
  notEqual( typeof Liquid.Block, 'undefined', 'Liquid.Tag is missing' );
});

test('Plain text pass-thru', function() {
  equal( 'plain text', render('plain text')  );
});

module('Testing variables...');

test("{{ 'string literal' }}", function() {
  equal( 'string literal', render('{{"string literal"}}')  );
  equal( 'string literal', render('{{ "string literal" }}')  );
  equal( 'string literal', render("{{'string literal'}}")  );
  equal( 'string literal', render("{{ 'string literal' }}")  );
  equal( 'string "literal"', render("{{'string \"literal\"'}}")  );
  equal( 'string "literal"', render("{{ 'string \"literal\"' }}")  );
});


test('{{ 10 }}', function() {
  equal( '10', render('{{10}}')  );
  equal( '10', render('{{ 10 }}')  );
});

test('{{ 5.5 }}', function() {
  equal( '5.5', render('{{5.5}}')  );
  equal( '5.5', render('{{ 5.5 }}')  );
});

test('{{ (1..5) }}', function() {
  equal( '1,2,3,4,5', render('{{(1..5)}}')  );
  equal( '1,2,3,4,5', render('{{ (1..5) }}')  );
});

test('{{ (a..e) }}', function() {
  equal( 'a,b,c,d,e', render('{{(a..e)}}')  );
});

test('{{ varname }}', function() {
  equal( 'Bob', render("{{ user }}", {user:'Bob'})  );
});

test('{{ parent.child }}', function() {
  equal( 'Bob', render('{{ user.name }}', {user:{ name:'Bob' }})  );
});

test('Empty string if child is undefined', function() {
  equal( '', render('{{ user.name }}', {user:{ fullname:'Bob' }})  );
});

test('{{ collection[0] }}', function() {
  equal( 'Bob', render('{{ users[0] }}', {users:['Bob']})  );
});

test('{{ collection[0].child }}', function() {
  equal( 'Bob', render('{{ users[0].name }}', {users:[{name:'Bob'}]})  );
});

test('object.toLiquid', function() {
  var rendered = render('{{ user }}', {
    user : {
      toLiquid : function () {
        return 'Mark Wahlberg';
      }
    }
  });
  equal('Mark Wahlberg', rendered);
});


module("Testing filters...");

test('{{ string | size }}', function() {
  equal( '3', render('{{user|size}}', {user:'Bob'})  );
  equal( '6', render('{{ user | size }}', {user:'Robert'})  );
});

test('{{ collection | size }}', function() {
  equal( '3', render('{{user|size}}', {user:[3,2,1]})  );
  equal( '5', render('{{ user | size }}', {user:[1,2,3,4,5]})  );
});

test('{{ string | upcase }}', function() {
  equal( 'BOB', render('{{user|upcase}}', {user:'Bob'})  );
  equal( 'BOB', render('{{ user | upcase }}', {user:'Bob'})  );
});

test('{{ string | downcase }}', function() {
  equal( 'bob', render('{{user|downcase}}', {user:'Bob'})  );
  equal( 'bob', render('{{ user | downcase }}', {user:'Bob'})  );
});

test('{{ string | capitalize }}', function() {
  equal( 'Bob', render('{{user|capitalize}}', {user:'bob'})  );
  equal( 'Bob', render('{{ user | capitalize }}', {user:'bob'})  );
});

test('{{ string | escape }}', function() {
  equal( '&lt;br/&gt;', render("{{'<br/>'|escape}}")  );
  equal( '&lt;br/&gt;', render("{{ '<br/>' | escape }}")  );
  equal( 'this &amp; &quot;that&quot;', render("{{ 'this & \"that\"' | escape }}")  );
});

test('{{ string | h }}', function() {
  equal( '&lt;br/&gt;', render("{{'<br/>'|escape}}")  );
  equal( '&lt;br/&gt;', render("{{ '<br/>' | escape }}")  );
  equal( 'this &amp; &quot;that&quot;', render("{{ 'this & \"that\"' | escape }}")  );
});

test('{{ string | truncate }}', function() {
  equal(
    'I am the very model of a modern major general, rea...',
    render("{{'I am the very model of a modern major general, really.'|truncate}}")
  );
  equal(
    'I am the very model of a modern major general, rea...',
    render("{{'I am the very model of a modern major general, really.' | truncate}}")
  );
});

test('{{ string | truncate:2 }}', function() {
  equal( 'Bo...', render('{{user|truncate:2}}', {user:'Bob'})  );
  equal( 'Bo...', render('{{ user | truncate:2 }}', {user:'Bob'})  );
  equal( 'Bo...', render('{{ user | truncate: 2 }}', {user:'Bob'})  );
});

test("{{ string | truncate:1,'-' }}", function() {
  equal( 'B-', render("{{user|truncate:1,'-'}}", {user:'Bob'})  );
  equal( 'B-', render("{{ user | truncate:1,'-' }}", {user:'Bob'})  );
  equal( 'B-', render("{{ user | truncate: 1,'-' }}", {user:'Bob'})  );
  equal( 'B-', render("{{ user | truncate: 1, '-' }}", {user:'Bob'})  );
});

test('{{ string | truncatewords }}', function() {
  equal(
    'a b c d e f g h i j k l m n o...',
    render("{{'a b c d e f g h i j k l m n o p q r s t u v w x y z'|truncatewords}}")
  );
  equal(
    'a b c d e f g h i j k l m n o...',
    render("{{ 'a b c d e f g h i j k l m n o p q r s t u v w x y z' | truncatewords }}")
  );
});

test('{{ string | truncatewords:5 }}', function() {
  equal(
    'a b c d e...',
    render("{{'a b c d e f g h i j k l m n o p q r s t u v w x y z'|truncatewords:5}}")
  );
  equal(
    'a b c d e...',
    render("{{ 'a b c d e f g h i j k l m n o p q r s t u v w x y z' | truncatewords:5 }}")
  );
});

test("{{ string | truncatewords:5,'-' }}", function() {
  equal(
    'a b c d e-',
    render("{{'a b c d e f g h i j k l m n o p q r s t u v w x y z'|truncatewords:5,'-'}}")
  );
  equal(
    'a b c d e-',
    render("{{ 'a b c d e f g h i j k l m n o p q r s t u v w x y z' | truncatewords:5,'-' }}")
  );
});

test("{{ string | strip_html }}", function() {
  equal(
    'hello bob',
    render("{{'hello <b>bob</b>'|strip_html}}")
  );
  equal(
    'hello bob',
    render("{{ 'hello <b>bob</b>' | strip_html }}")
  );
});

test('{{ string | strip_newlines }}', function() {
  var src = "\nhello \nbob \n\nold\n friend\n";
  equal(
    'hello bob old friend',
    render('{{src|strip_newlines}}', {src:src})
  );
  equal(
    'hello bob old friend',
    render('{{ src | strip_newlines }}', {src:src})
  );
});

test('{{ collection | join }}', function() {
  equal( '1 2 3', render('{{(1..3)|join}}') );
  equal( '1 2 3', render('{{ (1..3) | join }}') );
});

test("{{ collection | join:',' }}", function() {
  equal( '1,2,3', render("{{(1..3)|join:','}}") );
  equal( '1,2,3', render("{{ (1..3) | join:',' }}") );
});

test('{{ collection | sort }}', function() {
  equal( '1,2,3', render('{{c|sort}}', {c:[2,1,3]}) );
  equal( '1,2,3', render('{{ c | sort }}', {c:[2,1,3]}) );
  equal( '1,2,3', render('{{(1..3) | sort}}') );
  equal( '1,2,3', render('{{ (1..3) | sort }}') );
});

test('{{ collection | reverse }}', function() {
  equal( '3,2,1', render('{{(1..3)|reverse}}') );
  equal( '3,2,1', render('{{ (1..3) | reverse }}') );
  equal( '3,2,1', render('{{c|reverse}}', {c:[1,2,3]}) );
  equal( '3,2,1', render('{{ c | reverse }}', {c:[1,2,3]}) );
});

test('{{ string | replace:string }', function() {
  equal( 'bnns', render("{{'bananas'|replace:'a'}}") );
  equal( 'bnns', render("{{ 'bananas' | replace:'a' }}") );
});

test('{{ string | replace_first:sting }}', function() {
  equal( 'bnanas', render("{{'bananas'|replace_first:'a'}}") );
  equal( 'bnanas', render("{{ 'bananas' | replace_first:'a' }}") );
});

test('{{ string | newline_to_br }}', function() {
  var src = "Hello,\nHow are you?\nI'm glad to here it.";
  var exp = "Hello,<br/>\nHow are you?<br/>\nI'm glad to here it.";
  equal( exp, render('{{src|newline_to_br}}', {src:src}) );
  equal( exp, render('{{ src | newline_to_br }}', {src:src}) );
});

test("{{ 'now' | date:'format' }}", function() { // Duplicates issue #1 from github
  var exp = (new Date()).getFullYear();
  equal( exp, render("{{'now' | date: '%Y'}}", {}) );
});

test("{{ date | date:'format' }}", function() {
  var src = new Date('8/30/2008'),
      exp = "08.30.2008",
      fmt = "%m.%d.%Y";
  equal( exp, render("{{src|date:'%m.%d.%Y'}}", {src:src, fmt:fmt}) );
  equal( exp, render("{{ src | date:'%m.%d.%Y' }}", {src:src, fmt:fmt}) );
  equal( exp, render("{{src|date:fmt}}", {src:src, fmt:fmt}) );
  equal( exp, render("{{ src | date:fmt }}", {src:src, fmt:fmt}) );
});

test('{{ collection | first }}', function() {
  equal( '1', render('{{(1..3)|first}}') );
  equal( '1', render('{{ (1..3) | first }}') );
  equal( '1', render('{{c|first}}', {c:[1,2,3]}) );
  equal( '1', render('{{ c | first }}', {c:[1,2,3]}) );
});

test('{{ collection | last }}', function() {
  equal( '3', render('{{(1..3)|last}}') );
  equal( '3', render('{{ (1..3) | last }}') );
  equal( '3', render('{{c|last}}', {c:[1,2,3]}) );
  equal( '3', render('{{ c | last }}', {c:[1,2,3]}) );
});

test('{% for item in collection | offset:int %}{% endfor %}', function() {
  equal('2345', render('{% for item in (1..5) | offset:1 %}{{ item }}{% endfor %}'));
  equal('345', render('{% for item in (1..5) | offset:2 %}{{ item }}{% endfor %}'));
  equal('123', render('{% for item in (1..5) | offset:2 %}{{ forloop.index }}{% endfor %}'));
  equal('012', render('{% for item in (1..5) | offset:2 %}{{ forloop.index0 }}{% endfor %}'));
  equal('truefalse', render('{% for item in (1..3) | offset:1 %}{{ forloop.first }}{% endfor %}'));
  equal('true', render('{% for item in (1..3) | offset:2 %}{{ forloop.last }}{% endfor %}'));
});

test('{% for item in collection | limit:int %}{% endfor %}', function() {
  equal('1', render('{% for item in (1..5) | limit:1 %}{{ item }}{% endfor %}'));
  equal('12', render('{% for item in (1..5) | limit:2 %}{{ forloop.index }}{% endfor %}'));
  equal('12', render('{% for item in (1..5) | limit:2 %}{{ forloop.index }}{% endfor %}'));
  equal('01', render('{% for item in (1..5) | limit:2 %}{{ forloop.index0 }}{% endfor %}'));
  equal('1234', render('{% for item in (1..5) | limit:4 %}{{ forloop.index }}{% endfor %}'));
});

test('{% for item in collection | offset:int limit:int %}{% endfor %}', function() {
  equal('2', render('{% for item in (1..5) | offset:1 limit:1 %}{{ item }}{% endfor %}'));
  equal('34', render('{% for item in (1..5) | offset:2 limit:2 %}{{ item }}{% endfor %}'));
  equal('12', render('{% for item in (1..5) | offset:2 limit:2 %}{{ forloop.index }}{% endfor %}'));
  equal('01', render('{% for item in (1..5) | offset:2 limit:2 %}{{ forloop.index0 }}{% endfor %}'));
  equal('1234', render('{% for item in (1..5) | offset:1 limit:4 %}{{ forloop.index }}{% endfor %}'));
});

module('Testing tags...');

test('{% assign varname = value %}', function() {
  var tmpl = Liquid.parse("{% assign myVar = 'VALUE' %}.{{ myVar }}.");
  equal('.VALUE.', tmpl.render());

  tmpl = Liquid.parse('{% assign myVar = 10 %}.{{ myVar }}.');
  equal('.10.', tmpl.render());

  tmpl = Liquid.parse('{% assign myVar = 5.5 %}.{{ myVar }}.');
  equal('.5.5.', tmpl.render());

  tmpl = Liquid.parse('{% assign myVar = (1..3) %}.{{ myVar }}.');
  equal(".1,2,3.", tmpl.render());

  // Also make sure that nothing leaks out...
  tmpl = Liquid.parse("{% assign myVar = 'foo' %}");
  equal('', tmpl.render());
});

// "{% cache varname %} content {% endcache %}": function() {
//   var src = "{% cache myContent %} Good 'old content! {% endcache %}",
//       tmpl = Liquid.parse(src),
//       result = tmpl.render({});
//   equal("", result);
//   equal(" Good 'old content! ", tmpl.lastContext.get('myContent'))
// },

test('{% capture varname %} content {% endcapture %}', function() {
  var src = "{% capture myContent %}Good 'old content!{% endcapture %}Before {{ myContent }}";
  equal("Before Good 'old content!", Liquid.parse(src).render());
});

test('{% case conditionLeft %} {% when conditionRight %} {% else %} {% endcase %}', function() {
  var src = '{% case testVar %}\n' +
            '{% when 1 %} One!' +
            '{% when 2 %} Two!' +
            "{% when 'test' %} Test!" +
            '{% else %} Got me{% endcase %}',
      tmpl = Liquid.parse(src);

  equal(' One!', tmpl.render({ testVar : 1 }));
  equal(' Two!', tmpl.render({ testVar : 2 }));
  equal(' Test!', tmpl.render({ testVar : 'test' }));
  equal(' Got me', tmpl.render({ testVar : null }));
  equal(' Got me', tmpl.render({ }));
});

test('{% comment %} content {% endcomment %}', function() {
  equal('', render("{% comment %} I'm a comment! {% endcomment %}"));
});

test("{% cycle 'odd', 'even' %}", function() {
  var src = "{% cycle 'odd', 'even' %} {% cycle 'odd', 'even' %} {% cycle 'odd', 'even' %}";
  equal('odd even odd', render(src));

  var src2 = "{% cycle 'odd', 'even' %}{% cycle 'odd', 'even' %}{% cycle 'odd', 'even' %}";
  equal('oddevenodd', render(src2));
});

test('{% for item in collection %}{% endfor %}', function() {
  equal('123', render('{% for item in (1..3) %}{{ item }}{% endfor %}'));
  equal(' 1  2  3 ', render('{% for item in (1..3) %} {{ forloop.index }} {% endfor %}'));
  equal(' 0  1  2 ', render('{% for item in (1..3) %} {{ forloop.index0 }} {% endfor %}'));
  equal(' true  false  false ', render('{% for item in (1..3) %} {{ forloop.first }} {% endfor %}'));
  equal(' false  false  true ', render('{% for item in (1..3) %} {{ forloop.last }} {% endfor %}'));
  // TODO: Add test for the rest of the forloop variables too...
});

test('{% if conditions %}{% else %}{% endif %}', function() {
  equal('TRUE', render('{% if true %}TRUE{% endif %}'));
  equal('TRUE', render('{% if 1 == 1 %}TRUE{% endif %}'));
  equal('',     render('{% if 1 != 1 %}TRUE{% endif %}'));
  equal('',     render('{% if 1 > 1 %}TRUE{% endif %}'));
  equal('',     render('{% if 1 < 1 %}TRUE{% endif %}'));
  equal('TRUE', render('{% if 1 <= 1 %}TRUE{% endif %}'));
  equal('TRUE', render('{% if 1 >= 1 %}TRUE{% endif %}'));
  // Testing else as well...
  equal('TRUE', render('{% if true %}TRUE{% else %}FALSE{% endif %}'));
  equal('TRUE', render('{% if 1 == 1 %}TRUE{% else %}FALSE{% endif %}'));
  equal('FALSE',render('{% if 1 != 1 %}TRUE{% else %}FALSE{% endif %}'));
  equal('FALSE',render('{% if 1 > 1 %}TRUE{% else %}FALSE{% endif %}'));
  equal('FALSE',render('{% if 1 < 1 %}TRUE{% else %}FALSE{% endif %}'));
  equal('TRUE', render('{% if 1 <= 1 %}TRUE{% else %}FALSE{% endif %}'));
  equal('TRUE', render('{% if 1 >= 1 %}TRUE{% else %}FALSE{% endif %}'));
});

test('{% if hasKey || hasValue || contains %}', function () {
  var obj = {
    cat : true,
    dog : false,
    fish : true
  };
  equal('TRUE', render("{% if test hasKey 'dog' %}TRUE{% else %}FALSE{% endif %}", {test : obj}));
  equal('FALSE', render("{% if test hasValue 'nonvalue' %}TRUE{% else %}FALSE{% endif %}", {test : obj}));
  equal('TRUE', render('{% if test hasValue true %}TRUE{% else %}FALSE{% endif %}', {test : obj}));

  // TODO add contains for string
  //equal('TRUE', render("{% if test contains 'bob' %}TRUE{% else %}FALSE{% endif %}", {test : '---00000000bob000----0-00-'}))
  equal('TRUE', render("{% if test contains 'bob' %}TRUE{% else %}FALSE{% endif %}", {test : [1, 2, 3, 'bob']}));
});

test('{% ifchanged %}{% endifchanged %}', function() {
  equal('12', render('{% for item in col %}{% ifchanged %}{{ item }}{% endifchanged %}{% endfor %}', {col:[1,1,1,2,2,2]}));
});

test("{% include 'templateName' %}", function() {
  Liquid.readTemplateFile = function(path) {
    if(path == 'simple')
      return 'simple INCLUDED!';
    else
      return '{{ data }} INCLUDED!';
  };
  equal('simple INCLUDED!', render("{% include 'simple' %}"));
  equal('Data INCLUDED!', render("{% include 'variable' with data:'Data' %}"));
});

test('{% unless conditions %}{% else %}{% endunless %}', function() {
  equal('',     render('{% unless true %}TRUE{% endunless %}'));
  equal('',     render('{% unless 1 == 1 %}TRUE{% endunless %}'));
  equal('TRUE', render('{% unless 1 != 1 %}TRUE{% endunless %}'));
  equal('TRUE', render('{% unless 1 > 1 %}TRUE{% endunless %}'));
  equal('TRUE', render('{% unless 1 < 1 %}TRUE{% endunless %}'));
  equal('',     render('{% unless 1 <= 1 %}TRUE{% endunless %}'));
  equal('',     render('{% unless 1 >= 1 %}TRUE{% endunless %}'));
  // Testing else as well...
  equal('FALSE', render('{% unless true %}TRUE{% else %}FALSE{% endunless %}'));
  equal('FALSE', render('{% unless 1 == 1 %}TRUE{% else %}FALSE{% endunless %}'));
  equal('TRUE',  render('{% unless 1 != 1 %}TRUE{% else %}FALSE{% endunless %}'));
  equal('TRUE',  render('{% unless 1 > 1 %}TRUE{% else %}FALSE{% endunless %}'));
  equal('TRUE',  render('{% unless 1 < 1 %}TRUE{% else %}FALSE{% endunless %}'));
  equal('FALSE', render('{% unless 1 <= 1 %}TRUE{% else %}FALSE{% endunless %}'));
  equal('FALSE', render('{% unless 1 >= 1 %}TRUE{% else %}FALSE{% endunless %}'));
});

module('Testing context...');

test("{{ collection['missing_key'].value }}", function() {
  // TODO Consider using a Context object directly instead, calling variable on it directly
  equal('', render("{{ collection['missing_key'].value }}"));
  equal('', render("{{ collection['missing_key'].value }}", {collection: {}}));
});
