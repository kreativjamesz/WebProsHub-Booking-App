"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Globe,
  Image,
  Upload
} from "lucide-react";
import { toast } from "sonner";

interface BusinessFormData {
  // Basic Information
  name: string;
  description: string;
  categoryId: string;
  
  // Contact Information
  phone: string;
  email: string;
  website: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Media
  logo: File | null;
  coverImage: File | null;
}

const categories = [
  { id: "beauty-wellness", name: "Beauty & Wellness", icon: "💅" },
  { id: "health-fitness", name: "Health & Fitness", icon: "💪" },
  { id: "food-dining", name: "Food & Dining", icon: "🍽️" },
  { id: "professional-services", name: "Professional Services", icon: "💼" },
  { id: "home-garden", name: "Home & Garden", icon: "🏠" },
  { id: "education-training", name: "Education & Training", icon: "📚" },
  { id: "automotive", name: "Automotive", icon: "🚗" },
  { id: "technology", name: "Technology", icon: "💻" },
];

export default function BusinessOnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    description: "",
    categoryId: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    logo: null,
    coverImage: null,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field: keyof BusinessFormData, value: string | File | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (field: 'logo' | 'coverImage', file: File) => {
    handleInputChange(field, file);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1: // Basic Information
        return !!(formData.name && formData.description && formData.categoryId);
      case 2: // Contact Information
        return !!(formData.phone && formData.email);
      case 3: // Location
        return !!(formData.address && formData.city && formData.state && formData.zipCode);
      case 4: // Media
        return true; // Optional
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    } else {
      toast.error("Please fill in all required fields");
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Here you would submit the form data to your API
      console.log("Submitting business data:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Business created successfully!");
      router.push('/start-business/success');
    } catch (error) {
      toast.error("Failed to create business. Please try again.");
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="name">Business Name *</Label>
              <Input
                id="name"
                placeholder="Enter your business name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Business Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your business does and what services you offer"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="mt-2"
                rows={4}
              />
            </div>
            
            <div>
              <Label htmlFor="category">Business Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <span className="mr-2">{category.icon}</span>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your business phone number"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your business email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label htmlFor="website">Website (Optional)</Label>
              <Input
                id="website"
                type="url"
                placeholder="https://yourwebsite.com"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="mt-2"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="Enter your business address"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="mt-2"
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  placeholder="ZIP Code"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <Label>Business Logo (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('logo', file);
                    }}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload a file</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
              {formData.logo && (
                <div className="mt-2 flex items-center space-x-2">
                  <Image className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{formData.logo.name}</span>
                </div>
              )}
            </div>
            
            <div>
              <Label>Cover Image (Optional)</Label>
              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload('coverImage', file);
                    }}
                    className="hidden"
                    id="cover-upload"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer">
                    <span className="text-blue-600 hover:text-blue-500">Upload a file</span>
                    <span className="text-gray-500"> or drag and drop</span>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
              {formData.coverImage && (
                <div className="mt-2 flex items-center space-x-2">
                  <Image className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">{formData.coverImage.name}</span>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Basic Information";
      case 2: return "Contact Information";
      case 3: return "Location";
      case 4: return "Media & Branding";
      default: return "";
    }
  };

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1: return "Tell us about your business and what you do";
      case 2: return "How can customers reach you?";
      case 3: return "Where is your business located?";
      case 4: return "Add your logo and cover image to make your business stand out";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push('/start-business')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Business Onboarding</h1>
                <p className="text-sm text-gray-600">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-700">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <span className="text-blue-600 font-bold">{currentStep}</span>
              </div>
              <div>
                <CardTitle>{getStepTitle(currentStep)}</CardTitle>
                <CardDescription>{getStepDescription(currentStep)}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="flex items-center space-x-4">
            {currentStep < totalSteps && (
              <Button variant="outline" onClick={() => setCurrentStep(currentStep + 1)}>
                Skip for now
              </Button>
            )}
            
            <Button onClick={handleNext}>
              {currentStep === totalSteps ? (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Create Business
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-12">
          <div className="flex items-center justify-center space-x-4">
            {Array.from({ length: totalSteps }, (_, index) => (
              <div
                key={index}
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  index + 1 === currentStep
                    ? "bg-blue-600 border-blue-600 text-white"
                    : index + 1 < currentStep
                    ? "bg-green-500 border-green-500 text-white"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                {index + 1 < currentStep ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
