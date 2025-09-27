"use client"

import Landing from "../components/Landing"

export default function Page() {
  const handleGetHealthy = () => {
    console.log("Get Healthy clicked! Wire this up to open login modal or navigate to /dashboard")
    // You can replace this with your actual login/signup logic
    alert("Get Healthy clicked! Check console for integration details.")
  }

  const handleSeeDemo = () => {
    console.log("See Demo clicked! This scrolls to demo section or shows features")
  }

  return <Landing onGetHealthy={handleGetHealthy} onSeeDemo={handleSeeDemo} showDemoPreview={true} />
}
