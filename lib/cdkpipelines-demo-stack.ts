import * as ecs from '@aws-cdk/aws-ecs';
import ecs_patterns = require('@aws-cdk/aws-ecs-patterns');

import { CfnOutput, Construct, Stack, StackProps } from '@aws-cdk/core';
import * as path from 'path';

/**
 * A stack for our simple Application Load Balanced Fargate Service
 */
export class CdkpipelinesDemoStack extends Stack {
  /**
   * The DNS endpoint of the LoadBalancer
   */
  public readonly urlOutput: CfnOutput;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Instantiate Fargate Service with just cluster and image
    const service = new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      memoryLimitMiB: 1024,
      cpu: 512,
      taskImageOptions: {
        image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
      },
    });

    this.urlOutput = new CfnOutput(this, 'Url', {
      value: service.loadBalancer.loadBalancerDnsName,
    });
  }
}
