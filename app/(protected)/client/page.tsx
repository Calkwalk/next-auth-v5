"use client";

import UserInfo from '@/components/user-info';
import { useCurrentUser } from '@/hooks/use-current-user';

const ClientPage = () => {
  const user = useCurrentUser();
  return (
    <div className='w-full h-full'>
      <div className="container mx-auto p-4">
        <UserInfo user={user} label="💻Client Component" />
      </div>
    </div>
  )
}

export default ClientPage