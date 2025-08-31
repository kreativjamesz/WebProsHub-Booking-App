"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Building2, 
  Calendar, 
  Users, 
  Settings,
  ArrowRight,
  Home,
  BarChart3
} from "lucide-react";

export default function BusinessSuccessPage() {
  const router = useRouter();

  const nextSteps = [
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Set Your Availability",
      description: "Configure your working hours and availability for bookings",
      action: "Set Schedule",
      href: "/business/schedule"
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Add Your Services",
      description: "Create service listings with pricing and descriptions",
      action: "Add Services",
      href: "/business/services"
    },
    {
      icon: <Settings className="h-5 w-5" />,
      title: "Customize Your Profile",
      description: "Add photos, update information, and set preferences",
      action: "Customize",
      href: "/business/profile"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Building2 className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Business Created!</h1>
                <p className="text-gray-600">Welcome to our platform</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Congratulations! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Your business has been successfully created and is now live on our platform. 
            Customers can start finding and booking your services right away!
          </p>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            Business Status: Active
          </Badge>
        </div>

        {/* What Happens Next */}
        <Card className="mb-12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">What Happens Next?</CardTitle>
            <CardDescription>
              Here's what you can do to get your business fully operational
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {nextSteps.map((step, index) => (
                <div key={index} className="text-center p-6 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <div className="text-blue-600">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {step.description}
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(step.href)}
                  >
                    {step.action}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Your Business Dashboard</CardTitle>
            <CardDescription>
              Access key information and manage your business from one place
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-blue-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Total Bookings</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-green-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Services</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-purple-600 mb-2">0</div>
                <div className="text-sm text-gray-600">Customers</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold text-orange-600 mb-2">$0</div>
                <div className="text-sm text-gray-600">Revenue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => router.push('/business/dashboard')}
              className="text-lg px-8 py-6"
            >
              <BarChart3 className="mr-2 h-5 w-5" />
              Go to Dashboard
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              onClick={() => router.push('/business/profile')}
              className="text-lg px-8 py-6"
            >
              <Settings className="mr-2 h-5 w-5" />
              Complete Profile
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            onClick={() => router.push('/')}
            className="text-lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </div>

        {/* Tips */}
        <Card className="mt-12">
          <CardHeader>
            <CardTitle className="text-center">💡 Pro Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Optimize Your Profile</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add high-quality photos of your work</li>
                  <li>• Write detailed service descriptions</li>
                  <li>• Set competitive pricing</li>
                  <li>• Respond quickly to customer inquiries</li>
                </ul>
              </div>
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Grow Your Business</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Encourage customer reviews</li>
                  <li>• Offer special promotions</li>
                  <li>• Keep your availability updated</li>
                  <li>• Engage with your customers</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
