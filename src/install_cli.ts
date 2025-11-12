import * as core from "@actions/core"
import { execSync,exec } from "child_process";
import path from "path";
import * as fs from 'fs';


export async function install_cli(parameters:any) {
try{
    //let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli; curl -fsS https://tools.veracode.com/veracode-cli/install | sh`
   const workspace = process.env.GITHUB_WORKSPACE ?? ''// always available in Actions
   console.log("ws",workspace)
    const brocolliDir = path.join(workspace, 'brocolli-cli');
    fs.mkdirSync(brocolliDir);
 
    
    // const psCommand1 =   `Set-ExecutionPolicy AllSigned -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1')) ` ;
    // const psCommand2 = `$VERACODE_CLI = Get-Command veracode | Select-Object -ExpandProperty Definition`
     
  const psCommand1 = `Set-Content -Path "${brocolliDir}/downloaded.ps1" -Value ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))`
 


execSync(`powershell.exe -Command "${psCommand1}"`, { stdio: 'inherit' });

  console.log('Download complete!')


    const files = fs.readdirSync(brocolliDir);
    console.log('Contents of folder:', files);
let pwdCommand1 = `cd ${brocolliDir} && dir`
  try {
    console.log("before executing pwd")
    execSync(pwdCommand1, { stdio: 'inherit' })
   // execSync(lsCommand, { stdio: 'inherit' })
    console.log("after executing pwd")
  }
  catch (e) {
    console.log("Shipra executing command", e)
  }
    
   // let curlCommandOutputInitial = execSync(installCommandInitial)
   // let curlCommandOutput = execSync(installCommand)

    // if ( parameters.debug == "true" ){
    //     core.info('#### DEBUG START ####')
    //     core.info('intall_cli.ts - command output')
    //    core.info('command output : '+curlCommandOutput)
    //     core.info('#### DEBUG END ####')
    //   }
   // core.info(`${curlCommandOutput}`)

}
catch(e){
  console.log(e)
}
}