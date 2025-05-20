'use client'

import { Leaf } from "lucide-react";
import { Button } from "@/components/ui/button"; // Assuming default shadcn/ui path
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"; // Assuming default shadcn/ui path

interface SignInPageProps {
    onSignIn: () => void;
}

/**
 * A redesigned sign-in page component using shadcn/ui components.
 * Features a green theme centered around a Card layout.
 *
 * @param {SignInPageProps} props - Component props.
 * @param {() => void} props.onSignIn - Callback function triggered when the sign-in button is clicked.
 * @returns {JSX.Element} The rendered sign-in page component.
 */
export default function SignInPage({ onSignIn }: SignInPageProps) {
    return (
        // Main container: centers the card vertically and horizontally
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
            {/* Card component from shadcn/ui */}
            <Card className="w-full max-w-sm shadow-lg border-green-200">
                {/* Card Header: Contains the icon and title */}
                <CardHeader className="items-center text-center">
                    {/* Leaf Icon */}
                    <div className="p-3 bg-green-100 rounded-full mb-4 border border-green-200">
                        <Leaf className="h-10 w-10 text-green-600" />
                    </div>
                    {/* Title */}
                    <CardTitle className="text-4xl font-bold text-green-800 tracking-tight">
                        Map your City
                    </CardTitle>
                    {/* Optional Description */}
                    <CardDescription className="text-green-600 pt-1">
                        Sign in to continue
                    </CardDescription>
                </CardHeader>

                {/* Card Content: Main content area (currently just holds the button container) */}
                <CardContent>
                    {/* Sign-in button */}
                    <Button
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 text-lg rounded-lg transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        onClick={onSignIn}
                        size="lg" // Use large size for better prominence
                    >
                        Sign In
                    </Button>
                </CardContent>
                {/* Card Footer (Optional): Can be used for links like "Forgot Password?" */}
                {/* <CardFooter className="justify-center">
                    <p className="text-sm text-gray-500">Need help?</p>
                </CardFooter> */}
            </Card>
        </div>
    )
}
