let a = React.createElement("input", {
  value: this.state.a.b,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: Object.assign({}, this.state.a, {
        b: e.target.value
      })
    });
  }
});
let b = React.createElement(Input, {
  value: this.state.a.b.c,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: Object.assign({}, this.state.a, {
        b: Object.assign({}, this.state.a.b, {
          c: e
        })
      })
    });
  }
});
let c = React.createElement(Input.x, {
  value: this.state.a.b,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: Object.assign({}, this.state.a, {
        b: e
      })
    });
  },
  type: "checkbox"
});