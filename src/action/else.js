const Utils = require("../Utils")

module.exports = function({types}, JSXElementPath, attributePath, attributeContainer, {directiveName}) {
    const utils = new Utils()

    const ifName     = utils.getDirectiveById("if").directiveName,
          elseIfName = utils.getDirectiveById("elseIf").directiveName,
          tester     = new RegExp(`^(${ifName})|(${elseIfName})$`)

    // if else elseIf 不能同时出现在一个标签上
    if(attributeContainer.some((attr) => types.isJSXIdentifier(attr.name) && tester.test(attr.name.name))) {
        throw JSXElementPath.buildCodeFrameError(`${ifName}、${directiveName}、${elseIfName} 不能同时使用`)
    }

    // 未匹配到if
    if(!JSXElementPath.inList) throw attributePath.buildCodeFrameError(`${directiveName}未找到匹配的${ifName}`)

    const currentIndex  = JSXElementPath.key,
          containerList = JSXElementPath.container

    // 查找if构成的表达式
    let targetExpressPath = false
    for(let i = currentIndex - 1; i >= 0; i--) {
        const current = containerList[i]
        if(types.isJSXText(current) && /^\s*$/.test(current.value)) continue
        if(types.isConditionalExpression(current) && current.rioIfState === "if") {
            targetExpressPath = JSXElementPath.getSibling(i)
        }
        break
    }

    // 未匹配到if
    if(!targetExpressPath) throw attributePath.buildCodeFrameError(`${directiveName}未找到匹配的${ifName}`)

    function deepFindAlternatePath(expressPath) {
        const alternatePath = expressPath.get("alternate")
        return types.isNullLiteral(alternatePath.node) ? alternatePath : deepFindAlternatePath(alternatePath)
    }

    const alternatePath = deepFindAlternatePath(targetExpressPath)

    // 替换成三元运算符中alternatePath
    alternatePath.replaceWith(JSXElementPath.node)

    attributePath.remove()
    JSXElementPath.remove()

    // 标记
    targetExpressPath.node.rioIfState = "end-if"
}