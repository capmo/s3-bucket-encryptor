import { CompositePrincipal, Role, ServicePrincipal } from '@aws-cdk/aws-iam';
import { Key } from '@aws-cdk/aws-kms';
import { Code, Function, Runtime } from '@aws-cdk/aws-lambda';
import { Duration } from '@aws-cdk/core';
import { batchReportBucket, inventoryReportBucket } from '../bucket';
import { cfStackParameters } from '../cloud-formation/parameters';
import { region, stack } from '../stack';

const s3KmsKey = Key.fromLookup(stack, 'S3DefaultKMSKey', {
  aliasName: 'alias/aws/s3',
});

export const encryptorControllerRole = new Role(
  stack,
  'EncryptorControllerRole',
  {
    assumedBy: new CompositePrincipal(
      new ServicePrincipal('lambda.amazonaws.com'),
      new ServicePrincipal('batchoperations.s3.amazonaws.com')
    ),
  }
);

export const encryptorController = new Function(stack, 'EncryptorController', {
  code: Code.fromAsset('./src'),
  environment: {
    AddTag: cfStackParameters.AddTagToEncryptedObjects,
    DBName: cfStackParameters.GlueDatabaseName,
    DeploymentRegion: region,
    Encrypt: cfStackParameters.EncryptBuckets,
    IsDefaultS3KMSKey: 'true',
    KmsKey: s3KmsKey.keyId,
    /**
     * The tag key that will be added to each object that is encrypted if the
     * "AddTagToEncryptedObjects" parameter is set to "true". Existing tags on the
     * objects will not be overwritten. If the "AddTagToEncryptedObjects" is set to "no"
     * then this parameter can be ignored.
     */
    ObjectTagKey: '__ObjectEncrypted',
    /**
     * The tag value that will be added to each object that is encrypted if the
     * "AddTagToEncryptedObjects" parameter is set to "true". Existing tags on the
     * objects will not be overwritten. If the "AddTagToEncryptedObjects" is set to "no"
     * then this parameter can be ignored.
     */
    ObjectTagValue: 'no',
    RemoveS3InvConfig: 'true',
    /**
     * Specify the reporting level of S3 Batch job completion reports. If set to "AllTasks",
     * all Batch operations will be reported. If set to "FailedTasksOnly", then only
     * failed Batch operations will be recorded in the reports.
     */
    ReportingLevel: 'FailedTasksOnly',
    RoleArn: encryptorControllerRole.roleArn,
    S3BatchReportsBucket: batchReportBucket.bucketName,
    /**
     * Name for the S3 event that will be triggered when new S3 Inventory
     * report manifest files will be dropped into the inventory reports bucket. This event
     * will trigger a Lambda that launches an S3 Batch job to process the newly completed S3 Inventory report
     * if the "EncryptBuckets" parameter is set to "true". It will also add the new data as a partition
     * in the inventory reports Glue table.
     */
    S3EventIdBatch: 'BatchManifestUploadedEventNotification',
    /**
     * Name for the S3 event that will be triggered when new S3 Inventory
     * report manifest files will be dropped into the inventory reports bucket. This event
     * will trigger a Lambda that launches an S3 Batch job to process the newly completed S3 Inventory report
     * if the "EncryptBuckets" parameter is set to "true". It will also add the new data as a partition
     * in the inventory reports Glue table.
     */
    S3EventIdInv: 'InvManifestUploadedEventNotification',
    S3InvReportsBucket: inventoryReportBucket.bucketName,
    /**
     * Name identifier for the S3 Inventory reports that will be configured for the target buckets.
     */
    S3InventoriesName: 'ObjectEncryptionInventoryReport',
    /**
     * Name of the tag key that specifies which S3 buckets should
     * be targeted for the generation of S3 Inventory reports and optionally encryption.
     * Target S3 buckets must be tagged with the value specified here. Target buckets
     * must be in the same region in which this template is being deployed in order for
     * S3 Inventory to work.
     */
    S3TargetTagKey: '__S3Inventory_EnforceSSE', // TODO Import from cdk-lib
    /**
     * Name of the tag value that specifies which S3 buckets should
     * be targeted for the generation of S3 Inventory reports and optionally encryption.
     * Target S3 buckets must be tagged with the value specified here. Target buckets
     * must be in the same region in which this template is being deployed in order for S3
     * Inventory to work.
     */
    S3TargetTagValue: 'true',
    /**
     * This parameter is only used if the SSEType parameter is set to SSE-KMS. Enter the name of
     * the KMS key id that you want to use to encrypt objects in buckets. An example would be:
     * 1232d31d-g092-986a-jf03-9e9d377d6374. Please note that the key policy for the chosen key will
     * be automatically updated by a Lambda-backed custom resource to allow for S3 to use the key. S3
     * needs to be able to access this key in order to encrypt delivered S3 Inventory reports properly.
     */
    SSEType: cfStackParameters.SSEType,
    TBLNameBatch: cfStackParameters.GlueTableNameS3Batch,
    TBLNameInv: cfStackParameters.GlueTableNameS3Inventory,
  },
  functionName: `${stack.stackName}-encryptorController`,
  handler: 'encryptor-controller.handler',
  logRetention: 7,
  memorySize: 128,
  role: encryptorControllerRole,
  runtime: Runtime.PYTHON_3_7,
  timeout: Duration.seconds(900),
});
