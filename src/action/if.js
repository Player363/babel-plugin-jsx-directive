const Utils = require("../Utils")

module.exports = function({types}, JSXElementPath, attributePath, attributeContainer, directive) {
    const utils = new Utils()

    // if未设置值
    if(!attributePath.node.value) throw attributePath.buildCodeFrameError(`${directive.directiveName}未设置条件`)

    const elseName   = utils.getDirectiveById("else").directiveName,
          elseIfName = utils.getDirectiveById("elseIf").directiveName,
          tester     = new RegExp(`^(${elseName})|(${elseIfName})$`)

    // if else elseIf 不能同时出现在一个标签上
    if(attributeContainer.some((attr) => types.isJSXIdentifier(attr.name) && tester.test(attr.name.name))) {
        throw JSXElementPath.buildCodeFrameError(`${directive.directiveName}、${elseName}、${elseIfName} 不能同时使用`)
    }

    const attrNode = attributePath.node,
          left     = types.isJSXExpressionContainer(attrNode.value) ? attrNode.value.expression : attrNode.value

    // 构建三元运算符
    const expression = types.conditionalExpression(
        left,
        JSXElementPath.node,
        types.nullLiteral()
    )
    JSXElementPath.replaceWith(expression)

    // 标记
    expression.rioIfState = "if"

    attributePath.remove()
}