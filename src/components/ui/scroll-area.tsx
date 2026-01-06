import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

type ScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  gradientHeightTop?: string;
  gradientHeightBottom?: string;
  gradientColor?: string;
};

const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  className,
  gradientHeightTop = '1rem',
  gradientHeightBottom = '1rem',
  gradientColor = 'var(--background)',
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        'relative flex flex-col',
        'before:absolute before:inset-x-0 before:top-0 before:z-10 before:h-[var(--gradient-height-top)] before:bg-gradient-to-b before:from-[var(--gradient-color)] before:to-transparent before:content-[""]',
        'after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-[var(--gradient-height-bottom)] after:bg-gradient-to-t after:from-[var(--gradient-color)] after:to-transparent after:content-[""]',
        isMobile
          ? 'h-full min-h-0 *:px-4 [&>*:first-child]:pt-[var(--gradient-height-top)] [&>*:last-child]:pb-[var(--gradient-height-bottom)]'
          : 'max-h-[500px]',
        className
      )}
      style={
        {
          '--gradient-height-top': gradientHeightTop,
          '--gradient-height-bottom': gradientHeightBottom,
          '--gradient-color': gradientColor,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default ScrollArea;
