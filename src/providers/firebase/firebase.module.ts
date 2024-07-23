import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FirebaseService } from './firebase.service';
import * as data from 'src/keys/school-9ab47-firebase-adminsdk-1muzm-38933a2ada.json';
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [
    FirebaseService,
    {
      provide: 'FIREBASE_ADMIN',
      useFactory: async (config: ConfigService) => {
        return admin.initializeApp({
          credential: admin.credential.cert(data as admin.ServiceAccount),
          storageBucket: config.get<string>("FIREBASE_STORAGE_BUCKET"),
        });
      },
      inject: [ConfigService]
    },
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class FirebaseModule {}
