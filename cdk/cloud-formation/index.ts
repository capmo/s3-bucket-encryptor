import { stack } from '../stack';
import { CfnInclude } from '@aws-cdk/cloudformation-include';
import { encryptorController, encryptorControllerRole } from '../lambda';
import { batchReportBucket, inventoryReportBucket } from '../bucket';
import { cfStackParameters } from './parameters';

export const cfStack = new CfnInclude(stack, 's3-encryptor-cf-stack', {
  parameters: {
    ...cfStackParameters,
    EncryptorControllerLambdaFunctionArn: encryptorController.functionArn,
    EncryptorControllerRoleArn: encryptorControllerRole.roleArn,
    EncryptorControllerRoleName: encryptorControllerRole.roleName,
    S3BatchReportsDestinationBucketArn: batchReportBucket.bucketArn,
    S3BatchReportsDestinationBucketName: batchReportBucket.bucketName,
    S3InventoryReportsDestinationBucketArn: inventoryReportBucket.bucketArn,
    S3InventoryReportsDestinationBucketName: inventoryReportBucket.bucketName,
  },
  templateFile: __dirname + '/template.yml',
});
