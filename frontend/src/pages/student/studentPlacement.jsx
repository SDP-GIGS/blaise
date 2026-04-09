import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { apiClient } from "@/lib/apiClient";
import {
  ClipboardCheck, User, Building2, BookOpen, Search,
  Filter, Eye, CheckCircle2, Clock, AlertCircle, X,
  ChevronRight,
} from "lucide-react";

const STATUS_META = {
  approved:  { label: "Approved",      bg: "bg-emerald-100 text-emerald-800 border-emerald-200" },
  submitted: { label: "Pending Review", bg: "bg-amber-100 text-amber-800 border-amber-200"     },
  reviewed:  { label: "Reviewed",       bg: "bg-sky-100 text-sky-800 border-sky-200"            },
  rejected:  { label: "Rejected",       bg: "bg-red-100 text-red-800 border-red-200"            },
  draft:     { label: "Draft",          bg: "bg-gray-100 text-gray-600 border-gray-200"         },
};

