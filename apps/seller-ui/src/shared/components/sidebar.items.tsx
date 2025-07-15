import Link from 'next/link'
import React from 'react'

const SidebarItems = ({icon,title,isActive,href}:{icon:React.ReactNode,title:string,isActive:boolean,href:string}) => {
  return (
    <Link href={href} className='my-2 block'>
        <div className='flex gap-2 items-center w-full min-h-12 h-full px-[13px] rounded-lg cursor-pointer transition hover:bg-[#2b2f31]'>
            {icon}
            <h5 className={`text-lg ${isActive ? 'text-[#0085ff]' : 'text-slate-200'}`}>
                {title}
            </h5>
        </div>
    </Link>
  )
}

export default SidebarItems