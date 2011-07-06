(function() {
  var s;
  String.prototype.da_trim = function(str, start) {
    var a, r;
        if (str != null) {
      str;
    } else {
      str = "\s";
    };
    a = this;
    if (start === true || !(start != null)) {
      r = new RegExp("^" + str + "+");
      a = a.replace(r, "");
    }
    if (start === false || !(start != null)) {
      r = new RegExp("" + str + "+$");
      a = a.replace(r, "");
    }
    return a.toString();
  };
  Array.prototype.da_joinUrls = function(joiner) {
    var i, s, _i, _len, _ref, _ref2;
    s = (_ref = this[0]) != null ? _ref.da_trim('/', false) : void 0;
    _ref2 = this.slice(1);
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      i = _ref2[_i];
      if (i) {
        s += '/' + i.da_trim('/', true);
      }
    }
    return s;
  };
  s = "zztest/".da_trim("/", true);
  s = ["x", null].da_joinUrls('/');
  console.log(s);
}).call(this);
