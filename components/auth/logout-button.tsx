import React from 'react';
import { logout } from '@/actions/logout';

const LogoutButton = ({children}:{children:React.ReactNode}) => {
    const onClick = () => {
        logout();
    }
  return (
    <div onClick={onClick} className='cursor-pointer'>{children}</div>
  )
}

export default LogoutButton