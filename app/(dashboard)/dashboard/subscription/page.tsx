"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface Subscription {
  id: number;
  name: string;
  planName: string | null;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
  subscriptionEndDate: string | null;
  teamMembers: {
    id: number;
    userId: number;
    role: string;
    joinedAt: string;
    user: {
      id: number;
      name: string | null;
      email: string;
    };
  }[];
}

// ------------------- Helper Functions -------------------
const formatDuration = (days: number): string => {
  if (days < 0) {
    return "Expired";
  } else if (days === 0) {
    return "Expires today";
  } else if (days < 30) {
    return `${days} day${days !== 1 ? 's' : ''} left`;
  } else if (days < 365) {
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} left`;
  } else {
    const years = Math.floor(days / 365);
    const remainingMonths = Math.floor((days % 365) / 30);
    if (remainingMonths > 0) {
      return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} left`;
    }
    return `${years} year${years !== 1 ? 's' : ''} left`;
  }
};

// ------------------- Subscription Page -------------------
export default function SubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "trialing" | "canceled" | "unpaid"
  >("all");

  // ------------------- Data Fetching -------------------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const subscriptionsResponse = await fetch("/api/subscriptions");

        if (subscriptionsResponse.ok) {
          const subscriptionsData = await subscriptionsResponse.json();
          setSubscriptions(subscriptionsData);
        } else {
          toast.error("Failed to fetch subscription data");
        }
      } catch (error) {
        console.error("Error fetching subscription data:", error);
        toast.error("Failed to fetch subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ------------------- Filtering -------------------
  useEffect(() => {
    let filtered = subscriptions.filter((subscription) => {
      const userName = subscription.teamMembers[0]?.user.name || "";
      const userEmail = subscription.teamMembers[0]?.user.email || "";
      const teamName = subscription.name || "";

      return (
        userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teamName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (filterStatus !== "all") {
      filtered = filtered.filter((subscription) => subscription.subscriptionStatus === filterStatus);
    }

    setFilteredSubscriptions(filtered);
  }, [searchTerm, filterStatus, subscriptions]);

  // ------------------- Render -------------------
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading subscriptions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        <Input
          placeholder="Search subscriptions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <div className="flex gap-4">
          <Select
            value={filterStatus}
            onValueChange={(value) =>
              setFilterStatus(value as "all" | "active" | "trialing" | "canceled" | "unpaid")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="trialing">Trialing</SelectItem>
              <SelectItem value="canceled">Canceled</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Subscriptions Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Purchase Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSubscriptions.map((subscription) => {
            const user = subscription.teamMembers[0]?.user;
            const purchaseDate = new Date(subscription.createdAt);
            const currentDate = new Date();

            // Use actual subscription end date from database
            const subscriptionEndDate = subscription.subscriptionEndDate ? new Date(subscription.subscriptionEndDate) : null;
            const durationDays = subscriptionEndDate
              ? Math.floor((subscriptionEndDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24))
              : 0;

            return (
              <TableRow key={subscription.id}>
                <TableCell className="font-medium">{user?.name || "-"}</TableCell>
                <TableCell>{user?.email || "-"}</TableCell>
                <TableCell>{subscription.planName || "Free"}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      subscription.subscriptionStatus === "active" ? "default" :
                      subscription.subscriptionStatus === "trialing" ? "secondary" :
                      "destructive"
                    }
                  >
                    {subscription.subscriptionStatus || "inactive"}
                  </Badge>
                </TableCell>
                <TableCell>{purchaseDate.toLocaleDateString()}</TableCell>
                <TableCell>
                  {subscriptionEndDate
                    ? subscriptionEndDate.toLocaleDateString()
                    : "No end date"
                  }
                </TableCell>
                <TableCell>{formatDuration(durationDays)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
