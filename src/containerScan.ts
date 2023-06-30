#!/usr/bin/env node
import * as core from "@actions/core"
import * as artifact from '@actions/artifact'
import * as github from "@actions/github"
import { execSync } from "child_process";
import { env } from "process";
import * as fs from 'fs';
import { run_cli } from "./run_command";
import { install_cli } from "./install_cli";

export async function ContainerScan(parameters:any) {

  //install the cli
  install_cli(parameters)

  env.VERACODE_API_KEY_ID= parameters.vid
  env.VERACODE_API_KEY_SECRET= parameters.vkey
  
  //run this when oputput is requires and we may create issues and/or PR decorations
  if ( parameters.command == "scan" ){

    if ( parameters.debug == "true" ){
      core.info('#### DEBUG START ####')
      core.info('containerScan.ts - check for text output')
      core.info(parameters.output)
      core.info('#### DEBUG END ####')
    }

    //generate command to run
    let scanCommandOriginal = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format ${parameters.format} --output ${parameters.output}`
    
    if ( parameters.debug == "true" ){
      core.info('#### DEBUG START ####')
      core.info('containerScan.ts - original scan command')
      core.info(scanCommandOriginal)
      core.info('#### DEBUG END ####')
    }

    //create SBOM commands
    let sbom_cyclonedx_xml = `sbom --source ${parameters.source} --type ${parameters.type} --format cyclonedx-xml --output sbom_cyclonedx_xml.xml`
    let sbom_cyclonedx_xml_results_file = 'sbom_cyclonedx_xml.xml'

    let sbom_cyclonedx_json = `sbom --source ${parameters.source} --type ${parameters.type} --format cyclonedx-json --output sbom_cyclonedx_json.json`
    let sbom_cyclonedx_json_results_file = 'sbom_cyclonedx_json.json'

    let sbom_spdx_tag_value = `sbom --source ${parameters.source} --type ${parameters.type} --format spdx-tag-value --output sbom_spdx_tag_value.json`
    let sbom_spdx_tag_value_results_file = 'sbom_spdx_tag_value.json'

    let sbom_spdx_json = `sbom --source ${parameters.source} --type ${parameters.type} --format spdx-json --output sbom_spdx_json.json`
    let sbom_spdx_json_results_file = 'sbom_spdx_json.json'

    let sbom_github = `sbom --source ${parameters.source} --type ${parameters.type} --format github --output sbom_github.json`
    let sbom_github_results_file = 'sbom_github.json'


    //always run this to generate text output
    if ( parameters.output == "results.json" ){
      let scanCommandText = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format table --output results.txt`
      
      async function runParallelFunctions(): Promise<void> {
        let scanCommandText = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format ${parameters.format} --output ${parameters.output}`
        const promises = [run_cli(scanCommandOriginal,parameters.debug,'results.json'), run_cli(scanCommandText,parameters.debug,'results.txt'), run_cli(sbom_cyclonedx_xml,parameters.debug,sbom_cyclonedx_xml_results_file), run_cli(sbom_cyclonedx_json,parameters.debug,sbom_cyclonedx_json_results_file), run_cli(sbom_spdx_tag_value,parameters.debug,sbom_spdx_tag_value_results_file), run_cli(sbom_spdx_json,parameters.debug,sbom_spdx_json_results_file), run_cli(sbom_github,parameters.debug,sbom_github_results_file)];
        await Promise.all(promises);
        console.log('Both functions completed in parallel');
      }

    }
    else {
      async function runParallelFunctions(): Promise<void> {
        let scanCommandText = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format ${parameters.format} --output ${parameters.output}`
        const promises = [run_cli(scanCommandOriginal,parameters.debug,'results.txt'), run_cli(sbom_cyclonedx_xml,parameters.debug,sbom_cyclonedx_xml_results_file), run_cli(sbom_cyclonedx_json,parameters.debug,sbom_cyclonedx_json_results_file), run_cli(sbom_spdx_tag_value,parameters.debug,sbom_spdx_tag_value_results_file), run_cli(sbom_spdx_json,parameters.debug,sbom_spdx_json_results_file), run_cli(sbom_github,parameters.debug,sbom_github_results_file)];
        await Promise.all(promises);
        console.log('Both functions completed in parallel');
      }
    }

    async function runParallelFunctions(): Promise<void> {
      let scanCommandText = `${parameters.command} --source ${parameters.source} --type ${parameters.type} --format ${parameters.format} --output ${parameters.output}`
      const promises = [run_cli(scanCommandOriginal,parameters.debug,'results.json'), run_cli(scanCommandText,parameters.debug,'results.txt')];
      await Promise.all(promises);
      console.log('Both functions completed in parallel');
    }

    runParallelFunctions().catch((error) => {
      console.error('An error occurred:', error);
    });

    
//Start here for results outpout

    let results:any = ""

    if(fs.existsSync('results.txt')) {
      console.log(`Processing file: results.txt`);
      results = fs.readFileSync('results.txt', 'utf8');
    } else {
      throw `Unable to locate scan results file: results.txt`;
    }

    if ( parameters.debug == "true" ){
      core.info('#### DEBUG START ####')
      core.info('containerScan.ts')
      core.info('results')
      //core.info(results)
      core.info('#### DEBUG END ####')
    }

    //creating the body for the comment
    let commentBody:string = 'Veracode Container/IaC/Sercets Scan Summary'
    commentBody = commentBody+'---\n<details><summary>details</summary><p>\n---'
    commentBody = commentBody + results
    commentBody = commentBody+'---\n</p></details>\n==='

    if ( parameters.debug == "true" ){
      core.info('#### DEBUG START ####')
      core.info('containerScan.ts')
      core.info('comment Body')
      core.info(commentBody)
      core.info('#### DEBUG END ####')
    }

    if ( parameters.isPR >= 1 ){
      core.info("This run is part of a PR, should add some PR comment")

      try {
        const octokit = github.getOctokit(parameters.token);

        const context = github.context
        const repository:any = process.env.GITHUB_REPOSITORY
        const repo = repository.split("/");
        const commentID:any = context.payload.pull_request?.number;

        const { data: comment } = await octokit.rest.issues.createComment({
            owner: repo[0],
            repo: repo[1],
            issue_number: commentID,
            body: commentBody,
        });
        core.info('Adding scan results as comment to PR #'+commentID)
      } catch (error:any) {
          core.info(error);
      }
    }

    if ( parameters.fail_build == "true" ){
        //const policyPassed = commentBody.substring('"policy-passed":')
        const regex = /\"policy-passed\": false/g;
        //const policyPassed = commentBody.match(regex)
        const policyPassed = commentBody.search(regex)
        core.info('policyPassed: '+policyPassed)
        //const policyPassedString = policyPassed.split(":")

        if ( parameters.debug == "true" ){
          core.info('#### DEBUG START ####')
          core.info('containerScan.ts')
          core.info('full output string')
          //core.info(commentBody)
          core.info('Fail Build?')
          //core.info(policyPassed)
          core.info('#### DEBUG END ####')
        }

        if ( policyPassed > 1 ){
          core.info('Veracode Container Scanning failed')
          core.setFailed('Veracode Container Scanning failed')
        }
        else {
          core.info('Veracode Container Scanning passed')
        }
    }




  }
  else if ( parameters.command == "sbom" ){
    // This is where only the SBOM part is runnuing

  }



}