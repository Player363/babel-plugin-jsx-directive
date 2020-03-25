const path = require('path')
const fs = require('fs')
const plugin = require('../lib/index')
const pluginTester = require('babel-plugin-tester').default

function getFileContent(filePath) {
    filePath = path.resolve(__dirname, filePath)
    if (fs.existsSync(filePath)) return fs.readFileSync(filePath, 'utf-8')
}

function readFixtures() {
    return fs
        .readdirSync(path.resolve(__dirname, 'fixtures'))
        .sort()
        .map(groupName => {
            const tests = fs
                .readdirSync(path.resolve(__dirname, `fixtures/${groupName}`))
                .filter(v => v !== 'config.json')
                .map(testName => ({
                    title: testName,
                    code: getFileContent(`fixtures/${groupName}/${testName}/code.js`),
                    output: getFileContent(`fixtures/${groupName}/${testName}/output.js`),
                    ...JSON.parse(getFileContent(`fixtures/${groupName}/${testName}/config.json`) || '{}')
                }))
            return {
                title: groupName,
                tests,
                ...JSON.parse(getFileContent(`fixtures/${groupName}/config.json`) || '{}')
            }
        })
}

readFixtures().forEach(item => {
    pluginTester({
        plugin,
        pluginName: 'jsx-directive',
        endOfLine: 'auto',
        babelOptions: {
            'presets': ['@babel/preset-react']
        },
        ...item
    })
})
