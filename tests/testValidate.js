/**
 * Copyright (C) 2023 nuCarve
 * All rights reserved.
 *
 * Automated test manager for LaserPost
 *
 * This software is licensed under the MIT License:
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

import fs from 'node:fs';
import path from 'node:path';
import minimatch from 'minimatch';
import prettyDiff from './prettyDiff.js';
import {
  SNAPSHOT_NO_WRITE,
  SNAPSHOT_RESET,
  SNAPSHOT_CREATE,
} from './globals.js';
import { validateXPath } from './validatorXPath.js';
import { validateText } from './validatorText.js';
import { buildPostCommand, runPostProcessor } from './runPost.js';
import { prepStorageFolders } from './storage.js';
import { aggregateSetup, mergeSetups } from './setup.js';
import chalk from 'chalk';

/**
 * Validates the results of a prior post execution.  Identifies the validators to use based on the
 * post type and the artifact files discovered, and delegates to the appropriate validator.
 *
 * @param setup Setup to use for the command line arguments.
 * @param postNumber Index into which post should be generated.
 * @param cmdOptions Options from the command line (tests, paths).
 * @param cncPath Path to the transferred CNC file (in the test results folder).
 * @param snapshotPath Path to the snapshot folder (for the baseline snapshot to compare against)
 * @returns { pass: number, fail: number, lastFailure: string }
 */
export function validatePostResults(
  setup,
  postNumber,
  cmdOptions,
  cncPath,
  snapshotPath
) {
  const result = { pass: 0, fail: 0, lastFailure: undefined };

  // determine the post we used for this test
  const post = setup.posts[postNumber];

  // find validators that match our post for this setup
  for (const key in setup.validators) {
    const validator = setup.validators[key];
    if (minimatch(post, validator.post)) {
      // now see if any artifact files match the validator file pattern
      const files = fs.readdirSync(cncPath);
      for (const file of files)
        if (minimatch(file, validator.file)) {
          let validatorResult = undefined;

          // we have a match - a validator and a file to validate
          switch (validator.validator) {
            case 'xpath':
              validatorResult = validateXPath(
                validator,
                cncPath,
                file,
                cmdOptions
              );
              break;
            case 'text':
              validatorResult = validateText(
                validator,
                cncPath,
                file,
                cmdOptions
              );
              break;
            default:
              console.error(
                chalk.red(
                  `    Unknown validator "${validator.validator}" on "${key}" for "${file}".`
                )
              );
              result.lastFailure = `Unknown validator "${validator.validator}" on "${key}" for "${file}".`;
              result.fail++;
              break;
          }

          // did we run a test?
          if (validatorResult) {
            // record the snapshot
            fs.writeFileSync(
              `${path.resolve(cncPath, key)}.snapshot`,
              validatorResult.snapshot,
              { encoding: 'utf-8' }
            );

            // run the snapshot compare / management
            if (!validatorResult.failure) {
              const failureMessage = snapshotCompare(
                key,
                `${path.resolve(cncPath, key)}.snapshot`,
                `${path.resolve(snapshotPath, key)}.snapshot`,
                cmdOptions
              );
              if (!failureMessage) result.pass++;
              else {
                result.lastFailure = failureMessage;
                result.fail++;
              }
            } else {
              result.lastFailure = validatorResult.failure;
              result.fail++;
            }
          } else {
            result.lastFailure = 'Validator failed to return any results.';
            result.fail++;
          }
        }
    }
  }
  return result;
}

/**
 * Compare (and manage) snapshots, potentially capturing the new snapshot as current state depending
 * on command line options.
 *
 * @param validatorName Name of the validator
 * @param newSnapshotFile Path to the file that has the new snapshot test results
 * @param baselineSnapshotFile Path to the baseline snapshot (for the baseline snapshot to compare against)
 * @param cmdOptions Options from the command line (tests, paths).
 * @returns String with failure message, undefined means success
 */
export function snapshotCompare(
  validatorName,
  newSnapshotFile,
  baselineSnapshotFile,
  cmdOptions
) {
  // do we need to look at the baseline snapshot?
  if (cmdOptions.snapshotMode != SNAPSHOT_RESET) {
    // does the baseline snapshot file exist?
    if (fs.existsSync(baselineSnapshotFile)) {
      // load both snapshots
      const newSnapshot = fs.readFileSync(newSnapshotFile, {
        encoding: 'utf-8',
      });
      const baselineSnapshot = fs.readFileSync(baselineSnapshotFile, {
        encoding: 'utf-8',
      });

      // do a diff, which returns console-ready pretty formatting (or undefined if no diffs)
      const changes = prettyDiff(baselineSnapshot, newSnapshot);

      // do we have successful match?  If so, return success
      if (!changes) {
        if (cmdOptions.verbose)
          console.log(chalk.green(`      ${validatorName}: Snapshots match`));

        return undefined;
      }

      // not a match.
      console.log(
        chalk.red(`      FAIL ${validatorName}: Snapshots do not match`)
      );
      console.log(`      ${changes.replace(/\n/g, '\n      ')}`);
      return 'Snapshots do not match.';
    } else {
      if (cmdOptions.snapshotMode == SNAPSHOT_NO_WRITE) {
        console.log(
          chalk.red(
            `      FAIL ${validatorName}: Snapshot does not exist, but snapshot mode disallows creation (requires "-s=create")`
          )
        );
        return 'Snapshot does not exist (see "-s=create")';
      }
      console.log(
        chalk.yellow(
          `      ${validatorName}: Baseline snapshot does not exist; saving snapshot.`
        )
      );
    }
  } else
    console.log(
      chalk.yellow(`      ${validatorName}: Resetting snapshot to latest.`)
    );

  // overwrite the baseline snapshot with latest
  fs.copyFileSync(newSnapshotFile, baselineSnapshotFile);
  return undefined;
}

/**
 *
 * @param testSuite Test suite object that the individual test that needs to be executed.
 * @param testSetups Object containing all test setups
 * @param cmdOptions Options from the command line (tests, paths)
 * @returns Object with { pass: number, fail: number, summary: [{ test: string, post: string,
 * lastFailure: string }] }
 */
export function runTest(testSuite, testSetups, cmdOptions) {
  let setup = aggregateSetup(testSuite.setup, testSetups);
  setup = mergeSetups(testSuite, setup);
  let headerShown = false;

  const result = { pass: 0, fail: 0, summary: [] };

  for (let postIndex = 0; postIndex < setup.posts.length; ++postIndex) {
    // validate the setup
    let invalidSetup = undefined;
    if (!setup.cnc) invalidSetup = `Invalid setup: No CNC defined.`;
    if (setup.posts.length == 0)
      invalidSetup = `Invalid setup: No "posts" defined.`;

    if (invalidSetup) {
      // invalid setup - so populate the failure details and loop
      result.fail++;
      result.summary.push({
        test: setup.name,
        post: setup.posts[postIndex],
        lastFailure: invalidSetup,
      });
      continue;
    }

    // if using post filter(s), make sure the post matches
    if (cmdOptions.postFilter.length > 0) {
      let matchPost = false;
      for (const filter of cmdOptions.postFilter)
        if (
          setup.posts[postIndex].toLowerCase().includes(filter.toLowerCase())
        ) {
          matchPost = true;
          break;
        }
      if (!matchPost) continue;
    }

    // show test header if not already done
    if (!headerShown) {
      console.log(
        chalk.blue(`Test: "${testSuite.name}" (setup "${testSuite.setup}"):`)
      );
      headerShown = true;
    }
    console.log(chalk.gray(`  Post: ${setup.posts[postIndex]}`));

    // prepare the test results folder
    const folders = prepStorageFolders(setup, postIndex, cmdOptions);

    // execute the test
    const passed = runPostProcessor(
      cmdOptions,
      buildPostCommand(setup, postIndex, cmdOptions, folders.cncPath)
    );

    // did we successfully run the post?
    if (passed) {
      // validate the post results
      const validateResult = validatePostResults(
        setup,
        postIndex,
        cmdOptions,
        folders.cncPath,
        folders.snapshotPath
      );

      if (validateResult.fail > 0) {
        result.fail++;
        result.summary.push({
          test: setup.name,
          post: setup.posts[postIndex],
          lastFailure: validateResult.lastFailure,
        });
      } else {
        result.pass++;
        result.summary.push({
          test: setup.name,
          post: setup.posts[postIndex],
          lastFailure: undefined,
        });
      }
    } else {
      result.fail++;
      result.summary.push({
        test: setup.name,
        post: setup.posts[postIndex],
        lastFailure: 'Post-processor failed to execute.',
      });
    }
  }

  return result;
}

/**
 * Runs all tests that match the test criteria
 *
 * @param testSuites Object with all possible test suites
 * @param cmdOptions Options from the command line (tests, paths)
 * @returns Object with { pass: number, fail: number, summary: [{ test: string, post: string,
 * lastFailure: string }] }
 */
export function runTests(testSuites, cmdOptions) {
  const summary = { pass: 0, fail: 0, summary: [] };

  // loop for all defined tests
  for (const testSuite of testSuites.tests) {
    let testSelected = false;

    // if selectedTests were specified, limit to those that match
    if (cmdOptions.tests.length) {
      for (const test of cmdOptions.tests) {
        if (testSuite.name?.toLowerCase().includes(test.toLowerCase())) {
          testSelected = true;
          break;
        }
      }
    } else testSelected = true;

    // if test selected, run the test
    if (testSelected) {
      const result = runTest(testSuite, testSuites.setups, cmdOptions);
      summary.pass += result.pass;
      summary.fail += result.fail;
      summary.summary.push(...result.summary);
    }
  }
  return summary;
}
