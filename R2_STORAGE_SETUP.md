# Private file storage for Render

Neon continues to hold database records. Cloudflare R2 holds uploaded file bytes.
The portal backend proxies downloads after its existing role and ownership checks.
Receipt, policy and employee document URLs remain stable; no bucket URLs or tokens
are sent to the frontend. Only referenced profile images are publicly served by the
portal. New profile uploads accept PNG, JPEG, GIF and WebP signatures, not SVG/HTML.

## Account setup

1. Enable R2 in your Cloudflare account. The account owner must review and accept
   any billing terms or payment setup. Free allowances do not impose a hard spending cap.
2. Create a dedicated bucket, for example `pafpl-hr-private`. Leave public access,
   r2.dev and custom public domains disabled. Do not enable browser CORS: the portal
   backend makes the storage requests.
3. Create an R2 S3 credential with Object Read & Write permission restricted to this
   bucket. Do not grant account administration or access to unrelated buckets.
4. Enter these secrets directly into Render's backend environment, not chat, Git or
   client VITE settings:

   ```text
   STORAGE_PROVIDER=r2
   R2_ACCOUNT_ID=<Cloudflare account ID>
   R2_BUCKET=pafpl-hr-private
   R2_ACCESS_KEY_ID=<scoped credential ID>
   R2_SECRET_ACCESS_KEY=<scoped credential secret>
   ```

5. Configure a staging backend first. Test synthetic uploads, authenticated owner
   and staff downloads, denied access from other employees, profile images, and
   provider failures. The configured R2 backend never falls back to local disk.

## Existing uploads and release

Before restarting the old Render service, preserve any surviving `server/uploads`
files. Copy them to the private bucket with keys `uploads/<existing filename>`.
Verify file counts and SHA-256 checksums, and reconcile database references with
files. Obtain explicit authorization for transferring real HR files to the bucket.
Do not change attachment URLs or document paths merely to add a bucket URL.
Existing relative `uploads/<filename>` paths and paths within the configured local
upload directory are supported. Legacy absolute paths from another host must be
reconciled on a staging copy before release.

Uploads are limited to 10 MiB per file and ten files per generic upload. Authorized
downloads are bounded to the same size. Old files larger than this need review.
Database metadata deletion does not delete stored bytes; retention and orphan-file
cleanup require a separate reviewed policy. Malware scanning is not implemented.

R2 setup does not repair Neon schema drift or configure email delivery. Follow
[the release checklist](RENDER_RELEASE_CHECKLIST.md) before deploying production.

References: [Cloudflare SDK configuration](https://developers.cloudflare.com/r2/examples/aws/aws-sdk-js-v3/),
[R2 credentials](https://developers.cloudflare.com/r2/api/tokens/),
[pricing](https://developers.cloudflare.com/r2/pricing/).
