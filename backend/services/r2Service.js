/**
 * Cloudflare R2 storage helper (S3-compatible).
 *
 * Used by the Topic Summaries feature to store and stream private slide-deck
 * page images. Credentials come from env (see backend/.env):
 *   R2_ENDPOINT          e.g. https://<account>.r2.cloudflarestorage.com
 *   R2_BUCKET            e.g. sqb
 *   R2_ACCESS_KEY_ID     R2 API token access key
 *   R2_SECRET_ACCESS_KEY R2 API token secret
 *
 * Nothing here throws at import time — if R2 is not configured the feature
 * degrades gracefully (page endpoints return 503) so the rest of the API keeps
 * working, mirroring how the payment module is gated behind a flag.
 */
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';

export const R2_BUCKET = process.env.R2_BUCKET || 'sqb';

// Normalize the endpoint: the Cloudflare dashboard shows the "S3 API" URL with
// the bucket already appended (".../sqb"). The AWS SDK wants the *account*
// endpoint plus a separate Bucket, so strip a trailing "/<bucket>" or slash.
function normalizeEndpoint(raw) {
    let endpoint = (raw || '').trim().replace(/\/+$/, '');
    if (R2_BUCKET && endpoint.endsWith('/' + R2_BUCKET)) {
        endpoint = endpoint.slice(0, -(R2_BUCKET.length + 1));
    }
    return endpoint;
}

const R2_ENDPOINT = normalizeEndpoint(process.env.R2_ENDPOINT);
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;

export const isR2Configured = () =>
    Boolean(R2_ENDPOINT && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY);

let _client = null;
function getClient() {
    if (!isR2Configured()) {
        throw new Error(
            'R2 not configured — set R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY'
        );
    }
    if (!_client) {
        _client = new S3Client({
            region: 'auto',
            endpoint: R2_ENDPOINT,
            forcePathStyle: true,
            credentials: {
                accessKeyId: R2_ACCESS_KEY_ID,
                secretAccessKey: R2_SECRET_ACCESS_KEY,
            },
        });
    }
    return _client;
}

/**
 * Fetch an object. Returns the raw SDK response; `.Body` is a Node Readable
 * stream that can be piped straight to an Express response.
 */
export async function getObject(key) {
    return getClient().send(
        new GetObjectCommand({ Bucket: R2_BUCKET, Key: key })
    );
}

/** Upload an object (used by the one-time upload script). */
export async function putObject(key, body, contentType) {
    await getClient().send(
        new PutObjectCommand({
            Bucket: R2_BUCKET,
            Key: key,
            Body: body,
            ContentType: contentType,
        })
    );
    return key;
}
