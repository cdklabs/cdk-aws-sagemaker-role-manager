import { CdklabsConstructLibrary } from 'cdklabs-projen-project-types';

const project = new CdklabsConstructLibrary({
  author: 'Amazon Web Services',
  authorAddress: 'aws-cdk-dev@amazon.com',
  name: 'cdk-aws-sagemaker-role-manager',
  packageName: 'cdk-aws-sagemaker-role-manager',
  repositoryUrl: 'https://github.com/cdklabs/cdk-aws-sagemaker-role-manager',
  defaultReleaseBranch: "main",
  description: "Create roles and policies for ML Activities and ML Personas",
  cdkVersion: '2.67.0',
  minNodeVersion: '16.0.0',
  devDeps: ['cdklabs-projen-project-types', 'aws-sdk', 'aws-cdk-lib'],
  peerDeps: ['aws-cdk-lib'],
  projenrcTs: true,
});

const testTask = project.tasks?.tryFind('test');
testTask?.reset();
testTask?.prependExec( "eslint");
testTask?.prependExec("jest --passWithNoTests");
testTask?.prependSay('Running tests that check for matching snapshots. To update snapshots, run npm run updateSnapshot');

project.tasks?.addTask('updateSnapshot', {
  exec: 'jest --passWithNoTests --updateSnapshot'
})

project.gitignore?.include('assets/templates/*.json');

project.npmignore?.include('assets/templates/*.json');

project.synth();
