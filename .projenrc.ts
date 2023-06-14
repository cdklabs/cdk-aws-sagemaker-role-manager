import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';
import { UpdateSnapshot } from 'projen/lib/javascript';

const project = new CdklabsConstructLibrary({
  author: 'Amazon Web Services',
  authorAddress: 'sagemaker-hawkeye@amazon.com',
  name: '@cdklabs/cdk-aws-sagemaker-role-manager',
  repositoryUrl: 'https://github.com/cdklabs/cdk-aws-sagemaker-role-manager',
  defaultReleaseBranch: 'main',
  description: 'Create roles and policies for ML Activities and ML Personas',
  cdkVersion: '2.83.0',
  minNodeVersion: '16.0.0',
  devDeps: ['cdklabs-projen-project-types', 'aws-sdk'],
  projenrcTs: true,
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
  },
  publishToGo: {
    moduleName: 'github.com/cdklabs/cdk-aws-sagemaker-role-manager-go',
  },
  publishToPypi: {
    distName: 'cdklabs.cdk-aws-sagemaker-role-manager',
    module: 'cdklabs.cdk_aws_sagemaker_role_manager',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.cdklabs',
    javaPackage: 'io.github.cdklabs.cdkawssagemakerrolemanager',
    mavenArtifactId: 'cdk-aws-sagemaker-role-manager',
  },
  publishToNuget: {
    dotNetNamespace: 'Cdklabs.CdkAwsSagemakerRoleManager',
    packageId: 'Cdklabs.CdkAwsSagemakerRoleManager',
  },
});

project.gitignore?.include('assets/templates/*.json');

project.npmignore?.include('assets/templates/*.json');

// disable rossetta so that we can still use 'ts` in markdown without
// deciphering why rosetta complains (for now)
project.tasks.tryFind('rosetta:extract')?.reset('echo skipping');

project.synth();
