'use server';

import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';


import Home from './home';

export default async function Main() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/signin');
  }

  const userId = session.user.id;

  const userEmail = session.user.email;









  let linkedDB = null;


  let publicEnvVar = {
    NEXT_PUBLIC_DB_POTION_ENDPOINT_WS:
      process.env.NEXT_PUBLIC_DB_POTION_ENDPOINT_WS,
    NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP:
      process.env.NEXT_PUBLIC_DB_POTION_ENDPOINT_HTTP,
    NEXT_PUBLIC_NOTION_OAUTH_REDIRECT_URI:
      process.env.NEXT_PUBLIC_NOTION_OAUTH_REDIRECT_URI,
    NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID:
      process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID,
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN:
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  };

  return (

    <Home
      linkedDB={linkedDB}
      publicEnvVar={publicEnvVar}
      userEmail={userEmail}
    />

  );
}
