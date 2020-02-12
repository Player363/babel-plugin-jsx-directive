const Store = require("./Store")

class Utils {
    constructor(babel) {
        this.babel = babel
        this.types = babel.types
        this.template = babel.template
        this.store = new Store()
    }

    /**
     * 用ID获取指定的指令
     * @param {string} id - 指定要获取的ID
     * @return {directive}
     */
    getDirectiveById(id) {
        return this.store.TransformDirective.find(v => v.id === id)
    }

    /**
     * 寻找JSXElement中指定指令的index，
     * @param {Object} path - 目标JSXElement的Path
     * @param {BabelNodeJSXElement} path.node
     * @param {string|RegExp} condition - 需要查找的指令名称，可以是RegExp | string
     * @param {boolean=true} modifier - 是否允许修饰符，为true是，查找model，model_xxx也会匹配
     *                                  注意，当condition是RegExp时，该参数无效
     * @return {number} - 未找到返回-1
     */
    findDirectiveIndex(path, condition, modifier = true) {
        if(!this.types.isJSXElement(path.node)) return -1

        const openingElement = path.node.openingElement,
              attributes     = openingElement.attributes || []

        if(modifier && !(condition instanceof RegExp)) {
            condition = new RegExp(`^${condition}(_[a-zA-Z]*)*$`)
        }

        return attributes.findIndex((v) => {
            if(condition instanceof RegExp) {
                return this.types.isJSXAttribute(v) && condition.test(v.name.name)
            } else {
                return this.types.isJSXAttribute(v) && v.name.name === condition
            }
        })
    }

    /**
     * JSXElement去掉重复指令，保留最后一个并返回其位置，未找到返回-1
     * @param {object} path - 目标JSXElement的Path
     * @param {BabelNodeJSXElement} path.node
     * @param {string|RegExp} condition - 需要去重的指令名称，可以是RegExp
     * @param {boolean=true} modifier - 是否允许修饰符，为true是，查找model时，model_xxx也会匹配
     *                                  注意，当condition是RegExp时，该参数无效
     * @return {number} - 未找到返回-1
     */
    uniqueDirective(path, condition, modifier = true) {
        if(!this.types.isJSXElement(path.node)) return -1

        // 去重操作
        const openingElement = path.node.openingElement,
              attributes     = openingElement.attributes || []

        let n_directive = condition
        if(modifier && !(n_directive instanceof RegExp)) {
            n_directive = new RegExp(`^${n_directive}(_[a-zA-Z]*)*$`)
        }

        let has = false
        for(let i = attributes.length - 1; i >= 0; i--) {
            if(!this.types.isJSXAttribute(attributes[i])) continue

            const name = attributes[i].name
            if(
                this.types.isJSXIdentifier(name) &&
                n_directive instanceof RegExp ? n_directive.test(name.name) : name.name === n_directive
            ) {
                if(has) {
                    path.get("openingElement").get(`attributes.${i}`).remove()
                } else {
                    has = true
                }
            }
        }

        return has ? this.findDirectiveIndex(path, condition, modifier) : -1
    }

    /**
     * 判断字符串或者JSXAttribute是否有指定的修饰符
     * @param {string|BabelNodeJSXAttribute} target - 字符串或者JSXAttribute Node
     * @param {string} modifier - 指定的修饰符
     * @return {boolean}
     */
    hasModifier(target, modifier) {
        if(typeof target !== "string") target = target.name.name
        return target.indexOf(modifier) > -1
    }

    /**
     * 取得所有的修饰符
     * @param {string|BabelNodeJSXAttribute} target - 字符串或者JSXAttribute Node
     * @return {string[]}
     */
    getModifier(target){
        if(typeof target !== "string") target = target.name.name
        return target.split('_').slice(1)
    }

    /**
     * 判断JSXElement是否是原生节点，如div,span等
     * @param {BabelNodeJSXElement} node - 目标JSXElement
     * @return {boolean}
     */
    isNativeNode(node) {
        let name = node.openingElement.name
        return this.types.isJSXIdentifier(name) && /^[a-z]\w*/.test(name.name)
    }
}

/** @return {Utils} */
module.exports = function(...args) {
    return Utils.instance || (Utils.instance = new Utils(...args))
}
