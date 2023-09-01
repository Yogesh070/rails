import React, {useState} from 'react';
import {Button, Input, message, Modal, Progress} from 'antd';

import {LinkOutlined} from '@ant-design/icons';

import {storage} from '../../../firebase.config';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import {api} from '../../utils/api';
import {useRouter} from 'next/router';
import {useProjectStore} from '../../store/project.store';

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

  const [imageFile, setImageFile] = useState<File>();
  const [isUploading, setIsUploading] = useState(false);
  const [progressUpload, setProgressUpload] = useState(0);

  const addAttachment = useProjectStore((state) => state.addAttachmentToIssue);

  const {mutate: addAttachmentToIssue} =
    api.issue.addAttachmentToIssue.useMutation({
      onSuccess: (data) => {
        addAttachment(props.workflowId, props.issueId, data);
      },
    });

  const handleSelectedFile = (files: any) => {
    if (files && files[0].size < 10000000) {
      setImageFile(files[0]);

      console.log(files[0]);
    } else {
      message.error('File size to large');
    }
  };

  const handleUploadFile = () => {
    if (imageFile) {
      const fileName = imageFile.name;
      const storageRef = ref(
        storage,
        `${projectId}/${props.issueId}/${fileName}`
      );
      const uploadTask = uploadBytesResumable(storageRef, imageFile);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress); // to show progress upload

          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
          }
        },
        (error) => {
          message.error(error.message);
        },
        () => {
          setProgressUpload(0);
          setIsUploading(false);
          message.success('File uploaded successfully');
          handleOk();
          getDownloadURL(uploadTask.snapshot.ref).then((url) => {
            addAttachmentToIssue({
              issueId: props.issueId,
              url: url,
              displayName: fileName,
            });
          });
        }
      );
    } else {
      message.error('File not found');
    }
  };

  return (
    <>
      <Button type="default" icon={<LinkOutlined />} onClick={showModal}>
        Attach
      </Button>
      <Modal
        title="Attach a file"
        destroyOnClose={true}
        footer={
          <Button
            loading={isUploading}
            type="primary"
            onClick={handleUploadFile}
          >
            Upload
          </Button>
        }
        closable={true}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          type="file"
          placeholder="Select file to upload"
          accept="image/png"
          onChange={(files) => handleSelectedFile(files.target.files)}
        />
        <Progress percent={progressUpload} />
      </Modal>
    </>
  );
};

export default Attachment;
