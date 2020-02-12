let a = <input
    model={this.state.a}
    onChange={() => {
        console.log(1)
    }}
/>
let b = <input
    v-model__component={this.state.a.b}
    onChange={this.props.onSearh}
/>
