"use client"

import { useAtom } from 'jotai'
import React from 'react'
import { activeSidebarItem } from '../configs/constant'

const useSidebar = () => {
    const [activeSidebar, setActiveSidebar] = useAtom(activeSidebarItem)

    return {
        activeSidebar,
        setActiveSidebar
    }
}

export default useSidebar