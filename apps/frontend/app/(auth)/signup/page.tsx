import SignupForm from "@/app/(auth)/components/SignupForm";
import Footer from "@/app/(auth)/components/Footer";
import DesktopSignup from "@/app/(auth)/components/DesktopSignup";

export default function SignupPage() {
  return (
    <main className="w-full min-h-screen bg-[#ece6d5]">
      {/* Mobile View (< lg screen) */}
      <div className="flex lg:hidden items-center justify-center p-0 min-h-screen">
        <div
          className="w-full max-w-[430px] min-h-screen sm:min-h-[844px] bg-[#f5efe1] relative shadow-2xl sm:rounded-[36px] overflow-hidden flex flex-col justify-between border-0 sm:border sm:border-amber-900/10"
          style={{ position: "relative" }}
        >
          <SignupForm />
          <Footer />
        </div>
      </div>

      {/* Desktop View (>= lg screen) */}
      <div className="hidden lg:block w-full min-h-screen">
        <DesktopSignup />
      </div>
    </main>
  );
}
