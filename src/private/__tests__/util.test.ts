import * as fs from 'fs';
import * as path from 'path';

import { getTemplateFile, replacePatterns, TEMPLATES_DIR } from '../util';

const manageJobsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${TEMPLATES_DIR}/manageJobs.json`), 'utf8'));
const manageJobsVpcJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${TEMPLATES_DIR}/manageJobsVpc.json`), 'utf8'));
const manageJobsKmsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${TEMPLATES_DIR}/manageJobsKms.json`), 'utf8'));
const manageJobsVpcKmsJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, `../${TEMPLATES_DIR}/manageJobsVpcKms.json`), 'utf8'));

const testTemplateNoReplacements = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'sagemaker:AddAssociation',
        'sagemaker:CreateAction',
        'sagemaker:CreateArtifact',
        'sagemaker:CreateContext',
        'sagemaker:CreateExperiment',
        'sagemaker:CreateTrial',
        'sagemaker:CreateTrialComponent',
        'sagemaker:UpdateAction',
        'sagemaker:UpdateArtifact',
        'sagemaker:UpdateContext',
        'sagemaker:UpdateExperiment',
        'sagemaker:UpdateTrial',
        'sagemaker:UpdateTrialComponent',
        'sagemaker:AssociateTrialComponent',
        'sagemaker:DisassociateTrialComponent',
        'sagemaker:DeleteAssociation',
        'sagemaker:DeleteAction',
        'sagemaker:DeleteArtifact',
        'sagemaker:DeleteContext',
        'sagemaker:DeleteExperiment',
        'sagemaker:DeleteTrial',
        'sagemaker:DeleteTrialComponent',
      ],
      Resource: 'arn:aws:sagemaker:*:*:*/*',
    },
  ],
};

const testTemplateSingleValueReplacements = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'glue:SearchTables',
      ],
      Resource: [
        'arn:aws:glue:{{Region}}:{{AccountId}}:table/*/*',
        'arn:aws:glue:{{Region}}:{{AccountId}}:database/testDb',
        'arn:aws:glue:{{Region}}:{{AccountId}}:catalog',
      ],
    },
  ],
};

const testTemplateSingleValueReplacementsExpected = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'glue:SearchTables',
      ],
      Resource: [
        'arn:aws:glue:testRegion:testAccount:table/*/*',
        'arn:aws:glue:testRegion:testAccount:database/testDb',
        'arn:aws:glue:testRegion:testAccount:catalog',
      ],
    },
  ],
};

const testTemplateMultiValueReplacements = {
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:GetBucketAcl',
  ],
  Resource: [
    'arn:aws:s3:::[[S3Buckets]]/*',
  ],
};

const testTemplateMultiValueReplacementsExpected = {
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
    's3:GetBucketAcl',
  ],
  Resource: [
    'arn:aws:s3:::testBucket1/*',
    'arn:aws:s3:::testBucket2/*',
    'arn:aws:s3:::testBucket3/*',
  ],
};

const testTemplateMultiValueReplacementsWithReplacementsInSameLine = {
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
  ],
  Resource: [
    'arn:aws:s3:::[[S3Buckets]]/[[Objects]]',
  ],
};

const testTemplateMultiValueReplacementsWithReplacementsInSameLineExpected = {
  Effect: 'Allow',
  Action: [
    's3:GetObject',
    's3:PutObject',
  ],
  Resource: [
    'arn:aws:s3:::testBucket1/testObject1',
    'arn:aws:s3:::testBucket1/testObject2',
    'arn:aws:s3:::testBucket2/testObject1',
    'arn:aws:s3:::testBucket2/testObject2',
  ],
};

const testTemplateMultiValueAndSingleValueReplacements = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'glue:SearchTables',
      ],
      Resource: [
        'arn:aws:glue:{{Region}}:{{AccountId}}:table/*/*',
        'arn:aws:glue:{{Region}}:{{AccountId}}:database/[[GlueDbNames]]',
        'arn:aws:glue:{{Region}}:{{AccountId}}:catalog',
      ],
    },
    {
      Effect: 'Allow',
      Action: [
        's3:GetObject',
        's3:PutObject',
        's3:GetBucketAcl',
      ],
      Resource: [
        'arn:aws:s3:::[[S3Buckets]]/*',
      ],
    },
  ],
};

const testTemplateMultiValueAndSingleValueReplacementsExpected = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        'glue:SearchTables',
      ],
      Resource: [
        'arn:aws:glue:testRegion:testAccount:table/*/*',
        'arn:aws:glue:testRegion:testAccount:database/testDb',
        'arn:aws:glue:testRegion:testAccount:catalog',
      ],
    },
    {
      Effect: 'Allow',
      Action: [
        's3:GetObject',
        's3:PutObject',
        's3:GetBucketAcl',
      ],
      Resource: [
        'arn:aws:s3:::testBucket1/*',
        'arn:aws:s3:::testBucket2/*',
        'arn:aws:s3:::testBucket3/*',
      ],
    },
  ],
};

test('test replace patterns for happy case with no replacements', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  expect(replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateNoReplacements));
  svReplacements.set('test', 'testValue');
  expect(replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateNoReplacements));
  mvReplacements.set('test', ['testMultiValue1', 'testMultiValue2']);
  expect(replacePatterns(JSON.stringify(testTemplateNoReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateNoReplacements));
});

test('test replace patterns for happy case with single value replacements', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  svReplacements.set('Region', 'testRegion');
  svReplacements.set('AccountId', 'testAccount');
  expect(replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateSingleValueReplacementsExpected));
  mvReplacements.set('test', ['testMultiValue1', 'testMultiValue2']);
  expect(replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateSingleValueReplacementsExpected));
});

test('test replace patterns for happy case with multi value replacements', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2', 'testBucket3']);
  expect(replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateMultiValueReplacementsExpected));
  svReplacements.set('AccountId', 'testAccount');
  expect(replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateMultiValueReplacementsExpected));
});

test('test replace patterns for happy case with multi value replacements in same line', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2']);
  mvReplacements.set('Objects', ['testObject1', 'testObject2']);
  expect(replacePatterns(JSON.stringify(testTemplateMultiValueReplacementsWithReplacementsInSameLine), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateMultiValueReplacementsWithReplacementsInSameLineExpected));
  svReplacements.set('AccountId', 'testAccount');
});

test('test replace patterns for happy case with both multi value and single value replacements', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  svReplacements.set('Region', 'testRegion');
  svReplacements.set('AccountId', 'testAccount');
  mvReplacements.set('S3Buckets', ['testBucket1', 'testBucket2', 'testBucket3']);
  mvReplacements.set('GlueDbNames', ['testDb']);
  expect(replacePatterns(JSON.stringify(testTemplateMultiValueAndSingleValueReplacements), svReplacements, mvReplacements)).toBe(
    JSON.stringify(testTemplateMultiValueAndSingleValueReplacementsExpected));
});

test('test replace patterns with missing single value replacement', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  expect(() => { replacePatterns(JSON.stringify(testTemplateSingleValueReplacements), svReplacements, mvReplacements); }).toThrow(TypeError);
});

test('test replace patterns with missing multi value replacement', () => {
  const svReplacements = new Map<string, string>();
  const mvReplacements = new Map<string, string[]>();
  expect(() => { replacePatterns(JSON.stringify(testTemplateMultiValueReplacements), svReplacements, mvReplacements); }).toThrow(TypeError);
});

test('getTemplateFile with valid activity name', () => {
  expect(getTemplateFile(manageJobsJson.name, 1)).toEqual(manageJobsJson);
});

test('getTemplateFile with valid activity name and vpc customization enabled', () => {
  expect(getTemplateFile(manageJobsJson.name, 1, true, false)).toEqual(manageJobsVpcJson);
});

test('getTemplateFile with valid activity name and kms customization enabled', () => {
  expect(getTemplateFile(manageJobsJson.name, 1, false, true)).toEqual(manageJobsKmsJson);
});

test('getTemplateFile with valid activity name and both vpc and kms customization enabled', () => {
  expect(getTemplateFile(manageJobsJson.name, 1, true, true)).toEqual(manageJobsVpcKmsJson);
});

test('getTemplateFile with invalid activity name throws RangeError', () => {
  expect(() => { getTemplateFile('', 1); }).toThrow(RangeError);
});
