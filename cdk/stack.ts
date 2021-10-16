import * as cdk from "@aws-cdk/core";
import { name } from '../package.json';

export class CloudStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
  }
}

export const {
  account = process.env.CDK_DEFAULT_ACCOUNT,
  environment = "dev",
  region = "eu-central-1",
  stage = 'dev',
} = process.env.CDK_CONTEXT_JSON
  ? JSON.parse(process.env.CDK_CONTEXT_JSON)
  : {};

const app = new cdk.App();
export const stack = new CloudStack(app, "s3-bucket-encryptor", { 
  env: { region, account }, 
  stackName: name + (stage === 'prod' ? '' : `-${stage}`), 
});
