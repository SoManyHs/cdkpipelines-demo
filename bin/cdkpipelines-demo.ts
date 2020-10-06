#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { CdkpipelinesDemoStack } from '../lib/cdkpipelines-demo-stack';

const app = new cdk.App();
new CdkpipelinesDemoStack(app, 'CdkpipelinesDemoStack');
