import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as kms from 'aws-cdk-lib/aws-kms';
import { Construct } from 'constructs';

import {
  Activity,
  VPCOptions,
  KMSOptions,
} from './activity';

export interface PersonaProps extends VPCOptions, KMSOptions {
  readonly activities: Activity[];
}

export class Persona extends Construct {

  public readonly activities: Activity[];

  public constructor(scope: Construct, id: string, props: PersonaProps) {
    super(scope, id);

    if (props.activities.length === 0) {
      throw TypeError('The array activities must be of type Activity[] with at least one element.');
    }

    this.activities = props.activities;

    const activityNames = this.activities.map((activity) => {return activity.activityName;});
    if (activityNames.length !== new Set(activityNames).size) {
      throw TypeError('The array activities must be of type Activity[] and must not contain duplicate activities.');
    }

    this.customizeVPC(props.subnets, props.securityGroups);
    this.customizeKMS(props.dataKeys, props.volumeKeys);
  }

  /**
     * Creates role with permissions of persona
     * @param scope the Construct scope.
     * @param id the resource id.
     * @param roleName the name of the role that will be created, if empty the role will have the name of the activity.
     * @param roleDescription the description of the role that will be created.
     * @returns - The role that is created with the permissions of the persona
     */
  public createRole(scope: Construct, id: string, roleName: string, roleDescription: string = ''): iam.IRole {
    if (!roleName || !roleName.length) {
      throw TypeError('The role name should be a non empty string');
    }

    const policies = [];

    for (const activity of this.activities) {
      policies.push(activity.createPolicy(scope));
    }

    const role = new iam.Role(scope, id, {
      roleName: roleName,
      description: roleDescription,
      assumedBy: this.activities[0].createPrincipal(),
    });

    for (const policy of policies) {
      role.attachInlinePolicy(policy);
    }

    return role;
  }

  public customizeVPC(subnets?: ec2.ISubnet[], securityGroups?: ec2.ISecurityGroup[]) {
    if (!subnets && !securityGroups) {
      return;
    }

    if (!subnets || !subnets.length) {
      throw TypeError('The array subnets must be of type ec2.ISubnet[] with at least one element.');
    }
    if (!securityGroups || !securityGroups.length) {
      throw TypeError('The array securityGroups must be of type ec2.ISecurityGroup[] with at least one element.');
    }

    for (const activity of this.activities) {
      activity.customizeVPC(subnets, securityGroups);
    }
  }

  public customizeKMS(dataKeys?: kms.IKey[], volumeKeys?: kms.IKey[]) {
    if (!dataKeys && !volumeKeys) {
      return;
    }

    if (!dataKeys || !dataKeys.length) {
      throw TypeError('The array dataKeys must be of type kms.IKey[] with at least one element.');
    }
    if (!volumeKeys || !volumeKeys.length) {
      throw TypeError('The array volumeKeys must be of type kms.IKey[] with at least one element.');
    }

    for (const activity of this.activities) {
      activity.customizeKMS(dataKeys, volumeKeys);
    }
  }

  /**
     * Grant permissions of activity to identity
     * @param identity identity to be granted permissions
     * @returns - The grant with the permissions granted to the identity
     */
  public grantPermissionsTo(identity: iam.IGrantable): iam.Grant {
    let grant = this.activities[0].grantPermissionsTo(identity);
    for (let i = 1; i < this.activities.length; i++) {
      grant = grant.combine(this.activities[i].grantPermissionsTo(identity));
    }

    return grant;
  }

}
