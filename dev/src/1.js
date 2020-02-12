let a = <input
    model={this.state.a}
    onChange={(e, x) => {
        console.log(e)
    }}
/>
let b = <Input.x
    model={this.state.a.b}
    onChange={this.props.onSearh}
/>
let c = <input
    type="radio"
    model={this.state.a}
    onChange={a && b}
/>