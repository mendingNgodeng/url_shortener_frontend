import { toast } from 'sonner';

export const toastSuccess = (msg) => {
  toast.success(msg, {
    duration: 3000,
  });
};

export const toastError = (msg) => {
  toast.error(msg, {
    duration: 4000,
  });
};

export const toastInfo = (msg) => {
  toast.info(msg, {
    duration: 3000,
  });
};

export const toastWarning = (msg) => {
  toast.warning(msg, {
    duration: 3000,
  });
};
