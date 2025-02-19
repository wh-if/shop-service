import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { AppConfig } from '../config';
import { extname } from 'path';
import { AjaxResult } from 'src/common/AjaxResult';
import { Roles } from 'src/guard/role.guard';
import { USER_ROLE } from 'src/common/constant';

@Controller('upload')
export class UploadController {
  @Post()
  @Roles([USER_ROLE.USER])
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: AppConfig.upload.directoryPath,
        filename: (req, file, cb) => {
          // 为上传的文件命名
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return AjaxResult.success('上传成功', {
      originalname: file.originalname,
      filename: file.filename,
      size: file.size,
      mimetype: file.mimetype,
      path: `/static/${file.filename}`,
    });
  }
}
