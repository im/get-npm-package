const requiredVersion = require('../package.json').engines.node

const chalk = require('chalk')
const semver = require('semver')
const leven = require('leven')

function checkNodeVersion (wanted, id) {
    if (!semver.satisfies(process.version, wanted, { includePrerelease: true })) {
        console.log(chalk.red(
            `您使用的Nodejs版本是 ${process.version}, 但是 ${id} 需要使用的Nodejs版本是 ${wanted}`))
        process.exit(1)
    }
}

checkNodeVersion(requiredVersion, '@tangxiaomi/cli')

const program = require('commander')

program
    .version(`@vue/cli ${require('../package').version}`)
    .usage('<command> [options]')

program
    .command('serve')
    .description('创建本地node服务')
    .option('-p, --port <9999>', '指定服务端口，默认 9999')
    .option('-o, --open <false>', '是否自动打开浏览器，默认 false')
    .action((name, options) => {
        require('../lib/serve')({ name, options })
    })

program.on('command:*', ([cmd]) => {
    program.outputHelp()
    console.log(`  ` + chalk.red(`错误命令 ${chalk.yellow(cmd)}.`))
    console.log()
    suggestCommands(cmd)
    process.exitCode = 1
})

program.on('--help', () => {
    console.log()
    console.log(`  请输入 ${chalk.cyan(`tangxiaomi <command> --help`)} 了解命令的详细用法.`)
    console.log()
})

program.commands.forEach(c => c.on('--help', () => console.log()))

program.parse(process.argv)

function suggestCommands (unknownCommand) {
    const availableCommands = program.commands.map(cmd => cmd._name)

    let suggestion

    availableCommands.forEach(cmd => {
        const isBestMatch = leven(cmd, unknownCommand) < leven(suggestion || '', unknownCommand)
        if (leven(cmd, unknownCommand) < 3 && isBestMatch) {
            suggestion = cmd
        }
    })

    if (suggestion) {
        console.log(`  ` + chalk.red(`你是否要使用 ${chalk.yellow(suggestion)}?`))
    }
}