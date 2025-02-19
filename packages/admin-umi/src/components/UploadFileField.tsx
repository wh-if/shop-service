import { getBase64 } from '@/common/util';
import { uploadFile } from '@/services/upload';
import { UploadOutlined } from '@ant-design/icons';
import { App, Button, Upload, UploadFile, UploadFile as UploadFileType, UploadProps } from 'antd';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  onChange?: (fileList: UploadFileType[]) => void;
  initialList?: string[];
  children?: ReactNode;
  fieldProps?: UploadProps;
};

const UploadFileField: React.FC<Props> = (props) => {
  const { message } = App.useApp();
  const [fileList, setFileList] = useState<UploadFileType[]>([]);

  async function initFileList() {
    for (const i of props.initialList ?? []) {
      fetch('/api' + i)
        .then((r) => r.blob())
        .then(async (r) => {
          const thumbUrl = await getBase64(r);
          setFileList((list) => [
            ...list,
            {
              url: i,
              uid: i,
              thumbUrl,
            } as UploadFile,
          ]);
        });
    }
  }
  useEffect(() => {
    initFileList();
  }, []);

  return (
    <Upload
      {...props.fieldProps}
      fileList={fileList}
      onRemove={(file) => {
        const list = fileList.filter((f) => f.uid !== file.uid);
        setFileList(list);
        if (props.onChange) {
          props.onChange(list);
        }
      }}
      beforeUpload={(file) => {
        const maxCount = props.fieldProps?.maxCount ?? 1;
        if (maxCount > 1 && fileList.length >= maxCount) {
          message.error(`只能上传${props.fieldProps?.maxCount}个文件!`);
          return false;
        }
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('只能上传 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('图片需要小于 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }}
      customRequest={async (options) => {
        const hide = message.loading('正在上传');
        const { data } = await uploadFile(options.file as File);
        const file = options.file as UploadFileType;
        let item: UploadFile = {
          uid: data.path,
          name: file.name,
          url: data.path,
          thumbUrl: await getBase64(options.file as File),
        };
        let list = [...fileList, item];
        if (props.fieldProps?.maxCount === 1 && list.length > 1) {
          list = [item];
        }
        setFileList(list);
        if (props.onChange) {
          props.onChange(list);
        }
        hide();
        message.success('上传成功！');
      }}
    >
      {fileList.length < (props.fieldProps?.maxCount ?? 1) &&
        (props.children || <Button icon={<UploadOutlined />}>上传文件</Button>)}
    </Upload>
  );
};

export default UploadFileField;
