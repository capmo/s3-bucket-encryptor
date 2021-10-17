# s3-bucket-encryptor

A CloudFormation stack used to encrypt existing non-encrypted S3 objects of selected buckets. The code in this repo is heavily inspired by the AWS security blog post [How to retroactively encrypt existing objects in Amazon S3 using S3 Inventory, Amazon Athena, and S3 Batch Operations](https://aws.amazon.com/blogs/security/how-to-retroactively-encrypt-existing-objects-in-amazon-s3-using-s3-inventory-amazon-athena-and-s3-batch-operations/).

## Preparations

This repository uses npm packges from the Capmo Github registry. Make sure to set the auth token before installing packages.

```
export GITHUB_REGISTRY_AUTH_CONTEXT=<get-it-from-dashlane>
```

## Deployment

The project is deployed via circleCI (`staging` and `prod` environment). The `dev` environment can be deployed from your local environment:

```
export AWS_PROFILE=capmo-dev
npm run deploy 
```

