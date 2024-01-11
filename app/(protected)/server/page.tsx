import UserInfo from '@/components/user-info'
import { currentUser } from '@/lib/auth'

const ServerPage = async () => {
  const user = await currentUser()
  return (
    <div className='w-full h-full'>
      <div className="container mx-auto p-4">
        {/* <p>{user?.name}</p>
        <p>{user?.email}</p> */}
        <UserInfo user={user} label="🖥️Server component" />
      </div>
    </div>
  )
}

export default ServerPage