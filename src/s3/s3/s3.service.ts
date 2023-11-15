// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
//
// @Injectable()
// export class S3Service {
//     constructor (private readonly s3: S3) {
//         const envAccessKey:
//         this.s3 = new S3({
//             credentials: {
//                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                 accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//                 // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                 secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
//             },
//             endpoint: process.env.AWS_ENDPOINT_URL,
//             s3ForcePathStyle: true
//         });
//     }
//
//     async uploadFile (buffer: Buffer, key: string): Promise<string> {
//         try {
//             const result = await this.s3
//                 .upload({
//                     // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//                     Bucket: process.env.AWS_BUCKET_NAME!,
//                     Key: key,
//                     Body: buffer
//                 })
//                 .promise();
//
//             return result.Location;
//         } catch (error) {
//             throw new Error('Error uploading file to Yandex Object Storage');
//         }
//     }
//
//     getFileUrl (key: string): string {
//         return `https://${process.env.YANDEX_S3_BUCKET_NAME!}.${process.env.YANDEX_S3_ENDPOINT!}/${key}`;
//     }
// }
