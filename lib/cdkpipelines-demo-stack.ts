import ec2 = require('@aws-cdk/aws-ec2');
import ecs = require('@aws-cdk/aws-ecs');
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';

/**
 * A stack for our simple Lambda-powered web service
 */
export class CdkpipelinesDemoStack extends Stack {
  /**
   * The URL of the API Gateway endpoint, for use in the integ tests
   */
  // public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    const vpc = new ec2.Vpc(this, 'MyVpc', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'Cluster', { vpc });

    // Instantiate Fargate Service with just cluster and image
    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample"),
      },
    });


    // The Lambda function that contains the functionality
    // const handler = new lambda.Function(this, 'Lambda', {
    //   runtime: lambda.Runtime.NODEJS_12_X,
    //   handler: 'handler.handler',
    //   code: lambda.Code.fromAsset(path.resolve(__dirname, 'lambda')),
    // });

    // An API Gateway to make the Lambda web-accessible
    // const gw = new apigw.LambdaRestApi(this, 'Gateway', {
    //   description: 'Endpoint for a simple Lambda-powered web service',
    //   handler,
    // });

    // this.urlOutput = new CfnOutput(this, 'Url', {
    //   value: gw.url,
    // });
  }
}
