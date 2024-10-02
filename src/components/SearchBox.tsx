import { HTMLInputTypeAttribute } from 'react';
import { cn } from "@/utils/cn";
import { IoMdSearch } from "react-icons/io";

type Props = {
    className?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
    onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;

}

export default function SearchBox (props: Props) {
  return (
    <form
    className={cn('flex relative items-center justify-center h-10', props.className)}
    onSubmit={props.onSubmit}>

        {/* Input Search Box */}
        <input
        type='text'
        placeholder='Search Location...'
        value={props.value}
        onChange={props.onChange}
        className='px-4 py-2 w-[230px] border border-gray-300 rounded-l-md
                   focus:outline-none focus:border-blue-500 h-full'/>

        {/* Search Box Submit Button */}
        <button
        className='px-4 py-[9px] bg-blue-500 text-white rounded-r-md
                   focus:outline-none focus:border-blue-600 h-full
                   whitespace-nowrap'>
         <IoMdSearch />
        </button>

    </form>
  );
}
