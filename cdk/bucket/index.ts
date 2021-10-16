import { RemovalPolicy } from "@aws-cdk/aws-cloudwatch/node_modules/@aws-cdk/core";
import { SecureBucket } from '@capmo/cdk-lib/lib/s3';
import { stack } from "../stack";


export const inventoryReportBucket = new SecureBucket(stack, 'InventoryReportBucket', {
  removalPolicy: RemovalPolicy.RETAIN,
});

export const batchReportBucket = new SecureBucket(stack, 'S3BatchReportsDestinationBucket', {
  removalPolicy: RemovalPolicy.RETAIN,
});
