import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'

import * as fs from 'fs'
/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const files = fs.readdirSync('./')
    core.info(files.join(`\n`))
    const serviceAccount: string = core.getInput('service_account_json')
    fs.writeFileSync('secrets.json', serviceAccount)
    await exec.exec('npx firebase-tools projects:list', [], {
      env: {
        GOOGLE_APPLICATION_CREDENTIALS: './secrets.json'
      }
    })

    core.info(
      `github:${github.context.action} ${github.context.payload.head_commit.message}`
    )
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.info(serviceAccount)

    // Set outputs for other workflow steps to use
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
