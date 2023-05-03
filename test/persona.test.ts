import fs from 'fs';
import path from 'path';

import * as cdk from 'aws-cdk-lib';
import * as assertions from 'aws-cdk-lib/assertions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';

import * as util from './private/util';

import { Activity, Persona } from '../src';

describe('When creating a Persona class', () => {
  test('with valid persona options, the persona is created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageJobs(stack, 'activity id', {
          rolesToPass: [passedRole],
        }),
      ],
    });

    // THEN
    expect(persona.activities).toHaveLength(1);
  });

  test('persona creation does not create a role or policy as a side effect', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageEndpoints(stack, 'activity id', {}),
      ],
    });

    // THEN
    expect(persona.activities).toHaveLength(1);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
  });

  test('with valid vpc and kms customization options, the persona is created successfully', () => {
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
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageJobs(stack, 'activity id', {
          rolesToPass: [passedRole],
        }),
      ],
      subnets: [subnet],
      securityGroups: [securityGroup],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    // THEN
    expect(persona.activities).toHaveLength(1);
    expect(persona.activities[0].isVPCCustomized).toEqual(true);
    expect(persona.activities[0].isKMSCustomized).toEqual(true);
  });

  test('with empty list of activities, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with list containing duplicate activities, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageEndpoints(stack, 'activity id 1', {}),
          Activity.manageEndpoints(stack, 'activity id 2', {}),
        ],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with invalid activity options, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [Activity.manageJobs(stack, 'activity id',
          { rolesToPass: [] })],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with one vpc customization option empty, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // VPC Subnet
    const { subnet } = util.createVpcSubnetAndSecurityGroup(stack);

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageJobs(stack, 'activity id', {
            rolesToPass: [passedRole],
          }),
        ],
        subnets: [subnet],
        securityGroups: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with both vpc customization options empty, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageJobs(stack, 'activity id', {
            rolesToPass: [passedRole],
          }),
        ],
        subnets: [],
        securityGroups: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });
  // KMS Keys
  test('with one kms customization option empty, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    const dataKey = new kms.Key(stack, 'data key id', {});

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageJobs(stack, 'activity id', {
            rolesToPass: [passedRole],
          }),
        ],
        dataKeys: [dataKey],
        volumeKeys: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with both kms customization options empty, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageJobs(stack, 'activity id', {
            rolesToPass: [passedRole],
          }),
        ],
        dataKeys: [],
        volumeKeys: [],
      });
    };

    // THEN
    expect(when).toThrow(TypeError);
  });

  test('with all vpc and kms customization options empty, the persona throws TypeError', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const when = () => {
      new Persona(stack, 'persona id', {
        activities: [
          Activity.manageJobs(stack, 'activity id', {
            rolesToPass: [passedRole],
          }),
        ],
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
  test('without global conditions customized, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageEndpoints(stack, 'activity id', {}),
      ],
    });
    persona.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    const templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageEndpoints.json'), 'utf8')).templateJson;

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson,
      PolicyName: `SM_EndpointDeployment_${Date.now()}`,
    });

  });

  test('without global conditions customized and multiple activities, the role and its policies are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageEndpoints(stack, 'activity id 1', {}),
        Activity.manageExperiments(stack, 'activity id 2', {}),
        Activity.visualizeExperiments(stack, 'activity id 3', {}),
      ],
    });
    persona.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 1);
    template.resourceCountIs('AWS::IAM::Policy', 3);

    const templateJson1 = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageEndpoints.json'), 'utf8')).templateJson;
    const templateJson2 = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageExperiments.json'), 'utf8')).templateJson;
    const templateJson3 = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/visualizeExperiments.json'), 'utf8')).templateJson;

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson1,
      PolicyName: `SM_EndpointDeployment_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson2,
      PolicyName: `SM_ExperimentsManagement_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: templateJson3,
      PolicyName: `SM_ExperimentsVisualization_${Date.now()}`,
    });

  });

  test('with global conditions, the role and its policy are created successfully', () => {
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
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageJobs(stack, 'activity id', {
          rolesToPass: [passedRole],
        }),
      ],
      subnets: [subnet],
      securityGroups: [securityGroup],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    const role = persona.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 1);

    let templateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageJobsVpcKms.json'), 'utf8')).templateJson;

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
      PolicyName: `SM_CommonJobManagement_VPC_KMS_${Date.now()}`,
    });

  });

  test('using the data science persona without global conditions, the role and its policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    Date.now = jest.fn(() => new Date(Date.UTC(2023, 3, 13)).valueOf());

    // Role to be passed
    const passedRole = util.createPassedRole(stack);

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.runStudioAppsV2(stack, 'run studio template id', {}),
        Activity.manageJobs(stack, 'manage jobs activity id', {
          rolesToPass: [passedRole],
        }),
        Activity.manageModels(stack, 'manage models activity id', {
          rolesToPass: [passedRole],
        }),
        Activity.manageExperiments(stack, 'manage experiments activity id', {}),
        Activity.visualizeExperiments(stack, 'visualize experiments activity id', {}),
        Activity.accessS3Buckets(stack, 'access s3 buckets activity id', {
          s3Buckets: [new s3.Bucket(stack, 'bucket id', { bucketName: 'test' })],
        }),
      ],
    });

    persona.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    let runStudioAppsJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/runStudioAppsV2.json'), 'utf8')).templateJson;
    let manageJobsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageJobs.json'), 'utf8')).templateJson;
    let manageModelsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageModels.json'), 'utf8')).templateJson;
    let manageExperimentsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageExperiments.json'), 'utf8')).templateJson;
    let visualizeExperimentsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/visualizeExperiments.json'), 'utf8')).templateJson;
    let accessS3BucketsJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/accessS3Buckets.json'), 'utf8')).templateJson;

    stack.resolve(passedRole.roleName);

    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 6);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(runStudioAppsJson),
      PolicyName: `SM_StudioAppPermissionsV2_${Date.now()}`,
    });

    manageJobsTemplateJson.Statement[2].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageJobsTemplateJson),
      PolicyName: `SM_CommonJobManagement_${Date.now()}`,
    });

    manageModelsTemplateJson.Statement[2].Resource = { 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] };

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageModelsTemplateJson),
      PolicyName: `SM_ModelManagement_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageExperimentsTemplateJson),
      PolicyName: `SM_ExperimentsManagement_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(visualizeExperimentsTemplateJson),
      PolicyName: `SM_ExperimentsVisualization_${Date.now()}`,
    });

    accessS3BucketsJson.Statement[0].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }]] };
    accessS3BucketsJson.Statement[1].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }, '/*']] };

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(accessS3BucketsJson),
      PolicyName: `SageMakerS3BucketPolicyTemplate_${Date.now()}`,
    });
  });

  test('using the data science persona with global conditions, the role and its policy are created successfully', () => {
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
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.runStudioAppsV2(stack, 'run studio template id', {}),
        Activity.manageJobs(stack, 'manage jobs activity id', {
          rolesToPass: [passedRole],
        }),
        Activity.manageModels(stack, 'manage models activity id', {
          rolesToPass: [passedRole],
        }),
        Activity.manageExperiments(stack, 'manage experiments activity id', {}),
        Activity.visualizeExperiments(stack, 'visualize experiments activity id', {}),
        Activity.accessS3Buckets(stack, 'access s3 buckets activity id', {
          s3Buckets: [new s3.Bucket(stack, 'bucket id', { bucketName: 'test' })],
        }),
      ],
      subnets: [subnet],
      securityGroups: [securityGroup],
      dataKeys: [dataKey],
      volumeKeys: [volumeKey],
    });

    persona.createRole(stack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    let runStudioAppsJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/runStudioAppsV2.json'), 'utf8')).templateJson;
    let manageJobsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageJobsVpcKms.json'), 'utf8')).templateJson;
    let manageModelsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageModelsVpc.json'), 'utf8')).templateJson;
    let manageExperimentsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/manageExperiments.json'), 'utf8')).templateJson;
    let visualizeExperimentsTemplateJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/visualizeExperiments.json'), 'utf8')).templateJson;
    let accessS3BucketsJson = JSON.parse(fs.readFileSync(
      path.resolve(__dirname, '../src/private/templates/accessS3Buckets.json'), 'utf8')).templateJson;

    stack.resolve(passedRole.roleName);
    stack.resolve(subnet.subnetId);
    stack.resolve(securityGroup.securityGroupId);
    stack.resolve(dataKey.keyId);
    stack.resolve(volumeKey.keyId);

    const template = assertions.Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::Role', 2);
    template.resourceCountIs('AWS::IAM::Policy', 6);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(runStudioAppsJson),
      PolicyName: `SM_StudioAppPermissionsV2_${Date.now()}`,
    });

    manageJobsTemplateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSubnets'] = [{ Ref: 'subnetidSubnetEF5D338F' }];
    manageJobsTemplateJson.Statement[0].Condition['ForAllValues:StringEquals']['sagemaker:VpcSecurityGroupIds'] = [{ 'Fn::GetAtt': ['securitygroupid509A4AD0', 'GroupId'] }];
    manageJobsTemplateJson.Statement[0].Condition.StringEquals['sagemaker:VolumeKmsKey'] = [{ Ref: 'volumekeyid59073B7E' }];
    manageJobsTemplateJson.Statement[0].Condition.StringEquals['sagemaker:OutputKmsKey'] = [{ Ref: 'datakeyid00789BAD' }];
    manageJobsTemplateJson.Statement[3].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];
    manageJobsTemplateJson.Statement[4].Resource= [{ Ref: 'volumekeyid59073B7E' }];

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageJobsTemplateJson),
      PolicyName: `SM_CommonJobManagement_VPC_KMS_${Date.now()}`,
    });

    manageModelsTemplateJson.Statement[0].Condition['ForAllValues:StringEquals'] = {
      'sagemaker:VpcSecurityGroupIds': [
        {
          'Fn::GetAtt': ['securitygroupid509A4AD0', 'GroupId'],
        },
      ],
      'sagemaker:VpcSubnets': [
        {
          Ref: 'subnetidSubnetEF5D338F',
        },
      ],
    };

    manageModelsTemplateJson.Statement[3].Resource = { 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] };

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageModelsTemplateJson),
      PolicyName: `SM_ModelManagement_VPC_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(manageExperimentsTemplateJson),
      PolicyName: `SM_ExperimentsManagement_${Date.now()}`,
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(visualizeExperimentsTemplateJson),
      PolicyName: `SM_ExperimentsVisualization_${Date.now()}`,
    });

    accessS3BucketsJson.Statement[0].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }]] };
    accessS3BucketsJson.Statement[1].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }, '/*']] };

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: util.getFormattedTemplateJson(accessS3BucketsJson),
      PolicyName: `SageMakerS3BucketPolicyTemplate_${Date.now()}`,
    });
  });

  test('in different context than persona, the role and policy are created successfully', () => {
    // GIVEN
    const stack = new cdk.Stack();
    const newStack = new cdk.Stack();

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageEndpoints(stack, 'activity id', {}),
      ],
    });
    persona.createRole(newStack, 'testRoleName', 'testRoleName', 'testRoleDescription');

    // THEN
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Role', 0);
    assertions.Template.fromStack(stack).resourceCountIs('AWS::IAM::Policy', 0);
    assertions.Template.fromStack(newStack).resourceCountIs('AWS::IAM::Role', 1);
    assertions.Template.fromStack(newStack).resourceCountIs('AWS::IAM::Policy', 1);
  });
});

describe('When granting permissions', () => {
  test('to a cdk construct, its principal is granted the persona\'s permissions', () => {
    // GIVEN
    const app = new cdk.App();
    const stack = new cdk.Stack(app);

    const passedRole = util.createPassedRole(stack);

    const granteeRole = new iam.Role(stack, 'role id', {
      roleName: 'granteeRole',
      assumedBy: new iam.ServicePrincipal('sagemaker', {},
      ),
    });

    const repo = new ecr.Repository(stack, 'repository id', { repositoryName: 'test' });
    const s3Bucket = new s3.Bucket(stack, 'bucket id', { bucketName: 'test' });

    // WHEN
    const persona = new Persona(stack, 'persona id', {
      activities: [
        Activity.manageJobs(stack, 'manage jobs activity id', {
          rolesToPass: [passedRole],
        }),
        Activity.accessAwsServices(stack, 'access aws services activity id', {
          ecrRepositories: [repo],
          s3Buckets: [s3Bucket],
        }),
      ],
    });
    persona.grantPermissionsTo(granteeRole);

    // THEN
    let manageJobsTemplateJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/private/templates/manageJobs.json'), 'utf8')).templateJson;
    let accessAwsServicesJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../src/private/templates/accessAWSServices.json'), 'utf8')).templateJson;

    manageJobsTemplateJson.Statement = manageJobsTemplateJson.Statement.concat(accessAwsServicesJson.Statement);

    manageJobsTemplateJson.Statement[2].Resource = [{ 'Fn::GetAtt': ['passedroleid112F9904', 'Arn'] }];
    manageJobsTemplateJson.Statement[3].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }]] };
    manageJobsTemplateJson.Statement[4].Resource = { 'Fn::Join': ['', ['arn:aws:s3:::', { Ref: 'bucketid95691A2E' }, '/*']] };
    manageJobsTemplateJson.Statement[6].Resource = [{ 'Fn::GetAtt': ['repositoryidBAF79FC2', 'Arn'] }];

    manageJobsTemplateJson = util.getFormattedTemplateJson(manageJobsTemplateJson);

    stack.resolve(passedRole.roleName);
    stack.resolve(repo.repositoryArn);
    stack.resolve(s3Bucket.bucketName);

    assertions.Template.fromStack(stack).hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: manageJobsTemplateJson,
    });
  });
});
