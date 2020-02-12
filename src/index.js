const Store = require("./Store")
const Utils = require("./Utils")

module.exports = function(babel) {
    let store = new Store()
    let utils = new Utils(babel)

    return {
        visitor: {
            Program(_, {opts}) {
                // 选项设置
                let tmp = null

                // if设置
                tmp = utils.getDirectiveById("if")
                if(typeof opts["ifAttrName"] === "string") tmp.directiveName = opts["ifAttrName"]
                if(typeof opts["ifEnable"] !== "undefined") tmp.enable = !!opts["ifEnable"]

                // else 设置
                tmp = utils.getDirectiveById("else")
                if(typeof opts["elseAttrName"] === "string") tmp.directiveName = opts["elseAttrName"]
                if(typeof opts["elseEnable"] !== "undefined") tmp.enable = !!opts["elseEnable"]

                // elseIf设置
                tmp = utils.getDirectiveById("elseIf")
                if(typeof opts["elseIfAttrName"] === "string") tmp.directiveName = opts["elseIfAttrName"]
                if(typeof opts["elseIfEnable"] !== "undefined") tmp.enable = !!opts["elseIfEnable"]

                // model设置
                tmp = utils.getDirectiveById("model")
                if(typeof opts["modelAttrName"] === "string") tmp.directiveName = opts["modelAttrName"]
                if(typeof opts["modelEnable"] !== "undefined") tmp.enable = !!opts["modelEnable"]
            },

            JSXElement(path, {opts}) {
                // 遍历所有指令
                store.enabledDirective.forEach((directive) => {
                    const {action, directiveName} = directive

                    // 寻找指定的指令并去重
                    const directiveIndex = utils.uniqueDirective(path, directiveName)

                    // 未找到指令 over
                    if(directiveIndex < 0) return

                    const attributePath      = path.get("openingElement").get(`attributes.${directiveIndex}`),
                          attributeContainer = path.node.openingElement.attributes

                    // 执行对应的操作
                    action(
                        babel,                  // babel
                        path,                   // 该JSX的Path
                        attributePath,          // 该属性的Path
                        attributeContainer,     // 该属性的容器数组
                        directive,              // 该指令对象
                        opts,                   // 插件选项
                    )
                })
            },
        },
    }
}
