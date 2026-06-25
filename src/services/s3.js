import {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
} from '@aws-sdk/client-s3';

const region = import.meta.env.VITE_AWS_REGION;
const bucket = import.meta.env.VITE_AWS_S3_BUCKET;

const s3 = new S3Client({
  region,
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
  },
});

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif|bmp)$/i;

function publicUrlFor(key) {
  return `https://${bucket}.s3.${region}.amazonaws.com/${encodeURIComponent(key).replace(/%2F/g, '/')}`;
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
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: file.type || 'application/octet-stream',
    }),
  );
  return { key, url: publicUrlFor(key) };
}
