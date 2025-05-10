import { Avatar, AvatarFallback, AvatarImage } from '@/core/components/ui/avatar'
import { randomName } from '@/core/lib/utils'
import { getUser } from '@/features/auth/actions'
import LogoutForm from '@/features/auth/components/logout-form'
import Link from 'next/link'

export default async function Header () {
  const { data: user } = await getUser()

  if (!user) return null

  const name: string = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? randomName(2)
  const initials = name.split(' ').map((name: string) => name[0]).join('').toUpperCase()
  const fallback = initials?.length > 2 ? initials?.slice(0, 3) : initials

  return (
    <header className='flex flex-col xxs:flex-row items-center justify-between'>
      <Link href='/' className='font-bold'>
        MonoBanco
      </Link>

      <div className="flex gap-5 items-center">
        <Avatar>
          <AvatarImage src={user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture} />
          <AvatarFallback>{fallback}</AvatarFallback>
        </Avatar>

        <LogoutForm />
      </div>
    </header>
  )
}
