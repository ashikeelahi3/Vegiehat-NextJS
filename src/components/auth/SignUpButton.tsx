"use client"
import { SignUpButton as ClerkSignUpButton } from '@clerk/nextjs';
import { useTheme } from 'next-themes';

export function SignUpButton() {
  const { theme } = useTheme();

  return (
    <ClerkSignUpButton mode="modal" appearance={{
      layout: {
        helpPageUrl: "https://vegiehat.com/help",
        logoPlacement: "inside",
        logoImageUrl: "/images/web/vegiehat-logo.png",
        showOptionalFields: false,
        socialButtonsPlacement: "top",
        socialButtonsVariant: "blockButton"
      },
      variables: theme === "dark" 
        ? {
            borderRadius: "0.5rem",
            colorPrimary: "#3E885B",
            colorBackground: "#1F2937",
            colorInputBackground: "#111827",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            colorText: "#F9FAFB",
            colorTextSecondary: "#9CA3AF",
            colorTextOnPrimaryBackground: "#111827",
            colorDanger: "#EF4444",
            colorSuccess: "#10B981"
          }
        : {
            borderRadius: "0.5rem",
            colorPrimary: "#1E5631",
            colorBackground: "#FFFFFF",
            colorInputBackground: "#F8FAF9",
            fontFamily: "var(--font-geist-sans), system-ui, sans-serif",
            colorTextSecondary: "#3E885B",
            colorDanger: "#C1292E"
          },
      elements: theme === "dark" 
        ? {
            formButtonPrimary: "bg-vegiehat-primary hover:bg-vegiehat-secondary text-white",
            socialButtonsBlockButton: "border border-gray-600 hover:bg-gray-700 text-white",
            socialButtonsBlockButtonText: "font-medium text-white",
            formFieldInput: "bg-gray-800 border-gray-700 text-white",
            footerActionLink: "text-vegiehat-accent hover:text-vegiehat-accent/80"
          }
        : {
            formButtonPrimary: "bg-vegiehat-primary hover:bg-vegiehat-secondary text-white",
            socialButtonsBlockButton: "border border-gray-300 hover:bg-gray-100",
            socialButtonsBlockButtonText: "font-medium text-gray-800"
          }
    }}>
      <button className="px-4 py-2 text-sm font-medium text-white bg-vegiehat-secondary hover:bg-vegiehat-secondary/90 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/30">
        Sign Up
      </button>
    </ClerkSignUpButton>
  );
}