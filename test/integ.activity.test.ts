import * as cdk from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

import * as util from './util';
import { Activity } from '../src';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'stack', {
  env: {
    account: '012345678910',
    region: 'us-west-2',
  },
});

const bucket = new s3.Bucket(stack, 's3Bucket', {
  bucketName: 'testbucket',
});

const key = new kms.Key(stack, 'data key id', {});

const repo = new ecr.Repository(stack, 'ecrRepository', {
  repositoryName: 'test',
});

const role = util.createPassedRole(stack);

const { subnet, securityGroup } = util.createVpcSubnetAndSecurityGroup(stack);

Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

test('integ test for accessAWSServices ML Activity', () => {
  const activity = Activity.accessAwsServices(stack, 'accessAwsServices activity', {
    ecrRepositories: [repo],
    s3Buckets: [bucket],
  });

  activity.createRole(stack, 'accessAwsServices role', 'accessAwsServices role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessAWSServices ML Activity with VPC', () => {
  const activity = Activity.accessAwsServices(stack, 'accessAwsServices activity with VPC', {
    ecrRepositories: [repo],
    s3Buckets: [bucket],
    subnets: [subnet],
    securityGroups: [securityGroup],
  });

  activity.createRole(stack, 'accessAwsServices role with VPC', 'accessAwsServices role with VPC');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessAWSServices ML Activity with KMS', () => {
  const activity = Activity.accessAwsServices(stack, 'accessAwsServices activity with KMS', {
    ecrRepositories: [repo],
    s3Buckets: [bucket],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'accessAwsServices role with KMS', 'accessAwsServices role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessAWSServices ML Activity with VPC and KMS', () => {
  const activity = Activity.accessAwsServices(stack, 'accessAwsServices activity with VPC and KMS', {
    ecrRepositories: [repo],
    s3Buckets: [bucket],
    subnets: [subnet],
    securityGroups: [securityGroup],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'accessAwsServices role with VPC and KMS', 'accessAwsServices role with VPC and KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessS3AllResources ML Activity', () => {
  const activity = Activity.accessS3AllResources(stack, 'accessS3AllResources activity', {});

  activity.createRole(stack, 'accessS3AllResources role', 'accessS3AllResources role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessS3AllResourcesV2 ML Activity', () => {
  const activity = Activity.accessS3AllResourcesV2(stack, 'accessS3AllResourcesV2 activity', {});

  activity.createRole(stack, 'accessS3AllResourcesV2 role', 'accessS3AllResourcesV2 role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for accessS3Buckets ML Activity', () => {
  const activity = Activity.accessS3Buckets(stack, 'accessS3Buckets activity', {
    s3Buckets: [bucket],
  });

  activity.createRole(stack, 'accessS3Buckets role', 'accessS3Buckets role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageEndpoints ML Activity', () => {
  const activity = Activity.manageEndpoints(stack, 'manageEndpoints activity', {});

  activity.createRole(stack, 'manageEndpoints role', 'manageEndpoints role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageEndpoints ML Activity with KMS', () => {
  const activity = Activity.manageEndpoints(stack, 'manageEndpoints activity with KMS', {
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'manageEndpoints role with KMS', 'manageEndpoints role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageExperiments ML Activity', () => {
  const activity = Activity.manageExperiments(stack, 'manageExperiments activity', {});

  activity.createRole(stack, 'manageExperiments role', 'manageExperiments role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageGlueTables ML Activity', () => {
  const activity = Activity.manageGlueTables(stack, 'manageGlueTables activity', {
    glueDatabaseNames: ['tableName1'],
    s3Buckets: [bucket],
  });

  activity.createRole(stack, 'manageGlueTables role', 'manageGlueTables role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageGlueTables ML Activity with KMS', () => {
  const activity = Activity.manageGlueTables(stack, 'manageGlueTables activity with KMS', {
    glueDatabaseNames: ['tableName1'],
    s3Buckets: [bucket],
    dataKeys: [key],
    volumeKeys: [key],
  });

  activity.createRole(stack, 'manageGlueTables role with KMS', 'manageGlueTables role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageJobs ML Activity', () => {
  const activity = Activity.manageJobs(stack, 'manageJobs activity', {
    rolesToPass: [role],
  });

  activity.createRole(stack, 'manageJobs role', 'manageJobs role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageJobs ML Activity with VPC', () => {
  const activity = Activity.manageJobs(stack, 'manageJobs activity with VPC', {
    rolesToPass: [role],
    subnets: [subnet],
    securityGroups: [securityGroup],
  });

  activity.createRole(stack, 'manageJobs role with VPC', 'manageJobs role with VPC');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageJobs ML Activity with KMS', () => {
  const activity = Activity.manageJobs(stack, 'manageJobs activity with KMS', {
    rolesToPass: [role],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'manageJobs role with KMS', 'manageJobs role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageJobs ML Activity with VPC and KMS', () => {
  const activity = Activity.manageJobs(stack, 'manageJobs activity with VPC and KMS', {
    rolesToPass: [role],
    subnets: [subnet],
    securityGroups: [securityGroup],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'manageJobs role with VPC and KMS', 'manageJobs role with VPC and KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageModels ML Activity', () => {
  const activity = Activity.manageModels(stack, 'manageModels activity', {
    rolesToPass: [role],
  });

  activity.createRole(stack, 'manageModels role', 'manageModels role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for manageModels ML Activity with VPC', () => {
  const activity = Activity.manageModels(stack, 'manageModels activity with VPC', {
    rolesToPass: [role],
    subnets: [subnet],
    securityGroups: [securityGroup],
  });

  activity.createRole(stack, 'manageModels role with VPC', 'manageModels role with VPC');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for managePipelines ML Activity', () => {
  const activity = Activity.managePipelines(stack, 'managePipelines activity', {
    rolesToPass: [role],
  });

  activity.createRole(stack, 'managePipelines role', 'managePipelines role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for monitorModels ML Activity', () => {
  const activity = Activity.monitorModels(stack, 'monitorModels activity', {
    rolesToPass: [role],
  });

  activity.createRole(stack, 'monitorModels role', 'monitorModels role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for monitorModels ML Activity with VPC', () => {
  const activity = Activity.monitorModels(stack, 'monitorModels activity with VPC', {
    rolesToPass: [role],
    subnets: [subnet],
    securityGroups: [securityGroup],
  });

  activity.createRole(stack, 'monitorModels role with VPC', 'monitorModels role with VPC');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for monitorModels ML Activity with KMS', () => {
  const activity = Activity.monitorModels(stack, 'monitorModels activity with KMS', {
    rolesToPass: [role],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'monitorModels role with KMS', 'monitorModels role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for monitorModels ML Activity with VPC and KMS', () => {
  const activity = Activity.monitorModels(stack, 'monitorModels activity with VPC and KMS', {
    rolesToPass: [role],
    subnets: [subnet],
    securityGroups: [securityGroup],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'monitorModels role with VPC and KMS', 'monitorModels role with VPC and KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for queryAthenaGroups ML Activity', () => {
  const activity = Activity.queryAthenaGroups(stack, 'queryAthenaGroups activity', {
    athenaWorkgroupNames: ['athenaWorkgroupName'],
  });

  activity.createRole(stack, 'queryAthenaGroups role', 'queryAthenaGroups role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for runStudioApps ML Activity', () => {
  const activity = Activity.runStudioApps(stack, 'runStudioApps activity', {
    rolesToPass: [role],
  });

  activity.createRole(stack, 'runStudioApps role', 'runStudioApps role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for runStudioApps ML Activity with KMS', () => {
  const activity = Activity.runStudioApps(stack, 'runStudioApps activity with KMS', {
    rolesToPass: [role],
    volumeKeys: [key],
    dataKeys: [key],
  });

  activity.createRole(stack, 'runStudioApps role with KMS', 'runStudioApps role with KMS');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for runStudioAppsV2 ML Activity', () => {
  const activity = Activity.runStudioAppsV2(stack, 'runStudioAppsV2 activity', {});

  activity.createRole(stack, 'runStudioAppsV2 role', 'runStudioAppsV2 role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});

test('integ test for visualizeExperiments ML Activity', () => {
  const activity = Activity.visualizeExperiments(stack, 'visualizeExperiments activity', {});

  activity.createRole(stack, 'visualizeExperiments role', 'visualizeExperiments role');

  const template = assertions.Template.fromStack(stack);

  expect(template.toJSON()).toMatchSnapshot();
});
