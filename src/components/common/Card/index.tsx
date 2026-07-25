import { Surface } from '@/components/common/Surface';
import { Tilt3D, Tilt3DSheen } from '@/components/three-d/Tilt3D';

import { cn } from '@/utils/styles/classNames';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md';
  as?: React.ElementType;
  /**
   * Tilts the card in real 3D under the pointer and sweeps a specular
   * highlight across it. Children wrapped in <Depth> pick up parallax as it
   * moves. Automatically inert on touch devices and under Reduce Motion.
   */
  tilt?: boolean;
  /**
   * Applied to the tilt wrapper rather than the card surface. The wrapper
   * becomes the grid/flex item, so layout placement belongs here.
   * Ignored when `tilt` is off.
   */
  tiltClassName?: string;
}

const paddingMap = {
  none: '',
  sm: 'px-[14px] py-[12px]',
  md: 'px-[20px] py-[16px]',
};

export function Card({
  children,
  className,
  hover,
  padding = 'none',
  as,
  tilt,
  tiltClassName,
}: CardProps) {
  const surface = (
    <Surface
      as={as}
      rounded="xl"
      className={cn(
        'card',
        hover && 'card-hover',
        paddingMap[padding],
        // `relative` anchors the sheen, `preserve-3d` keeps <Depth> children in
        // the tilt plane's 3D space, `h-full` fills the wrapper.
        tilt && 'relative preserve-3d h-full',
        className,
      )}
    >
      {tilt && <Tilt3DSheen />}
      {children}
    </Surface>
  );

  if (!tilt) return surface;

  return <Tilt3D className={tiltClassName}>{surface}</Tilt3D>;
}
