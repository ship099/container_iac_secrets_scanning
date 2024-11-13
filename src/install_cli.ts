import * as core from "@actions/core"
import axios from "axios";
import { execSync, exec } from "child_process";
import fs from 'fs'
import path from "path";



export async function install_cli(parameters: any) {

  let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli;`

  core.info('Install command :' + installCommand)
  let curlCommandOutput = execSync(installCommand)
  const pwdCommand = `pwd`
  //const lsCommand = `cat ${scaResult.fileName}`
  const lsCommand = `ls`
  try {
    console.log("Shipra inside installing cli before executing pwd")
    execSync(pwdCommand, { stdio: 'inherit' })
    // execSync(lsCommand, { stdio: 'inherit' })
    console.log("Shipra after executing pwd")
  }
  catch (e) {
    console.log("Shipra executing command", e)
  }
  const cliFileName = `veracode-cli_2.28.0_linux_x86`
  const cliFile = `${cliFileName}.tar.gz`;
  const downloadUrl = `https://tools.veracode.com/veracode-cli/${cliFile}`;
  const response = await axios.get(downloadUrl, { responseType: 'arraybuffer', maxContentLength: Number.MAX_SAFE_INTEGER, maxBodyLength: Number.MAX_SAFE_INTEGER });
  const buffer = Buffer.from(response.data);
  const tempZipPath = path.resolve(cliFile);
  core.info('tempZipFile ' + tempZipPath)
  fs.writeFileSync(tempZipPath, buffer);
  const command = `tar -xzf ${tempZipPath} -C ${__dirname}`
  let curlCommandOutput1 = execSync(command);
  fs.unlinkSync(tempZipPath);

  const extractedCliDir = path.join(`${__dirname}`, `veracode-cli_2.28.0_linux_x86`);
  const veracodeExecutable = path.join(extractedCliDir, 'veracode');


  const pwdCommand1 = `pwd`
  //const lsCommand = `cat ${scaResult.fileName}`
  const lsCommand1 = `ls`
  try {
    console.log("Shipra executing pwd")
    execSync(pwdCommand1, { stdio: 'inherit' })
    execSync(lsCommand1, { stdio: 'inherit' })
    console.log("Shipra after executing pwd")
  }
  catch (e) {
    console.log("Shipra executing command", e)
  }
  if (parameters.debug == "true") {
    core.info('#### DEBUG START ####')
    core.info('intall_cli.ts - command output')
    core.info('command output : ' + curlCommandOutput1)
    core.info('#### DEBUG END ####')
  }
  core.info(`${curlCommandOutput}`)

}