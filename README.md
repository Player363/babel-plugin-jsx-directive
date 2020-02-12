# babel-plugin-jsx-directive
为jsx提供了一些便于开发的指令

提供了以下类似Vue的指令集

1. if（类似v-if）
2. elseIf
3. else
4. model（类似v-model)

## 条件判断指令（if, elseIf, else）

```jsx harmony
a = <div>
    <a if={true}>1</a>
    
    <a if="333" href="https://www.baidu.com">a</a>
    <b elseIf={4 + 5 > 10}>b</b>
    <d else>d</d>
    
    <a if="333">a</a>
    <c elseIf="3">c</c>
</div>
```

以上代码会被编译成

```jsx harmony
a = <div>
    {true && <a>1</a>}
    
    {
        "333" 
            ? <a href="https://www.baidu.com">a</a>
            : (4 + 5 > 10 ? <b>b</b> : <d>d</d>)         
    }

    {
        "333" 
            ? <a>a</a>
            : ("3" && <c>c</c>)
    }
</div>
```

## model指令
类似`Vue`的`v-model`

```jsx harmony
let a = <input model={this.state.text}/>
```
代码`model={this.state.text}`会被分解为`value`和`onChange`属性
编译后如下
```jsx harmony
let a = <input value={this.state.text} onChange={(e) => this.setState({text: e.target.value})}/>
```

#### 属性和取值方式

默认情况下

当`model`指令被使用在`type`的值为`text`、`select`、`textarea`的`input`元素上时会使用，`value`属性和`onChange`事件，且取值方式为`e.target.value`
```jsx harmony
<input model={this.state.text} type="text"/>;
<input model={this.state.text} type="select"/>;
<input model={this.state.text} type="textarea"/>;

// 以上会被编译成

<input value={this.state.text} onChange={(e) => this.setState({text: e.target.value})} type="text"/>;
<input value={this.state.text} onChange={(e) => this.setState({text: e.target.value})} type="select"/>;
<input value={this.state.text} onChange={(e) => this.setState({text: e.target.value})} type="textarea"/>;
```

当`model`指令被使用在`checkbox`、`radio`元素上时会使用，`checked`属性和`onChange`事件，且取值方式为`e.target.checked`
```jsx harmony
<input model={this.state.text} type="checkbox"/>;
<input model={this.state.text} type="radio"/>;

// 以上会被编译成

<input value={this.state.text} onChange={(e) => this.setState({text: e.target.checked})} type="checkbox"/>;
<input value={this.state.text} onChange={(e) => this.setState({text: e.target.checked})} type="radio"/>;
```

当`model`指令被使用在其他元素上时使用`value`属性和`onChange`事件，且取值方式为`e`
```jsx harmony
<Component model={this.state.text}/>;
<Input model={this.state.text}/>;
<Input.xxxx model={this.state.text}/>;

// 以上会被编译成
<Component value={this.state.text} onChange={(e) => this.setState({text: e})}/>;
<Input value={this.state.text} onChange={(e) => this.setState({text: e})}/>;
<Input.xxxx value={this.state.text} onChange={(e) => this.setState({text: e})}/>;
```

*model的值必须为`this.state.xxx.xxx.xxx`*的形式
```jsx harmony
<Component model={this.state.a}/>;        // √
<Component model={this.state.a.b}/>;      // √
<Component model={this.state.a.b.c}/>;    // √

<Component model={3}/>;                   // ×
let x = 3;
<Component model={x}/>;                   // ×
```

```jsx harmony
<Component model={this.state.a.b.c}/>;

// 会被编译成

<Component 
    value={this.state.a.b.c} 
    onChange={
        e => this.setState({
            a: Object.assign({}, this.state.a, {
                b: Object.assign({}, this.state.a.b, {
                    c: e
                })
            })
        })
    }
/>;
```

#### 修饰符设置属性和取值方式

1. 设置属性：可以使用`_`接在`model`指令之后来设置其取值属性和取值方式

```jsx harmony
<Component model_checked={this.state.a}/>;    // 使用checked属性
<Component model_value={this.state.a}/>;      // 使用value属性
```

2. 设置取值方式：目前一共有3种取值方式。
  
 ```jsx harmony
event: `e.target.value`
eventChecked: `e.target.checked`
component: `e`
```
在设置属性之后再使用`_`拼接
```jsx harmony
<Component model_checked_eventChecked={this.state.a}/>;    // 使用checked属性，取值为e.target.checked
<Component model__component={this.state.a}/>;      // 使用默认的value属性，取值方式为e
```
