import * as core from "@actions/core"
import * as artifact from '@actions/artifact'
import { execSync, exec } from "child_process";


export async function run_cli(command: string, debug: any, resultsfile: any) {

    //let scanCommand = `curl -fsS https://tools.veracode.com/veracode-cli/install | sh && ./veracode ${command} `
    const pwdCommand = `pwd`
    //const lsCommand = `cat ${scaResult.fileName}`
    const lsCommand = `cd ..`
    try {
        console.log("before executing pwd")
        execSync(pwdCommand, { stdio: 'inherit' })
        execSync(lsCommand, { stdio: 'inherit' })
        execSync(pwdCommand, { stdio: 'inherit' })
        console.log("after executing pwd")
    }
    catch (e) {
        console.log("Shipra executing command", e)
    }
    let scanCommand = `../veracode-cli/veracode ${command} `
    core.info('Scan command :' + scanCommand)
    let curlCommandOutput = execSync(scanCommand)

    if (debug == "true") {
        core.info('#### DEBUG START ####')
        core.info('run_command.ts - command output')
        core.info('command output : ' + curlCommandOutput)
        core.info('#### DEBUG END ####')
    }
    core.info(`${curlCommandOutput}`)
}