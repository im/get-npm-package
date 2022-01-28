const downloadUrl = require('download')
const axios = require('axios')
const ora = require('ora')
const spinner = ora()
const chalk = require('chalk')
const npa = require('npm-package-arg')

/**
 * Download `package` to `dest` and opts.
 *
 * @param {String} packageName
 * @param {String} dest
 * @param {Object} opts
 */

// const REGISTRY_URL = `https://registry.npmjs.org/`
const TAOBAO_REGISTRY_URL = `https://registry.npm.taobao.org/`

const download = async (packageName, dest, opts) => {
    const defaultOpts = {
        url: TAOBAO_REGISTRY_URL,
        log: true
    }

    const { rawSpec, name } = npa(packageName)

    opts = Object.assign(defaultOpts, opts)

    const url = opts.url + name
    spinner.start()

    try {

        spinner.text = `Loading ...`

        const res = await axios.get(url)
        if (res.status === 200) {
            const data = res.data
            const name = data.name
            const latest = data['dist-tags'].latest
            const downloadVersion = rawSpec || latest
            const versions = data.versions
            let curVersion = versions[downloadVersion]
            if (!curVersion) {
                opts.log && console.log('  ' + chalk.red(`There is no version for ${downloadVersion}`))
                spinner.stop()
                spinner.clear()
                return
            }

            const tarball = curVersion.dist.tarball

            const repository = data.repository
            let repositoryUrl = ''
            if (typeof repository === 'string') {
                repositoryUrl = repository
            } else {
                repositoryUrl = repository.url
            }

            spinner.clear()
            spinner.stop()

            opts.log && console.log('  ')
            opts.log && console.log('  Package Name:     ' + chalk.green(name))
            opts.log && console.log('  Download Version: ' + chalk.green(downloadVersion))
            opts.log && console.log('  Latest:           ' + chalk.green(latest))
            opts.log && console.log('  Repository:       ' + chalk.green.underline(repositoryUrl))

            var downloadOptions = {
                extract: true,
                strip: 1,
                mode: '666',
                ...opts,
                headers: {
                    accept: 'application/zip',
                    ...(opts.headers || {})
                }
            }
            spinner.text = `Downloading ${packageName} content ...`
            return downloadUrl(tarball, dest, downloadOptions)
                .then(function () {
                    spinner.text = `download success ...`
                    spinner.stop()
                    opts.log && console.log('  ')
                    opts.log && console.log('  ' + chalk.green(`${packageName} download `) + chalk.yellow(`successful`))
                    return 'success'

                })
                .catch(function (err) {
                    spinner.text = `download failure ...`
                    spinner.stop()
                    return err
                })

        } else {
            spinner.stop()
        }

    } catch (err) {
        spinner.stop()
        spinner.clear()
        console.log('  ' + chalk.red('Network error, please try again later...'))
    }
}

module.exports = download