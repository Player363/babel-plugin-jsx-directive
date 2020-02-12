const Utils = require("../Utils")
const expressionTemplate = {
    event: `e.target.value`,
    eventChecked: `e.target.checked`,
    component: `e`
}

module.exports = function({types, template}, JSXElementPath, attributePath, attributeContainer, directive) {
    const utils = new Utils()

    const modelValue      = attributePath.node.value, // model属性值
          modelExpression = modelValue.expression     // model属性值表达式

    // model属性值表达式字符串格式 this.state.xxx
    let modelValueStr = types.isMemberExpression(modelExpression) && expression2Str(modelExpression)

    // model的值必须是this.state.xxx的形式
    if(!modelValueStr || !(modelValueStr.slice(0, 11) === "this.state.")) {
        throw attributePath.buildCodeFrameError(`${directive.directiveName}的值必须是 this.state.xxx 的形式`)
    }

    // -----------------------------------------------------
    // 默认情况下：
    // text、select、textarea 元素使用 value 属性和 change 事件，取值为 e.target.value
    // checkbox、radio 使用 checked 属性和 change 事件，取值为 e.target.value
    // 组件上使用 value 属性和 change 事件，取值为 e
    //
    // 事件固定为onChange，
    // 属性和取值方式可用修饰符更改
    // -----------------------------------------------------
    /** step0 设置属性，事件，取值方式 **/
    let valueProp,
        getValueExpression,
        changeEvent = "onChange"

    const modifiers = utils.getModifier(attributePath.node)

    // 设置属性
    if(modifiers[0]) valueProp = modifiers[0]
    if(!valueProp) {
        if(
            // 是input元素
            types.isJSXIdentifier(JSXElementPath.node.openingElement.name, {name: "input"}) &&
            // 该元素有设置 type='radio'|'checked'
            attributeContainer.find(attr => (
                types.isJSXIdentifier(attr.name, {name: "type"}) &&
                (
                    types.isStringLiteral(attr.value, {value: "radio"}) ||
                    types.isStringLiteral(attr.value, {value: "checkbox"})
                )
            ))
        ) {
            valueProp = "checked"
            getValueExpression = "eventChecked"
        } else {
            valueProp = "value"
        }
    }

    // 设置取值方式
    if(modifiers[1]) getValueExpression = modifiers[1]
    if(!getValueExpression) {
        if(utils.isNativeNode(JSXElementPath.node))
            getValueExpression = "event"
        else
            getValueExpression = "component"
    }
    getValueExpression = expressionTemplate[getValueExpression]

    /** step1 构建 onChange事件 属性 **/
    let functionStr
    let modelMemberArr = modelValueStr && modelValueStr.split(".")

    if(modelMemberArr.length == 3) {
        functionStr = `
        (...args) => {
            const e = args[0]
            this.setState({${modelMemberArr[2]}: ${getValueExpression}});
        }`
    } else {
        let arr = modelMemberArr.slice(2)
        functionStr = `
        (...args) => {
            const e = args[0]
            this.setState({
                ${arr[0]} : $
            })
        }`

        for(let i = 0; i < arr.length - 1; i++) {
            const pushStr = `Object.assign({}, this.state.${arr.slice(0, i + 1).join(".")}, {
                ${arr[i + 1]}: $
            })`
            functionStr = functionStr.replace("$", pushStr)
        }
        functionStr = functionStr.replace("$", getValueExpression)
    }

    // 编译成AST
    const functionAST = template(functionStr)().expression

    // 查找是否有原始定义的onChange
    let preOnChangeIndex = utils.uniqueDirective(JSXElementPath, changeEvent, false)
    if(preOnChangeIndex > -1) {
        let preOnChangePath = JSXElementPath.get("openingElement").get(`attributes.${preOnChangeIndex}`)
        let preOnChange = preOnChangePath.node

        // 如果有，把原函数改造作为立即执行函数插入到生成的函数体里
        if(preOnChange.value) {
            let expression = types.isJSXExpressionContainer(preOnChange.value) ? preOnChange.value.expression : preOnChange.value

            functionAST.body.body.push(
                types.expressionStatement(
                    types.callExpression(
                        expression,
                        [types.spreadElement(types.identifier("args"))]
                    )
                )
            )
        }

        preOnChangePath.remove()
    }

    // 插入 onChange handle 属性节点
    attributePath.insertAfter(
        types.JSXAttribute(
            types.jSXIdentifier(changeEvent),
            types.JSXExpressionContainer(functionAST)
        )
    )

    /** step2 构建 属性 属性 **/
    attributePath.node.name.name = valueProp
}

function expression2Str(expression) {
    let objStr
    switch(expression.object.type) {
        case "MemberExpression":
            objStr = expression2Str(expression.object)
            break
        case "Identifier":
            objStr = expression.object.name
            break
        case "ThisExpression":
            objStr = "this"
            break
    }
    return objStr + "." + expression.property.name
}