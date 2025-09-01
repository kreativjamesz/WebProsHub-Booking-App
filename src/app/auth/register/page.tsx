'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { clearError, setUser, setToken, setError } from '@/stores/slices/auth/auth.slice';
import { useRegisterMutation } from '@/stores/slices/auth/auth.api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Eye, EyeOff, Loader2, User, Building, Mail, Lock, UserPlus, ArrowRight, Users, Store } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['CUSTOMER', 'BUSINESS_OWNER']),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { error, isAuthenticated } = useAppSelector(state => state.auth);
    
    // RTK Query hook
    const [registerUser, { isLoading }] = useRegisterMutation();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'CUSTOMER',
        },
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const onSubmit = async (data: RegisterFormData) => {
        const { confirmPassword, ...registerData } = data;
        
        try {
            dispatch(clearError());
            const result = await registerUser(registerData).unwrap();
            
            // Store in Redux store
            dispatch(setUser(result.user));
            dispatch(setToken(result.token));
            
            // Redirect to home page
            router.push('/');
        } catch (error: unknown) {
            if (error instanceof Error) {
                dispatch(setError(error.message));
            } else {
                dispatch(setError("Registration failed"));
            }
        }
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex justify-center">
                        <div className="p-3 bg-primary/10 rounded-full">
                            <Building className="h-8 w-8 text-primary" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Create your account</h1>
                        <p className="text-muted-foreground">
                            Join us and start your journey
                        </p>
                    </div>
                </div>

                {/* Register Form */}
                <Card className="border-2">
                    <CardHeader className="space-y-2">
                        <CardTitle className="text-xl text-center">Sign Up</CardTitle>
                        <CardDescription className="text-center">
                            Fill in your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <Alert className="border-destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-sm font-medium">
                                        Full Name
                                    </Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="name"
                                            placeholder="Enter your full name"
                                            {...register("name")}
                                            className={`pl-10 h-11 ${errors.name ? "border-destructive focus:border-destructive" : ""}`}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="Enter your email"
                                            {...register("email")}
                                            className={`pl-10 h-11 ${errors.email ? "border-destructive focus:border-destructive" : ""}`}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="text-sm text-destructive">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-sm font-medium">
                                        Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Create a password"
                                            {...register("password")}
                                            className={`pl-10 pr-10 h-11 ${errors.password ? "border-destructive focus:border-destructive" : ""}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.password && (
                                        <p className="text-sm text-destructive">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium">
                                        Confirm Password
                                    </Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm your password"
                                            {...register("confirmPassword")}
                                            className={`pl-10 pr-10 h-11 ${errors.confirmPassword ? "border-destructive focus:border-destructive" : ""}`}
                                        />
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            className="absolute right-0 top-0 h-11 px-3 py-2 hover:bg-transparent"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4 text-muted-foreground" />
                                            ) : (
                                                <Eye className="h-4 w-4 text-muted-foreground" />
                                            )}
                                        </Button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-medium">Account Type</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            type="button"
                                            variant={selectedRole === 'CUSTOMER' ? 'default' : 'outline'}
                                            className="h-11 flex items-center space-x-2"
                                            onClick={() => register('role').onChange({ target: { value: 'CUSTOMER' } })}
                                        >
                                            <Users className="h-4 w-4" />
                                            <span>Customer</span>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={selectedRole === 'BUSINESS_OWNER' ? 'default' : 'outline'}
                                            className="h-11 flex items-center space-x-2"
                                            onClick={() => register('role').onChange({ target: { value: 'BUSINESS_OWNER' } })}
                                        >
                                            <Store className="h-4 w-4" />
                                            <span>Business</span>
                                        </Button>
                                    </div>
                                    <input
                                        type="hidden"
                                        {...register("role")}
                                    />
                                </div>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-11" 
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Create Account
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Footer */}
                <div className="text-center space-y-4">
                    <Separator />
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Already have an account?{" "}
                            <Link 
                                href="/auth/login" 
                                className="font-medium text-primary hover:underline"
                            >
                                Sign in here
                            </Link>
                        </p>
                        <p className="text-sm text-muted-foreground">
                            <Link 
                                href="/" 
                                className="font-medium text-primary hover:underline flex items-center justify-center space-x-1"
                            >
                                <ArrowRight className="h-3 w-3" />
                                <span>Back to home</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
