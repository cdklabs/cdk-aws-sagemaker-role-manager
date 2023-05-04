const { awscdk } = require('projen');
const project = new awscdk.AwsCdkConstructLibrary({
  author: 'Nikolas Papastavrou',
  authorAddress: 'npapasta@amazon.com',
  cdkVersion: '2.67.0',
  defaultReleaseBranch: 'main',
  npmDistTag: 'latest',
  name: 'cdk-aws-sagemaker-role-manager',
  description: 'Create roles and policies for ML Activities and ML Personas',
  repositoryUrl: 'https://github.com/cdklabs/cdk-aws-sagemaker-role-manager',

  peerDependencies: [
    'aws-cdk-lib',
  ],
  devDeps: [
    'aws-sdk',
  ],
  packageName: 'cdk-aws-sagemaker-role-manager',

  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',
  autoApproveOptions: {
    allowedUsernames: ['cdklabs-automation', 'dontirun'],
    secret: 'GITHUB_TOKEN',
  },
  autoApproveUpgrades: true,
  depsUpgradeOptions: {
    ignoreProjen: false,
    workflowOptions: {
      labels: ['auto-approve'],
      secret: 'PROJEN_GITHUB_TOKEN',
    },
  },
  eslintOptions: { prettier: true },
  buildWorkflow: true,
  release: true,
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

project.gitignore.exclude('.env', '.idea/**', '.DS_Store', 'build');

project.synth();
