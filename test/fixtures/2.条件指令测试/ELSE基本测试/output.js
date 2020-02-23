let a = React.createElement(
  "div",
  null,
  "1"
    ? React.createElement("a", {
        href: "https://www.baidu.com"
      })
    : React.createElement("a", {
        href: "https://www.google.com"
      })
);
