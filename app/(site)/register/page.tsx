import { AuthContainer } from "@/components/auth-cont"
import { ProfileForm } from "@/components/profile-form"

export default function PageRegister() {
  return (
    <AuthContainer
      title="Register Your Account"
      desc="Create an account to start sharing and exploring study materials."
    >
      <ProfileForm />
    </AuthContainer>
  )
}
