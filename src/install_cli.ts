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
   // let installCommand = 'powershell -Command "Set-Location ..; New-Item -ItemType Directory -Force -Name veracode-cli; Set-Location veracode-cli; Invoke-WebRequest -Uri https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1;"'
  // let makeDirCommand = execSync(installCommandInitial);

  // const pwdCommand = `pwd`
  // //const lsCommand = `cat ${scaResult.fileName}`
  // const lsCommand = `dir`
  // try {
  //   console.log("before executing pwd")
  //   execSync(pwdCommand, { stdio: 'inherit' })
  //   execSync(lsCommand, { stdio: 'inherit' })
  //   console.log("after executing pwd")
  // }
  // catch (e) {
  //   console.log("Shipra executing command", e)
  // }


  //  let installCommand =  `powershell -NoProfile -ExecutionPolicy Bypass -Command "
  //   Invoke-WebRequest https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1"`
    
    const psCommand1 =   `Set-ExecutionPolicy AllSigned -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))` ;
    const psCommand2 = `$VERACODE_CLI = Get-Command veracode | Select-Object -ExpandProperty Definition`
     
      // Run PowerShell script inside Node
//   const psCommand = `
//   Invoke-WebRequest https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1;
//   .\\install.ps1 -DestinationPath '${brocolliDir}'
// `;

//Approach 2
// try {
//  const result= execSync(`powershell -NoProfile -Command "iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))"`, {
//     stdio: 'inherit',
//     cwd: brocolliDir, // ensure we are in the GitHub workspace
//   });
//   console.log("result",result)
// } catch (err) {
//   console.error('CLI installation failed', err);
//   process.exit(1);
// }

//this one is erroring out
//const psCommand = `(New-Object System.Net.WebClient).DownloadFile('https://tools.veracode.com/veracode-cli/install.ps1', '${brocolliDir}')`

//this one is downloading the cli and keeping it in the destination path provided.
const psCommand = `$destFile = Join-Path '${brocolliDir}' 'veracode'; Invoke-WebRequest -Uri 'https://tools.veracode.com/veracode-cli/install.ps1' -OutFile $destFile;& $destFile -DestinationPath '${brocolliDir}'`;

//const psCommand = `Invoke-WebRequest -Uri 'https://tools.veracode.com/veracode-cli/install.ps1' -OutFile $env:TEMP\\veracode; & $env:TEMP\\veracode scan --source ${workspace} --type directory --format json --output results.json`

execSync(`powershell.exe -Command "${psCommand}"`, { stdio: 'inherit' });

  console.log('Download complete!')
 // execSync(`powershell.exe -Command "${psCommand2}"`, { stdio: 'inherit' });
 // execSync('powershell -NoProfile -Command "Get-Command veracode | Select-Object -ExpandProperty Definition"', { stdio: 'inherit' });

//  const path1 = execSync('powershell "Get-Command veracode | Select-Object -ExpandProperty Source"', { shell: 'powershell.exe' })
//  .toString().trim();
// execSync(`"${path1}" veracode`, { stdio: 'inherit' });

    const files = fs.readdirSync(brocolliDir);
    console.log('Contents of folder:', files);
let pwdCommand1 = `cd ${brocolliDir} && dir`
  try {
    console.log("before executing pwd")
    execSync(pwdCommand1, { stdio: 'inherit' })
   // execSync(lsCommand1, { stdio: 'inherit' })
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