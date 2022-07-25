import { notification } from 'antd';
import { useSelector } from 'react-redux';

export const notifSuccess = (message = 'Thành công', description = '') => {
  notification.success({
    message: message,
    description: description,
    duration: 4,
  });
};

export const notifFailure = (error) => {
    notification.error({
        message: 'Lỗi',
        description: error.message,
        duration: 4,
    });
};

export const notifFailureMes = (message = 'Lỗi', description = '') => {
  notification.error({
    message: message,
    description: description,
    duration: 3,
  });
};
