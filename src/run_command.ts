import * as core from "@actions/core"
import * as artifact from '@actions/artifact'
import { execSync,exec } from "child_process";
import path from "path";
import * as fs from 'fs';


export async function run_cli(command:string, debug:any, resultsfile:any, failBuildOnError:boolean) {
    // let scanCommand = `../veracode-cli/veracode ${command}`
    // core.info('Scan command :' + scanCommand)

    //let scanCommand = `curl -fsS https://tools.veracode.com/veracode-cli/install | sh && ./veracode ${command} `
    const workspace = process.env.GITHUB_WORKSPACE ?? ''// always available in Actions
    console.log("ws",workspace)
     const brocolliDir = path.join(workspace, 'brocolli-cli');
    let cliPath = path.join(brocolliDir,'downloaded.ps1')
    console.log("cliPath",cliPath)
    console.log("command",command)
try{
   await execSync(
        `powershell "& ${cliPath} ${command}"`,
        { stdio: 'inherit' }
      );
       
       // let curlCommandOutput = execSync(scanCommand)

        if ( debug == "true" ){
            core.info('#### DEBUG START ####')
            core.info('run_command.ts - command output')
     //       core.info('command output : '+curlCommandOutput)
            core.info('#### DEBUG END ####')
        }
   //     core.info(`${curlCommandOutput}`)
    } catch (error: any) {
      //  const failureMessage = `Veracode CLI scan failed. Exit code: ${error.status}, Command: ${scanCommand}`;
      console.log(error)
        const failureMessage = `Veracode CLI scan failed. Exit code: ${error.status},`;
        const failBuildOnErrorBool = String(failBuildOnError).toLowerCase() === "true";
        if (failBuildOnErrorBool) {
            core.setFailed(failureMessage);
            core.info(`Note: Build failed due to break_build_on_error flag being set to true.`)
        } else {
            core.error(failureMessage);
        }
    }
}