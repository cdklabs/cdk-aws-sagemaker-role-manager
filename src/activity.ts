import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';

import { getTemplateFile, parameterValidationRegex, replacePatterns } from './private';

/**
 * Construction properties for a SageMaker Activity
 */
export interface ActivityProps {

  /**
   * Name of the SageMaker Activity. This name will be used to name the IAM policy that is created from this Activity.
   *
   */
  readonly activityName: string;

  /**
   * Version of the SageMaker Activity. This version will be used to fetch the policy template that corresponds to the
   * Activity.
   *
   * @default - 1
   */
  readonly version?: number;

  /**
   * ECR Repositories to give image pull permissions
   *
   * @default - none
   */
  readonly ecrRepositories?: ecr.IRepository[];

  /**
   * Roles to allow passing as passed roles to actions
   *
   * @default - none
   */
  readonly rolesToPass?: iam.IRole[];

  /**
   * S3 Buckets to give read and write permissions
   *
   * @default - none
   */
  readonly s3Buckets?: s3.IBucket[];

  /**
   * Names of the Athena workgroups to give query permissions
   *
   * @default - none
   */
  readonly athenaWorkgroupNames?: string[];

  /**
   * Names of the Glue Databases to give permissions to search tables
   *
   * @default - none
   */
  readonly glueDatabaseNames?: string[];

  /**
   * Whether the activity supports customization for vpc subnets and vpc security groups
   *
   * @default - false
   */
  readonly isCustomizationAvailableForVPC: boolean;

  /**
   * Whether the activity supports customization for kms data keys and volume keys
   *
   * @default - false
   */
  readonly isCustomizationAvailableForKMS: boolean;
}

/**
 * SageMaker Activity Static Function Options
 */
export interface AccessAwsServicesOptions extends VPCOptions, KMSOptions {
  readonly ecrRepositories: ecr.IRepository[];
  readonly s3Buckets: s3.IBucket[];
}

export interface AccessS3AllResourcesOptions extends VPCOptions, KMSOptions {}

export interface AccessS3AllResourcesV2Options extends VPCOptions, KMSOptions {}

export interface AccessS3BucketsOptions extends VPCOptions, KMSOptions {
  readonly s3Buckets: s3.IBucket[];
}

export interface ManageJobsOptions extends VPCOptions, KMSOptions {
  readonly rolesToPass: iam.IRole[];
}

export interface ManageEndpointsOptions extends VPCOptions, KMSOptions {}

export interface ManageExperimentsOptions extends VPCOptions, KMSOptions {}

export interface ManageGlueTablesOptions extends VPCOptions, KMSOptions {
  readonly s3Buckets: s3.IBucket[];
  readonly glueDatabaseNames: string[];
}

export interface ManageModelsOptions extends VPCOptions, KMSOptions {
  readonly rolesToPass: iam.IRole[];
}

export interface ManagePipelinesOptions extends VPCOptions, KMSOptions {
  readonly rolesToPass: iam.IRole[];
}

export interface MonitorModelsOptions extends VPCOptions, KMSOptions {
  readonly rolesToPass: iam.IRole[];
}

export interface QueryAthenaGroupsOptions extends VPCOptions, KMSOptions {
  readonly athenaWorkgroupNames: string[];
}

export interface RunStudioAppsOptions extends VPCOptions, KMSOptions {
  readonly rolesToPass: iam.IRole[];
}

export interface RunStudioAppsV2Options extends VPCOptions, KMSOptions {}

export interface VisualizeExperimentsOptions extends VPCOptions, KMSOptions {}

/**
 * Global Condition Customization Options
 */
export interface VPCOptions {
  readonly subnets?: ec2.ISubnet[];
  readonly securityGroups?: ec2.ISecurityGroup[];
}

export interface KMSOptions {
  readonly dataKeys?: kms.IKey[];
  readonly volumeKeys?: kms.IKey[];
}

export class Activity extends Construct {

  // Activity Default Names
  public static readonly ACCESS_AWS_SERVICES = 'SM_ComputeExecutionRole';
  public static readonly ACCESS_S3_ALL_RESOURCES = 'SageMakerS3AllResourcesPolicyTemplate';
  public static readonly ACCESS_S3_BUCKETS = 'SageMakerS3BucketPolicyTemplate';
  public static readonly MANAGE_ENDPOINTS_ACTIVITY_NAME = 'SM_EndpointDeployment';
  public static readonly MANAGE_EXPERIMENTS_ACTIVITY_NAME = 'SM_ExperimentsManagement';
  public static readonly MANAGE_GLUE_TABLES_ACTIVITY_NAME = 'SM_GlueTableManagement';
  public static readonly MANAGE_JOBS_ACTIVITY_NAME = 'SM_CommonJobManagement';
  public static readonly MANAGE_MODELS_ACTIVITY_NAME = 'SM_ModelManagement';
  public static readonly MANAGE_PIPELINES_ACTIVITY_NAME = 'SM_PipelineManagement';
  public static readonly MONITOR_MODELS_ACTIVITY_NAME = 'SM_ModelMonitoring';
  public static readonly QUERY_ATHENA_WORKGROUPS = 'SM_AthenaQueryAccess';
  public static readonly RUN_STUDIO_APPS = 'SM_StudioAppPermissions';
  public static readonly VISUALIZE_EXPERIMENTS = 'SM_ExperimentsVisualization';

  // Activity Default Parameter Values
  public static readonly ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE = ['primary'];

  // Activity Selection Functions
  public static accessAwsServices(scope: Construct, id: string, options: AccessAwsServicesOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.ACCESS_AWS_SERVICES,
      isCustomizationAvailableForVPC: true,
      isCustomizationAvailableForKMS: true,
      ecrRepositories: options.ecrRepositories,
      s3Buckets: options.s3Buckets,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static accessS3AllResources(scope: Construct, id: string, options: AccessS3AllResourcesOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.ACCESS_S3_ALL_RESOURCES,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static accessS3AllResourcesV2(scope: Construct, id: string, options: AccessS3AllResourcesV2Options): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.ACCESS_S3_ALL_RESOURCES,
      version: 2,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static accessS3Buckets(scope: Construct, id: string, options: AccessS3BucketsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.ACCESS_S3_BUCKETS,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
      s3Buckets: options.s3Buckets,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static manageEndpoints(scope: Construct, id: string, options: ManageEndpointsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_ENDPOINTS_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: true,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static manageExperiments(scope: Construct, id: string, options: ManageExperimentsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_EXPERIMENTS_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static manageGlueTables(scope: Construct, id: string, options: ManageGlueTablesOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_GLUE_TABLES_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: true,
      s3Buckets: options.s3Buckets,
      glueDatabaseNames: options.glueDatabaseNames,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static manageJobs(scope: Construct, id: string, options: ManageJobsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_JOBS_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: true,
      isCustomizationAvailableForKMS: true,
      rolesToPass: options.rolesToPass,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static manageModels(scope: Construct, id: string, options: ManageModelsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_MODELS_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: true,
      isCustomizationAvailableForKMS: false,
      rolesToPass: options.rolesToPass,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static managePipelines(scope: Construct, id: string, options: ManagePipelinesOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MANAGE_PIPELINES_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
      rolesToPass: options.rolesToPass,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static monitorModels(scope: Construct, id: string, options: MonitorModelsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.MONITOR_MODELS_ACTIVITY_NAME,
      isCustomizationAvailableForVPC: true,
      isCustomizationAvailableForKMS: true,
      rolesToPass: options.rolesToPass,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static queryAthenaGroups(scope: Construct, id: string, options: QueryAthenaGroupsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.QUERY_ATHENA_WORKGROUPS,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
      athenaWorkgroupNames: options.athenaWorkgroupNames,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static runStudioApps(scope: Construct, id: string, options: RunStudioAppsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.RUN_STUDIO_APPS,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
      rolesToPass: options.rolesToPass,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static runStudioAppsV2(scope: Construct, id: string, options: RunStudioAppsV2Options): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.RUN_STUDIO_APPS,
      version: 2,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  public static visualizeExperiments(scope: Construct, id: string, options: VisualizeExperimentsOptions): Activity {

    const activity = new Activity(scope, id, {
      activityName: Activity.VISUALIZE_EXPERIMENTS,
      isCustomizationAvailableForVPC: false,
      isCustomizationAvailableForKMS: false,
    });

    activity.customizeVPC(options.subnets, options.securityGroups);
    activity.customizeKMS(options.dataKeys, options.volumeKeys);

    return activity;
  }

  // Single Value Replacement Parameter Names
  private static readonly ACCOUNT_ID_PARAMETER_NAME = 'AccountId';
  private static readonly REGION_PARAMETER_NAME = 'Region';

  // Multi Value Replacement Parameter Names
  private static readonly ATHENA_WORKGROUP_NAMES_PARAMETER_NAME = 'WorkGroupNames';
  private static readonly ECR_REPOSITORIES_PARAMETER_NAME = 'ECRRepoArns';
  private static readonly GLUE_DATABASE_NAMES_PARAMETER_NAME = 'GlueDbNames';
  private static readonly PASSED_ROLES_PARAMETER_NAME = 'PassRoles';
  private static readonly S3_BUCKETS_PARAMETER_NAME = 'S3Buckets';
  private static readonly SUBNETS_PARAMETER_NAME = 'VpcSubnets';
  private static readonly SECURITY_GROUPS_PARAMETER_NAME = 'VpcSecurityGroups';
  private static readonly DATA_KEYS_PARAMETER_NAME = 'DataKmsKeys';
  private static readonly VOLUME_KEYS_PARAMETER_NAME = 'VolumeKmsKeys';

  /**
   * Get grant options from statement for Grant.addToPrincipal() function
   * @param identity identity to be granted permissions
   * @param statement the statement from which to get the actions, resources and conditions
   * @returns - The options for the Grant.addToPrincipal() function
   */
  private static getGrantOptions(identity: iam.IGrantable, statement: any): iam.GrantOnPrincipalOptions {
    const actions = typeof(statement.Action) === 'string' ? [statement.Action] : statement.Action;
    const resourceArns = typeof(statement.Resource) === 'string' ? [statement.Resource] : statement.Resource;
    const conditions = statement.Condition ? statement.Condition: {};

    return {
      grantee: identity,
      actions: actions,
      resourceArns: resourceArns,
      conditions: conditions,
    };
  }

  public readonly activityName: string;
  public readonly version: number;

  private readonly singleValueReplacements: Map<string, string>;
  private readonly multiValueReplacements: Map<string, string[]>;

  private readonly isCustomizationAvailableForVPC: boolean;
  private readonly isCustomizationAvailableForKMS: boolean;
  public isVPCCustomized: boolean = false;
  public isKMSCustomized: boolean = false;

  private constructor(scope: Construct, id: string, props: ActivityProps) {
    super(scope, id);

    // Validate passed values for multi value replacements
    if (props.athenaWorkgroupNames && props.athenaWorkgroupNames.length === 0) {
      throw TypeError(`The value of the athenaWorkgroupNames parameter should be of type ${props.athenaWorkgroupNames} with at least one element.`);
    }

    for (const athenaWorkGroupName of props.athenaWorkgroupNames || []) {
      if (!parameterValidationRegex.test(athenaWorkGroupName)) {
        throw TypeError(`The value ${athenaWorkGroupName} of athenaWorkgroupNames array element contains an invalid character,
             athenaWorkgroupNames elements must be alphanumeric with no spaces and only the special characters: _/:.-`);
      }
    }

    if (props.ecrRepositories && props.ecrRepositories.length === 0) {
      throw TypeError(`The value of the ecrRepositories parameter should be of type ${props.ecrRepositories} with at least one element.`);
    }

    if (props.glueDatabaseNames && props.glueDatabaseNames.length === 0) {
      throw TypeError(`The value of the glueDatabaseNames parameter should be of type ${props.glueDatabaseNames} with at least one element.`);
    }

    for (const glueDatabaseName of props.glueDatabaseNames || []) {
      if (!parameterValidationRegex.test(glueDatabaseName)) {
        throw TypeError(`The value ${glueDatabaseName} of glueDatabaseNames array element contains an invalid character,
             glueDatabaseNames elements must be alphanumeric with no spaces and only the special characters: _/:.-`);
      }
    }

    if (props.rolesToPass && props.rolesToPass.length === 0) {
      throw TypeError(`The value of the rolesToPass parameter should be of type ${props.rolesToPass} with at least one element.`);
    }

    if (props.s3Buckets && props.s3Buckets.length === 0) {
      throw TypeError(`The value of the s3Buckets parameter should be of type ${props.s3Buckets} with at least one element.`);
    }

    this.activityName = props.activityName;
    this.version = props.version || 1;

    // Set single value replacements
    this.singleValueReplacements = new Map<string, string>();
    this.singleValueReplacements.set(Activity.ACCOUNT_ID_PARAMETER_NAME,
      cdk.Token.isUnresolved(cdk.Stack.of(this).account) ? '*' : cdk.Stack.of(this).account);
    this.singleValueReplacements.set(Activity.REGION_PARAMETER_NAME,
      cdk.Token.isUnresolved(cdk.Stack.of(this).region) ? '*' : cdk.Stack.of(this).region);

    // Set multi value replacements
    this.multiValueReplacements = new Map<string, string[]>();

    this.multiValueReplacements.set(Activity.ATHENA_WORKGROUP_NAMES_PARAMETER_NAME, props.athenaWorkgroupNames ?? []);
    this.multiValueReplacements.set(Activity.ECR_REPOSITORIES_PARAMETER_NAME, (props.ecrRepositories ?? []).map(
      (ecrRepository) => ecrRepository.repositoryArn));
    this.multiValueReplacements.set(Activity.GLUE_DATABASE_NAMES_PARAMETER_NAME, props.glueDatabaseNames ?? []);
    this.multiValueReplacements.set(Activity.PASSED_ROLES_PARAMETER_NAME, (props.rolesToPass ?? []).map(
      (role) => role.roleArn));
    this.multiValueReplacements.set(Activity.S3_BUCKETS_PARAMETER_NAME, (props.s3Buckets ?? []).map(
      (s3Bucket) => s3Bucket.bucketName));

    this.isCustomizationAvailableForVPC = props.isCustomizationAvailableForVPC;
    this.isCustomizationAvailableForKMS = props.isCustomizationAvailableForKMS;
  }

  /**
   * Creates role with permissions of activity
   * @param scope the Construct scope.
   * @param id the resource id.
   * @param roleNameSuffix the name suffix of the role that will be created, if empty the role will have the name of the activity.
   * @param roleDescription the description of the role that will be created.
   * @returns - The role that is created with the permissions of the activity
   */
  public createRole(scope: Construct, id: string, roleNameSuffix: string, roleDescription: string = ''): iam.IRole {
    if (!roleNameSuffix || !roleNameSuffix.length) {
      throw TypeError('The role name should be a non empty string');
    }

    const policy = this.createPolicy(scope);

    const role = new iam.Role(scope, id, {
      roleName: `SageMaker-${roleNameSuffix}`,
      description: roleDescription,
      assumedBy: this.createPrincipal(),
    });

    role.attachInlinePolicy(policy);

    return role;
  }

  /**
   * Creates policy with permissions of activity
   * @param scope the Construct scope.
   * @returns - The policy that is created with the permissions of the activity
   */
  public createPolicy(scope: Construct): iam.Policy {
    const templateFile = getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
    const timestamp = Date.now().toString();
    const templateName = `${templateFile.name}_V${this.version}_${timestamp}`;
    const templateAsString = JSON.stringify(templateFile.templateJson);

    // Replace singleValueReplacements and multiValueReplacements in templateDocument
    const policyDocumentJSON = JSON.parse(replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));

    const policyDocument = iam.PolicyDocument.fromJson(policyDocumentJSON);

    return new iam.Policy(scope, `${templateName} id`, {
      policyName: templateName,
      document: policyDocument,
    });
  }

  /**
   * Creates ML Activity service principal using ML Activity trust template
   * @returns - The service principal of the ML Activity
   */
  public createPrincipal(): iam.ServicePrincipal {
    const templateFile = getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
    const templateAsString = JSON.stringify(templateFile.trustTemplateJson);

    // Replace singleValueReplacements and multiValueReplacements in templateDocument
    const policyDocumentJSON = JSON.parse(replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));
    const policyDocumentStatement = policyDocumentJSON.Statement[0];

    return new iam.ServicePrincipal(policyDocumentStatement.Principal.Service, {
      conditions: policyDocumentStatement.Condition,
    });
  }

  /**
   * Grant permissions of activity to identity
   * @param identity identity to be granted permissions
   * @returns - The grant with the permissions granted to the identity
   */
  public grantPermissionsTo(identity: iam.IGrantable): iam.Grant {
    const templateFile = getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
    const templateAsString = JSON.stringify(templateFile.templateJson);

    // Replace singleValueReplacements and multiValueReplacements in templateDocument
    let policyDocumentJSON = JSON.parse(replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));

    let grant = iam.Grant.addToPrincipal(Activity.getGrantOptions(identity, policyDocumentJSON.Statement[0]));

    for (let i = 1; i < policyDocumentJSON.Statement.length; i++) {
      grant = grant.combine(iam.Grant.addToPrincipal(Activity.getGrantOptions(identity, policyDocumentJSON.Statement[i])));
    }

    return grant;
  }

  public customizeVPC(subnets?: ec2.ISubnet[], securityGroups?: ec2.ISecurityGroup[]) {
    if (!this.isCustomizationAvailableForVPC || (!subnets && !securityGroups)) {
      return;
    }

    if (!subnets || !subnets.length) {
      throw TypeError('The array subnets must be of type ec2.ISubnet[] with at least one element.');
    }
    if (!securityGroups || !securityGroups.length) {
      throw TypeError('The array securityGroups must be of type ec2.ISecurityGroup[] with at least one element.');
    }

    this.multiValueReplacements.set(Activity.SUBNETS_PARAMETER_NAME, subnets.map((subnet) => subnet.subnetId));
    this.multiValueReplacements.set(Activity.SECURITY_GROUPS_PARAMETER_NAME, securityGroups.map(
      (securityGroup) => securityGroup.securityGroupId));

    this.isVPCCustomized = true;
  }

  public customizeKMS(dataKeys?: kms.IKey[], volumeKeys?: kms.IKey[]) {
    if (!this.isCustomizationAvailableForKMS || (!dataKeys && !volumeKeys)) {
      return;
    }

    if (!dataKeys || !dataKeys.length) {
      throw TypeError('The array dataKeys must be of type kms.IKey[] with at least one element.');
    }
    if (!volumeKeys || !volumeKeys.length) {
      throw TypeError('The array volumeKeys must be of type kms.IKey[] with at least one element.');
    }

    this.multiValueReplacements.set(Activity.DATA_KEYS_PARAMETER_NAME, dataKeys.map((key) => key.keyId));
    this.multiValueReplacements.set(Activity.VOLUME_KEYS_PARAMETER_NAME, volumeKeys.map((key) => key.keyId));

    this.isKMSCustomized = true;
  }

}
