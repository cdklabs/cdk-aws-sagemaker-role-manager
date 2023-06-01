const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Nikolas Papastavrou',
  authorAddress: 'npapasta@amazon.com',
  cdkVersion: '2.81.0',
  defaultReleaseBranch: 'main',
  npmDistTag: 'latest',
  name: 'cdk-aws-sagemaker-role-manager',
  description: "Create roles and policies for ML Activities and ML Personas",
  repositoryUrl: 'https://github.com/cdklabs/cdk-aws-sagemaker-role-manager',
  publishToPypi: {
    distName: 'cdk-aws-sagemaker-role-manager',
    module: 'cdk_aws_sagemaker_role_manager',
  },
  publishToMaven: {
    mavenGroupId: 'io.github.cdklabs',
    javaPackage: 'io.github.cdklabs.aws.sagemaker.role.manager',
    mavenArtifactId: 'cdk-aws-sagemaker-role-manager',
    mavenEndpoint: 'https://s01.oss.sonatype.org',
  },
  peerDependencies: [
    'aws-cdk-lib',
  ],
  devDeps: [
    'aws-sdk',
  ],
  packageName: 'cdk-aws-sagemaker-role-manager',

  tsconfig: {
    resolveJsonModule: true,
  }
});

project.package.addField('prettier', {
  singleQuote: true,
  semi: true,
  trailingComma: 'es5',
});

project.eslint.addRules({
  'prettier/prettier': [
    'error',
    { singleQuote: true, semi: true, trailingComma: 'es5' },
  ],
});
project.tasks.tryFind('eslint').prependExec('npx prettier --write RULES.md');

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

project.gitignore.include('lib', 'conf/templates/*.json');

project.npmignore.include('conf/templates/*.json');

project.synth();
