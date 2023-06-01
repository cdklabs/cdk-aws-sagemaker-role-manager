"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Activity = void 0;
const JSII_RTTI_SYMBOL_1 = Symbol.for("jsii.rtti");
const cdk = require("aws-cdk-lib");
const iam = require("aws-cdk-lib/aws-iam");
const constructs_1 = require("constructs");
const private_1 = require("./private");
class Activity extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        this.isVPCCustomized = false;
        this.isKMSCustomized = false;
        // Validate passed values for multi value replacements
        if (props.athenaWorkgroupNames && props.athenaWorkgroupNames.length === 0) {
            throw TypeError(`The value of the athenaWorkgroupNames parameter should be of type ${props.athenaWorkgroupNames} with at least one element.`);
        }
        for (const athenaWorkGroupName of props.athenaWorkgroupNames || []) {
            if (!private_1.parameterValidationRegex.test(athenaWorkGroupName)) {
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
            if (!private_1.parameterValidationRegex.test(glueDatabaseName)) {
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
        this.singleValueReplacements = new Map();
        this.singleValueReplacements.set(Activity.ACCOUNT_ID_PARAMETER_NAME, cdk.Token.isUnresolved(cdk.Stack.of(this).account) ? '*' : cdk.Stack.of(this).account);
        this.singleValueReplacements.set(Activity.REGION_PARAMETER_NAME, cdk.Token.isUnresolved(cdk.Stack.of(this).region) ? '*' : cdk.Stack.of(this).region);
        // Set multi value replacements
        this.multiValueReplacements = new Map();
        this.multiValueReplacements.set(Activity.ATHENA_WORKGROUP_NAMES_PARAMETER_NAME, props.athenaWorkgroupNames ?? []);
        this.multiValueReplacements.set(Activity.ECR_REPOSITORIES_PARAMETER_NAME, (props.ecrRepositories ?? []).map((ecrRepository) => ecrRepository.repositoryArn));
        this.multiValueReplacements.set(Activity.GLUE_DATABASE_NAMES_PARAMETER_NAME, props.glueDatabaseNames ?? []);
        this.multiValueReplacements.set(Activity.PASSED_ROLES_PARAMETER_NAME, (props.rolesToPass ?? []).map((role) => role.roleArn));
        this.multiValueReplacements.set(Activity.S3_BUCKETS_PARAMETER_NAME, (props.s3Buckets ?? []).map((s3Bucket) => s3Bucket.bucketName));
        this.isCustomizationAvailableForVPC = props.isCustomizationAvailableForVPC;
        this.isCustomizationAvailableForKMS = props.isCustomizationAvailableForKMS;
    }
    // Activity Selection Functions
    static accessAwsServices(scope, id, options) {
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
    static accessS3AllResources(scope, id, options) {
        const activity = new Activity(scope, id, {
            activityName: Activity.ACCESS_S3_ALL_RESOURCES,
            isCustomizationAvailableForVPC: false,
            isCustomizationAvailableForKMS: false,
        });
        activity.customizeVPC(options.subnets, options.securityGroups);
        activity.customizeKMS(options.dataKeys, options.volumeKeys);
        return activity;
    }
    static accessS3AllResourcesV2(scope, id, options) {
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
    static accessS3Buckets(scope, id, options) {
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
    static manageEndpoints(scope, id, options) {
        const activity = new Activity(scope, id, {
            activityName: Activity.MANAGE_ENDPOINTS_ACTIVITY_NAME,
            isCustomizationAvailableForVPC: false,
            isCustomizationAvailableForKMS: true,
        });
        activity.customizeVPC(options.subnets, options.securityGroups);
        activity.customizeKMS(options.dataKeys, options.volumeKeys);
        return activity;
    }
    static manageExperiments(scope, id, options) {
        const activity = new Activity(scope, id, {
            activityName: Activity.MANAGE_EXPERIMENTS_ACTIVITY_NAME,
            isCustomizationAvailableForVPC: false,
            isCustomizationAvailableForKMS: false,
        });
        activity.customizeVPC(options.subnets, options.securityGroups);
        activity.customizeKMS(options.dataKeys, options.volumeKeys);
        return activity;
    }
    static manageGlueTables(scope, id, options) {
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
    static manageJobs(scope, id, options) {
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
    static manageModels(scope, id, options) {
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
    static managePipelines(scope, id, options) {
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
    static monitorModels(scope, id, options) {
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
    static queryAthenaGroups(scope, id, options) {
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
    static runStudioApps(scope, id, options) {
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
    static runStudioAppsV2(scope, id, options) {
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
    static visualizeExperiments(scope, id, options) {
        const activity = new Activity(scope, id, {
            activityName: Activity.VISUALIZE_EXPERIMENTS,
            isCustomizationAvailableForVPC: false,
            isCustomizationAvailableForKMS: false,
        });
        activity.customizeVPC(options.subnets, options.securityGroups);
        activity.customizeKMS(options.dataKeys, options.volumeKeys);
        return activity;
    }
    /**
     * Get grant options from statement for Grant.addToPrincipal() function
     * @param identity identity to be granted permissions
     * @param statement the statement from which to get the actions, resources and conditions
     * @returns - The options for the Grant.addToPrincipal() function
     */
    static getGrantOptions(identity, statement) {
        const actions = typeof (statement.Action) === 'string' ? [statement.Action] : statement.Action;
        const resourceArns = typeof (statement.Resource) === 'string' ? [statement.Resource] : statement.Resource;
        const conditions = statement.Condition ? statement.Condition : {};
        return {
            grantee: identity,
            actions: actions,
            resourceArns: resourceArns,
            conditions: conditions,
        };
    }
    /**
     * Creates role with permissions of activity
     * @param scope the Construct scope.
     * @param id the resource id.
     * @param roleNameSuffix the name suffix of the role that will be created, if empty the role will have the name of the activity.
     * @param roleDescription the description of the role that will be created.
     * @returns - The role that is created with the permissions of the activity
     */
    createRole(scope, id, roleNameSuffix, roleDescription = '') {
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
    createPolicy(scope) {
        const templateFile = private_1.getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
        const timestamp = Date.now().toString();
        const templateName = `${templateFile.name}_V${this.version}_${timestamp}`;
        const templateAsString = JSON.stringify(templateFile.templateJson);
        // Replace singleValueReplacements and multiValueReplacements in templateDocument
        const policyDocumentJSON = JSON.parse(private_1.replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));
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
    createPrincipal() {
        const templateFile = private_1.getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
        const templateAsString = JSON.stringify(templateFile.trustTemplateJson);
        // Replace singleValueReplacements and multiValueReplacements in templateDocument
        const policyDocumentJSON = JSON.parse(private_1.replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));
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
    grantPermissionsTo(identity) {
        const templateFile = private_1.getTemplateFile(this.activityName, this.version, this.isVPCCustomized, this.isKMSCustomized);
        const templateAsString = JSON.stringify(templateFile.templateJson);
        // Replace singleValueReplacements and multiValueReplacements in templateDocument
        let policyDocumentJSON = JSON.parse(private_1.replacePatterns(templateAsString, this.singleValueReplacements, this.multiValueReplacements));
        let grant = iam.Grant.addToPrincipal(Activity.getGrantOptions(identity, policyDocumentJSON.Statement[0]));
        for (let i = 1; i < policyDocumentJSON.Statement.length; i++) {
            grant = grant.combine(iam.Grant.addToPrincipal(Activity.getGrantOptions(identity, policyDocumentJSON.Statement[i])));
        }
        return grant;
    }
    customizeVPC(subnets, securityGroups) {
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
        this.multiValueReplacements.set(Activity.SECURITY_GROUPS_PARAMETER_NAME, securityGroups.map((securityGroup) => securityGroup.securityGroupId));
        this.isVPCCustomized = true;
    }
    customizeKMS(dataKeys, volumeKeys) {
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
exports.Activity = Activity;
_a = JSII_RTTI_SYMBOL_1;
Activity[_a] = { fqn: "cdk-aws-sagemaker-role-manager.Activity", version: "0.0.0" };
// Activity Default Names
Activity.ACCESS_AWS_SERVICES = 'SM_ComputeExecutionRole';
Activity.ACCESS_S3_ALL_RESOURCES = 'SageMakerS3AllResourcesPolicyTemplate';
Activity.ACCESS_S3_BUCKETS = 'SageMakerS3BucketPolicyTemplate';
Activity.MANAGE_ENDPOINTS_ACTIVITY_NAME = 'SM_EndpointDeployment';
Activity.MANAGE_EXPERIMENTS_ACTIVITY_NAME = 'SM_ExperimentsManagement';
Activity.MANAGE_GLUE_TABLES_ACTIVITY_NAME = 'SM_GlueTableManagement';
Activity.MANAGE_JOBS_ACTIVITY_NAME = 'SM_CommonJobManagement';
Activity.MANAGE_MODELS_ACTIVITY_NAME = 'SM_ModelManagement';
Activity.MANAGE_PIPELINES_ACTIVITY_NAME = 'SM_PipelineManagement';
Activity.MONITOR_MODELS_ACTIVITY_NAME = 'SM_ModelMonitoring';
Activity.QUERY_ATHENA_WORKGROUPS = 'SM_AthenaQueryAccess';
Activity.RUN_STUDIO_APPS = 'SM_StudioAppPermissions';
Activity.VISUALIZE_EXPERIMENTS = 'SM_ExperimentsVisualization';
// Activity Default Parameter Values
Activity.ATHENA_WORKGROUP_NAMES_DEFAULT_VALUE = ['primary'];
// Single Value Replacement Parameter Names
Activity.ACCOUNT_ID_PARAMETER_NAME = 'AccountId';
Activity.REGION_PARAMETER_NAME = 'Region';
// Multi Value Replacement Parameter Names
Activity.ATHENA_WORKGROUP_NAMES_PARAMETER_NAME = 'WorkGroupNames';
Activity.ECR_REPOSITORIES_PARAMETER_NAME = 'ECRRepoArns';
Activity.GLUE_DATABASE_NAMES_PARAMETER_NAME = 'GlueDbNames';
Activity.PASSED_ROLES_PARAMETER_NAME = 'PassRoles';
Activity.S3_BUCKETS_PARAMETER_NAME = 'S3Buckets';
Activity.SUBNETS_PARAMETER_NAME = 'VpcSubnets';
Activity.SECURITY_GROUPS_PARAMETER_NAME = 'VpcSecurityGroups';
Activity.DATA_KEYS_PARAMETER_NAME = 'DataKmsKeys';
Activity.VOLUME_KEYS_PARAMETER_NAME = 'VolumeKmsKeys';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWN0aXZpdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWN0aXZpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxtQ0FBbUM7QUFHbkMsMkNBQTJDO0FBRzNDLDJDQUF1QztBQUV2Qyx1Q0FBdUY7QUF5SXZGLE1BQWEsUUFBUyxTQUFRLHNCQUFTO0lBaVNyQyxZQUFvQixLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUFvQjtRQUNwRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBSlosb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFDakMsb0JBQWUsR0FBWSxLQUFLLENBQUM7UUFLdEMsc0RBQXNEO1FBQ3RELElBQUksS0FBSyxDQUFDLG9CQUFvQixJQUFJLEtBQUssQ0FBQyxvQkFBb0IsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ3pFLE1BQU0sU0FBUyxDQUFDLHFFQUFxRSxLQUFLLENBQUMsb0JBQW9CLDZCQUE2QixDQUFDLENBQUM7U0FDL0k7UUFFRCxLQUFLLE1BQU0sbUJBQW1CLElBQUksS0FBSyxDQUFDLG9CQUFvQixJQUFJLEVBQUUsRUFBRTtZQUNsRSxJQUFJLENBQUMsa0NBQXdCLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEVBQUU7Z0JBQ3ZELE1BQU0sU0FBUyxDQUFDLGFBQWEsbUJBQW1CO3NIQUM4RCxDQUFDLENBQUM7YUFDakg7U0FDRjtRQUVELElBQUksS0FBSyxDQUFDLGVBQWUsSUFBSSxLQUFLLENBQUMsZUFBZSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDL0QsTUFBTSxTQUFTLENBQUMsZ0VBQWdFLEtBQUssQ0FBQyxlQUFlLDZCQUE2QixDQUFDLENBQUM7U0FDckk7UUFFRCxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUNuRSxNQUFNLFNBQVMsQ0FBQyxrRUFBa0UsS0FBSyxD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Q0FBNEIsR0FBRyxvQkFBb0IsQ0FBQztBQUNwRCxnQ0FBdUIsR0FBRyxzQkFBc0IsQ0FBQztBQUNqRCx3QkFBZSxHQUFHLHlCQUF5QixDQUFDO0FBQzVDLDhCQUFxQixHQUFHLDZCQUE2QixDQUFDO0FBRTdFLG9DQUFvQztBQUNiLDZDQUFvQyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFrTzFFLDJDQUEyQztBQUNuQixrQ0FBeUIsR0FBRyxXQUFXLENBQUM7QUFDeEMsOEJBQXFCLEdBQUcsUUFBUSxDQUFDO0FBRXpELDBDQUEwQztBQUNsQiw4Q0FBcUMsR0FBRyxnQkFBZ0IsQ0FBQztBQUN6RCx3Q0FBK0IsR0FBRyxhQUFhLENBQUM7QUFDaEQsMkNBQWtDLEdBQUcsYUFBYSxDQUFDO0FBQ25ELG9DQUEyQixHQUFHLFdBQVcsQ0FBQztBQUMxQyxrQ0FBeUIsR0FBRyxXQUFXLENBQUM7QUFDeEMsK0JBQXNCLEdBQUcsWUFBWSxDQUFDO0FBQ3RDLHVDQUE4QixHQUFHLG1CQUFtQixDQUFDO0FBQ3JELGlDQUF3QixHQUFHLGFBQWEsQ0FBQztBQUN6QyxtQ0FBMEIsR0FBRyxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0ICogYXMgZWMyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lYzInO1xuaW1wb3J0ICogYXMgZWNyIGZyb20gJ2F3cy1jZGstbGliL2F3cy1lY3InO1xuaW1wb3J0ICogYXMgaWFtIGZyb20gJ2F3cy1jZGstbGliL2F3cy1pYW0nO1xuaW1wb3J0ICogYXMga21zIGZyb20gJ2F3cy1jZGstbGliL2F3cy1rbXMnO1xuaW1wb3J0ICogYXMgczMgZnJvbSAnYXdzLWNkay1saWIvYXdzLXMzJztcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gJ2NvbnN0cnVjdHMnO1xuXG5pbXBvcnQgeyBnZXRUZW1wbGF0ZUZpbGUsIHBhcmFtZXRlclZhbGlkYXRpb25SZWdleCwgcmVwbGFjZVBhdHRlcm5zIH0gZnJvbSAnLi9wcml2YXRlJztcblxuLyoqXG4gKiBDb25zdHJ1Y3Rpb24gcHJvcGVydGllcyBmb3IgYSBTYWdlTWFrZXIgQWN0aXZpdHlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY3Rpdml0eVByb3BzIHtcblxuICAvKipcbiAgICogTmFtZSBvZiB0aGUgU2FnZU1ha2VyIEFjdGl2aXR5LiBUaGlzIG5hbWUgd2lsbCBiZSB1c2VkIHRvIG5hbWUgdGhlIElBTSBwb2xpY3kgdGhhdCBpcyBjcmVhdGVkIGZyb20gdGhpcyBBY3Rpdml0eS5cbiAgICpcbiAgICovXG4gIHJlYWRvbmx5IGFjdGl2aXR5TmFtZTogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBWZXJzaW9uIG9mIHRoZSBTYWdlTWFrZXIgQWN0aXZpdHkuIFRoaXMgdmVyc2lvbiB3aWxsIGJlIHVzZWQgdG8gZmV0Y2ggdGhlIHBvbGljeSB0ZW1wbGF0ZSB0aGF0IGNvcnJlc3BvbmRzIHRvIHRoZVxuICAgKiBBY3Rpdml0eS5cbiAgICpcbiAgICogQGRlZmF1bHQgLSAxXG4gICAqL1xuICByZWFkb25seSB2ZXJzaW9uPzogbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBFQ1IgUmVwb3NpdG9yaWVzIHRvIGdpdmUgaW1hZ2UgcHVsbCBwZXJtaXNzaW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGVjclJlcG9zaXRvcmllcz86IGVjci5JUmVwb3NpdG9yeVtdO1xuXG4gIC8qKlxuICAgKiBSb2xlcyB0byBhbGxvdyBwYXNzaW5nIGFzIHBhc3NlZCByb2xlcyB0byBhY3Rpb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgcm9sZXNUb1Bhc3M/OiBpYW0uSVJvbGVbXTtcblxuICAvKipcbiAgICogUzMgQnVja2V0cyB0byBnaXZlIHJlYWQgYW5kIHdyaXRlIHBlcm1pc3Npb25zXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gbm9uZVxuICAgKi9cbiAgcmVhZG9ubHkgczNCdWNrZXRzPzogczMuSUJ1Y2tldFtdO1xuXG4gIC8qKlxuICAgKiBOYW1lcyBvZiB0aGUgQXRoZW5hIHdvcmtncm91cHMgdG8gZ2l2ZSBxdWVyeSBwZXJtaXNzaW9uc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIG5vbmVcbiAgICovXG4gIHJlYWRvbmx5IGF0aGVuYVdvcmtncm91cE5hbWVzPzogc3RyaW5nW107XG5cbiAgLyoqXG4gICAqIE5hbWVzIG9mIHRoZSBHbHVlIERhdGFiYXNlcyB0byBnaXZlIHBlcm1pc3Npb25zIHRvIHNlYXJjaCB0YWJsZXNcbiAgICpcbiAgICogQGRlZmF1bHQgLSBub25lXG4gICAqL1xuICByZWFkb25seSBnbHVlRGF0YWJhc2VOYW1lcz86IHN0cmluZ1tdO1xuXG4gIC8qKlxuICAgKiBXaGV0aGVyIHRoZSBhY3Rpdml0eSBzdXBwb3J0cyBjdXN0b21pemF0aW9uIGZvciB2cGMgc3VibmV0cyBhbmQgdnBjIHNlY3VyaXR5IGdyb3Vwc1xuICAgKlxuICAgKiBAZGVmYXVsdCAtIGZhbHNlXG4gICAqL1xuICByZWFkb25seSBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIFdoZXRoZXIgdGhlIGFjdGl2aXR5IHN1cHBvcnRzIGN1c3RvbWl6YXRpb24gZm9yIGttcyBkYXRhIGtleXMgYW5kIHZvbHVtZSBrZXlzXG4gICAqXG4gICAqIEBkZWZhdWx0IC0gZmFsc2VcbiAgICovXG4gIHJlYWRvbmx5IGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogYm9vbGVhbjtcbn1cblxuLyoqXG4gKiBTYWdlTWFrZXIgQWN0aXZpdHkgU3RhdGljIEZ1bmN0aW9uIE9wdGlvbnNcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBBY2Nlc3NBd3NTZXJ2aWNlc09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgZWNyUmVwb3NpdG9yaWVzOiBlY3IuSVJlcG9zaXRvcnlbXTtcbiAgcmVhZG9ubHkgczNCdWNrZXRzOiBzMy5JQnVja2V0W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQWNjZXNzUzNBbGxSZXNvdXJjZXNPcHRpb25zIGV4dGVuZHMgVlBDT3B0aW9ucywgS01TT3B0aW9ucyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY2Vzc1MzQWxsUmVzb3VyY2VzVjJPcHRpb25zIGV4dGVuZHMgVlBDT3B0aW9ucywgS01TT3B0aW9ucyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIEFjY2Vzc1MzQnVja2V0c09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgczNCdWNrZXRzOiBzMy5JQnVja2V0W107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlSm9ic09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgcm9sZXNUb1Bhc3M6IGlhbS5JUm9sZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hbmFnZUVuZHBvaW50c09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlRXhwZXJpbWVudHNPcHRpb25zIGV4dGVuZHMgVlBDT3B0aW9ucywgS01TT3B0aW9ucyB7fVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hbmFnZUdsdWVUYWJsZXNPcHRpb25zIGV4dGVuZHMgVlBDT3B0aW9ucywgS01TT3B0aW9ucyB7XG4gIHJlYWRvbmx5IHMzQnVja2V0czogczMuSUJ1Y2tldFtdO1xuICByZWFkb25seSBnbHVlRGF0YWJhc2VOYW1lczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlTW9kZWxzT3B0aW9ucyBleHRlbmRzIFZQQ09wdGlvbnMsIEtNU09wdGlvbnMge1xuICByZWFkb25seSByb2xlc1RvUGFzczogaWFtLklSb2xlW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlUGlwZWxpbmVzT3B0aW9ucyBleHRlbmRzIFZQQ09wdGlvbnMsIEtNU09wdGlvbnMge1xuICByZWFkb25seSByb2xlc1RvUGFzczogaWFtLklSb2xlW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9uaXRvck1vZGVsc09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgcm9sZXNUb1Bhc3M6IGlhbS5JUm9sZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXJ5QXRoZW5hR3JvdXBzT3B0aW9ucyBleHRlbmRzIFZQQ09wdGlvbnMsIEtNU09wdGlvbnMge1xuICByZWFkb25seSBhdGhlbmFXb3JrZ3JvdXBOYW1lczogc3RyaW5nW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUnVuU3R1ZGlvQXBwc09wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHtcbiAgcmVhZG9ubHkgcm9sZXNUb1Bhc3M6IGlhbS5JUm9sZVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJ1blN0dWRpb0FwcHNWMk9wdGlvbnMgZXh0ZW5kcyBWUENPcHRpb25zLCBLTVNPcHRpb25zIHt9XG5cbmV4cG9ydCBpbnRlcmZhY2UgVmlzdWFsaXplRXhwZXJpbWVudHNPcHRpb25zIGV4dGVuZHMgVlBDT3B0aW9ucywgS01TT3B0aW9ucyB7fVxuXG4vKipcbiAqIEdsb2JhbCBDb25kaXRpb24gQ3VzdG9taXphdGlvbiBPcHRpb25zXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgVlBDT3B0aW9ucyB7XG4gIHJlYWRvbmx5IHN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdO1xuICByZWFkb25seSBzZWN1cml0eUdyb3Vwcz86IGVjMi5JU2VjdXJpdHlHcm91cFtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEtNU09wdGlvbnMge1xuICByZWFkb25seSBkYXRhS2V5cz86IGttcy5JS2V5W107XG4gIHJlYWRvbmx5IHZvbHVtZUtleXM/OiBrbXMuSUtleVtdO1xufVxuXG5leHBvcnQgY2xhc3MgQWN0aXZpdHkgZXh0ZW5kcyBDb25zdHJ1Y3Qge1xuXG4gIC8vIEFjdGl2aXR5IERlZmF1bHQgTmFtZXNcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBQ0NFU1NfQVdTX1NFUlZJQ0VTID0gJ1NNX0NvbXB1dGVFeGVjdXRpb25Sb2xlJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBQ0NFU1NfUzNfQUxMX1JFU09VUkNFUyA9ICdTYWdlTWFrZXJTM0FsbFJlc291cmNlc1BvbGljeVRlbXBsYXRlJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBBQ0NFU1NfUzNfQlVDS0VUUyA9ICdTYWdlTWFrZXJTM0J1Y2tldFBvbGljeVRlbXBsYXRlJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQU5BR0VfRU5EUE9JTlRTX0FDVElWSVRZX05BTUUgPSAnU01fRW5kcG9pbnREZXBsb3ltZW50JztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBNQU5BR0VfRVhQRVJJTUVOVFNfQUNUSVZJVFlfTkFNRSA9ICdTTV9FeHBlcmltZW50c01hbmFnZW1lbnQnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BTkFHRV9HTFVFX1RBQkxFU19BQ1RJVklUWV9OQU1FID0gJ1NNX0dsdWVUYWJsZU1hbmFnZW1lbnQnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1BTkFHRV9KT0JTX0FDVElWSVRZX05BTUUgPSAnU01fQ29tbW9uSm9iTWFuYWdlbWVudCc7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFOQUdFX01PREVMU19BQ1RJVklUWV9OQU1FID0gJ1NNX01vZGVsTWFuYWdlbWVudCc7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTUFOQUdFX1BJUEVMSU5FU19BQ1RJVklUWV9OQU1FID0gJ1NNX1BpcGVsaW5lTWFuYWdlbWVudCc7XG4gIHB1YmxpYyBzdGF0aWMgcmVhZG9ubHkgTU9OSVRPUl9NT0RFTFNfQUNUSVZJVFlfTkFNRSA9ICdTTV9Nb2RlbE1vbml0b3JpbmcnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFFVRVJZX0FUSEVOQV9XT1JLR1JPVVBTID0gJ1NNX0F0aGVuYVF1ZXJ5QWNjZXNzJztcbiAgcHVibGljIHN0YXRpYyByZWFkb25seSBSVU5fU1RVRElPX0FQUFMgPSAnU01fU3R1ZGlvQXBwUGVybWlzc2lvbnMnO1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFZJU1VBTElaRV9FWFBFUklNRU5UUyA9ICdTTV9FeHBlcmltZW50c1Zpc3VhbGl6YXRpb24nO1xuXG4gIC8vIEFjdGl2aXR5IERlZmF1bHQgUGFyYW1ldGVyIFZhbHVlc1xuICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IEFUSEVOQV9XT1JLR1JPVVBfTkFNRVNfREVGQVVMVF9WQUxVRSA9IFsncHJpbWFyeSddO1xuXG4gIC8vIEFjdGl2aXR5IFNlbGVjdGlvbiBGdW5jdGlvbnNcbiAgcHVibGljIHN0YXRpYyBhY2Nlc3NBd3NTZXJ2aWNlcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBBY2Nlc3NBd3NTZXJ2aWNlc09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuQUNDRVNTX0FXU19TRVJWSUNFUyxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQzogdHJ1ZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogdHJ1ZSxcbiAgICAgIGVjclJlcG9zaXRvcmllczogb3B0aW9ucy5lY3JSZXBvc2l0b3JpZXMsXG4gICAgICBzM0J1Y2tldHM6IG9wdGlvbnMuczNCdWNrZXRzLFxuICAgIH0pO1xuXG4gICAgYWN0aXZpdHkuY3VzdG9taXplVlBDKG9wdGlvbnMuc3VibmV0cywgb3B0aW9ucy5zZWN1cml0eUdyb3Vwcyk7XG4gICAgYWN0aXZpdHkuY3VzdG9taXplS01TKG9wdGlvbnMuZGF0YUtleXMsIG9wdGlvbnMudm9sdW1lS2V5cyk7XG5cbiAgICByZXR1cm4gYWN0aXZpdHk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFjY2Vzc1MzQWxsUmVzb3VyY2VzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IEFjY2Vzc1MzQWxsUmVzb3VyY2VzT3B0aW9ucyk6IEFjdGl2aXR5IHtcblxuICAgIGNvbnN0IGFjdGl2aXR5ID0gbmV3IEFjdGl2aXR5KHNjb3BlLCBpZCwge1xuICAgICAgYWN0aXZpdHlOYW1lOiBBY3Rpdml0eS5BQ0NFU1NfUzNfQUxMX1JFU09VUkNFUyxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQzogZmFsc2UsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgYWN0aXZpdHkuY3VzdG9taXplVlBDKG9wdGlvbnMuc3VibmV0cywgb3B0aW9ucy5zZWN1cml0eUdyb3Vwcyk7XG4gICAgYWN0aXZpdHkuY3VzdG9taXplS01TKG9wdGlvbnMuZGF0YUtleXMsIG9wdGlvbnMudm9sdW1lS2V5cyk7XG5cbiAgICByZXR1cm4gYWN0aXZpdHk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIGFjY2Vzc1MzQWxsUmVzb3VyY2VzVjIoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogQWNjZXNzUzNBbGxSZXNvdXJjZXNWMk9wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuQUNDRVNTX1MzX0FMTF9SRVNPVVJDRVMsXG4gICAgICB2ZXJzaW9uOiAyLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBhY3Rpdml0eS5jdXN0b21pemVWUEMob3B0aW9ucy5zdWJuZXRzLCBvcHRpb25zLnNlY3VyaXR5R3JvdXBzKTtcbiAgICBhY3Rpdml0eS5jdXN0b21pemVLTVMob3B0aW9ucy5kYXRhS2V5cywgb3B0aW9ucy52b2x1bWVLZXlzKTtcblxuICAgIHJldHVybiBhY3Rpdml0eTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgYWNjZXNzUzNCdWNrZXRzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IEFjY2Vzc1MzQnVja2V0c09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuQUNDRVNTX1MzX0JVQ0tFVFMsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IGZhbHNlLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yS01TOiBmYWxzZSxcbiAgICAgIHMzQnVja2V0czogb3B0aW9ucy5zM0J1Y2tldHMsXG4gICAgfSk7XG5cbiAgICBhY3Rpdml0eS5jdXN0b21pemVWUEMob3B0aW9ucy5zdWJuZXRzLCBvcHRpb25zLnNlY3VyaXR5R3JvdXBzKTtcbiAgICBhY3Rpdml0eS5jdXN0b21pemVLTVMob3B0aW9ucy5kYXRhS2V5cywgb3B0aW9ucy52b2x1bWVLZXlzKTtcblxuICAgIHJldHVybiBhY3Rpdml0eTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFuYWdlRW5kcG9pbnRzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IE1hbmFnZUVuZHBvaW50c09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuTUFOQUdFX0VORFBPSU5UU19BQ1RJVklUWV9OQU1FLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogdHJ1ZSxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYW5hZ2VFeHBlcmltZW50cyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBNYW5hZ2VFeHBlcmltZW50c09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuTUFOQUdFX0VYUEVSSU1FTlRTX0FDVElWSVRZX05BTUUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IGZhbHNlLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yS01TOiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYW5hZ2VHbHVlVGFibGVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IE1hbmFnZUdsdWVUYWJsZXNPcHRpb25zKTogQWN0aXZpdHkge1xuXG4gICAgY29uc3QgYWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoc2NvcGUsIGlkLCB7XG4gICAgICBhY3Rpdml0eU5hbWU6IEFjdGl2aXR5Lk1BTkFHRV9HTFVFX1RBQkxFU19BQ1RJVklUWV9OQU1FLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogdHJ1ZSxcbiAgICAgIHMzQnVja2V0czogb3B0aW9ucy5zM0J1Y2tldHMsXG4gICAgICBnbHVlRGF0YWJhc2VOYW1lczogb3B0aW9ucy5nbHVlRGF0YWJhc2VOYW1lcyxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYW5hZ2VKb2JzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IE1hbmFnZUpvYnNPcHRpb25zKTogQWN0aXZpdHkge1xuXG4gICAgY29uc3QgYWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoc2NvcGUsIGlkLCB7XG4gICAgICBhY3Rpdml0eU5hbWU6IEFjdGl2aXR5Lk1BTkFHRV9KT0JTX0FDVElWSVRZX05BTUUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IHRydWUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVM6IHRydWUsXG4gICAgICByb2xlc1RvUGFzczogb3B0aW9ucy5yb2xlc1RvUGFzcyxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtYW5hZ2VNb2RlbHMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogTWFuYWdlTW9kZWxzT3B0aW9ucyk6IEFjdGl2aXR5IHtcblxuICAgIGNvbnN0IGFjdGl2aXR5ID0gbmV3IEFjdGl2aXR5KHNjb3BlLCBpZCwge1xuICAgICAgYWN0aXZpdHlOYW1lOiBBY3Rpdml0eS5NQU5BR0VfTU9ERUxTX0FDVElWSVRZX05BTUUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IHRydWUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVM6IGZhbHNlLFxuICAgICAgcm9sZXNUb1Bhc3M6IG9wdGlvbnMucm9sZXNUb1Bhc3MsXG4gICAgfSk7XG5cbiAgICBhY3Rpdml0eS5jdXN0b21pemVWUEMob3B0aW9ucy5zdWJuZXRzLCBvcHRpb25zLnNlY3VyaXR5R3JvdXBzKTtcbiAgICBhY3Rpdml0eS5jdXN0b21pemVLTVMob3B0aW9ucy5kYXRhS2V5cywgb3B0aW9ucy52b2x1bWVLZXlzKTtcblxuICAgIHJldHVybiBhY3Rpdml0eTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgbWFuYWdlUGlwZWxpbmVzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IE1hbmFnZVBpcGVsaW5lc09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuTUFOQUdFX1BJUEVMSU5FU19BQ1RJVklUWV9OQU1FLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogZmFsc2UsXG4gICAgICByb2xlc1RvUGFzczogb3B0aW9ucy5yb2xlc1RvUGFzcyxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBtb25pdG9yTW9kZWxzKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIG9wdGlvbnM6IE1vbml0b3JNb2RlbHNPcHRpb25zKTogQWN0aXZpdHkge1xuXG4gICAgY29uc3QgYWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoc2NvcGUsIGlkLCB7XG4gICAgICBhY3Rpdml0eU5hbWU6IEFjdGl2aXR5Lk1PTklUT1JfTU9ERUxTX0FDVElWSVRZX05BTUUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IHRydWUsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVM6IHRydWUsXG4gICAgICByb2xlc1RvUGFzczogb3B0aW9ucy5yb2xlc1RvUGFzcyxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBxdWVyeUF0aGVuYUdyb3VwcyhzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBvcHRpb25zOiBRdWVyeUF0aGVuYUdyb3Vwc09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuUVVFUllfQVRIRU5BX1dPUktHUk9VUFMsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JWUEM6IGZhbHNlLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yS01TOiBmYWxzZSxcbiAgICAgIGF0aGVuYVdvcmtncm91cE5hbWVzOiBvcHRpb25zLmF0aGVuYVdvcmtncm91cE5hbWVzLFxuICAgIH0pO1xuXG4gICAgYWN0aXZpdHkuY3VzdG9taXplVlBDKG9wdGlvbnMuc3VibmV0cywgb3B0aW9ucy5zZWN1cml0eUdyb3Vwcyk7XG4gICAgYWN0aXZpdHkuY3VzdG9taXplS01TKG9wdGlvbnMuZGF0YUtleXMsIG9wdGlvbnMudm9sdW1lS2V5cyk7XG5cbiAgICByZXR1cm4gYWN0aXZpdHk7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHJ1blN0dWRpb0FwcHMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogUnVuU3R1ZGlvQXBwc09wdGlvbnMpOiBBY3Rpdml0eSB7XG5cbiAgICBjb25zdCBhY3Rpdml0eSA9IG5ldyBBY3Rpdml0eShzY29wZSwgaWQsIHtcbiAgICAgIGFjdGl2aXR5TmFtZTogQWN0aXZpdHkuUlVOX1NUVURJT19BUFBTLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogZmFsc2UsXG4gICAgICByb2xlc1RvUGFzczogb3B0aW9ucy5yb2xlc1RvUGFzcyxcbiAgICB9KTtcblxuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZVZQQyhvcHRpb25zLnN1Ym5ldHMsIG9wdGlvbnMuc2VjdXJpdHlHcm91cHMpO1xuICAgIGFjdGl2aXR5LmN1c3RvbWl6ZUtNUyhvcHRpb25zLmRhdGFLZXlzLCBvcHRpb25zLnZvbHVtZUtleXMpO1xuXG4gICAgcmV0dXJuIGFjdGl2aXR5O1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBydW5TdHVkaW9BcHBzVjIoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogUnVuU3R1ZGlvQXBwc1YyT3B0aW9ucyk6IEFjdGl2aXR5IHtcblxuICAgIGNvbnN0IGFjdGl2aXR5ID0gbmV3IEFjdGl2aXR5KHNjb3BlLCBpZCwge1xuICAgICAgYWN0aXZpdHlOYW1lOiBBY3Rpdml0eS5SVU5fU1RVRElPX0FQUFMsXG4gICAgICB2ZXJzaW9uOiAyLFxuICAgICAgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBmYWxzZSxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogZmFsc2UsXG4gICAgfSk7XG5cbiAgICBhY3Rpdml0eS5jdXN0b21pemVWUEMob3B0aW9ucy5zdWJuZXRzLCBvcHRpb25zLnNlY3VyaXR5R3JvdXBzKTtcbiAgICBhY3Rpdml0eS5jdXN0b21pemVLTVMob3B0aW9ucy5kYXRhS2V5cywgb3B0aW9ucy52b2x1bWVLZXlzKTtcblxuICAgIHJldHVybiBhY3Rpdml0eTtcbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgdmlzdWFsaXplRXhwZXJpbWVudHMoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgb3B0aW9uczogVmlzdWFsaXplRXhwZXJpbWVudHNPcHRpb25zKTogQWN0aXZpdHkge1xuXG4gICAgY29uc3QgYWN0aXZpdHkgPSBuZXcgQWN0aXZpdHkoc2NvcGUsIGlkLCB7XG4gICAgICBhY3Rpdml0eU5hbWU6IEFjdGl2aXR5LlZJU1VBTElaRV9FWFBFUklNRU5UUyxcbiAgICAgIGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQzogZmFsc2UsXG4gICAgICBpc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVM6IGZhbHNlLFxuICAgIH0pO1xuXG4gICAgYWN0aXZpdHkuY3VzdG9taXplVlBDKG9wdGlvbnMuc3VibmV0cywgb3B0aW9ucy5zZWN1cml0eUdyb3Vwcyk7XG4gICAgYWN0aXZpdHkuY3VzdG9taXplS01TKG9wdGlvbnMuZGF0YUtleXMsIG9wdGlvbnMudm9sdW1lS2V5cyk7XG5cbiAgICByZXR1cm4gYWN0aXZpdHk7XG4gIH1cblxuICAvLyBTaW5nbGUgVmFsdWUgUmVwbGFjZW1lbnQgUGFyYW1ldGVyIE5hbWVzXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEFDQ09VTlRfSURfUEFSQU1FVEVSX05BTUUgPSAnQWNjb3VudElkJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgUkVHSU9OX1BBUkFNRVRFUl9OQU1FID0gJ1JlZ2lvbic7XG5cbiAgLy8gTXVsdGkgVmFsdWUgUmVwbGFjZW1lbnQgUGFyYW1ldGVyIE5hbWVzXG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEFUSEVOQV9XT1JLR1JPVVBfTkFNRVNfUEFSQU1FVEVSX05BTUUgPSAnV29ya0dyb3VwTmFtZXMnO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBFQ1JfUkVQT1NJVE9SSUVTX1BBUkFNRVRFUl9OQU1FID0gJ0VDUlJlcG9Bcm5zJztcbiAgcHJpdmF0ZSBzdGF0aWMgcmVhZG9ubHkgR0xVRV9EQVRBQkFTRV9OQU1FU19QQVJBTUVURVJfTkFNRSA9ICdHbHVlRGJOYW1lcyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFBBU1NFRF9ST0xFU19QQVJBTUVURVJfTkFNRSA9ICdQYXNzUm9sZXMnO1xuICBwcml2YXRlIHN0YXRpYyByZWFkb25seSBTM19CVUNLRVRTX1BBUkFNRVRFUl9OQU1FID0gJ1MzQnVja2V0cyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNVQk5FVFNfUEFSQU1FVEVSX05BTUUgPSAnVnBjU3VibmV0cyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFNFQ1VSSVRZX0dST1VQU19QQVJBTUVURVJfTkFNRSA9ICdWcGNTZWN1cml0eUdyb3Vwcyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IERBVEFfS0VZU19QQVJBTUVURVJfTkFNRSA9ICdEYXRhS21zS2V5cyc7XG4gIHByaXZhdGUgc3RhdGljIHJlYWRvbmx5IFZPTFVNRV9LRVlTX1BBUkFNRVRFUl9OQU1FID0gJ1ZvbHVtZUttc0tleXMnO1xuXG4gIC8qKlxuICAgKiBHZXQgZ3JhbnQgb3B0aW9ucyBmcm9tIHN0YXRlbWVudCBmb3IgR3JhbnQuYWRkVG9QcmluY2lwYWwoKSBmdW5jdGlvblxuICAgKiBAcGFyYW0gaWRlbnRpdHkgaWRlbnRpdHkgdG8gYmUgZ3JhbnRlZCBwZXJtaXNzaW9uc1xuICAgKiBAcGFyYW0gc3RhdGVtZW50IHRoZSBzdGF0ZW1lbnQgZnJvbSB3aGljaCB0byBnZXQgdGhlIGFjdGlvbnMsIHJlc291cmNlcyBhbmQgY29uZGl0aW9uc1xuICAgKiBAcmV0dXJucyAtIFRoZSBvcHRpb25zIGZvciB0aGUgR3JhbnQuYWRkVG9QcmluY2lwYWwoKSBmdW5jdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgZ2V0R3JhbnRPcHRpb25zKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSwgc3RhdGVtZW50OiBhbnkpOiBpYW0uR3JhbnRPblByaW5jaXBhbE9wdGlvbnMge1xuICAgIGNvbnN0IGFjdGlvbnMgPSB0eXBlb2Yoc3RhdGVtZW50LkFjdGlvbikgPT09ICdzdHJpbmcnID8gW3N0YXRlbWVudC5BY3Rpb25dIDogc3RhdGVtZW50LkFjdGlvbjtcbiAgICBjb25zdCByZXNvdXJjZUFybnMgPSB0eXBlb2Yoc3RhdGVtZW50LlJlc291cmNlKSA9PT0gJ3N0cmluZycgPyBbc3RhdGVtZW50LlJlc291cmNlXSA6IHN0YXRlbWVudC5SZXNvdXJjZTtcbiAgICBjb25zdCBjb25kaXRpb25zID0gc3RhdGVtZW50LkNvbmRpdGlvbiA/IHN0YXRlbWVudC5Db25kaXRpb246IHt9O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGdyYW50ZWU6IGlkZW50aXR5LFxuICAgICAgYWN0aW9uczogYWN0aW9ucyxcbiAgICAgIHJlc291cmNlQXJuczogcmVzb3VyY2VBcm5zLFxuICAgICAgY29uZGl0aW9uczogY29uZGl0aW9ucyxcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIHJlYWRvbmx5IGFjdGl2aXR5TmFtZTogc3RyaW5nO1xuICBwdWJsaWMgcmVhZG9ubHkgdmVyc2lvbjogbnVtYmVyO1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgc2luZ2xlVmFsdWVSZXBsYWNlbWVudHM6IE1hcDxzdHJpbmcsIHN0cmluZz47XG4gIHByaXZhdGUgcmVhZG9ubHkgbXVsdGlWYWx1ZVJlcGxhY2VtZW50czogTWFwPHN0cmluZywgc3RyaW5nW10+O1xuXG4gIHByaXZhdGUgcmVhZG9ubHkgaXNDdXN0b21pemF0aW9uQXZhaWxhYmxlRm9yVlBDOiBib29sZWFuO1xuICBwcml2YXRlIHJlYWRvbmx5IGlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUzogYm9vbGVhbjtcbiAgcHVibGljIGlzVlBDQ3VzdG9taXplZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgaXNLTVNDdXN0b21pemVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczogQWN0aXZpdHlQcm9wcykge1xuICAgIHN1cGVyKHNjb3BlLCBpZCk7XG5cbiAgICAvLyBWYWxpZGF0ZSBwYXNzZWQgdmFsdWVzIGZvciBtdWx0aSB2YWx1ZSByZXBsYWNlbWVudHNcbiAgICBpZiAocHJvcHMuYXRoZW5hV29ya2dyb3VwTmFtZXMgJiYgcHJvcHMuYXRoZW5hV29ya2dyb3VwTmFtZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYFRoZSB2YWx1ZSBvZiB0aGUgYXRoZW5hV29ya2dyb3VwTmFtZXMgcGFyYW1ldGVyIHNob3VsZCBiZSBvZiB0eXBlICR7cHJvcHMuYXRoZW5hV29ya2dyb3VwTmFtZXN9IHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuYCk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBhdGhlbmFXb3JrR3JvdXBOYW1lIG9mIHByb3BzLmF0aGVuYVdvcmtncm91cE5hbWVzIHx8IFtdKSB7XG4gICAgICBpZiAoIXBhcmFtZXRlclZhbGlkYXRpb25SZWdleC50ZXN0KGF0aGVuYVdvcmtHcm91cE5hbWUpKSB7XG4gICAgICAgIHRocm93IFR5cGVFcnJvcihgVGhlIHZhbHVlICR7YXRoZW5hV29ya0dyb3VwTmFtZX0gb2YgYXRoZW5hV29ya2dyb3VwTmFtZXMgYXJyYXkgZWxlbWVudCBjb250YWlucyBhbiBpbnZhbGlkIGNoYXJhY3RlcixcbiAgICAgICAgICAgICBhdGhlbmFXb3JrZ3JvdXBOYW1lcyBlbGVtZW50cyBtdXN0IGJlIGFscGhhbnVtZXJpYyB3aXRoIG5vIHNwYWNlcyBhbmQgb25seSB0aGUgc3BlY2lhbCBjaGFyYWN0ZXJzOiBfLzouLWApO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcm9wcy5lY3JSZXBvc2l0b3JpZXMgJiYgcHJvcHMuZWNyUmVwb3NpdG9yaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGBUaGUgdmFsdWUgb2YgdGhlIGVjclJlcG9zaXRvcmllcyBwYXJhbWV0ZXIgc2hvdWxkIGJlIG9mIHR5cGUgJHtwcm9wcy5lY3JSZXBvc2l0b3JpZXN9IHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuYCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLmdsdWVEYXRhYmFzZU5hbWVzICYmIHByb3BzLmdsdWVEYXRhYmFzZU5hbWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKGBUaGUgdmFsdWUgb2YgdGhlIGdsdWVEYXRhYmFzZU5hbWVzIHBhcmFtZXRlciBzaG91bGQgYmUgb2YgdHlwZSAke3Byb3BzLmdsdWVEYXRhYmFzZU5hbWVzfSB3aXRoIGF0IGxlYXN0IG9uZSBlbGVtZW50LmApO1xuICAgIH1cblxuICAgIGZvciAoY29uc3QgZ2x1ZURhdGFiYXNlTmFtZSBvZiBwcm9wcy5nbHVlRGF0YWJhc2VOYW1lcyB8fCBbXSkge1xuICAgICAgaWYgKCFwYXJhbWV0ZXJWYWxpZGF0aW9uUmVnZXgudGVzdChnbHVlRGF0YWJhc2VOYW1lKSkge1xuICAgICAgICB0aHJvdyBUeXBlRXJyb3IoYFRoZSB2YWx1ZSAke2dsdWVEYXRhYmFzZU5hbWV9IG9mIGdsdWVEYXRhYmFzZU5hbWVzIGFycmF5IGVsZW1lbnQgY29udGFpbnMgYW4gaW52YWxpZCBjaGFyYWN0ZXIsXG4gICAgICAgICAgICAgZ2x1ZURhdGFiYXNlTmFtZXMgZWxlbWVudHMgbXVzdCBiZSBhbHBoYW51bWVyaWMgd2l0aCBubyBzcGFjZXMgYW5kIG9ubHkgdGhlIHNwZWNpYWwgY2hhcmFjdGVyczogXy86Li1gKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocHJvcHMucm9sZXNUb1Bhc3MgJiYgcHJvcHMucm9sZXNUb1Bhc3MubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYFRoZSB2YWx1ZSBvZiB0aGUgcm9sZXNUb1Bhc3MgcGFyYW1ldGVyIHNob3VsZCBiZSBvZiB0eXBlICR7cHJvcHMucm9sZXNUb1Bhc3N9IHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuYCk7XG4gICAgfVxuXG4gICAgaWYgKHByb3BzLnMzQnVja2V0cyAmJiBwcm9wcy5zM0J1Y2tldHMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoYFRoZSB2YWx1ZSBvZiB0aGUgczNCdWNrZXRzIHBhcmFtZXRlciBzaG91bGQgYmUgb2YgdHlwZSAke3Byb3BzLnMzQnVja2V0c30gd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudC5gKTtcbiAgICB9XG5cbiAgICB0aGlzLmFjdGl2aXR5TmFtZSA9IHByb3BzLmFjdGl2aXR5TmFtZTtcbiAgICB0aGlzLnZlcnNpb24gPSBwcm9wcy52ZXJzaW9uIHx8IDE7XG5cbiAgICAvLyBTZXQgc2luZ2xlIHZhbHVlIHJlcGxhY2VtZW50c1xuICAgIHRoaXMuc2luZ2xlVmFsdWVSZXBsYWNlbWVudHMgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgIHRoaXMuc2luZ2xlVmFsdWVSZXBsYWNlbWVudHMuc2V0KEFjdGl2aXR5LkFDQ09VTlRfSURfUEFSQU1FVEVSX05BTUUsXG4gICAgICBjZGsuVG9rZW4uaXNVbnJlc29sdmVkKGNkay5TdGFjay5vZih0aGlzKS5hY2NvdW50KSA/ICcqJyA6IGNkay5TdGFjay5vZih0aGlzKS5hY2NvdW50KTtcbiAgICB0aGlzLnNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzLnNldChBY3Rpdml0eS5SRUdJT05fUEFSQU1FVEVSX05BTUUsXG4gICAgICBjZGsuVG9rZW4uaXNVbnJlc29sdmVkKGNkay5TdGFjay5vZih0aGlzKS5yZWdpb24pID8gJyonIDogY2RrLlN0YWNrLm9mKHRoaXMpLnJlZ2lvbik7XG5cbiAgICAvLyBTZXQgbXVsdGkgdmFsdWUgcmVwbGFjZW1lbnRzXG4gICAgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xuXG4gICAgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzLnNldChBY3Rpdml0eS5BVEhFTkFfV09SS0dST1VQX05BTUVTX1BBUkFNRVRFUl9OQU1FLCBwcm9wcy5hdGhlbmFXb3JrZ3JvdXBOYW1lcyA/PyBbXSk7XG4gICAgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzLnNldChBY3Rpdml0eS5FQ1JfUkVQT1NJVE9SSUVTX1BBUkFNRVRFUl9OQU1FLCAocHJvcHMuZWNyUmVwb3NpdG9yaWVzID8/IFtdKS5tYXAoXG4gICAgICAoZWNyUmVwb3NpdG9yeSkgPT4gZWNyUmVwb3NpdG9yeS5yZXBvc2l0b3J5QXJuKSk7XG4gICAgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzLnNldChBY3Rpdml0eS5HTFVFX0RBVEFCQVNFX05BTUVTX1BBUkFNRVRFUl9OQU1FLCBwcm9wcy5nbHVlRGF0YWJhc2VOYW1lcyA/PyBbXSk7XG4gICAgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzLnNldChBY3Rpdml0eS5QQVNTRURfUk9MRVNfUEFSQU1FVEVSX05BTUUsIChwcm9wcy5yb2xlc1RvUGFzcyA/PyBbXSkubWFwKFxuICAgICAgKHJvbGUpID0+IHJvbGUucm9sZUFybikpO1xuICAgIHRoaXMubXVsdGlWYWx1ZVJlcGxhY2VtZW50cy5zZXQoQWN0aXZpdHkuUzNfQlVDS0VUU19QQVJBTUVURVJfTkFNRSwgKHByb3BzLnMzQnVja2V0cyA/PyBbXSkubWFwKFxuICAgICAgKHMzQnVja2V0KSA9PiBzM0J1Y2tldC5idWNrZXROYW1lKSk7XG5cbiAgICB0aGlzLmlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQyA9IHByb3BzLmlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQztcbiAgICB0aGlzLmlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUyA9IHByb3BzLmlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvcktNUztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIHJvbGUgd2l0aCBwZXJtaXNzaW9ucyBvZiBhY3Rpdml0eVxuICAgKiBAcGFyYW0gc2NvcGUgdGhlIENvbnN0cnVjdCBzY29wZS5cbiAgICogQHBhcmFtIGlkIHRoZSByZXNvdXJjZSBpZC5cbiAgICogQHBhcmFtIHJvbGVOYW1lU3VmZml4IHRoZSBuYW1lIHN1ZmZpeCBvZiB0aGUgcm9sZSB0aGF0IHdpbGwgYmUgY3JlYXRlZCwgaWYgZW1wdHkgdGhlIHJvbGUgd2lsbCBoYXZlIHRoZSBuYW1lIG9mIHRoZSBhY3Rpdml0eS5cbiAgICogQHBhcmFtIHJvbGVEZXNjcmlwdGlvbiB0aGUgZGVzY3JpcHRpb24gb2YgdGhlIHJvbGUgdGhhdCB3aWxsIGJlIGNyZWF0ZWQuXG4gICAqIEByZXR1cm5zIC0gVGhlIHJvbGUgdGhhdCBpcyBjcmVhdGVkIHdpdGggdGhlIHBlcm1pc3Npb25zIG9mIHRoZSBhY3Rpdml0eVxuICAgKi9cbiAgcHVibGljIGNyZWF0ZVJvbGUoc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcm9sZU5hbWVTdWZmaXg6IHN0cmluZywgcm9sZURlc2NyaXB0aW9uOiBzdHJpbmcgPSAnJyk6IGlhbS5JUm9sZSB7XG4gICAgaWYgKCFyb2xlTmFtZVN1ZmZpeCB8fCAhcm9sZU5hbWVTdWZmaXgubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1RoZSByb2xlIG5hbWUgc2hvdWxkIGJlIGEgbm9uIGVtcHR5IHN0cmluZycpO1xuICAgIH1cblxuICAgIGNvbnN0IHBvbGljeSA9IHRoaXMuY3JlYXRlUG9saWN5KHNjb3BlKTtcblxuICAgIGNvbnN0IHJvbGUgPSBuZXcgaWFtLlJvbGUoc2NvcGUsIGlkLCB7XG4gICAgICByb2xlTmFtZTogYFNhZ2VNYWtlci0ke3JvbGVOYW1lU3VmZml4fWAsXG4gICAgICBkZXNjcmlwdGlvbjogcm9sZURlc2NyaXB0aW9uLFxuICAgICAgYXNzdW1lZEJ5OiB0aGlzLmNyZWF0ZVByaW5jaXBhbCgpLFxuICAgIH0pO1xuXG4gICAgcm9sZS5hdHRhY2hJbmxpbmVQb2xpY3kocG9saWN5KTtcblxuICAgIHJldHVybiByb2xlO1xuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgcG9saWN5IHdpdGggcGVybWlzc2lvbnMgb2YgYWN0aXZpdHlcbiAgICogQHBhcmFtIHNjb3BlIHRoZSBDb25zdHJ1Y3Qgc2NvcGUuXG4gICAqIEByZXR1cm5zIC0gVGhlIHBvbGljeSB0aGF0IGlzIGNyZWF0ZWQgd2l0aCB0aGUgcGVybWlzc2lvbnMgb2YgdGhlIGFjdGl2aXR5XG4gICAqL1xuICBwdWJsaWMgY3JlYXRlUG9saWN5KHNjb3BlOiBDb25zdHJ1Y3QpOiBpYW0uUG9saWN5IHtcbiAgICBjb25zdCB0ZW1wbGF0ZUZpbGUgPSBnZXRUZW1wbGF0ZUZpbGUodGhpcy5hY3Rpdml0eU5hbWUsIHRoaXMudmVyc2lvbiwgdGhpcy5pc1ZQQ0N1c3RvbWl6ZWQsIHRoaXMuaXNLTVNDdXN0b21pemVkKTtcbiAgICBjb25zdCB0aW1lc3RhbXAgPSBEYXRlLm5vdygpLnRvU3RyaW5nKCk7XG4gICAgY29uc3QgdGVtcGxhdGVOYW1lID0gYCR7dGVtcGxhdGVGaWxlLm5hbWV9X1Yke3RoaXMudmVyc2lvbn1fJHt0aW1lc3RhbXB9YDtcbiAgICBjb25zdCB0ZW1wbGF0ZUFzU3RyaW5nID0gSlNPTi5zdHJpbmdpZnkodGVtcGxhdGVGaWxlLnRlbXBsYXRlSnNvbik7XG5cbiAgICAvLyBSZXBsYWNlIHNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzIGFuZCBtdWx0aVZhbHVlUmVwbGFjZW1lbnRzIGluIHRlbXBsYXRlRG9jdW1lbnRcbiAgICBjb25zdCBwb2xpY3lEb2N1bWVudEpTT04gPSBKU09OLnBhcnNlKHJlcGxhY2VQYXR0ZXJucyh0ZW1wbGF0ZUFzU3RyaW5nLCB0aGlzLnNpbmdsZVZhbHVlUmVwbGFjZW1lbnRzLCB0aGlzLm11bHRpVmFsdWVSZXBsYWNlbWVudHMpKTtcblxuICAgIGNvbnN0IHBvbGljeURvY3VtZW50ID0gaWFtLlBvbGljeURvY3VtZW50LmZyb21Kc29uKHBvbGljeURvY3VtZW50SlNPTik7XG5cbiAgICByZXR1cm4gbmV3IGlhbS5Qb2xpY3koc2NvcGUsIGAke3RlbXBsYXRlTmFtZX0gaWRgLCB7XG4gICAgICBwb2xpY3lOYW1lOiB0ZW1wbGF0ZU5hbWUsXG4gICAgICBkb2N1bWVudDogcG9saWN5RG9jdW1lbnQsXG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQ3JlYXRlcyBNTCBBY3Rpdml0eSBzZXJ2aWNlIHByaW5jaXBhbCB1c2luZyBNTCBBY3Rpdml0eSB0cnVzdCB0ZW1wbGF0ZVxuICAgKiBAcmV0dXJucyAtIFRoZSBzZXJ2aWNlIHByaW5jaXBhbCBvZiB0aGUgTUwgQWN0aXZpdHlcbiAgICovXG4gIHB1YmxpYyBjcmVhdGVQcmluY2lwYWwoKTogaWFtLlNlcnZpY2VQcmluY2lwYWwge1xuICAgIGNvbnN0IHRlbXBsYXRlRmlsZSA9IGdldFRlbXBsYXRlRmlsZSh0aGlzLmFjdGl2aXR5TmFtZSwgdGhpcy52ZXJzaW9uLCB0aGlzLmlzVlBDQ3VzdG9taXplZCwgdGhpcy5pc0tNU0N1c3RvbWl6ZWQpO1xuICAgIGNvbnN0IHRlbXBsYXRlQXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeSh0ZW1wbGF0ZUZpbGUudHJ1c3RUZW1wbGF0ZUpzb24pO1xuXG4gICAgLy8gUmVwbGFjZSBzaW5nbGVWYWx1ZVJlcGxhY2VtZW50cyBhbmQgbXVsdGlWYWx1ZVJlcGxhY2VtZW50cyBpbiB0ZW1wbGF0ZURvY3VtZW50XG4gICAgY29uc3QgcG9saWN5RG9jdW1lbnRKU09OID0gSlNPTi5wYXJzZShyZXBsYWNlUGF0dGVybnModGVtcGxhdGVBc1N0cmluZywgdGhpcy5zaW5nbGVWYWx1ZVJlcGxhY2VtZW50cywgdGhpcy5tdWx0aVZhbHVlUmVwbGFjZW1lbnRzKSk7XG4gICAgY29uc3QgcG9saWN5RG9jdW1lbnRTdGF0ZW1lbnQgPSBwb2xpY3lEb2N1bWVudEpTT04uU3RhdGVtZW50WzBdO1xuXG4gICAgcmV0dXJuIG5ldyBpYW0uU2VydmljZVByaW5jaXBhbChwb2xpY3lEb2N1bWVudFN0YXRlbWVudC5QcmluY2lwYWwuU2VydmljZSwge1xuICAgICAgY29uZGl0aW9uczogcG9saWN5RG9jdW1lbnRTdGF0ZW1lbnQuQ29uZGl0aW9uLFxuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEdyYW50IHBlcm1pc3Npb25zIG9mIGFjdGl2aXR5IHRvIGlkZW50aXR5XG4gICAqIEBwYXJhbSBpZGVudGl0eSBpZGVudGl0eSB0byBiZSBncmFudGVkIHBlcm1pc3Npb25zXG4gICAqIEByZXR1cm5zIC0gVGhlIGdyYW50IHdpdGggdGhlIHBlcm1pc3Npb25zIGdyYW50ZWQgdG8gdGhlIGlkZW50aXR5XG4gICAqL1xuICBwdWJsaWMgZ3JhbnRQZXJtaXNzaW9uc1RvKGlkZW50aXR5OiBpYW0uSUdyYW50YWJsZSk6IGlhbS5HcmFudCB7XG4gICAgY29uc3QgdGVtcGxhdGVGaWxlID0gZ2V0VGVtcGxhdGVGaWxlKHRoaXMuYWN0aXZpdHlOYW1lLCB0aGlzLnZlcnNpb24sIHRoaXMuaXNWUENDdXN0b21pemVkLCB0aGlzLmlzS01TQ3VzdG9taXplZCk7XG4gICAgY29uc3QgdGVtcGxhdGVBc1N0cmluZyA9IEpTT04uc3RyaW5naWZ5KHRlbXBsYXRlRmlsZS50ZW1wbGF0ZUpzb24pO1xuXG4gICAgLy8gUmVwbGFjZSBzaW5nbGVWYWx1ZVJlcGxhY2VtZW50cyBhbmQgbXVsdGlWYWx1ZVJlcGxhY2VtZW50cyBpbiB0ZW1wbGF0ZURvY3VtZW50XG4gICAgbGV0IHBvbGljeURvY3VtZW50SlNPTiA9IEpTT04ucGFyc2UocmVwbGFjZVBhdHRlcm5zKHRlbXBsYXRlQXNTdHJpbmcsIHRoaXMuc2luZ2xlVmFsdWVSZXBsYWNlbWVudHMsIHRoaXMubXVsdGlWYWx1ZVJlcGxhY2VtZW50cykpO1xuXG4gICAgbGV0IGdyYW50ID0gaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKEFjdGl2aXR5LmdldEdyYW50T3B0aW9ucyhpZGVudGl0eSwgcG9saWN5RG9jdW1lbnRKU09OLlN0YXRlbWVudFswXSkpO1xuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2xpY3lEb2N1bWVudEpTT04uU3RhdGVtZW50Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBncmFudCA9IGdyYW50LmNvbWJpbmUoaWFtLkdyYW50LmFkZFRvUHJpbmNpcGFsKEFjdGl2aXR5LmdldEdyYW50T3B0aW9ucyhpZGVudGl0eSwgcG9saWN5RG9jdW1lbnRKU09OLlN0YXRlbWVudFtpXSkpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZ3JhbnQ7XG4gIH1cblxuICBwdWJsaWMgY3VzdG9taXplVlBDKHN1Ym5ldHM/OiBlYzIuSVN1Ym5ldFtdLCBzZWN1cml0eUdyb3Vwcz86IGVjMi5JU2VjdXJpdHlHcm91cFtdKSB7XG4gICAgaWYgKCF0aGlzLmlzQ3VzdG9taXphdGlvbkF2YWlsYWJsZUZvclZQQyB8fCAoIXN1Ym5ldHMgJiYgIXNlY3VyaXR5R3JvdXBzKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghc3VibmV0cyB8fCAhc3VibmV0cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignVGhlIGFycmF5IHN1Ym5ldHMgbXVzdCBiZSBvZiB0eXBlIGVjMi5JU3VibmV0W10gd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudC4nKTtcbiAgICB9XG4gICAgaWYgKCFzZWN1cml0eUdyb3VwcyB8fCAhc2VjdXJpdHlHcm91cHMubGVuZ3RoKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1RoZSBhcnJheSBzZWN1cml0eUdyb3VwcyBtdXN0IGJlIG9mIHR5cGUgZWMyLklTZWN1cml0eUdyb3VwW10gd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpVmFsdWVSZXBsYWNlbWVudHMuc2V0KEFjdGl2aXR5LlNVQk5FVFNfUEFSQU1FVEVSX05BTUUsIHN1Ym5ldHMubWFwKChzdWJuZXQpID0+IHN1Ym5ldC5zdWJuZXRJZCkpO1xuICAgIHRoaXMubXVsdGlWYWx1ZVJlcGxhY2VtZW50cy5zZXQoQWN0aXZpdHkuU0VDVVJJVFlfR1JPVVBTX1BBUkFNRVRFUl9OQU1FLCBzZWN1cml0eUdyb3Vwcy5tYXAoXG4gICAgICAoc2VjdXJpdHlHcm91cCkgPT4gc2VjdXJpdHlHcm91cC5zZWN1cml0eUdyb3VwSWQpKTtcblxuICAgIHRoaXMuaXNWUENDdXN0b21pemVkID0gdHJ1ZTtcbiAgfVxuXG4gIHB1YmxpYyBjdXN0b21pemVLTVMoZGF0YUtleXM/OiBrbXMuSUtleVtdLCB2b2x1bWVLZXlzPzoga21zLklLZXlbXSkge1xuICAgIGlmICghdGhpcy5pc0N1c3RvbWl6YXRpb25BdmFpbGFibGVGb3JLTVMgfHwgKCFkYXRhS2V5cyAmJiAhdm9sdW1lS2V5cykpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIWRhdGFLZXlzIHx8ICFkYXRhS2V5cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignVGhlIGFycmF5IGRhdGFLZXlzIG11c3QgYmUgb2YgdHlwZSBrbXMuSUtleVtdIHdpdGggYXQgbGVhc3Qgb25lIGVsZW1lbnQuJyk7XG4gICAgfVxuICAgIGlmICghdm9sdW1lS2V5cyB8fCAhdm9sdW1lS2V5cy5sZW5ndGgpIHtcbiAgICAgIHRocm93IFR5cGVFcnJvcignVGhlIGFycmF5IHZvbHVtZUtleXMgbXVzdCBiZSBvZiB0eXBlIGttcy5JS2V5W10gd2l0aCBhdCBsZWFzdCBvbmUgZWxlbWVudC4nKTtcbiAgICB9XG5cbiAgICB0aGlzLm11bHRpVmFsdWVSZXBsYWNlbWVudHMuc2V0KEFjdGl2aXR5LkRBVEFfS0VZU19QQVJBTUVURVJfTkFNRSwgZGF0YUtleXMubWFwKChrZXkpID0+IGtleS5rZXlJZCkpO1xuICAgIHRoaXMubXVsdGlWYWx1ZVJlcGxhY2VtZW50cy5zZXQoQWN0aXZpdHkuVk9MVU1FX0tFWVNfUEFSQU1FVEVSX05BTUUsIHZvbHVtZUtleXMubWFwKChrZXkpID0+IGtleS5rZXlJZCkpO1xuXG4gICAgdGhpcy5pc0tNU0N1c3RvbWl6ZWQgPSB0cnVlO1xuICB9XG5cbn1cbiJdfQ==