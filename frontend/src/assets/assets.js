// Admin UI content (for panels/side widgets)
export const adminShowsQuickActions = [
    { key: "show_report", label: "Generate Show Report", toast: "Generating show report..." },
    { key: "notify_users", label: "Send Notifications to Users", toast: "Sending notifications to users..." },
    { key: "update_prices", label: "Update Show Prices", toast: "Opening price update modal..." },
]

export const adminShowsRecentActivity = [
    { action: "Show added", details: "A new show was added", time: "10 min ago" },
    { action: "Show updated", details: "Show details were updated", time: "45 min ago" },
    { action: "Show deleted", details: "A show was removed", time: "2 hours ago" },
    { action: "Status changed", details: "Show status was changed", time: "5 hours ago" },
]

export const adminBookingsHelpActions = [
    { key: "contact_customer", label: "Contact Customer" },
    { key: "issue_refund", label: "Issue Refund" },
    { key: "resend_ticket", label: "Resend Ticket" },
]

export const adminBookingsRecentNotifications = [
    { text: "New booking received", time: "5 min ago" },
    { text: "Payment failed for a booking", time: "1 hour ago" },
    { text: "Customer requested cancellation", time: "3 hours ago" },
    { text: "Monthly revenue target achieved", time: "1 day ago" },
]
