import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
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
export interface AccessS3AllResourcesOptions extends VPCOptions, KMSOptions {
}
export interface AccessS3AllResourcesV2Options extends VPCOptions, KMSOptions {
}
export interface AccessS3BucketsOptions extends VPCOptions, KMSOptions {
    readonly s3Buckets: s3.IBucket[];
}
export interface ManageJobsOptions extends VPCOptions, KMSOptions {
    readonly rolesToPass: iam.IRole[];
}
export interface ManageEndpointsOptions extends VPCOptions, KMSOptions {
}
export interface ManageExperimentsOptions extends VPCOptions, KMSOptions {
}
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
export interface RunStudioAppsV2Options extends VPCOptions, KMSOptions {
}
export interface VisualizeExperimentsOptions extends VPCOptions, KMSOptions {
}
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
export declare class Activity extends Construct {
    static readonly ACCESS_AWS_SERVICES = "SM_ComputeExecutionRole";
    static readonly ACCESS_S3_ALL_RESOURCES = "SageMakerS3AllResourcesPolicyTemplate";
    static readonly ACCESS_S3_BUCKETS = "SageMakerS3BucketPolicyTemplate";
    static readonly MANAGE_ENDPOINTS_ACTIVITY_NAME = "SM_EndpointDeployment";
    static readonly MANAGE_EXPERIMENTS_ACTIVITY_NAME = "SM_ExperimentsManagement";
    static readonly MANAGE_GLUE_TABLES_ACTIVITY_NAME = "SM_GlueTableManagement";
    static readonly MANAGE_JOBS_ACTIVITY_NAME = "SM_CommonJobManagement";
    static readonly MANAGE_MODELS_ACTIVITY_NAME = "SM_ModelManagement";
    static readonly MANAGE_PIPELINES_ACTIVITY_NAME = "SM_PipelineManagement";
    static readonly MONITOR_MODELS_ACTIVITY_NAME = "SM_ModelMonitoring";
    static readonly QUERY_ATHENA_WORKGROUPS = "SM_AthenaQueryAccess";
    static readonly RUN_STUDIO_APPS = "SM_StudioAppPermissions";
    static readonly VISUALIZE_EXPERIMENTS = "SM_ExperimentsVisualization";
    static readonly ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE: string[];
    static accessAwsServices(scope: Construct, id: string, options: AccessAwsServicesOptions): Activity;
    static accessS3AllResources(scope: Construct, id: string, options: AccessS3AllResourcesOptions): Activity;
    static accessS3AllResourcesV2(scope: Construct, id: string, options: AccessS3AllResourcesV2Options): Activity;
    static accessS3Buckets(scope: Construct, id: string, options: AccessS3BucketsOptions): Activity;
    static manageEndpoints(scope: Construct, id: string, options: ManageEndpointsOptions): Activity;
    static manageExperiments(scope: Construct, id: string, options: ManageExperimentsOptions): Activity;
    static manageGlueTables(scope: Construct, id: string, options: ManageGlueTablesOptions): Activity;
    static manageJobs(scope: Construct, id: string, options: ManageJobsOptions): Activity;
    static manageModels(scope: Construct, id: string, options: ManageModelsOptions): Activity;
    static managePipelines(scope: Construct, id: string, options: ManagePipelinesOptions): Activity;
    static monitorModels(scope: Construct, id: string, options: MonitorModelsOptions): Activity;
    static queryAthenaGroups(scope: Construct, id: string, options: QueryAthenaGroupsOptions): Activity;
    static runStudioApps(scope: Construct, id: string, options: RunStudioAppsOptions): Activity;
    static runStudioAppsV2(scope: Construct, id: string, options: RunStudioAppsV2Options): Activity;
    static visualizeExperiments(scope: Construct, id: string, options: VisualizeExperimentsOptions): Activity;
    private static readonly ACCOUNT_ID_PARAMETER_NAME;
    private static readonly REGION_PARAMETER_NAME;
    private static readonly ATHENA_WORKGROUP_NAMES_PARAMETER_NAME;
    private static readonly ECR_REPOSITORIES_PARAMETER_NAME;
    private static readonly GLUE_DATABASE_NAMES_PARAMETER_NAME;
    private static readonly PASSED_ROLES_PARAMETER_NAME;
    private static readonly S3_BUCKETS_PARAMETER_NAME;
    private static readonly SUBNETS_PARAMETER_NAME;
    private static readonly SECURITY_GROUPS_PARAMETER_NAME;
    private static readonly DATA_KEYS_PARAMETER_NAME;
    private static readonly VOLUME_KEYS_PARAMETER_NAME;
    /**
     * Get grant options from statement for Grant.addToPrincipal() function
     * @param identity identity to be granted permissions
     * @param statement the statement from which to get the actions, resources and conditions
     * @returns - The options for the Grant.addToPrincipal() function
     */
    private static getGrantOptions;
    readonly activityName: string;
    readonly version: number;
    private readonly singleValueReplacements;
    private readonly multiValueReplacements;
    private readonly isCustomizationAvailableForVPC;
    private readonly isCustomizationAvailableForKMS;
    isVPCCustomized: boolean;
    isKMSCustomized: boolean;
    private constructor();
    /**
     * Creates role with permissions of activity
     * @param scope the Construct scope.
     * @param id the resource id.
     * @param roleNameSuffix the name suffix of the role that will be created, if empty the role will have the name of the activity.
     * @param roleDescription the description of the role that will be created.
     * @returns - The role that is created with the permissions of the activity
     */
    createRole(scope: Construct, id: string, roleNameSuffix: string, roleDescription?: string): iam.IRole;
    /**
     * Creates policy with permissions of activity
     * @param scope the Construct scope.
     * @returns - The policy that is created with the permissions of the activity
     */
    createPolicy(scope: Construct): iam.Policy;
    /**
     * Creates ML Activity service principal using ML Activity trust template
     * @returns - The service principal of the ML Activity
     */
    createPrincipal(): iam.ServicePrincipal;
    /**
     * Grant permissions of activity to identity
     * @param identity identity to be granted permissions
     * @returns - The grant with the permissions granted to the identity
     */
    grantPermissionsTo(identity: iam.IGrantable): iam.Grant;
    customizeVPC(subnets?: ec2.ISubnet[], securityGroups?: ec2.ISecurityGroup[]): void;
    customizeKMS(dataKeys?: kms.IKey[], volumeKeys?: kms.IKey[]): void;
}
