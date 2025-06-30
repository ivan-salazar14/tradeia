import { Metadata } from "next"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export const metadata: Metadata = {
  title: "Dashboard - Tradeia",
  description: "Tu panel de control personalizado para señales de trading",
}

export default function DashboardPage() {
  return <DashboardContent />
} 