import { RemovalPolicy } from '@aws-cdk/aws-cloudwatch/node_modules/@aws-cdk/core';
import { BlockPublicAccess, Bucket } from '@aws-cdk/aws-s3';
import { stack } from '../stack';

export const inventoryReportBucket = new Bucket(
  stack,
  'InventoryReportBucket',
  {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    removalPolicy: RemovalPolicy.RETAIN,
  }
);

export const batchReportBucket = new Bucket(
  stack,
  'S3BatchReportsDestinationBucket',
  {
    blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    removalPolicy: RemovalPolicy.RETAIN,
  }
);
