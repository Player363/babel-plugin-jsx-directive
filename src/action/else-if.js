const Utils = require("../Utils")

module.exports = function({types}, JSXElementPath, attributePath, attributeContainer, {directiveName}) {
    const utils = new Utils()

    const ifName   = utils.getDirectiveById("if").directiveName,
          elseName = utils.getDirectiveById("else").directiveName,
          tester   = new RegExp(`^(${ifName})|(${elseName})$`)

    // elseIf未设置值
    if(!attributePath.node.value) throw attributePath.buildCodeFrameError(`${directiveName}未设置条件`)

    // 未匹配到 if 或者 else-if
    if(!JSXElementPath.inList) throw attributePath.buildCodeFrameError(`${directiveName}未找到匹配的${ifName}或${directiveName}`)

    const currentIndex = JSXElementPath.key
    const containerList = JSXElementPath.container

    // 查找rio-if构成的表达式
    let targetExpressPath = false
    for(let i = currentIndex - 1; i >= 0; i--) {
        const current = containerList[i]
        if(types.isJSXText(current) && /^\s*$/.test(current.value)) continue
        if(types.isConditionalExpression(current) && current.rioIfState === "if") {
            targetExpressPath = JSXElementPath.getSibling(i)
        }
        break
    }

    // 未匹配到 if 或者 else-if
    if(!targetExpressPath) throw attributePath.buildCodeFrameError(`${directiveName}未找到匹配的${ifName}或${directiveName}`)

    function deepFindAlternatePath(expressPath) {
        const alternatePath = expressPath.get("alternate")
        return types.isNullLiteral(alternatePath.node) ? alternatePath : deepFindAlternatePath(alternatePath)
    }

    const targetAlternatePath = deepFindAlternatePath(targetExpressPath)
    const attributeNode = attributePath.node

    // 开始构建三元运算符
    const left = types.isJSXExpressionContainer(attributeNode.value) ? attributeNode.value.expression : attributeNode.value

    const expression = types.conditionalExpression(
        left,
        JSXElementPath.node,
        types.nullLiteral()
    )

    targetAlternatePath.replaceWith(expression)

    attributePath.remove()
    JSXElementPath.remove()
}
