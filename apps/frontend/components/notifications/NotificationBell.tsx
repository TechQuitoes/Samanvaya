"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  CheckCheck,
  UserPlus,
  ShieldCheck,
  ShieldAlert,
  Plane,
  FileText,
  Sparkles,
  ExternalLink,
  Volume2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/hooks/useNotifications";
import { usePushNotifications } from "@/hooks/usePushNotifications";
import { AppNotification } from "@/types/notification";

function formatTimeAgo(dateStr: string): string {
  if (!dateStr) return "Just now";
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSec < 60) return "Just now";
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
  return `${Math.floor(diffInSec / 86400)}d ago`;
}

function getNotificationIcon(type: string) {
  switch (type) {
    case "APPROVAL_REQUEST":
      return <UserPlus className="w-4 h-4 text-amber-600" />;
    case "ACCOUNT_APPROVED":
      return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    case "ACCOUNT_BLOCKED":
      return <ShieldAlert className="w-4 h-4 text-rose-600" />;
    case "TRAVEL":
      return <Plane className="w-4 h-4 text-sky-600" />;
    case "TASK":
    case "DOCUMENTATION":
      return <FileText className="w-4 h-4 text-indigo-600" />;
    default:
      return <Sparkles className="w-4 h-4 text-[#174824]" />;
  }
}

export default function NotificationBell() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const { isSupported, permission, isSubscribed, subscribeUser, isLoading: isPushLoading } = usePushNotifications();

  const handleNotificationClick = (item: AppNotification) => {
    if (!item.isRead) {
      markAsRead(item._id);
    }
    setIsOpen(false);
    if (item.actionUrl) {
      router.push(item.actionUrl);
    }
  };

  const showPushPrompt = isSupported && permission !== "granted" && !isSubscribed;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="relative p-2 rounded-xl text-[#2c221e] hover:text-[#174824] hover:bg-[#174824]/5 transition-all cursor-pointer outline-none select-none"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 sm:w-6 sm:h-6" />

          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#c0392b] text-white text-[10px] font-bold flex items-center justify-center shadow-xs animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[330px] sm:w-[380px] p-0 rounded-2xl border border-[#e5d9c3] bg-[#faf4e8] shadow-[0_10px_30px_rgba(0,0,0,0.1)] overflow-hidden z-50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#174824] text-white">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-300" />
            <span className="font-bold text-sm tracking-wide">Notifications</span>
            {unreadCount > 0 && (
              <Badge className="bg-amber-400 text-[#174824] hover:bg-amber-400 text-[10px] font-bold px-1.5 py-0">
                {unreadCount} new
              </Badge>
            )}
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              className="text-[11px] text-amber-200/90 hover:text-white flex items-center gap-1 font-semibold transition-colors cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark all read</span>
            </button>
          )}
        </div>

        {/* Push Notification Enable Banner (if not subscribed yet) */}
        {showPushPrompt && (
          <div className="p-3 bg-amber-50/90 border-b border-amber-200/80 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Volume2 className="w-4 h-4 text-amber-700 flex-shrink-0 animate-bounce" />
              <p className="text-xs text-amber-900 font-semibold truncate">
                Enable instant browser alerts
              </p>
            </div>
            <Button
              size="sm"
              disabled={isPushLoading}
              onClick={subscribeUser}
              className="h-7 text-[11px] px-2.5 bg-[#174824] hover:bg-[#174824]/90 text-white rounded-lg font-bold cursor-pointer flex-shrink-0"
            >
              {isPushLoading ? "Enabling..." : "Allow Push"}
            </Button>
          </div>
        )}

        {/* Notification List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#e5d9c3]/50">
          {notifications.length === 0 ? (
            <div className="py-12 px-4 text-center">
              <div className="relative w-8 h-8 mx-auto mb-2 opacity-50">
                <Image
                  src="/assests/flower-icon.png"
                  alt="Lotus"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-xs font-bold text-[#174824]">No New Notifications</p>
              <p className="text-[11px] text-[#8c7865] mt-0.5">
                All Glories to Srila Prabhupada 🙏
              </p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => handleNotificationClick(item)}
                className={`p-3.5 flex items-start gap-3 hover:bg-[#f2ece0] transition-colors cursor-pointer ${
                  !item.isRead ? "bg-[#fffdfa]" : "bg-transparent opacity-85"
                }`}
              >
                {/* Type Icon Badge */}
                <div className="w-8 h-8 rounded-xl bg-[#174824]/10 border border-[#174824]/20 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
                  {getNotificationIcon(item.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <p
                      className={`text-xs truncate ${
                        !item.isRead ? "font-bold text-[#2c221e]" : "font-medium text-[#5a4836]"
                      }`}
                    >
                      {item.title}
                    </p>
                    <span className="text-[10px] text-[#8c7865] font-medium flex-shrink-0">
                      {formatTimeAgo(item.createdAt)}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5a4836] line-clamp-2 leading-relaxed">
                    {item.body}
                  </p>

                  {item.actionUrl && (
                    <p className="text-[10px] font-bold text-[#174824] flex items-center gap-1 pt-0.5 hover:underline">
                      <span>View details</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </p>
                  )}
                </div>

                {/* Unread indicator dot */}
                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer: Push Status */}
        <div className="px-4 py-2 bg-[#f2ece0] border-t border-[#e5d9c3] flex items-center justify-between text-[11px]">
          <div className="flex items-center gap-1.5 text-[#5a4836] font-medium">
            <span className={`w-2 h-2 rounded-full ${isSubscribed ? "bg-emerald-500" : "bg-amber-500"}`} />
            <span>{isSubscribed ? "Push Alerts: Active" : "Push Alerts: Inactive"}</span>
          </div>

          {!isSubscribed && (
            <button
              type="button"
              onClick={subscribeUser}
              disabled={isPushLoading}
              className="text-[#174824] hover:underline font-bold cursor-pointer"
            >
              {isPushLoading ? "Syncing..." : "Sync Push Token"}
            </button>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
