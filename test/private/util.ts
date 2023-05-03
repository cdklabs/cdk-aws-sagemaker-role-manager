import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

/**
 * Replace single element arrays of resources and actions to strings in input template json. We do this because the
 * aws-cdk/iam module converts single element arrays of resources and actions to strings so we must update
 * the templates to follow this convention for the tests.
 * @param templateJson the json object of which we need to convert single element arrays of resources and actions to strings
 * @returns - the json object with strings in the place of single element arrays of resources and actions
 */
export function getFormattedTemplateJson(templateJson: any) {
  let ret: any = JSON.parse(JSON.stringify(templateJson));
  for (let i = 0; i < ret.Statement.length; i++) {
    if (isSingleElementArray(ret.Statement[i].Action)) {
      ret.Statement[i].Action = ret.Statement[i].Action[0];
    }
    if (isSingleElementArray(ret.Statement[i].Resource)) {
      ret.Statement[i].Resource = ret.Statement[i].Resource[0];
    }
  }

  return ret;
}

/**
 * Create role that will be used as a passed role in the tests
 * @param scope the Construct scope in which the passed role will be created
 * @returns - The role that is created that will be used as a passed role in the tests
 */
export function createPassedRole(scope: Construct): iam.Role {

  return new iam.Role(scope, 'passed role id', {
    roleName: 'Test Role',
    description: 'Test Description',
    assumedBy: new iam.ServicePrincipal('sagemaker.amazonaws.com'),
  });
}

/**
 * Create a vpc subnet and a vpc security gorup that will be used in the tests
 * @param scope the Construct scope in which the passed role will be created
 * @returns - An object that has the created vpc subnet and vpc security group
 */
export function createVpcSubnetAndSecurityGroup(scope: Construct) {
  const vpc = ec2.Vpc.fromVpcAttributes(scope, 'VPC', {
    vpcId: 'vpc-1234',
    availabilityZones: ['dummy1a', 'dummy1b', 'dummy1c'],
    publicSubnetIds: ['pub-1', 'pub-2', 'pub-3'],
    publicSubnetRouteTableIds: ['rt-1', 'rt-2', 'rt-3'],
  });
  const subnet = new ec2.PrivateSubnet(scope, 'subnet id', {
    availabilityZone: vpc.availabilityZones[0],
    cidrBlock: '10.0.0.0/28',
    vpcId: vpc.vpcId,
  });
  const securityGroup = new ec2.SecurityGroup(scope, 'security group id', { vpc: vpc });

  return {
    subnet: subnet,
    securityGroup: securityGroup,
  };
}

/**
 * Determiine if the element is a single element array
 * @param element the element to determine if it is a single element array
 * @returns - true if it is a single element array, else false
 */
export function isSingleElementArray(element: any) {
  return Array.isArray(element) && element.length === 1;
}
