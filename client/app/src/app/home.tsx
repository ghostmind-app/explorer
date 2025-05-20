'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MapComponent from './map/index.tsx'; // Adjust the import path to where your Map.tsx is located

export default function Home({
  userEmail,
  publicEnvVar,
}: {
  userEmail: string; // Assuming this prop means the user is logged in
  publicEnvVar: {
    NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN: string;
  };
}) {
  const router = useRouter();

  // Keep the sign out logic here, but pass it down to the map component
  const signOutRequest = async (event: React.MouseEvent) => {
    event.preventDefault();
    await signOut({ redirect: false });
    router.replace('/signin'); // Or wherever your sign-in page is
  };

  // If userEmail is present, we assume the user is logged in and display the map
  // Otherwise, you might want to redirect or show a different component (handle in parent/page logic)
  if (!userEmail) {
    // Optional: Handle case where userEmail might be missing unexpectedly
    // router.replace('/signin'); // Example redirect
    return <p>Loading user information or please sign in...</p>; // Placeholder
  }

  return (
    // Render the MapComponent directly, taking up the full page view
    // Pass the necessary props down
    <MapComponent
      userEmail={userEmail}
      MAPBOX_ACCESS_TOKEN={publicEnvVar.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
      onSignOut={signOutRequest} // Pass the sign-out function
    />
  );
}