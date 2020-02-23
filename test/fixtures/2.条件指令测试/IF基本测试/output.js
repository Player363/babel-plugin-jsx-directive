function _extends() {
  _extends =
    Object.assign ||
    function(target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

"true" ? React.createElement("div", null) : null;
let a = true ? React.createElement("div", null) : null;
let b = true + 3 || 4 ? React.createElement("div", null) : null;
let c = 567 ? React.createElement("div", null) : null;
let d = {}
  ? React.createElement(
      "div",
      _extends(
        {
          x: "5"
        },
        {
          b: 2
        },
        {
          y: "4"
        }
      )
    )
  : null;
let e = React.createElement(
  "div",
  null,
  true ? React.createElement("a", null) : null,
  false ? React.createElement("div", null) : null
);
