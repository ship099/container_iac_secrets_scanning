import * as core from "@actions/core"
import { execSync,exec, spawn } from "child_process";
import path from "path";
import * as fs from 'fs';


export async function install_cli(parameters:any) {
try{
    //let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli; curl -fsS https://tools.veracode.com/veracode-cli/install | sh`
   const workspace = process.env.GITHUB_WORKSPACE ?? ''// always available in Actions
   //console.log("ws",workspace)
    const brocolliDir = path.join(workspace, 'brocolli-cli');
    fs.mkdirSync(brocolliDir);
 
    
  const psCommand1 = `Set-ExecutionPolicy AllSigned -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))`
  const args: string[] = [
    '-NoProfile', // Prevents loading the user profile, for predictability
    '-Command',
    psCommand1
  ];



 // execSync(`powershell.exe -Command "${psCommand1}"`, { stdio: 'inherit' });
  console.log('Download complete!')
  const child = spawn('powershell.exe', args, {
    stdio: 'inherit', // Pipes the output to the console for real-time viewing
    shell: true,      // Using shell: true can sometimes help with command resolution on Windows
  });

  child.on('error', (error) => {
    // This catches errors in the spawn process itself (e.g., powershell.exe not found)
    console.error(`Failed to start PowerShell process: ${error.message}`);
  });

  child.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });


    const files = fs.readdirSync(brocolliDir);
    //console.log('Contents of folder:', files);
   // "$env:APPDATA" 
   console.log("appdata",process.env.APPDATA)
let pwdCommand1 = `dir`
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