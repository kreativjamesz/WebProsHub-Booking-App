'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { registerUser, clearError } from '@/lib/stores/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Loader2, User, Building } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    role: z.enum(['customer', 'business_owner']),
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
    const { isLoading, error, isAuthenticated } = useAppSelector(state => state.auth);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            role: 'customer',
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
        dispatch(registerUser(registerData));
    };

    if (isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create your account</h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Join us and start your journey
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Sign Up</CardTitle>
                        <CardDescription>
                            Fill in your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    {...register('name')}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    {...register('email')}
                                    className={errors.email ? 'border-red-500' : ''}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        {...register('password')}
                                        className={errors.password ? 'border-red-500' : ''}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-red-500">{errors.password.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        {...register('confirmPassword')}
                                        className={errors.confirmPassword ? 'border-red-500' : ''}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Account Type</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            value="customer"
                                            {...register('role')}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            cursor-pointer rounded-lg border-2 p-4 text-center transition-all
                                            ${selectedRole === 'customer' 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}>
                                            <User className="h-6 w-6 mx-auto mb-2" />
                                            <div className="font-medium">Customer</div>
                                            <div className="text-sm text-gray-500">Book services</div>
                                        </div>
                                    </label>
                                    <label className="relative">
                                        <input
                                            type="radio"
                                            value="business_owner"
                                            {...register('role')}
                                            className="sr-only"
                                        />
                                        <div className={`
                                            cursor-pointer rounded-lg border-2 p-4 text-center transition-all
                                            ${selectedRole === 'business_owner' 
                                                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                                                : 'border-gray-200 hover:border-gray-300'
                                            }
                                        `}>
                                            <Building className="h-6 w-6 mx-auto mb-2" />
                                            <div className="font-medium">Business Owner</div>
                                            <div className="text-sm text-gray-500">Offer services</div>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href="/auth/login"
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
