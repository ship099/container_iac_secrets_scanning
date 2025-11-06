import * as core from "@actions/core"
import { execSync,exec } from "child_process";


export async function install_cli(parameters:any) {
try{
    //let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli; curl -fsS https://tools.veracode.com/veracode-cli/install | sh`
   // let installCommand = 'powershell -Command "Set-Location ..; New-Item -ItemType Directory -Force -Name veracode-cli; Set-Location veracode-cli; Invoke-WebRequest -Uri https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1;"'
    let installCommand =  `powershell -NoProfile -ExecutionPolicy Bypass -Command "
    Set-Location ..;
    New-Item -ItemType Directory -Force -Name veracode-cli | Out-Null;
    Set-Location veracode-cli;
    Invoke-WebRequest -Uri https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1
  "`
    /**
     *   Set-ExecutionPolicy AllSigned -Scope Process -Force
      $ProgressPreference = "silentlyContinue"
      iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))
      $VERACODE_CLI = Get-Command veracode | Select-Object -ExpandProperty Definition
     */

    core.info('Install command :' + installCommand)
    let curlCommandOutput = execSync(installCommand)

    if ( parameters.debug == "true" ){
        core.info('#### DEBUG START ####')
        core.info('intall_cli.ts - command output')
       core.info('command output : '+curlCommandOutput)
        core.info('#### DEBUG END ####')
      }
   // core.info(`${curlCommandOutput}`)

}
catch(e){
  console.log(e)
}
}