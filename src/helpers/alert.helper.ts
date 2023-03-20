import { toast } from 'react-toastify';

export class AlertHelper {
  success(message: string): void {
    toast.success(message);
  }

  error(message: string): void {
    toast.error(message);
  }

  warning(message: string): void {
    toast.warn(message);
  }

  info(message: string): void {
    toast.info(message);
  }
}
