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
  // console.log('Download complete!')
  const child = await spawn('powershell.exe', args, {
    stdio: 'inherit', // Pipes the output to the console for real-time viewing
    shell: true,      // Using shell: true can sometimes help with command resolution on Windows
  });

// Combined PowerShell command
const psCommand = `
$script = "$env:GITHUB_WORKSPACE\\install.ps1";
Invoke-WebRequest 'https://tools.veracode.com/veracode-cli/install.ps1' -OutFile $script;
`;

// Set-ExecutionPolicy AllSigned -Scope Process -Force;
// powershell -File $script

// Spawn PowerShell
// const child = spawn("powershell.exe", [
//   "-NoProfile",
//   "-ExecutionPolicy", "Bypass",
//   "-Command",
//   psCommand1
// ]);

// Output handling
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
  files.filter(f => f.toLowerCase().endsWith(".ps1"));
console.log("files",files)


/**
 * console.log(`Installation complete for ${cliCommandName}. Now locating file...`);

    // 2. Find the path
    try {
        const fullCliPath = await findCliLocation(cliCommandName);
        
        // 3. You can now use this full path in subsequent spawn calls
        // Example: await spawn(fullCliPath, ['--version'], ...);
        console.log(`Ready to use the CLI at: ${fullCliPath}`);

    } catch (e) {
        // Handle the failure to locate the file
        console.error("Critical error: Cannot proceed without CLI path.");
    }
 */

//  const filePath = path.join(tempDir, "install.ps1");
  

  //checking the file exists in temp folder or not
  // if (fs.existsSync(filePath)) {
  //   console.log("Found:", filePath);
  // } else {
  //   console.log("File not found");
  // }

  // let pwdCommand1 = `cd ${process.env.TEMP} & dir`
  // try {
  //   console.log("before executing pwd")
  //   execSync(pwdCommand1, { stdio: 'inherit' })
  //  // execSync(lsCommand, { stdio: 'inherit' })
  //   console.log("after executing pwd")
  // }
  // catch (e) {
  //   console.log("Shipra executing command", e)
  // }
});

// console.log("child",child)
//   child.on('error', (error) => {
//     // This catches errors in the spawn process itself (e.g., powershell.exe not found)
//     console.error(`Failed to start PowerShell process: ${error.message}`);
//   });
//   let output: string = '';
//   // child.stdout!.on('data', (data) => {
//   //             output = `${output}${data}`;
//   //         });

//   child.on('close', (code) => {
//     console.log(`Child process exited with code ${code}`);
//   });
// console.log("data",output)

   console.log("appdata",process.env.APPDATA)
// let pwdCommand1 = `cd ${process.env.GITHUB_WORKSPACE} & dir`
//   try {
//     console.log("before executing pwd")
//     execSync(pwdCommand1, { stdio: 'inherit' })
//    // execSync(lsCommand, { stdio: 'inherit' })
//     console.log("after executing pwd")
//   }
//   catch (e) {
//     console.log("Shipra executing command", e)
//   }
    
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

import { promisify } from 'util';

// Promisify the exec function to use async/await
const execPromise = promisify(exec);

async function findCliLocation(cliName: string): Promise<string> {
    try {
        // Run the Windows 'where.exe' command to find the executable
        const command = `where.exe ${cliName}`;
        console.log(`Attempting to locate CLI with: ${command}`);

        const { stdout, stderr } = await execPromise(command);

        if (stderr) {
            // Handle any errors from the where.exe command
            throw new Error(`where.exe failed: ${stderr}`);
        }

        // The stdout will contain the full path(s). 
        // We'll take the first one and trim any whitespace.
        const cliPath = stdout.trim().split('\n')[0];

        if (!cliPath) {
            throw new Error(`'where.exe' returned no location for ${cliName}`);
        }

        console.log(`✅ CLI found at: ${cliPath}`);
        return cliPath;

    } catch (error:any) {
        console.error(`Could not locate CLI: ${error.message}`);
        // Depending on your needs, you might re-throw or return a default path
        throw error;
    }
}

// --- Usage Example ---
// Replace 'your-cli-name' with the actual command you use to run the tool 
// after installation (e.g., 'az', 'gh', 'scoop').
const cliCommandName = 'veracode'; 

