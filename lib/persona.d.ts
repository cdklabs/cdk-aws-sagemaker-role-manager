import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';
import { Activity, VPCOptions, KMSOptions } from './activity';
export interface PersonaProps extends VPCOptions, KMSOptions {
    readonly activities: Activity[];
}
export declare class Persona extends Construct {
    readonly activities: Activity[];
    constructor(scope: Construct, id: string, props: PersonaProps);
    /**
       * Creates role with permissions of persona
       * @param scope the Construct scope.
       * @param id the resource id.
       * @param roleNameSuffix the name suffix of the role that will be created, if empty the role will have the name of the activity.
       * @param roleDescription the description of the role that will be created.
       * @returns - The role that is created with the permissions of the persona
       */
    createRole(scope: Construct, id: string, roleNameSuffix: string, roleDescription?: string): iam.IRole;
    customizeVPC(subnets?: ec2.ISubnet[], securityGroups?: ec2.ISecurityGroup[]): void;
    customizeKMS(dataKeys?: kms.IKey[], volumeKeys?: kms.IKey[]): void;
    /**
       * Grant permissions of activity to identity
       * @param identity identity to be granted permissions
       * @returns - The grant with the permissions granted to the identity
       */
    grantPermissionsTo(identity: iam.IGrantable): iam.Grant;
}
