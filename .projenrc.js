const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Nikolas Papastavrou',
  authorAddress: 'npapasta@amazon.com',
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-aws-sagemaker-role-manager',
  repositoryUrl: 'https://github.com/cdklabs/cdk-aws-sagemaker-role-manager',

  peerDependencies: [
    'aws-cdk-lib',
  ],
  devDeps: [
    'aws-sdk',
  ],
  publishToMaven: {
    javaPackage: 'io.github.cdklabs.cdk-aws-sagemaker-role-manager',
    mavenGroupId: 'io.github.cdklabs',
    mavenArtifactId: 'cdk-aws-sagemaker-role-manager',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  publishToPypi: {
    distName: 'cdk-aws-sagemaker-role-manager',
    module: 'cdk_aws_sagemaker_role_manager',
  },
  packageName: 'cdk-aws-sagemaker-role-manager',
});

testTask = project.tasks.tryFind('test');
testTask.reset();
testTask.prependExec( "eslint");
testTask.prependExec("jest --passWithNoTests");
testTask.prependSay('Running tests that check for matching snapshots. To update snapshots, run npm run updateSnapshot');

project.tasks.addTask('updateSnapshot', {
  exec: 'jest --passWithNoTests --updateSnapshot'
})

project.gitignore.exclude('.env', '.idea/**', '.DS_Store', 'build');

project.synth();
