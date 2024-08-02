import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import * as path from 'path';
import * as fs from "fs"

@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;

  constructor(private config: ConfigService) {
    const serviceAccountPath = path.resolve(__dirname, '../../../../src/keys/school-9ab47-firebase-adminsdk-1muzm-942eae9f3d.json');
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error(`Service account key file not found at path: ${serviceAccountPath}`);
    }
    // Load the service account key
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: this.config.get<string>('FIREBASE_STORAGE_BUCKET'),
    });
    this.storage = admin.storage();
  }

  getStorageInstance(): admin.storage.Storage {
    return this.storage;
  }
}
