"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  User,
  Mail,
  Phone,
  ArrowRight,
  Landmark,
  Users,
  Lock,
  ChevronDown,
  ShieldCheck,
  Building,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Edit2,
  Loader2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSignup } from "../hooks/useSignup";
import { UserRole } from "@/types/auth";

export default function SignupForm() {
  const {
    currentStep,
    maxUnlockedStep,
    goToStep,
    formData,
    updateFormData,
    fieldErrors,
    clearFieldError,
    isLoading,
    error,
    handleNextStep,
  } = useSignup();

  const [showPassword, setShowPassword] = useState(false);

  const steps = [
    { id: 1, label: "Personal" },
    { id: 2, label: "Temple" },
    { id: 3, label: "Role" },
    { id: 4, label: "Confirm" },
  ];

  const roleOptions = [
    { value: UserRole.SUPER_ADMIN, label: "Super Administrator" },
    { value: UserRole.ADMIN, label: "Administrator" },
    { value: UserRole.DATA_ENTRY_OPERATOR, label: "Data Entry Operator" },
    { value: UserRole.DEPARTMENT_USER, label: "Department User" },
    { value: UserRole.VIEWER, label: "Viewer" },
  ];

  return (
    <Card className="relative w-full flex flex-col items-center px-4 sm:px-6 py-5 sm:py-6 z-10 space-y-4 overflow-hidden">
      {/* Decorative Top Leaf Graphics */}
      <div className="absolute top-0 left-0 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none z-0">
        <Image
          src="/assests/leftSideleaf.png"
          alt="Top Left Leaf Accent"
          fill
          className="object-contain object-top-left opacity-90"
        />
      </div>
      <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 pointer-events-none z-0">
        <Image
          src="/assests/rightSideLeaf.png"
          alt="Top Right Leaf Accent"
          fill
          className="object-contain object-top-right opacity-90"
        />
      </div>

      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between pt-2 z-10">
        <Link href="/login">
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10 rounded-full bg-white/70 backdrop-blur-md shadow-sm border border-amber-900/10 flex items-center justify-center text-[#2c221e]"
            aria-label="Go back to login"
          >
            <ChevronLeft className="w-6 h-6 text-[#2c221e]" />
          </Button>
        </Link>

        {/* Center Lotus Emblem */}
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image
            src="/assests/flower-icon.png"
            alt="Lotus Emblem"
            width={48}
            height={48}
            className="object-contain"
          />
        </div>

        <div className="w-10" />
      </div>

      {/* Page Title & Subtitle */}
      <div className="text-center px-2 space-y-1">
        <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-[#174824] tracking-wide">
          Create Account
        </h1>
        <p className="text-[#5a4836] font-medium text-xs sm:text-sm">
          Join LDMS and continue your seva
        </p>
      </div>

      {/* General Error Alert if any */}
      {error && (
        <div className="w-full bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3 text-center font-medium animate-fadeIn">
          {error}
        </div>
      )}

      {/* Progress Stepper Bar with Locked States */}
      <div className="w-full max-w-[360px] my-2">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#e4d9c6] -z-0" />

          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            const isLocked = step.id > maxUnlockedStep;

            return (
              <div
                key={step.id}
                className={`relative z-10 flex flex-col items-center transition-all ${
                  isLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
                }`}
                onClick={() => goToStep(step.id)}
              >
                <div
                  className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm transition-all ${
                    isActive
                      ? "bg-[#174824] text-white shadow-md ring-2 ring-[#174824]/20"
                      : isCompleted
                      ? "bg-[#174824]/90 text-white"
                      : isLocked
                      ? "bg-[#e5d9c3]/50 border border-[#cfa35d]/40 text-[#8c7865]"
                      : "bg-[#f5efe1] border border-[#cfa35d] text-[#5a4836]"
                  }`}
                >
                  {isLocked ? <Lock className="w-3.5 h-3.5" /> : step.id}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 ${
                    isActive ? "text-[#174824]" : "text-[#8c7865]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: Personal Information */}
      {currentStep === 1 ? (
        <Card className="w-full border border-[#e8dfcf] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#174824] text-white text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h2 className="text-[#174824] font-bold text-base sm:text-lg">
              Personal Information
            </h2>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4" noValidate>
            <Input
              id="fullName"
              type="text"
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => {
                updateFormData({ fullName: e.target.value });
                clearFieldError("fullName");
              }}
              error={fieldErrors.fullName}
              placeholder="Enter your full name"
              leftIcon={<User className="w-5 h-5" />}
              required
            />

            <Input
              id="signup-email"
              type="email"
              label="Email Address"
              value={formData.email}
              onChange={(e) => {
                updateFormData({ email: e.target.value });
                clearFieldError("email");
              }}
              error={fieldErrors.email}
              placeholder="Enter your email address"
              leftIcon={<Mail className="w-5 h-5" />}
              required
            />

            <Input
              id="mobile"
              type="tel"
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => {
                updateFormData({ mobile: e.target.value });
                clearFieldError("mobile");
              }}
              error={fieldErrors.mobile}
              placeholder="10-digit mobile number"
              leftIcon={<Phone className="w-5 h-5" />}
              required
            />

            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              label="Password"
              value={formData.password}
              onChange={(e) => {
                updateFormData({ password: e.target.value });
                clearFieldError("password");
              }}
              error={fieldErrors.password}
              placeholder="Create password (min 6 chars)"
              leftIcon={<Lock className="w-5 h-5" />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-[#8c7865]"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              }
              required
            />

            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              label="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => {
                updateFormData({ confirmPassword: e.target.value });
                clearFieldError("confirmPassword");
              }}
              error={fieldErrors.confirmPassword}
              placeholder="Re-enter password"
              leftIcon={<Lock className="w-5 h-5" />}
              required
            />

            <Button
              type="submit"
              variant="sacred-primary"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Card
          className={`w-full p-4 flex items-center justify-between transition-all ${
            1 > maxUnlockedStep
              ? "cursor-not-allowed opacity-60 bg-[#f7f3e9]"
              : "cursor-pointer hover:bg-[#fffcf7]"
          }`}
          onClick={() => goToStep(1)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eadeca] text-[#b88636] font-bold text-sm flex items-center justify-center">
              1
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#b88636]" />
              <span className="font-bold text-sm text-[#b88636]">
                Personal Information
              </span>
            </div>
          </div>
          <ChevronDown className="w-5 h-5 text-[#b88636]" />
        </Card>
      )}

      {/* STEP 2: Temple Information */}
      {currentStep === 2 ? (
        <Card className="w-full border border-[#e8dfcf] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#174824] text-white text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h2 className="text-[#174824] font-bold text-base sm:text-lg">
              Temple Information
            </h2>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4" noValidate>
            <Input
              id="templeName"
              type="text"
              label="Temple / Center Name"
              value={formData.templeName}
              onChange={(e) => {
                updateFormData({ templeName: e.target.value });
                clearFieldError("templeName");
              }}
              error={fieldErrors.templeName}
              placeholder="e.g. ISKCON Vrindavan / Delhi"
              leftIcon={<Landmark className="w-5 h-5" />}
              required
            />

            <Input
              id="templeLocation"
              type="text"
              label="City / Location"
              value={formData.templeLocation}
              onChange={(e) => updateFormData({ templeLocation: e.target.value })}
              placeholder="Enter temple location (Optional)"
              leftIcon={<Building className="w-5 h-5" />}
            />

            <Button
              type="submit"
              variant="sacred-primary"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Card
          className={`w-full p-4 flex items-center justify-between transition-all ${
            2 > maxUnlockedStep
              ? "cursor-not-allowed opacity-60 bg-[#f7f3e9]"
              : "cursor-pointer hover:bg-[#fffcf7]"
          }`}
          onClick={() => goToStep(2)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eadeca] text-[#b88636] font-bold text-sm flex items-center justify-center">
              2
            </div>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4 text-[#b88636]" />
              <span className="font-bold text-sm text-[#b88636]">
                Temple Information
              </span>
            </div>
          </div>
          {2 > maxUnlockedStep ? (
            <Lock className="w-4 h-4 text-[#8c7865]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#b88636]" />
          )}
        </Card>
      )}

      {/* STEP 3: Role Selection */}
      {currentStep === 3 ? (
        <Card className="w-full border border-[#e8dfcf] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#174824] text-white text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h2 className="text-[#174824] font-bold text-base sm:text-lg">
              Role Selection
            </h2>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4" noValidate>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#4a3e31]">
                Select Your Seva Role
              </label>
              <div
                className={`relative flex items-center bg-[#fcfaf5] border rounded-xl px-3 h-12 transition-all ${
                  fieldErrors.role ? "border-red-500" : "border-[#e4d9c6]"
                }`}
              >
                <Users className="w-5 h-5 text-[#8c7865] mr-2 flex-shrink-0" />
                <select
                  value={formData.role}
                  onChange={(e) => {
                    updateFormData({ role: e.target.value });
                    clearFieldError("role");
                  }}
                  className="w-full bg-transparent text-sm text-[#2c221e] outline-none font-medium cursor-pointer"
                  required
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              {fieldErrors.role && (
                <span className="text-xs text-red-600 mt-0.5">{fieldErrors.role}</span>
              )}
            </div>

            <Button
              type="submit"
              variant="sacred-primary"
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </form>
        </Card>
      ) : (
        <Card
          className={`w-full p-4 flex items-center justify-between transition-all ${
            3 > maxUnlockedStep
              ? "cursor-not-allowed opacity-60 bg-[#f7f3e9]"
              : "cursor-pointer hover:bg-[#fffcf7]"
          }`}
          onClick={() => goToStep(3)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eadeca] text-[#b88636] font-bold text-sm flex items-center justify-center">
              3
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#b88636]" />
              <span className="font-bold text-sm text-[#b88636]">
                Role Selection
              </span>
            </div>
          </div>
          {3 > maxUnlockedStep ? (
            <Lock className="w-4 h-4 text-[#8c7865]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#b88636]" />
          )}
        </Card>
      )}

      {/* STEP 4: Confirm Details */}
      {currentStep === 4 ? (
        <Card className="w-full border border-[#e8dfcf] p-5 sm:p-6">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#174824] text-white text-xs font-bold flex items-center justify-center">
              4
            </div>
            <h2 className="text-[#174824] font-bold text-base sm:text-lg">
              Confirm Details
            </h2>
          </div>

          <form onSubmit={handleNextStep} className="space-y-4">
            <div className="bg-[#fdfbf7] border border-[#e8dfcf] rounded-xl p-4 space-y-3 text-xs">
              <div className="flex justify-between items-start border-b border-[#e8dfcf] pb-2">
                <div>
                  <span className="font-bold text-[#174824] text-sm block">
                    Personal Details
                  </span>
                  <p className="text-[#4a3e31] font-semibold mt-1">
                    {formData.fullName || "—"}
                  </p>
                  <p className="text-[#8c7865]">{formData.email || "—"}</p>
                  <p className="text-[#8c7865]">{formData.mobile || "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="text-[#b88636] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="flex justify-between items-start border-b border-[#e8dfcf] pb-2">
                <div>
                  <span className="font-bold text-[#174824] text-sm block">
                    Temple Details
                  </span>
                  <p className="text-[#4a3e31] font-semibold mt-1">
                    {formData.templeName || "—"}
                  </p>
                  <p className="text-[#8c7865]">{formData.templeLocation || "—"}</p>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(2)}
                  className="text-[#b88636] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>

              <div className="flex justify-between items-start">
                <div>
                  <span className="font-bold text-[#174824] text-sm block">
                    Seva Role
                  </span>
                  <p className="text-[#4a3e31] font-semibold mt-1">
                    {formData.role || "—"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => goToStep(3)}
                  className="text-[#b88636] hover:underline flex items-center gap-1 font-semibold"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>

            <Button
              type="submit"
              variant="sacred-primary"
              disabled={isLoading}
              className="w-full mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Submitting Registration...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Confirm & Submit Registration</span>
                </>
              )}
            </Button>
          </form>
        </Card>
      ) : (
        <Card
          className={`w-full p-4 flex items-center justify-between transition-all ${
            4 > maxUnlockedStep
              ? "cursor-not-allowed opacity-60 bg-[#f7f3e9]"
              : "cursor-pointer hover:bg-[#fffcf7]"
          }`}
          onClick={() => goToStep(4)}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#eadeca] text-[#b88636] font-bold text-sm flex items-center justify-center">
              4
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#b88636]" />
              <span className="font-bold text-sm text-[#b88636]">
                Confirm Details
              </span>
            </div>
          </div>
          {4 > maxUnlockedStep ? (
            <Lock className="w-4 h-4 text-[#8c7865]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#b88636]" />
          )}
        </Card>
      )}

      {/* Admin Review Information Notice Box */}
      <div className="w-full bg-[#edf4eb] border border-[#c3dfc1] rounded-2xl p-4 flex items-start gap-3 mt-2">
        <ShieldCheck className="w-6 h-6 text-[#216833] flex-shrink-0 mt-0.5" />
        <p className="text-[#216833] text-xs font-medium leading-relaxed">
          Your account will be reviewed by the administrator. You will receive an
          approval notification once activated.
        </p>
      </div>
    </Card>
  );
}
