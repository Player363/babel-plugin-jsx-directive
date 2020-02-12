let a = React.createElement("sd", {
  event: this.state.c.d,
  onChange: (...args) => {
    const e = args[0];
    this.setState({
      c: Object.assign({}, this.state.c, {
        d: e.target.value
      })
    });
  }
});
let b = true ? React.createElement("sd", {
  if_1x: false,
  if_x4: false
}) : null;