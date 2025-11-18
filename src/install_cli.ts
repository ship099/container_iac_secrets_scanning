import * as core from "@actions/core"
import { execSync,exec, spawn } from "child_process";
import path from "path";
import * as fs from 'fs';


export async function install_cli(parameters:any) {
try{
    //let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli; curl -fsS https://tools.veracode.com/veracode-cli/install | sh`
   const workspace = process.env.GITHUB_WORKSPACE ?? ''// always available in Actions
 
    let results_file = 'results.txt' 
  const psCommand1 = `Set-ExecutionPolicy AllSigned -Scope Process -Force; iex ((New-Object System.Net.WebClient).DownloadString('https://tools.veracode.com/veracode-cli/install.ps1'))`
  const args: string[] = [
    '-NoProfile', // Prevents loading the user profile, for predictability
    '-Command',
    psCommand1
  ];
  let results:any = ""

  let scanCommandOriginal = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format table --output ${results_file} --temp ./ --verbose`



  //using spawn to install the CLI
  const child = await spawn('powershell.exe', args, {
    stdio: 'inherit', // Pipes the output to the console for real-time viewing
    shell: true,      // Using shell: true can sometimes help with command resolution on Windows
  });

  child.on("data", data => {
    console.log("OUT:", data.toString());
  });

  child.on("data", data => {
    console.error("ERR:", data.toString());
  });

  child.on("close", code => {
    console.log("Process exited with code", code);
    console.log(process.env.TEMP)
    const tempDir = process.env.TEMP ?? '';
    const appdata = process.env.APPDATA ?? "";
    const files = fs.readdirSync(appdata)
    const files2 = files.filter(f => f.toLowerCase().endsWith(".ps1"));
    const cliPathVera = path.join(appdata, 'veracode')
    let pwdCommand1 = `dir ${cliPathVera}`
    let pwdCommand2 = `dir ${parameters.source}`
    try {
      console.log("before executing pwd")
      execSync(`powershell ${pwdCommand2}`, { stdio: 'inherit' })
      // execSync(lsCommand, { stdio: 'inherit' })
      console.log("after executing pwd")
    }
    catch (e) {
      console.log(e)
    }

    const cliPath = path.join(cliPathVera, 'veracode.exe');
    try {
      execSync(
        `powershell "${cliPath} ${scanCommandOriginal}"`,
        { stdio: 'inherit' }
      );
    }
    catch (e) {
      console.log("Shipra executing command", e)
      if (fs.existsSync('results.txt')) {
        console.log(`Processing file: results.txt`);
        results = fs.readFileSync('results.txt', 'utf8');
      } else {
        throw `Unable to locate scan results file: results.txt`;
      }

      //creating the body for the comment
      let commentBody: string = '<pre>Veracode Container/IaC/Sercets Scan Summary\n'
      commentBody = commentBody + '\n<details><summary>details</summary><p>\n'
      commentBody = commentBody + results
      commentBody = commentBody + '\n</p></details>\n</pre>'

      core.info(results)
      console.log("Shipra executing command", e)
    }

  });

   console.log("appdata",process.env.APPDATA)
    
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



