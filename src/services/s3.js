import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const endpoint = import.meta.env.VITE_S3_ENDPOINT;
const region = import.meta.env.VITE_S3_REGION;
const bucket = import.meta.env.VITE_S3_BUCKET;

const s3 = new S3Client({
  endpoint,
  region,
  credentials: {
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
  requestChecksumCalculation: 'WHEN_REQUIRED',
  responseChecksumValidation: 'WHEN_REQUIRED',
});

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;

function publicUrlFor(key) {
  const base = endpoint.replace(/\/+$/, '');
  const encodedKey = encodeURIComponent(key).replace(/%2F/g, '/');
  return `${base}/${bucket}/${encodedKey}`;
}

export async function fetchGalleryImages() {
  const out = await s3.send(
    new ListObjectsV2Command({ Bucket: bucket, MaxKeys: 1000 }),
  );
  const contents = out.Contents || [];
  return contents
    .filter((obj) => obj.Key && IMAGE_EXT.test(obj.Key))
    .sort((a, b) => (b.LastModified?.getTime() ?? 0) - (a.LastModified?.getTime() ?? 0))
    .map((obj) => ({
      key: obj.Key,
      url: publicUrlFor(obj.Key),
      lastModified: obj.LastModified,
      size: obj.Size,
    }));
}

export async function uploadImageToS3(file) {
  const key = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
  const body = new Uint8Array(await file.arrayBuffer());
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
      ContentLength: body.byteLength,
    }),
  );
  return { key, url: publicUrlFor(key) };
}
