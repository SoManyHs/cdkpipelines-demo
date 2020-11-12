import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipeline_actions from '@aws-cdk/aws-codepipeline-actions';
import { Construct, SecretValue, Stack, StackProps } from '@aws-cdk/core';
import { CdkPipeline, ShellScriptAction, SimpleSynthAction } from "@aws-cdk/pipelines";
import { CdkpipelinesDemoStage } from './cdkpipelines-demo-stage';

/**
 * The stack that defines the application pipeline
 */
export class CdkpipelinesDemoPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',
      cloudAssemblyArtifact,

      // Where the source can be found
      sourceAction: new codepipeline_actions.GitHubSourceAction({
        actionName: 'GitHub',
        branch: 'main',
        output: sourceArtifact,
        oauthToken: SecretValue.secretsManager('SoManyHs/CdkPipelinesDemo'),
        owner: 'SoManyHs',
        repo: 'cdkpipelines-demo',
      }),

       // How it will be built and synthesized
       synthAction: SimpleSynthAction.standardNpmSynth({
         sourceArtifact,
         cloudAssemblyArtifact,

         // We need a build step to compile the TypeScript Fargate Service
         buildCommand: 'npm run build'
       }),
    });

    // This is where we add the application stages
    const preprod = new CdkpipelinesDemoStage(this, 'PreProd', {
      env: { account: '794715269151', region: 'us-east-2' }
    });
    const preprodStage = pipeline.addApplicationStage(preprod);

    preprodStage.addActions(new ShellScriptAction({
      actionName: 'TestService',
      useOutputs: {
        ENDPOINT_URL: pipeline.stackOutput(preprod.urlOutput),
      },
      commands: [
        'curl -Ssf $ENDPOINT_URL',
      ],
    }));

    // pipeline.addApplicationStage(new CdkpipelinesDemoStage(this, 'Staging', {
    //   env: { account: '794715269151', region: 'us-east-2' }
    // }));
  }
}
