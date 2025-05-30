## cdk-aws-sagemaker-role-manager

## Usage

### Create Role from ML Activity with VPC and KMS conditions

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

const activity = Activity.manageJobs(stack, 'id1', {
    rolesToPass: [iam.Role.fromRoleName('Enter Name')],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});

activity.createRole(stack, 'role id', 'Enter Name');
```

### Create Role from ML Activity without VPC and KMS conditions

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

const activity = Activity.manageJobs(this, 'id1', {
    rolesToPass: [iam.Role.fromRoleName('Enter Name')],
});

activity.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from Data Scientist ML Persona

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity, Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(),
        Activity.manageJobs(this, 'id1', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageModels(this, 'id2', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageExperiments(this, 'id3', {}),
        Activity.searchExperiments(this, 'id4', {}),
        Activity.accessBuckets(this, 'id5', {buckets: [s3.S3Bucket.fromBucketName('Enter Name')]})
    ],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});

persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from Data Scientist ML Persona without vpc and kms global conditions

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity, Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

// Please see below how to create the Data Scientist ML Persona using its ML Activities.
// You can update the following list with changes matching your usecase.
let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(),
        Activity.manageJobs(this, 'id1', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageModels(this, 'id2', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageExperiments(this, 'id3', {}),
        Activity.searchExperiments(this, 'id4', {}),
        Activity.accessBuckets(this, 'id5', {buckets: [s3.S3Bucket.fromBucketName('Enter Name')]})
    ],
});

// We can create a role with Data Scientist persona permissions
const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role MLOps ML Persona

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity, Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(this, 'id1', {}),
        Activity.manageModels(this, 'id2', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageEndpoints(this, 'id3',{rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.managePipelines(this, 'id4', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.searchExperiments(this, 'id5', {})
    ],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});

const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from MLOps ML Persona without vpc and kms global conditions

```ts
import { Stack } from 'aws-cdk-lib';
import { Activity, Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager';

const stack = new Stack(app, 'CdkRoleManagerDemo');

let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(this, 'id1', {}),
        Activity.manageModels(this, 'id2', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.manageEndpoints(this, 'id3',{rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.managePipelines(this, 'id4', {rolesToPass: [iam.Role.fromRoleName('Enter Name')]}),
        Activity.searchExperiments(this, 'id5', {})
    ],
});

const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

## Available ML Activities
| ML Activity Name | ML Activity Interface           | ML Activity Description                                                                                   | ML Activity Required Parameters |
|------------------|---------------------------------|-----------------------------------------------------------------------------------------------------------|---------------------------------|
| Access Required AWS Services          | Activity.accessAwsServices()    | Permissions to access S3, ECR, Cloudwatch and EC2. Required for execution roles for jobs and endpoints.   | ecrRepositories, s3Buckets      |
| Run Studio Applications         | Activity.runStudioApps()        | Permissions to operate within a Studio environment. Required for domain and user-profile execution roles. | rolesToPass                     |
| Manage ML Jobs          | Activity.manageJobs()           | Permissions to manage SageMaker jobs across their lifecycles.                                             | rolesToPass                     |
| Manage Models          | Activity.manageModels()         | 	Permissions to manage SageMaker models and Model Registry.                                               | rolesToPass                     |
| Manage Endpoints        | Activity.manageEndpoints()      | Permissions to manage SageMaker Endpoint deployments and updates.                                         | No required parameters          |
| Manage Pipelines         | Activity.managePipelines()      | Permissions to manage SageMaker Pipelines and pipeline executions.                                        | rolesToPass                     |
| Manage Experiments         | Activity.manageExperiments()    | 	Permissions to manage experiments and trials.                                                            | No required parameters          |
| Search and visualize experiments         | Activity.visualizeExperiments() | Permissions to audit, query lineage and visualize experiments.                                            | No required parameters          |
| 	Manage Model Monitoring         | Activity.monitorModels()        | Permissions to manage monitoring schedules for SageMaker Model Monitor.                                   | rolesToPass                     |
| S3 Full Access        | Activity.accessS3AllResources() | 	Permissions to perform all S3 operations                                                                 | No required parameters          |
| S3 Bucket Access         | Activity.accessS3Buckets()      | Permissions to perform operations on specified buckets.                                                   | s3Buckets                       |
| 	Query Athena Workgroups        | Activity.queryAthenaGroups()    | Permissions to execute and manage Amazon Athena queries.                                                  | athenaWorkgroupNames            |
| 	Manage Glue Tables       | Activity.manageGlueTables()     | 	Permissions to create and manage Glue tables for SageMaker Feature Store and Data Wrangler.                                                                                                          | s3Buckets, glueDatabaseNames                     |

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.


## License

This project is licensed under the Apache-2.0 License.
<!-- Updated: Fri May 30 12:30:03 CEST 2025 -->
