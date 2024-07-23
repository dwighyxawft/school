import { Injectable, Inject } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  constructor(@Inject('FIREBASE_ADMIN') private readonly firebaseAdmin: admin.app.App) {}

  async uploadFile(filePath: string, destination: string): Promise<string> {
    const bucket = this.firebaseAdmin.storage().bucket();
    await bucket.upload(filePath, { destination });
    return `https://storage.googleapis.com/${bucket.name}/${destination}`;
  }
}
