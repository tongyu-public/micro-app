import { DefaultFooter } from '@ty-one-components/frame';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const defaultMessage = '互换中后台系统技术部出品';
  return <DefaultFooter copyright={`${currentYear} ${defaultMessage}`} />;
};
