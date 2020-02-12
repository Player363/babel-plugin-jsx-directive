let a = React.createElement("input", {
  value: this.state.a,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: e
    });
    this.props.x(...args);
  }
});
let b = React.createElement(Input, {
  checked: this.state.a.b,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      a: Object.assign({}, this.state.a, {
        b: e.target.value
      })
    });
    this.props.onSearh(...args);
  }
});
let c = React.createElement(Input.x, {
  xxxX: this.state.a.b,
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
