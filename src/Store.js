class Store {
    constructor() {
        /**
         * 所有指令
         * @type {directive[]}
         */
        this.TransformDirective = [
            {id: "if", directiveName: "if", enable: true, action: require("./action/if")},
            {id: "else", directiveName: "else", enable: true, action: require("./action/else")},
            {id: "elseIf", directiveName: "elseIf", enable: true, action: require("./action/else-if")},
            {id: "model", directiveName: "model", enable: true, action: require("./action/model")},
        ]
    }

    /**
     * get 当前启用的指令数组
     * @return {directive[]}
     */
    get enabledDirective() {
        return this.TransformDirective.filter(v => v.enable)
    }
}

/** @return {Store} */
module.exports = function(...args) {
    return Store.instance || (Store.instance = new Store(...args))
}