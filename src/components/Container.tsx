import React from 'react';
import { cn } from "@/utils/cn"

export default function Container (props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
    {... props}
    className={cn(
                'w-full bg-white border rounded-xl py-4 shadow-md flex',
                props.className
    )}
    style={props.style}>
    </div>
  );
}
