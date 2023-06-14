## cdk-aws-sagemaker-role-manager

## Usage

### Create Role from ML Activity with VPC and KMS conditions

```ts
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

```ts
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

```ts
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

```ts
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

```ts
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

```ts
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

```ts
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


# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Activity <a name="Activity" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity"></a>

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createPolicy">createPolicy</a></code> | Creates policy with permissions of activity. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createPrincipal">createPrincipal</a></code> | Creates ML Activity service principal using ML Activity trust template. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole">createRole</a></code> | Creates role with permissions of activity. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeKMS">customizeKMS</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeVPC">customizeVPC</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.grantPermissionsTo">grantPermissionsTo</a></code> | Grant permissions of activity to identity. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `createPolicy` <a name="createPolicy" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createPolicy"></a>

```typescript
public createPolicy(scope: Construct): Policy
```

Creates policy with permissions of activity.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createPolicy.parameter.scope"></a>

- *Type:* constructs.Construct

the Construct scope.

---

##### `createPrincipal` <a name="createPrincipal" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createPrincipal"></a>

```typescript
public createPrincipal(): ServicePrincipal
```

Creates ML Activity service principal using ML Activity trust template.

##### `createRole` <a name="createRole" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole"></a>

```typescript
public createRole(scope: Construct, id: string, roleNameSuffix: string, roleDescription?: string): IRole
```

Creates role with permissions of activity.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole.parameter.scope"></a>

- *Type:* constructs.Construct

the Construct scope.

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole.parameter.id"></a>

- *Type:* string

the resource id.

---

###### `roleNameSuffix`<sup>Required</sup> <a name="roleNameSuffix" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole.parameter.roleNameSuffix"></a>

- *Type:* string

the name suffix of the role that will be created, if empty the role will have the name of the activity.

---

###### `roleDescription`<sup>Optional</sup> <a name="roleDescription" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.createRole.parameter.roleDescription"></a>

- *Type:* string

the description of the role that will be created.

---

##### `customizeKMS` <a name="customizeKMS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeKMS"></a>

```typescript
public customizeKMS(dataKeys?: IKey[], volumeKeys?: IKey[]): void
```

###### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeKMS.parameter.dataKeys"></a>

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

###### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeKMS.parameter.volumeKeys"></a>

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `customizeVPC` <a name="customizeVPC" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeVPC"></a>

```typescript
public customizeVPC(subnets?: ISubnet[], securityGroups?: ISecurityGroup[]): void
```

###### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeVPC.parameter.subnets"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

###### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.customizeVPC.parameter.securityGroups"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `grantPermissionsTo` <a name="grantPermissionsTo" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.grantPermissionsTo"></a>

```typescript
public grantPermissionsTo(identity: IGrantable): Grant
```

Grant permissions of activity to identity.

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.grantPermissionsTo.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

identity to be granted permissions.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessAwsServices">accessAwsServices</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResources">accessS3AllResources</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResourcesV2">accessS3AllResourcesV2</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3Buckets">accessS3Buckets</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageEndpoints">manageEndpoints</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageExperiments">manageExperiments</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageGlueTables">manageGlueTables</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageJobs">manageJobs</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageModels">manageModels</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.managePipelines">managePipelines</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.monitorModels">monitorModels</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.queryAthenaGroups">queryAthenaGroups</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioApps">runStudioApps</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioAppsV2">runStudioAppsV2</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.visualizeExperiments">visualizeExperiments</a></code> | *No description.* |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.isConstruct"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

##### `accessAwsServices` <a name="accessAwsServices" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessAwsServices"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.accessAwsServices(scope: Construct, id: string, options: AccessAwsServicesOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessAwsServices.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessAwsServices.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessAwsServices.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions">AccessAwsServicesOptions</a>

---

##### `accessS3AllResources` <a name="accessS3AllResources" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResources"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.accessS3AllResources(scope: Construct, id: string, options: AccessS3AllResourcesOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResources.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResources.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResources.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions">AccessS3AllResourcesOptions</a>

---

##### `accessS3AllResourcesV2` <a name="accessS3AllResourcesV2" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResourcesV2"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.accessS3AllResourcesV2(scope: Construct, id: string, options: AccessS3AllResourcesV2Options)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResourcesV2.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResourcesV2.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3AllResourcesV2.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options">AccessS3AllResourcesV2Options</a>

---

##### `accessS3Buckets` <a name="accessS3Buckets" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3Buckets"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.accessS3Buckets(scope: Construct, id: string, options: AccessS3BucketsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3Buckets.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3Buckets.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.accessS3Buckets.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions">AccessS3BucketsOptions</a>

---

##### `manageEndpoints` <a name="manageEndpoints" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageEndpoints"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.manageEndpoints(scope: Construct, id: string, options: ManageEndpointsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageEndpoints.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageEndpoints.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageEndpoints.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions">ManageEndpointsOptions</a>

---

##### `manageExperiments` <a name="manageExperiments" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageExperiments"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.manageExperiments(scope: Construct, id: string, options: ManageExperimentsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageExperiments.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageExperiments.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageExperiments.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions">ManageExperimentsOptions</a>

---

##### `manageGlueTables` <a name="manageGlueTables" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageGlueTables"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.manageGlueTables(scope: Construct, id: string, options: ManageGlueTablesOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageGlueTables.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageGlueTables.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageGlueTables.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions">ManageGlueTablesOptions</a>

---

##### `manageJobs` <a name="manageJobs" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageJobs"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.manageJobs(scope: Construct, id: string, options: ManageJobsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageJobs.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageJobs.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageJobs.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions">ManageJobsOptions</a>

---

##### `manageModels` <a name="manageModels" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageModels"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.manageModels(scope: Construct, id: string, options: ManageModelsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageModels.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageModels.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.manageModels.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions">ManageModelsOptions</a>

---

##### `managePipelines` <a name="managePipelines" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.managePipelines"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.managePipelines(scope: Construct, id: string, options: ManagePipelinesOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.managePipelines.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.managePipelines.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.managePipelines.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions">ManagePipelinesOptions</a>

---

##### `monitorModels` <a name="monitorModels" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.monitorModels"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.monitorModels(scope: Construct, id: string, options: MonitorModelsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.monitorModels.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.monitorModels.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.monitorModels.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions">MonitorModelsOptions</a>

---

##### `queryAthenaGroups` <a name="queryAthenaGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.queryAthenaGroups"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.queryAthenaGroups(scope: Construct, id: string, options: QueryAthenaGroupsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.queryAthenaGroups.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.queryAthenaGroups.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.queryAthenaGroups.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions">QueryAthenaGroupsOptions</a>

---

##### `runStudioApps` <a name="runStudioApps" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioApps"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.runStudioApps(scope: Construct, id: string, options: RunStudioAppsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioApps.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioApps.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioApps.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions">RunStudioAppsOptions</a>

---

##### `runStudioAppsV2` <a name="runStudioAppsV2" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioAppsV2"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.runStudioAppsV2(scope: Construct, id: string, options: RunStudioAppsV2Options)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioAppsV2.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioAppsV2.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.runStudioAppsV2.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options">RunStudioAppsV2Options</a>

---

##### `visualizeExperiments` <a name="visualizeExperiments" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.visualizeExperiments"></a>

```typescript
import { Activity } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Activity.visualizeExperiments(scope: Construct, id: string, options: VisualizeExperimentsOptions)
```

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.visualizeExperiments.parameter.scope"></a>

- *Type:* constructs.Construct

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.visualizeExperiments.parameter.id"></a>

- *Type:* string

---

###### `options`<sup>Required</sup> <a name="options" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.visualizeExperiments.parameter.options"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions">VisualizeExperimentsOptions</a>

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.activityName">activityName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.version">version</a></code> | <code>number</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.isKMSCustomized">isKMSCustomized</a></code> | <code>boolean</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.isVPCCustomized">isVPCCustomized</a></code> | <code>boolean</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `activityName`<sup>Required</sup> <a name="activityName" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.activityName"></a>

```typescript
public readonly activityName: string;
```

- *Type:* string

---

##### `version`<sup>Required</sup> <a name="version" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.version"></a>

```typescript
public readonly version: number;
```

- *Type:* number

---

##### `isKMSCustomized`<sup>Required</sup> <a name="isKMSCustomized" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.isKMSCustomized"></a>

```typescript
public readonly isKMSCustomized: boolean;
```

- *Type:* boolean

---

##### `isVPCCustomized`<sup>Required</sup> <a name="isVPCCustomized" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.isVPCCustomized"></a>

```typescript
public readonly isVPCCustomized: boolean;
```

- *Type:* boolean

---

#### Constants <a name="Constants" id="Constants"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_AWS_SERVICES">ACCESS_AWS_SERVICES</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_S3_ALL_RESOURCES">ACCESS_S3_ALL_RESOURCES</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_S3_BUCKETS">ACCESS_S3_BUCKETS</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE">ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_ENDPOINTS_ACTIVITY_NAME">MANAGE_ENDPOINTS_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_EXPERIMENTS_ACTIVITY_NAME">MANAGE_EXPERIMENTS_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_GLUE_TABLES_ACTIVITY_NAME">MANAGE_GLUE_TABLES_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_JOBS_ACTIVITY_NAME">MANAGE_JOBS_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_MODELS_ACTIVITY_NAME">MANAGE_MODELS_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_PIPELINES_ACTIVITY_NAME">MANAGE_PIPELINES_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MONITOR_MODELS_ACTIVITY_NAME">MONITOR_MODELS_ACTIVITY_NAME</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.QUERY_ATHENA_WORKGROUPS">QUERY_ATHENA_WORKGROUPS</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.RUN_STUDIO_APPS">RUN_STUDIO_APPS</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.VISUALIZE_EXPERIMENTS">VISUALIZE_EXPERIMENTS</a></code> | <code>string</code> | *No description.* |

---

##### `ACCESS_AWS_SERVICES`<sup>Required</sup> <a name="ACCESS_AWS_SERVICES" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_AWS_SERVICES"></a>

```typescript
public readonly ACCESS_AWS_SERVICES: string;
```

- *Type:* string

---

##### `ACCESS_S3_ALL_RESOURCES`<sup>Required</sup> <a name="ACCESS_S3_ALL_RESOURCES" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_S3_ALL_RESOURCES"></a>

```typescript
public readonly ACCESS_S3_ALL_RESOURCES: string;
```

- *Type:* string

---

##### `ACCESS_S3_BUCKETS`<sup>Required</sup> <a name="ACCESS_S3_BUCKETS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ACCESS_S3_BUCKETS"></a>

```typescript
public readonly ACCESS_S3_BUCKETS: string;
```

- *Type:* string

---

##### `ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE`<sup>Required</sup> <a name="ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE"></a>

```typescript
public readonly ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE: string[];
```

- *Type:* string[]

---

##### `MANAGE_ENDPOINTS_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_ENDPOINTS_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_ENDPOINTS_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_ENDPOINTS_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MANAGE_EXPERIMENTS_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_EXPERIMENTS_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_EXPERIMENTS_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_EXPERIMENTS_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MANAGE_GLUE_TABLES_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_GLUE_TABLES_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_GLUE_TABLES_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_GLUE_TABLES_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MANAGE_JOBS_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_JOBS_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_JOBS_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_JOBS_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MANAGE_MODELS_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_MODELS_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_MODELS_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_MODELS_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MANAGE_PIPELINES_ACTIVITY_NAME`<sup>Required</sup> <a name="MANAGE_PIPELINES_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MANAGE_PIPELINES_ACTIVITY_NAME"></a>

```typescript
public readonly MANAGE_PIPELINES_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `MONITOR_MODELS_ACTIVITY_NAME`<sup>Required</sup> <a name="MONITOR_MODELS_ACTIVITY_NAME" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.MONITOR_MODELS_ACTIVITY_NAME"></a>

```typescript
public readonly MONITOR_MODELS_ACTIVITY_NAME: string;
```

- *Type:* string

---

##### `QUERY_ATHENA_WORKGROUPS`<sup>Required</sup> <a name="QUERY_ATHENA_WORKGROUPS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.QUERY_ATHENA_WORKGROUPS"></a>

```typescript
public readonly QUERY_ATHENA_WORKGROUPS: string;
```

- *Type:* string

---

##### `RUN_STUDIO_APPS`<sup>Required</sup> <a name="RUN_STUDIO_APPS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.RUN_STUDIO_APPS"></a>

```typescript
public readonly RUN_STUDIO_APPS: string;
```

- *Type:* string

---

##### `VISUALIZE_EXPERIMENTS`<sup>Required</sup> <a name="VISUALIZE_EXPERIMENTS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Activity.property.VISUALIZE_EXPERIMENTS"></a>

```typescript
public readonly VISUALIZE_EXPERIMENTS: string;
```

- *Type:* string

---

### Persona <a name="Persona" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona"></a>

#### Initializers <a name="Initializers" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer"></a>

```typescript
import { Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager'

new Persona(scope: Construct, id: string, props: PersonaProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.props">props</a></code> | <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps">PersonaProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.Initializer.parameter.props"></a>

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps">PersonaProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole">createRole</a></code> | Creates role with permissions of persona. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeKMS">customizeKMS</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeVPC">customizeVPC</a></code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.grantPermissionsTo">grantPermissionsTo</a></code> | Grant permissions of activity to identity. |

---

##### `toString` <a name="toString" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `createRole` <a name="createRole" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole"></a>

```typescript
public createRole(scope: Construct, id: string, roleNameSuffix: string, roleDescription?: string): IRole
```

Creates role with permissions of persona.

###### `scope`<sup>Required</sup> <a name="scope" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole.parameter.scope"></a>

- *Type:* constructs.Construct

the Construct scope.

---

###### `id`<sup>Required</sup> <a name="id" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole.parameter.id"></a>

- *Type:* string

the resource id.

---

###### `roleNameSuffix`<sup>Required</sup> <a name="roleNameSuffix" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole.parameter.roleNameSuffix"></a>

- *Type:* string

the name suffix of the role that will be created, if empty the role will have the name of the activity.

---

###### `roleDescription`<sup>Optional</sup> <a name="roleDescription" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.createRole.parameter.roleDescription"></a>

- *Type:* string

the description of the role that will be created.

---

##### `customizeKMS` <a name="customizeKMS" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeKMS"></a>

```typescript
public customizeKMS(dataKeys?: IKey[], volumeKeys?: IKey[]): void
```

###### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeKMS.parameter.dataKeys"></a>

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

###### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeKMS.parameter.volumeKeys"></a>

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `customizeVPC` <a name="customizeVPC" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeVPC"></a>

```typescript
public customizeVPC(subnets?: ISubnet[], securityGroups?: ISecurityGroup[]): void
```

###### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeVPC.parameter.subnets"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

###### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.customizeVPC.parameter.securityGroups"></a>

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `grantPermissionsTo` <a name="grantPermissionsTo" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.grantPermissionsTo"></a>

```typescript
public grantPermissionsTo(identity: IGrantable): Grant
```

Grant permissions of activity to identity.

###### `identity`<sup>Required</sup> <a name="identity" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.grantPermissionsTo.parameter.identity"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

identity to be granted permissions.

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.isConstruct"></a>

```typescript
import { Persona } from '@cdklabs/cdk-aws-sagemaker-role-manager'

Persona.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Persona.property.activities">activities</a></code> | <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity">Activity</a>[]</code> | *No description.* |

---

##### `node`<sup>Required</sup> <a name="node" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---

##### `activities`<sup>Required</sup> <a name="activities" id="@cdklabs/cdk-aws-sagemaker-role-manager.Persona.property.activities"></a>

```typescript
public readonly activities: Activity[];
```

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity">Activity</a>[]

---


## Structs <a name="Structs" id="Structs"></a>

### AccessAwsServicesOptions <a name="AccessAwsServicesOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions"></a>

SageMaker Activity Static Function Options.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.Initializer"></a>

```typescript
import { AccessAwsServicesOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const accessAwsServicesOptions: AccessAwsServicesOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.ecrRepositories">ecrRepositories</a></code> | <code>aws-cdk-lib.aws_ecr.IRepository[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.s3Buckets">s3Buckets</a></code> | <code>aws-cdk-lib.aws_s3.IBucket[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `ecrRepositories`<sup>Required</sup> <a name="ecrRepositories" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.ecrRepositories"></a>

```typescript
public readonly ecrRepositories: IRepository[];
```

- *Type:* aws-cdk-lib.aws_ecr.IRepository[]

---

##### `s3Buckets`<sup>Required</sup> <a name="s3Buckets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessAwsServicesOptions.property.s3Buckets"></a>

```typescript
public readonly s3Buckets: IBucket[];
```

- *Type:* aws-cdk-lib.aws_s3.IBucket[]

---

### AccessS3AllResourcesOptions <a name="AccessS3AllResourcesOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.Initializer"></a>

```typescript
import { AccessS3AllResourcesOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const accessS3AllResourcesOptions: AccessS3AllResourcesOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### AccessS3AllResourcesV2Options <a name="AccessS3AllResourcesV2Options" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.Initializer"></a>

```typescript
import { AccessS3AllResourcesV2Options } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const accessS3AllResourcesV2Options: AccessS3AllResourcesV2Options = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3AllResourcesV2Options.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### AccessS3BucketsOptions <a name="AccessS3BucketsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.Initializer"></a>

```typescript
import { AccessS3BucketsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const accessS3BucketsOptions: AccessS3BucketsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.s3Buckets">s3Buckets</a></code> | <code>aws-cdk-lib.aws_s3.IBucket[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `s3Buckets`<sup>Required</sup> <a name="s3Buckets" id="@cdklabs/cdk-aws-sagemaker-role-manager.AccessS3BucketsOptions.property.s3Buckets"></a>

```typescript
public readonly s3Buckets: IBucket[];
```

- *Type:* aws-cdk-lib.aws_s3.IBucket[]

---

### ActivityProps <a name="ActivityProps" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.Initializer"></a>

```typescript
import { ActivityProps } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const activityProps: ActivityProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.activityName">activityName</a></code> | <code>string</code> | Name of the SageMaker Activity. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.isCustomizationAvailableForKMS">isCustomizationAvailableForKMS</a></code> | <code>boolean</code> | Whether the activity supports customization for kms data keys and volume keys. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.isCustomizationAvailableForVPC">isCustomizationAvailableForVPC</a></code> | <code>boolean</code> | Whether the activity supports customization for vpc subnets and vpc security groups. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.athenaWorkgroupNames">athenaWorkgroupNames</a></code> | <code>string[]</code> | Names of the Athena workgroups to give query permissions. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.ecrRepositories">ecrRepositories</a></code> | <code>aws-cdk-lib.aws_ecr.IRepository[]</code> | ECR Repositories to give image pull permissions. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.glueDatabaseNames">glueDatabaseNames</a></code> | <code>string[]</code> | Names of the Glue Databases to give permissions to search tables. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | Roles to allow passing as passed roles to actions. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.s3Buckets">s3Buckets</a></code> | <code>aws-cdk-lib.aws_s3.IBucket[]</code> | S3 Buckets to give read and write permissions. |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.version">version</a></code> | <code>number</code> | Version of the SageMaker Activity. |

---

##### `activityName`<sup>Required</sup> <a name="activityName" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.activityName"></a>

```typescript
public readonly activityName: string;
```

- *Type:* string

Name of the SageMaker Activity.

This name will be used to name the IAM policy that is created from this Activity.

---

##### `isCustomizationAvailableForKMS`<sup>Required</sup> <a name="isCustomizationAvailableForKMS" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.isCustomizationAvailableForKMS"></a>

```typescript
public readonly isCustomizationAvailableForKMS: boolean;
```

- *Type:* boolean
- *Default:* false

Whether the activity supports customization for kms data keys and volume keys.

---

##### `isCustomizationAvailableForVPC`<sup>Required</sup> <a name="isCustomizationAvailableForVPC" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.isCustomizationAvailableForVPC"></a>

```typescript
public readonly isCustomizationAvailableForVPC: boolean;
```

- *Type:* boolean
- *Default:* false

Whether the activity supports customization for vpc subnets and vpc security groups.

---

##### `athenaWorkgroupNames`<sup>Optional</sup> <a name="athenaWorkgroupNames" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.athenaWorkgroupNames"></a>

```typescript
public readonly athenaWorkgroupNames: string[];
```

- *Type:* string[]
- *Default:* none

Names of the Athena workgroups to give query permissions.

---

##### `ecrRepositories`<sup>Optional</sup> <a name="ecrRepositories" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.ecrRepositories"></a>

```typescript
public readonly ecrRepositories: IRepository[];
```

- *Type:* aws-cdk-lib.aws_ecr.IRepository[]
- *Default:* none

ECR Repositories to give image pull permissions.

---

##### `glueDatabaseNames`<sup>Optional</sup> <a name="glueDatabaseNames" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.glueDatabaseNames"></a>

```typescript
public readonly glueDatabaseNames: string[];
```

- *Type:* string[]
- *Default:* none

Names of the Glue Databases to give permissions to search tables.

---

##### `rolesToPass`<sup>Optional</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]
- *Default:* none

Roles to allow passing as passed roles to actions.

---

##### `s3Buckets`<sup>Optional</sup> <a name="s3Buckets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.s3Buckets"></a>

```typescript
public readonly s3Buckets: IBucket[];
```

- *Type:* aws-cdk-lib.aws_s3.IBucket[]
- *Default:* none

S3 Buckets to give read and write permissions.

---

##### `version`<sup>Optional</sup> <a name="version" id="@cdklabs/cdk-aws-sagemaker-role-manager.ActivityProps.property.version"></a>

```typescript
public readonly version: number;
```

- *Type:* number
- *Default:* 1

Version of the SageMaker Activity.

This version will be used to fetch the policy template that corresponds to the
Activity.

---

### KMSOptions <a name="KMSOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions.Initializer"></a>

```typescript
import { KMSOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const kMSOptions: KMSOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.KMSOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### ManageEndpointsOptions <a name="ManageEndpointsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.Initializer"></a>

```typescript
import { ManageEndpointsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const manageEndpointsOptions: ManageEndpointsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageEndpointsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### ManageExperimentsOptions <a name="ManageExperimentsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.Initializer"></a>

```typescript
import { ManageExperimentsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const manageExperimentsOptions: ManageExperimentsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageExperimentsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### ManageGlueTablesOptions <a name="ManageGlueTablesOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.Initializer"></a>

```typescript
import { ManageGlueTablesOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const manageGlueTablesOptions: ManageGlueTablesOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.glueDatabaseNames">glueDatabaseNames</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.s3Buckets">s3Buckets</a></code> | <code>aws-cdk-lib.aws_s3.IBucket[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `glueDatabaseNames`<sup>Required</sup> <a name="glueDatabaseNames" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.glueDatabaseNames"></a>

```typescript
public readonly glueDatabaseNames: string[];
```

- *Type:* string[]

---

##### `s3Buckets`<sup>Required</sup> <a name="s3Buckets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageGlueTablesOptions.property.s3Buckets"></a>

```typescript
public readonly s3Buckets: IBucket[];
```

- *Type:* aws-cdk-lib.aws_s3.IBucket[]

---

### ManageJobsOptions <a name="ManageJobsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.Initializer"></a>

```typescript
import { ManageJobsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const manageJobsOptions: ManageJobsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `rolesToPass`<sup>Required</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageJobsOptions.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

---

### ManageModelsOptions <a name="ManageModelsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.Initializer"></a>

```typescript
import { ManageModelsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const manageModelsOptions: ManageModelsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `rolesToPass`<sup>Required</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManageModelsOptions.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

---

### ManagePipelinesOptions <a name="ManagePipelinesOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.Initializer"></a>

```typescript
import { ManagePipelinesOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const managePipelinesOptions: ManagePipelinesOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `rolesToPass`<sup>Required</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.ManagePipelinesOptions.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

---

### MonitorModelsOptions <a name="MonitorModelsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.Initializer"></a>

```typescript
import { MonitorModelsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const monitorModelsOptions: MonitorModelsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `rolesToPass`<sup>Required</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.MonitorModelsOptions.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

---

### PersonaProps <a name="PersonaProps" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.Initializer"></a>

```typescript
import { PersonaProps } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const personaProps: PersonaProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.activities">activities</a></code> | <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity">Activity</a>[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `activities`<sup>Required</sup> <a name="activities" id="@cdklabs/cdk-aws-sagemaker-role-manager.PersonaProps.property.activities"></a>

```typescript
public readonly activities: Activity[];
```

- *Type:* <a href="#@cdklabs/cdk-aws-sagemaker-role-manager.Activity">Activity</a>[]

---

### QueryAthenaGroupsOptions <a name="QueryAthenaGroupsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.Initializer"></a>

```typescript
import { QueryAthenaGroupsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const queryAthenaGroupsOptions: QueryAthenaGroupsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.athenaWorkgroupNames">athenaWorkgroupNames</a></code> | <code>string[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `athenaWorkgroupNames`<sup>Required</sup> <a name="athenaWorkgroupNames" id="@cdklabs/cdk-aws-sagemaker-role-manager.QueryAthenaGroupsOptions.property.athenaWorkgroupNames"></a>

```typescript
public readonly athenaWorkgroupNames: string[];
```

- *Type:* string[]

---

### RunStudioAppsOptions <a name="RunStudioAppsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.Initializer"></a>

```typescript
import { RunStudioAppsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const runStudioAppsOptions: RunStudioAppsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.rolesToPass">rolesToPass</a></code> | <code>aws-cdk-lib.aws_iam.IRole[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `rolesToPass`<sup>Required</sup> <a name="rolesToPass" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsOptions.property.rolesToPass"></a>

```typescript
public readonly rolesToPass: IRole[];
```

- *Type:* aws-cdk-lib.aws_iam.IRole[]

---

### RunStudioAppsV2Options <a name="RunStudioAppsV2Options" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.Initializer"></a>

```typescript
import { RunStudioAppsV2Options } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const runStudioAppsV2Options: RunStudioAppsV2Options = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.RunStudioAppsV2Options.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### VisualizeExperimentsOptions <a name="VisualizeExperimentsOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions"></a>

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.Initializer"></a>

```typescript
import { VisualizeExperimentsOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const visualizeExperimentsOptions: VisualizeExperimentsOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.dataKeys">dataKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.volumeKeys">volumeKeys</a></code> | <code>aws-cdk-lib.aws_kms.IKey[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---

##### `dataKeys`<sup>Optional</sup> <a name="dataKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.dataKeys"></a>

```typescript
public readonly dataKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

##### `volumeKeys`<sup>Optional</sup> <a name="volumeKeys" id="@cdklabs/cdk-aws-sagemaker-role-manager.VisualizeExperimentsOptions.property.volumeKeys"></a>

```typescript
public readonly volumeKeys: IKey[];
```

- *Type:* aws-cdk-lib.aws_kms.IKey[]

---

### VPCOptions <a name="VPCOptions" id="@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions"></a>

Global Condition Customization Options.

#### Initializer <a name="Initializer" id="@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions.Initializer"></a>

```typescript
import { VPCOptions } from '@cdklabs/cdk-aws-sagemaker-role-manager'

const vPCOptions: VPCOptions = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions.property.securityGroups">securityGroups</a></code> | <code>aws-cdk-lib.aws_ec2.ISecurityGroup[]</code> | *No description.* |
| <code><a href="#@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions.property.subnets">subnets</a></code> | <code>aws-cdk-lib.aws_ec2.ISubnet[]</code> | *No description.* |

---

##### `securityGroups`<sup>Optional</sup> <a name="securityGroups" id="@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions.property.securityGroups"></a>

```typescript
public readonly securityGroups: ISecurityGroup[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISecurityGroup[]

---

##### `subnets`<sup>Optional</sup> <a name="subnets" id="@cdklabs/cdk-aws-sagemaker-role-manager.VPCOptions.property.subnets"></a>

```typescript
public readonly subnets: ISubnet[];
```

- *Type:* aws-cdk-lib.aws_ec2.ISubnet[]

---



