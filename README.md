## cdk-aws-sagemaker-role-manager

## Usage

### Create Role from ML Activity with VPC and KMS conditions
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Simple ML Activity Role Creation
const activity = Activity.manageJobs(this, 'id1', {
    rolesToPass: [new iam.Role('Enter Role Parameters')],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});
const role = activity.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from ML Activity without VPC and KMS conditions
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Simple ML Activity Role Creation
const activity = Activity.manageJobs(this, 'id1', {
    rolesToPass: [new iam.Role('Enter Role Parameters')],
});

const role = activity.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from Data Scientist ML Persona
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Please see below how to create the Data Scientist ML Persona using its ML Activities.
// You can update the following list with changes matching your usecase.
let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(),
        Activity.manageJobs(this, 'id1', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageModels(this, 'id2', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageExperiments(this, 'id3', {}),
        Activity.searchExperiments(this, 'id4', {}),
        Activity.accessBuckets(this, 'id5', {buckets: [s3.S3Bucket.fromBucketName('Enter Name')]})
    ],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});

// We can create a role with Data Scientist persona permissions
const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from Data Scientist ML Persona without vpc and kms global conditions
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Please see below how to create the Data Scientist ML Persona using its ML Activities.
// You can update the following list with changes matching your usecase.
let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(),
        Activity.manageJobs(this, 'id1', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageModels(this, 'id2', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageExperiments(this, 'id3', {}),
        Activity.searchExperiments(this, 'id4', {}),
        Activity.accessBuckets(this, 'id5', {buckets: [s3.S3Bucket.fromBucketName('Enter Name')]})
    ],
});

// We can create a role with Data Scientist persona permissions
const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role MLOps ML Persona
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Please see below MLOps ML Activities.
// You can update the following list with changes matching your usecase.
let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(this, 'id1', {}),
        Activity.manageModels(this, 'id2', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageEndpoints(this, 'id3',{rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.managePipelines(this, 'id4', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.searchExperiments(this, 'id5', {})
    ],
    subnets: [ec2.Subnet.fromSubnetId('Enter Id')],
    securityGroups: [ec2.SecurityGroup.fromSecurityGroupId('Enter Id')],
    dataKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
    volumeKeys: [kms.Key.fromKeyArn('Enter Key Arn')],
});

// We can create a role with Data Scientist persona permissions
const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Create Role from MLOps ML Persona without vpc and kms global conditions
```
import { App, Stack } from 'aws-cdk-lib';
import { Activity } from 'cdk-aws-sagemaker-role-manager';

const app = new App();
new Stack(app, 'CdkRoleManagerDemo');

// Please see below MLOps ML Activities.
// You can update the following list with changes matching your usecase.
let persona = new Persona(this, 'persona id', {
    activities: [
        Activity.useStudioApps(this, 'id1', {}),
        Activity.manageModels(this, 'id2', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.manageEndpoints(this, 'id3',{rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.managePipelines(this, 'id4', {rolesToPass: [new iam.Role('Enter Role Parameters')]}),
        Activity.searchExperiments(this, 'id5', {})
    ],
});

// We can create a role with Data Scientist persona permissions
const role = persona.createRole(this, 'role id', 'Enter Name', 'Enter Description');
```

### Use created role to initialize notebook instance and/or user profile
```
// Variable role has already been created through cdk
// ...

// Create a notebook instance and/or user profile with role
let notebookInstance = new CfnNotebookInstance(this, 'nb', { RoleArn: role.RoleArn, ...});
let userProfile = new CfnNUserProfile(this, 'up', { RoleName: role.RoleName, ... });
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
