"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  UserPlus, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Users,
  TrendingUp,
  Shield
} from "lucide-react";

export default function StartBusinessPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false); // This would come from auth context

  const handleStartOnboarding = () => {
    if (isAuthenticated) {
      router.push('/start-business/onboarding');
    } else {
      router.push('/start-business/register');
    }
  };

  const benefits = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Reach More Customers",
      description: "Connect with customers actively looking for your services"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Grow Your Business",
      description: "Increase bookings and revenue with our platform"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Professional Platform",
      description: "Build trust with a professional online presence"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Create Account",
      description: "Sign up or log in to get started",
      icon: <UserPlus className="h-5 w-5" />
    },
    {
      number: 2,
      title: "Business Details",
      description: "Tell us about your business and services",
      icon: <Building2 className="h-5 w-5" />
    },
    {
      number: 3,
      title: "Go Live",
      description: "Start accepting bookings from customers",
      icon: <CheckCircle className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Start Your Business</h1>
                <p className="text-gray-600">Join thousands of successful businesses</p>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              Back to Home
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Turn Your Skills Into a
            <span className="text-blue-600"> Thriving Business</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Join our platform and start accepting bookings from customers in your area. 
            Whether you&apos;re a freelancer, small business owner, or entrepreneur, 
            we&apos;ll help you get started in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={handleStartOnboarding}
              className="text-lg px-8 py-6"
            >
              Start Your Business
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center border-0 shadow-lg">
                <CardContent className="pt-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <div className="text-blue-600">
                      {benefit.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gray-300 transform -translate-y-1/2 z-0" />
                )}
                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4 text-white">
                    <span className="text-xl font-bold">{step.number}</span>
                  </div>
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                    <div className="text-blue-600">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Success Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="ml-2">Verified</Badge>
                </div>
                <p className="text-gray-700 mb-4">
                  &quot;Since joining the platform, my beauty salon has seen a 40% increase in bookings. 
                  The automated scheduling system has saved me hours every week.&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Sarah Johnson</p>
                    <p className="text-sm text-gray-600">Beauty Salon Owner</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <Badge variant="secondary" className="ml-2">Verified</Badge>
                </div>
                <p className="text-gray-700 mb-4">
                  &quot;As a personal trainer, this platform has helped me expand my client base 
                  and manage my schedule efficiently. Highly recommended!&quot;
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gray-300 rounded-full mr-3" />
                  <div>
                    <p className="font-semibold text-gray-900">Mike Chen</p>
                    <p className="text-sm text-gray-600">Personal Trainer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Business Journey?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of successful business owners who have transformed 
                their services into thriving businesses with our platform.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={handleStartOnboarding}
                className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-gray-100"
              >
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
