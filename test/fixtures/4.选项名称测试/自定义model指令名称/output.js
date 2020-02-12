let a = React.createElement("input", {
  model: this.state.a,
  onChange: () => {
    console.log(1);
  }
});
let b = React.createElement("input", {
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