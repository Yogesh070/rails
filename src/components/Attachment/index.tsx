import React, {useState} from 'react';
import type {UploadFile, UploadProps} from 'antd';
import {Button, message, Modal, Upload} from 'antd';

import {LinkOutlined, InboxOutlined} from '@ant-design/icons';

import {storage} from '../../../firebase.config';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import {api} from '../../utils/api';
import { useRouter } from 'next/router';
import { useProjectStore } from '../../store/project.store';

const {Dragger} = Upload;

interface AttachmentProps {
  issueId: string;
  workflowId: string;
}

const Attachment = (props: AttachmentProps) => {

  const router = useRouter();
  const projectId = router.query.projectId as string;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: true,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
      strokeWidth: 3,
      format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);

      return false;
    },
    fileList,
  };

  const addAttachment= useProjectStore(state=>state.addAttachmentToIssue)

  const {mutate: addAttachmentToIssue} =
    api.issue.addAttachmentToIssue.useMutation({
      onSuccess: (data) => {
        addAttachment(props.workflowId, props.issueId, data);
      }
    });
    

  const handleUpload = () => {
    fileList.forEach((file) => {
      const storageRef = ref(storage, `${projectId}/${props.issueId}/${file.name}`);
      const uploadTask = uploadBytesResumable(
        storageRef,
        file.originFileObj as Blob
      );

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.error(error);
          message.error('upload failed.');
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          setFileList([]);
          setUploading(false);
          message.success('upload successfully.');
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            addAttachmentToIssue({
              issueId: props.issueId,
              url: downloadURL,
              displayName: file.name,
            });
          });
        }
      );
    });
    setUploading(true);
  };

  return (
    <>
      <Button type="default" icon={<LinkOutlined />} onClick={showModal}>
        Attach
      </Button>
      <Modal
        title="Attach a file"
        footer={
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{marginTop: 16}}
          >
            {uploading ? 'Uploading' : 'Start Upload'}
          </Button>
        }
        closable={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Dragger {...uploadProps} className="m-0">
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag file to this area to upload
          </p>
          <p>Attach a file from your computer </p>
        </Dragger>
      </Modal>
    </>
  );
};

export default Attachment;
