import React from 'react';

interface Props {
  variant?: 'outline' | 'fill'
  as?: keyof JSX.IntrinsicElements | React.ComponentType
}

const variantClassesMap: Record<Required<Props>['variant'], string> = {
  outline: 'bg-transparent',
  fill: 'bg-blue-500 text-white'
}

const Tag: React.FC<Props> = ({ variant = 'outline', as = 'span', children, ...props }) => {
  const variantClasses = variantClassesMap[variant]
  const Comp = as;

  return (
    <Comp
      className={`${variantClasses} inline-block rounded-lg text-theme-text border-blue-500 border-solid border py-0.5 px-2 mr-2 mb-2 text-sm`}
      {...props}
    >
      {children}
    </Comp>
  );
};

export default Tag;
