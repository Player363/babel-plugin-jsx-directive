let a = React.createElement("input", {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e.target.value
    });

    ((e, x) => {
      console.log(e);
    })(...args);
  }
});
let b = React.createElement(Input.x, {
  value: this.state.a.b,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: Object.assign({}, this.state.a, {
        b: e
      })
    });
    this.props.onSearh(...args);
  }
});
let c = React.createElement("input", {
  type: "radio",
  checked: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e.target.checked
    });
    (a && b)(...args);
  }
});