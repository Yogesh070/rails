import React, {useRef, useState} from 'react';
import type {InputRef, ModalProps} from 'antd';
import {Modal, Input, Button} from 'antd';

import {PlusOutlined} from '@ant-design/icons';
import {createPortal} from 'react-dom';

interface IssueModalProps extends ModalProps {
  onEnterPress: (value: string) => void;
  renderer?: React.ReactNode;
}

const IssueModal = (props: IssueModalProps) => {
  const inputRef = useRef<InputRef>(null);

  const [showModal, setShowModal] = useState(false);
  const handleClick=()=>{
    setShowModal(true);
    setTimeout(() => {
      inputRef.current!.focus();
    }, 300);
  }

  return (
    <>
      {
      props.renderer ? (
        <div onClick={handleClick}>
          {props.renderer}
        </div>
      ) : (
        <Button
          className="w-100"
          icon={<PlusOutlined />}
          onClick={handleClick}
        >
          Create Issue
        </Button>
      )}
      {showModal &&
        createPortal(
          <Modal
            bodyStyle={{
              width: '100%',
              padding: 0,
              bottom: '50px',
              position: 'absolute',
            }}
            {...props}
            open={showModal}
            footer={null}
            mask={false}
            closable={false}
            width={'100%'}
            wrapClassName="bottom-0 p-0"
            style={{verticalAlign: 'bottom', padding: 0}}
            centered
            onCancel={() => {
              setShowModal(false);
            }}
          >
            <Input
              className="w-full"
              placeholder="Start typing to create a new issue"
              ref={inputRef}
              allowClear
              onPressEnter={(e) => {
                props.onEnterPress(e.currentTarget.value);
                setShowModal(false);
              }}
              autoFocus={true}
            />
          </Modal>,
          document.body
        )}
    </>
  );
};

export default IssueModal;
