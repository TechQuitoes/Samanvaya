"use client";

import { useState } from "react";
import Image from "next/image";
import {
  UserCircle,
  MapPin,
  Building2,
  Calendar,
  Heart,
  Phone,
  Plus,
  Edit3,
  FileText,
  Clock,
  Sparkles,
  Shield,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import LotusDivider from "@/components/ui/LotusDivider";
import SacredPortalLayout from "@/components/layout/SacredPortalLayout";
import useLeaderProfile from "@/hooks/useLeaderProfile";
import { LeaderStatus } from "@/types/leader-profile";

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Not specified";
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadge(status: LeaderStatus) {
  switch (status) {
    case LeaderStatus.TRAVELLING:
      return (
        <Badge className="bg-amber-600 text-white font-bold text-xs px-3 py-1 gap-1">
          <Clock className="w-3.5 h-3.5 animate-pulse" />
          TRAVELLING
        </Badge>
      );
    case LeaderStatus.STAYING:
      return (
        <Badge className="bg-emerald-700 text-white font-bold text-xs px-3 py-1 gap-1">
          <Building2 className="w-3.5 h-3.5" />
          STAYING AT TEMPLE
        </Badge>
      );
    case LeaderStatus.MEETING:
      return (
        <Badge className="bg-blue-700 text-white font-bold text-xs px-3 py-1 gap-1">
          <UserCircle className="w-3.5 h-3.5" />
          IN MEETING
        </Badge>
      );
    case LeaderStatus.REST:
      return (
        <Badge className="bg-purple-700 text-white font-bold text-xs px-3 py-1 gap-1">
          <Heart className="w-3.5 h-3.5" />
          REST & RETREAT
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
}

export default function LeaderProfilePage() {
  const { profile, isLoading, isSaving, updateProfile, updateLocationStatus } =
    useLeaderProfile();

  // Location Update Modal State
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<LeaderStatus>(LeaderStatus.STAYING);
  const [cityInput, setCityInput] = useState("");
  const [residenceInput, setResidenceInput] = useState("");

  // Edit Bio Modal State
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [designationInput, setDesignationInput] = useState("");
  const [bioInput, setBioInput] = useState("");

  const handleOpenLocationModal = () => {
    if (profile) {
      setSelectedStatus(profile.currentStatus);
      setCityInput(profile.currentCity || "");
      setResidenceInput(profile.residenceAddress || "");
    }
    setLocationModalOpen(true);
  };

  const handleSaveLocation = async () => {
    await updateLocationStatus({
      currentStatus: selectedStatus,
      currentCity: cityInput,
      residenceAddress: residenceInput,
    });
    setLocationModalOpen(false);
  };

  const handleOpenBioModal = () => {
    if (profile) {
      setDesignationInput(profile.designation || "");
      setBioInput(profile.biography || "");
    }
    setBioModalOpen(true);
  };

  const handleSaveBio = async () => {
    await updateProfile({
      designation: designationInput,
      biography: bioInput,
    });
    setBioModalOpen(false);
  };

  return (
    <SacredPortalLayout>
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-[#174824] text-white shadow-xs">
              <UserCircle className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#174824]">
                Leader Master Profile
              </h2>
              <p className="text-xs sm:text-sm text-[#5a4836] font-medium">
                Manage leader information, emergency contacts, and real-time status updates
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleOpenLocationModal}
            className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-semibold gap-2 shadow-sm cursor-pointer"
          >
            <MapPin className="w-4 h-4 text-amber-300" />
            Update Current Location
          </Button>
        </div>
      </div>

      {isLoading || !profile ? (
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-[24px] bg-[#e5d9c3]/60" />
          <Skeleton className="h-64 w-full rounded-[24px] bg-[#e5d9c3]/60" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Top Hero Leader Card */}
          <Card className="relative overflow-hidden rounded-[24px] sm:rounded-[28px] border-[#e5d9c3] bg-[#faf4e8] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              {/* Leader Avatar & Identity */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#174824]/10 border-2 border-[#174824]/30 flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-3xl font-bold text-[#174824]">
                    {profile.userId?.name?.charAt(0)?.toUpperCase() || "L"}
                  </span>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-[#174824]">
                      {profile.userId?.name}
                    </h3>
                    <button
                      type="button"
                      onClick={handleOpenBioModal}
                      className="p-1 text-[#5a4836] hover:text-[#174824] transition-colors"
                      aria-label="Edit Profile"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-amber-900">
                    {profile.designation || "Leader"}
                  </p>
                  <p className="text-xs text-[#5a4836] font-medium">
                    {profile.userId?.email} • {profile.userId?.mobile}
                  </p>
                </div>
              </div>

              {/* Current Status Box */}
              <div className="bg-[#fcfaf5] border border-[#e5d9c3] rounded-2xl p-4 space-y-2 min-w-[260px]">
                <p className="text-[11px] font-bold text-[#8c7865] uppercase tracking-wider">
                  Current Status & Location
                </p>
                <div className="flex items-center gap-2">
                  {getStatusBadge(profile.currentStatus)}
                </div>
                <div className="space-y-1 text-xs text-[#5a4836] font-medium pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#174824]" />
                    <span>{profile.currentCity || "Mumbai"}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-[#174824]" />
                    <span>{profile.residenceAddress || "ISKCON Leader Center"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Biography Section */}
            {profile.biography && (
              <div className="pt-4 border-t border-[#e5d9c3]/60 space-y-1">
                <p className="text-xs font-bold text-[#8c7865] uppercase tracking-wider">
                  Biography & Seva Overview
                </p>
                <p className="text-xs sm:text-sm text-[#4a3e31] leading-relaxed">
                  {profile.biography}
                </p>
              </div>
            )}
          </Card>

          {/* Details & Emergency Contacts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Master Data */}
            <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#e5d9c3]/60 pb-3">
                <Shield className="w-5 h-5 text-[#174824]" />
                <h4 className="text-base font-bold text-[#174824]">
                  Personal Master Info
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <p className="text-[#8c7865] font-semibold">Date of Birth</p>
                  <p className="font-bold text-[#2c221e] mt-0.5">
                    {formatDate(profile.dob)}
                  </p>
                </div>

                <div>
                  <p className="text-[#8c7865] font-semibold">Nationality</p>
                  <p className="font-bold text-[#2c221e] mt-0.5">
                    {profile.nationality || "Indian"}
                  </p>
                </div>

                <div>
                  <p className="text-[#8c7865] font-semibold">Blood Group</p>
                  <p className="font-bold text-red-800 mt-0.5">
                    {profile.bloodGroup || "O+"}
                  </p>
                </div>

                <div>
                  <p className="text-[#8c7865] font-semibold">Role & Access</p>
                  <p className="font-bold text-[#174824] mt-0.5">
                    {profile.userId?.role}
                  </p>
                </div>
              </div>
            </Card>

            {/* Emergency Contacts Card */}
            <Card className="rounded-[24px] p-6 border border-[#e5d9c3] bg-[#faf4e8] shadow-xs space-y-4">
              <div className="flex items-center gap-2 border-b border-[#e5d9c3]/60 pb-3">
                <Phone className="w-5 h-5 text-red-700" />
                <h4 className="text-base font-bold text-[#174824]">
                  Emergency Contacts
                </h4>
              </div>

              {profile.emergencyContacts.length === 0 ? (
                <p className="text-xs text-[#5a4836] font-medium">
                  No emergency contacts specified.
                </p>
              ) : (
                <div className="space-y-3">
                  {profile.emergencyContacts.map((contact, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-[#fcfaf5] border border-[#e5d9c3]/80 flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#2c221e]">{contact.name}</p>
                        <p className="text-[11px] text-[#8c7865]">
                          {contact.relation}
                        </p>
                      </div>
                      <p className="font-bold text-[#174824]">{contact.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}

      {/* Real-time Location Update Modal */}
      <Dialog open={locationModalOpen} onOpenChange={setLocationModalOpen}>
        <DialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#174824] flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#174824]" />
              Update Current Status & Location
            </DialogTitle>
            <DialogDescription className="text-[#5a4836] text-xs">
              Update leader real-time location and current seva status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5a4836]">
                Current Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as LeaderStatus)}
                className="w-full h-11 px-3 rounded-xl border border-[#cfa35d] bg-white text-xs font-semibold text-[#2c221e] focus:outline-none"
              >
                <option value={LeaderStatus.STAYING}>STAYING (At Temple/Residence)</option>
                <option value={LeaderStatus.TRAVELLING}>TRAVELLING (On Tour)</option>
                <option value={LeaderStatus.MEETING}>MEETING (In Conference)</option>
                <option value={LeaderStatus.REST}>REST & RETREAT</option>
              </select>
            </div>

            <Input
              label="Current City"
              value={cityInput}
              onChange={(e) => setCityInput(e.target.value)}
              placeholder="e.g. Mumbai, Vrindavan, Mayapur"
            />

            <Input
              label="Current Residence / Temple Address"
              value={residenceInput}
              onChange={(e) => setResidenceInput(e.target.value)}
              placeholder="e.g. ISKCON Juhu, Mumbai"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLocationModalOpen(false)}
              className="rounded-xl border-[#e5d9c3]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveLocation}
              disabled={isSaving}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-semibold gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Bio Modal */}
      <Dialog open={bioModalOpen} onOpenChange={setBioModalOpen}>
        <DialogContent className="bg-[#faf4e8] border-[#e5d9c3] rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-[#174824] flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-[#174824]" />
              Edit Profile Designation & Bio
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <Input
              label="Designation"
              value={designationInput}
              onChange={(e) => setDesignationInput(e.target.value)}
              placeholder="e.g. Temple President, General Secretary"
            />

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#5a4836]">
                Biography & Overview
              </label>
              <textarea
                value={bioInput}
                onChange={(e) => setBioInput(e.target.value)}
                rows={4}
                className="w-full p-3 rounded-xl border border-[#cfa35d] bg-white text-xs text-[#2c221e] focus:outline-none"
                placeholder="Enter leader biography and seva details..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setBioModalOpen(false)}
              className="rounded-xl border-[#e5d9c3]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveBio}
              disabled={isSaving}
              className="bg-[#174824] hover:bg-[#174824]/90 text-white rounded-xl font-semibold gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SacredPortalLayout>
  );
}
