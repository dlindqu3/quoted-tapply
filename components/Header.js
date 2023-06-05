'use client'
import React from 'react';
import { useUserContext } from '@/context/AuthContext';


function Header() {

  const { user } = useUserContext();

  return (
    <div>
    <div>Header here</div>
    {/* { user && <p>{user.displayName}</p> }  */}
    </div>

  )
}

export default Header