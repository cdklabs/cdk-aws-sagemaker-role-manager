import fs from 'fs';
import path from 'path';

import * as cdk from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

import * as util from './util';

import { Activity } from '../src';

describe('When creating an Activity class', () => {
  test('with valid activity options, the activity is created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageJobs(stack, 'activity id', {
      rolesToPass: [passedRole],
    });

    // THEN
    expect(activity.activityName).toEqual(Activity.MANAGE_JOBS_ACTIVITY_NAME);
    expect(activity.isVPCCustomized).toEqual(false);
    expect(activity.isKMSCustomized).toEqual(false);
  });

  test('activity creation does not create a role or policy as a side effect', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const activity = Activity.manageEndpoints(stack, 'activity id', {});

    // THEN
    expect(activity.activityName).toEqual(Activity.MANAGE_ENDPOINTS_ACTIVITY_NAME);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
  });

  test('with valid vpc and kms customization options, the activity is created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // VPC Subnet and Security Group
    const { subnet, securityGroup } = util.createVpcSubnetAndSecurityGroup(stack);

    // KMS Keys
    const dataKey = new kms.Key(stack, 'data key id', {});
    const volumeKey = new kms.Key(stack, 'volume key id', {});

    // Role to be passed
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageJobs(stack, 'activity id', {
      rolesToPass: [passedRole],
      subnets: [subnet],
      securityGroups: [securityGroup],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    // THEN
    expect(activity.activityName).toEqual(Activity.MANAGE_JOBS_ACTIVITY_NAME);
    expect(activity.isVPCCustomized).toEqual(true);
    expect(activity.isKMSCustomized).toEqual(true);
  });

  test('with invalid activity options, the activity throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => { Activity.manageJobs(stack, 'activity id', { rolesToPass: [] }); };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with invalid vpc customization options, the activity throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      Activity.manageJobs(stack, 'activity id', {
        rolesToPass: [passedRole],
        subnets: [],
        securityGroups: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with invalid kms customization options, the activity throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      Activity.manageJobs(stack, 'activity id', {
        rolesToPass: [passedRole],
        dataKeys: [],
        volumeKeys: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with invalid vpc and kms customization options, the activity throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      Activity.manageJobs(stack, 'activity id', {
        rolesToPass: [passedRole],
        subnets: [],
        securityGroups: [],
        dataKeys: [],
        volumeKeys: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

});

describe('When creating a role', () => {
  test('with default account id and region, the role and its trust policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // WHEN
    const activity = Activity.manageGlueTables(stack, 'activity id', {
      s3Buckets: [new s3.Bucket(stack, 'bucket id', { bucketName: 'test' })],
      glueDatabaseNames: ['testGlueDatabaseName'],
    });

    activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    const manageGlueTableTemplate = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageGlueTables.json'), 'utf8'));
    const manageGlueTableTrustTemplate = manageGlueTableTemplate.trustTemplateJson;

    manageGlueTableTrustTemplate.Statement[0].Condition.ArnLike['aws:SourceArn'] = 'arn:aws:sagemaker:*:*:*';

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: manageGlueTableTrustTemplate,
    });
  });
  test('with custom account id and region, the role and its trust policy are created successfully', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app, 'my-cdk-stack-dev', {
      stackName: 'my-cdk-stack-dev',
      env: {
        region: 'us-east-1',
        account: '123456789',
      },
    });
    stack.resolve(stack.region);
    stack.resolve(stack.account);

    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // WHEN
    const activity = Activity.manageGlueTables(stack, 'activity id', {
      s3Buckets: [new s3.Bucket(stack, 'bucket id', { bucketName: 'test' })],
      glueDatabaseNames: ['testGlueDatabaseName'],
    });

    activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    const manageGlueTableTemplate = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageGlueTables.json'), 'utf8'));
    const manageGlueTableTrustTemplate = manageGlueTableTemplate.trustTemplateJson;

    manageGlueTableTrustTemplate.Statement[0].Condition.ArnLike['aws:SourceArn'] =
        'arn:aws:sagemaker:us-east-1:123456789:*';

    template.hasResourceProperties('AWS::IAM::Role', {
      AssumeRolePolicyDocument: manageGlueTableTrustTemplate,
    });
  });

  test('without global conditions customized, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // WHEN
    const activity = Activity.manageEndpoints(stack, 'activity id', {});
    activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    const templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageEndpoints.json'), 'utf8')).templateJson;

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson,
      PolicyName: `SM_EndpointDeployment_V1_${Date.now()}`,
    });

  });

  test('with vpc global conditions, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // VPC Subnet and Security Group
    const { subnet, securityGroup } = util.createVpcSubnetAndSecurityGroup(stack);

    // Role to be passed
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageJobs(stack, 'activity id', {
      rolesToPass: [passedRole],
      subnets: [subnet],
      securityGroups: [securityGroup],
    });

    const role = activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    let templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageJobsVpc.json'), 'utf8')).templateJson;

    templateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSubnets'] = [{ Ref: 'subnetidSubnetEF5D338F' }];
    templateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSecurityGroupIds'] = [{ 'Fn::GetAtt': ['securitygroupid509A4AD0', 'GroupId'] }];
    templateJson.Statement[3].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];

    templateJson = util.getFormattedTemplateJson(templateJson);

    cdk.Stack.of(role).resolve(role.roleName);
    cdk.Stack.of(subnet).resolve(subnet.subnetId);
    cdk.Stack.of(securityGroup).resolve(securityGroup.securityGroupId);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson,
      PolicyName: `SM_CommonJobManagement_VPC_V1_${Date.now()}`,
    });

  });

  test('with kms global conditions, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // KMS Keys
    const dataKey = new kms.Key(stack, 'data key id', {});
    const volumeKey = new kms.Key(stack, 'volume key id', {});

    // Role to be passed
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageJobs(stack, 'activity id', {
      rolesToPass: [passedRole],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    const role = activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    let templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageJobsKms.json'), 'utf8')).templateJson;

    templateJson.Statement[0].Condition.StringEquals['sagemaker:VolumeKmsKey'] = [{ Ref: 'volumekeyid59073B7E' }];
    templateJson.Statement[0].Condition.StringEquals['sagemaker:OutputKmsKey'] = [{ Ref: 'datakeyid00789BAD' }];
    templateJson.Statement[3].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];
    templateJson.Statement[4].Resource= [{ Ref: 'volumekeyid59073B7E' }];

    templateJson = util.getFormattedTemplateJson(templateJson);

    cdk.Stack.of(role).resolve(role.roleName);
    cdk.Stack.of(dataKey).resolve(dataKey.keyId);
    cdk.Stack.of(volumeKey).resolve(volumeKey.keyId);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson,
      PolicyName: `SM_CommonJobManagement_KMS_V1_${Date.now()}`,
    });

  });

  test('with both vpc and kms global conditions, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // VPC Subnet and Security Group
    const { subnet, securityGroup } = util.createVpcSubnetAndSecurityGroup(stack);

    // KMS Keys
    const dataKey = new kms.Key(stack, 'data key id', {});
    const volumeKey = new kms.Key(stack, 'volume key id', {});

    // Role to be passed
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageJobs(stack, 'activity id', {
      rolesToPass: [passedRole],
      subnets: [subnet],
      securityGroups: [securityGroup],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    const role = activity.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    let templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../assets/templates/manageJobsVpcKms.json'), 'utf8')).templateJson;

    templateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSubnets'] = [{ Ref: 'subnetidSubnetEF5D338F' }];
    templateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSecurityGroupIds'] = [{ 'Fn::GetAtt': ['securitygroupid509A4AD0', 'GroupId'] }];
    templateJson.Statement[0].Condition.StringEquals['sagemaker:VolumeKmsKey'] = [{ Ref: 'volumekeyid59073B7E' }];
    templateJson.Statement[0].Condition.StringEquals['sagemaker:OutputKmsKey'] = [{ Ref: 'datakeyid00789BAD' }];
    templateJson.Statement[3].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];
    templateJson.Statement[4].Resource= [{ Ref: 'volumekeyid59073B7E' }];

    templateJson = util.getFormattedTemplateJson(templateJson);

    cdk.Stack.of(role).resolve(role.roleName);
    cdk.Stack.of(subnet).resolve(subnet.subnetId);
    cdk.Stack.of(securityGroup).resolve(securityGroup.securityGroupId);
    cdk.Stack.of(dataKey).resolve(dataKey.keyId);
    cdk.Stack.of(volumeKey).resolve(volumeKey.keyId);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson,
      PolicyName: `SM_CommonJobManagement_VPC_KMS_V1_${Date.now()}`,
    });

  });

  test('in different context than activity, the role and policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const newStack = new cdk.Stack();

    // WHEN
    const activity = Activity.manageEndpoints(stack, 'activity id', {});
    activity.createRole(newStack, 'role id', 'testRoleName', 'testRoleDescription');

    // THEN
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    assertions.Template.fromStack(newStack).resourceCountIs('AWS::IAM::Role', 1);
    assertions.Template.fromStack(newStack).resourceCountIs('AWS::IAM::Policy', 1);
  });
});

describe('When granting permissions', () => {
  Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

  test('to a cdk construct, its principal is granted the activity\'s permissions', () => {
    // GIVEN
    let activityTemplate = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../assets/templates/manageEndpoints.json'), 'utf8'));

    const stack = new cdk.Stack();

    const granteeRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageEndpoints(stack, 'activity id', {});
    activity.grantPermissionsTo(granteeRole);

    // THEN
    assertions.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(activityTemplate.templateJson),
    });
  });

  test('to a cdk construct, no roles are created as a side effect', () => {
    // GIVEN
    const stack = new cdk.Stack();

    const granteeRole = util.createPassedRole(stack);

    // WHEN
    const activity = Activity.manageEndpoints(stack, 'activity id', {});
    activity.grantPermissionsTo(granteeRole);

    // THEN
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 1);
  });
});
