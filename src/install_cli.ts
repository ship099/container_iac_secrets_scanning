import * as core from "@actions/core"
import axios from "axios";
import { execSync, exec } from "child_process";
import fs from 'fs'
import path from "path";



export async function install_cli(parameters: any) {

  let installCommand = `cd ..;mkdir veracode-cli; cd veracode-cli; curl -fsS https://tools.veracode.com/veracode-cli/install | sh`


  const cliFileName = `veracode-cli_2.28.0_linux_x86`
  const cliFile = `${cliFileName}.tar.gz`;
  const downloadUrl = `https://tools.veracode.com/veracode-cli/${cliFile}`;
  const response = await axios.get(downloadUrl, { responseType: 'arraybuffer', maxContentLength: Number.MAX_SAFE_INTEGER, maxBodyLength: Number.MAX_SAFE_INTEGER });
  const buffer = Buffer.from(response.data);
  const cliPath = path.resolve('veracode-cli')
  const tempZipPath = path.resolve(cliPath, cliFile);
  fs.writeFileSync(tempZipPath, buffer);
  const command = `tar -xzf ${tempZipPath} -C ${cliPath}`
  let curlCommandOutput = execSync(command);
  fs.unlinkSync(tempZipPath);
  // core.info('Install command :' + installCommand)
  //  let curlCommandOutput = execSync(installCommand)

  const pwdCommand = `pwd`
  //const lsCommand = `cat ${scaResult.fileName}`
  const lsCommand = `ls`
  try {
    console.log("inside installing cli before executing pwd")
    execSync(pwdCommand, { stdio: 'inherit' })
    execSync(lsCommand, { stdio: 'inherit' })
    console.log("after executing pwd")
  }
  catch (e) {
    console.log("Shipra executing command", e)
  }
  if (parameters.debug == "true") {
    core.info('#### DEBUG START ####')
    core.info('intall_cli.ts - command output')
    core.info('command output : ' + curlCommandOutput)
    core.info('#### DEBUG END ####')
  }
  core.info(`${curlCommandOutput}`)

}