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

  const pwdCommand = `pwd`
  //const lsCommand = `cat ${scaResult.fileName}`
  const lsCommand = `dir`
  try {
    console.log("before executing pwd")
    execSync(pwdCommand, { stdio: 'inherit' })
    execSync(lsCommand, { stdio: 'inherit' })
    console.log("after executing pwd")
  }
  catch (e) {
    console.log("Shipra executing command", e)
  }


  //  let installCommand =  `powershell -NoProfile -ExecutionPolicy Bypass -Command "
  //   Invoke-WebRequest https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1"`
    
    const psCommand =   `Set-ExecutionPolicy AllSigned -Scope Process -Force;
      $ProgressPreference = "silentlyContinue";
      iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1') scan --source alpine:latest --type image) ;`
     // $VERACODE_CLI = Get-Command veracode | Select-Object -ExpandProperty Definition`
     
      // Run PowerShell script inside Node
//   const psCommand = `
//   Invoke-WebRequest https://tools.veracode.com/veracode-cli/install.ps1 -OutFile install.ps1;
//   .\\install.ps1 -DestinationPath '${brocolliDir}'
// `;


try {
 const result= execSync(`powershell -NoProfile -Command "${psCommand}"`, {
    stdio: 'inherit',
    cwd: brocolliDir, // ensure we are in the GitHub workspace
  });
  console.log("result",result)
} catch (err) {
  console.error('CLI installation failed', err);
  process.exit(1);
}

// Verify contents
// const files = fs.readdirSync(targetDir);
// console.log('Installed files:', files);
// }

//     core.info('Install command :' + installCommand)
//     execSync(installCommand, {
//       cwd: brocolliDir,
//       stdio: 'inherit',
//     });

    const files = fs.readdirSync(brocolliDir);
    console.log('Contents of folder:', files);

  try {
    console.log("before executing pwd")
    execSync(pwdCommand, { stdio: 'inherit' })
    execSync(lsCommand, { stdio: 'inherit' })
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