let a = React.createElement(
  "div",
  null,
  "1"
    ? React.createElement("a", {
        href: "123"
      })
    : "2"
    ? React.createElement("a", {
        href: "456"
      })
    : "3"
    ? React.createElement("a", {
        href: "789"
      })
    : React.createElement("a", {
        href: "000"
      })
);
