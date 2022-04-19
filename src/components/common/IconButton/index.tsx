import React, { MouseEventHandler } from 'react';

type Props = {
  icon: React.ReactNode;
  title: string;
  type: 'button';
  variant: 'add' | 'remove' | 'default';
  handleOnClick?: MouseEventHandler<HTMLButtonElement>;
};

const IconButton = ({ icon, title, type, variant, handleOnClick }: Props) => {
  const variantColor = () => {
    switch (variant) {
      case 'add':
        return 'border border-green-500 text-green-500 rounded-xl';
      case 'remove':
        return 'border border-red-500 text-red-500 rounded-xl';
      default:
        return 'border border-white text-white rounded-xl';
    }
  };
  return (
    <button
      className={`p-2 ${variantColor()}`}
      title={title}
      type={type}
      onClick={handleOnClick}
    >
      {icon}
    </button>
  );
};
export default IconButton;
