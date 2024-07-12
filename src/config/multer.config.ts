import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerCourseConfig = {
  storage: diskStorage({
    destination: './src/uploads/images/courses',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

export const multerUserConfig = {
  storage: diskStorage({
    destination: './src/uploads/images/users',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

export const multerInstructorConfig = {
  storage: diskStorage({
    destination: './src/uploads/images/instructors',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};

export const multerAdminConfig = {
  storage: diskStorage({
    destination: './src/uploads/images/admins',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 10);
      cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
};
