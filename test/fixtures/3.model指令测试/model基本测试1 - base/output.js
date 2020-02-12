let a = React.createElement("input", {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e.target.value
    });
  }
});
let b = React.createElement(Input, {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e
    });
  }
});
let c = React.createElement(Input.x, {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e
    });
  }
});
let d = React.createElement("input", {
  checked: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e.target.checked
    });
  },
  type: "radio"
});
let e = React.createElement("input", {
  checked: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e.target.checked
    });
  },
  type: "checkbox"
});
let f = React.createElement(Input.x, {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e
    });
  },
  type: "checkbox"
});