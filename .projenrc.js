const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'npapasta',
  authorAddress: 'npapasta@amazon.com',
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  name: 'cdk-aws-sagemaker-role-manager',
  repositoryUrl: 'https://github.com/npapasta/HawkeyeRoleManagerCDKConstructs.git',

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

project.gitignore.exclude('.env', '.idea/**', '.github/**', '.DS_Store', '.mergify.yml', 'API.md', 'build',
    'example/*.js', 'example/*.d.ts');

project.synth();
