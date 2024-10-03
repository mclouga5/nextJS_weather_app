import React from 'react';
import { cn } from "@/utils/cn"

const Container = React.forwardRef<HTMLDivElement, React.HTMLProps<HTMLDivElement>>((props, ref) => {
  return (
    <div
      {...props}
      ref={ref} // Attach the ref here
      className={cn(
        'w-full bg-white border rounded-xl py-4 shadow-md flex',
        props.className
      )}
      style={props.style}
    >
      {props.children}
    </div>
  );
});

Container.displayName = 'Container';

export default Container;
