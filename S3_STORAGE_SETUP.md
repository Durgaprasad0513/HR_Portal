# Private Amazon S3 storage for Render

Selected storage provider: Amazon S3. Neon remains the database. The backend uses
the AWS SDK to write `uploads/<filename>` and proxy authorized downloads, keeping
existing portal URLs and role/ownership checks. Never make the bucket public.

## AWS setup

1. The account owner signs in and reviews any account or billing terms. S3 is usage
   billed; do not assume permanent free storage. Configure AWS billing alerts.
2. Create a dedicated general-purpose bucket in the chosen region. Keep all four
   Block Public Access settings enabled, Object Ownership set to Bucket owner
   enforced (ACLs disabled), and default encryption enabled. No browser CORS rules
   are needed because uploads and downloads go through the backend.
3. Give the backend a dedicated IAM principal restricted to this bucket's upload
   prefix. Do not use root credentials or AdministratorAccess. The normal runtime
   only needs this policy (replace BUCKET_NAME):

   ```json
   {
     "Version": "2012-10-17",
     "Statement": [{
       "Effect": "Allow",
       "Action": ["s3:GetObject", "s3:PutObject"],
       "Resource": "arn:aws:s3:::BUCKET_NAME/uploads/*"
     }]
   }
   ```

   If selecting a customer-managed KMS key, separate KMS permissions are required;
   this baseline uses S3-managed encryption. IAM credential creation requires the
   account owner's confirmation. AWS-hosted deployments can use a workload role;
   Render needs securely configured AWS credentials or a separately arranged
   short-lived credential mechanism.
4. Enter configuration directly into Render's backend environment, never chat,
   Git, screenshots or frontend VITE variables:

   ```text
   STORAGE_PROVIDER=s3
   S3_BUCKET=<private bucket name>
   AWS_REGION=<bucket region>
   AWS_ACCESS_KEY_ID=<dedicated IAM access key>
   AWS_SECRET_ACCESS_KEY=<dedicated IAM secret>
   ```

   Set AWS_SESSION_TOKEN only for temporary credentials, and arrange renewal before
   expiration. Existing R2 variables are unused when selecting s3.

## Verification and migration

First test a staging backend with synthetic receipts, employee documents and
profile photos. Check owner/staff access, denied access from other employees,
direct public bucket denial, and error responses when storage is unavailable.
The code never falls back to temporary disk after a storage error.

Before restarting the existing Render service, preserve surviving local upload
files. With explicit authorization for transferring HR files to the selected
private bucket, copy them to `uploads/<existing filename>` and verify counts and
SHA-256 checksums. Keep database attachment URLs stable. Legacy absolute document
paths from another host need reconciliation in staging. Files above 10 MiB need
review because upload and download limits are 10 MiB.

Metadata deletion does not delete object bytes. Define retention, backup and
orphan-file cleanup separately. Malware scanning is not implemented. Follow
RENDER_RELEASE_CHECKLIST.md for Neon migrations, CORS and email configuration
before release. Account, bucket, credential and live file round-trip verification
are still required; local mocked SDK tests do not establish production readiness.

References:
[Block Public Access](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html),
[encryption](https://docs.aws.amazon.com/AmazonS3/latest/userguide/default-bucket-encryption.html),
[pricing](https://aws.amazon.com/s3/pricing/).
