import React from 'react';
import { GiUbisoftSun } from "react-icons/gi";
import { FaLocationCrosshairs, FaLocationDot} from "react-icons/fa6";
import SearchBox from '@/components/SearchBox';

type Props = {};

export default function Navbar ({}: Props) {
  return (
    <nav className='shadow-sm sticky top-0 left-0 z-50 bg-white'>
      <div className='h-[80px] w-full flex justify-between items-center max-w-7x1 px-3 mx-auto'>
        <div className='flex items-center justify-center gap-2'>
          <h2 className='text-gray-500 text-3xl'> Weather</h2>
          <GiUbisoftSun className='text-3xl mt-1 text-yellow-400' />
        </div>

        <section className='flex gap-2 items-center'>
        <FaLocationCrosshairs className='text-2xl text-gray-400 hover:opacity-80 cursor-pointer'/>
        <FaLocationDot className='text-2xl'/>
        <p className='text-slate-900/80 text-sm'> London</p>
        <SearchBox/>
        </section>

      </div>
    </nav>
  );
}

