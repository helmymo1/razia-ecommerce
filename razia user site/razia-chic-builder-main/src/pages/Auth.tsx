import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Logo from '@/components/Logo';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useGoogleLogin } from '@react-oauth/google';

const Auth: React.FC = () => {
  const { language } = useLanguage();
  const { user, signUp, signIn, signInWithGoogle, signInWithApple } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/shop';
  
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          toast.error(language === 'ar' ? 'خطأ في تسجيل الدخول' : error.message);
        } else {
          toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
          navigate(redirect);
        }
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast.error(language === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
          setIsLoading(false);
          return;
        }
        
        const { error } = await signUp(formData.email, formData.password, {
          first_name: formData.firstName,
          last_name: formData.lastName,
        });
        
        if (error) {
          toast.error(language === 'ar' ? 'خطأ في إنشاء الحساب' : error.message);
        } else {
          toast.success(language === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
          navigate(redirect);
        }
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'حدث خطأ غير متوقع' : 'An unexpected error occurred');
    }
    
    setIsLoading(false);
  };

  // Google Sign-In handler - receives credential from GoogleLogin component
  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsLoading(true);
    try {
      const { error } = await signInWithGoogle(credentialResponse.credential);
      if (error) {
        toast.error(language === 'ar' ? 'خطأ في تسجيل الدخول مع Google' : error.message);
      } else {
        toast.success(language === 'ar' ? 'تم تسجيل الدخول بنجاح' : 'Signed in successfully');
        navigate(redirect);
      }
    } catch (err: any) {
      toast.error(err.message || 'Google sign-in failed');
    }
    setIsLoading(false);
  };

  const handleGoogleError = () => {
    toast.error(language === 'ar' ? 'خطأ في تسجيل الدخول مع Google' : 'Google sign-in failed');
  };

  const handleGoogleSignIn = useGoogleLogin({
    onSuccess: (tokenResponse) => handleGoogleSuccess({ credential: tokenResponse.access_token }),
    onError: handleGoogleError,
  });

  const handleAppleSignIn = async () => {
    // Apple Sign-In requires additional setup with Apple Developer Program
    // For now, show a toast indicating it's coming soon
    toast.info(language === 'ar' ? 'قريباً' : 'Apple Sign-In coming soon');
  };

  const inputClasses = "h-12 pl-12 bg-background border-border focus:border-primary transition-colors";

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 lg:px-20 py-12">
        <div className="w-full max-w-md mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Link to="/">
              <Logo size="md" />
            </Link>
          </div>

          {/* Title */}
          <motion.div
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-heading text-3xl lg:text-4xl font-bold text-foreground mb-2">
              {isLogin 
                ? (language === 'ar' ? 'مرحباً بعودتك' : 'Welcome Back')
                : (language === 'ar' ? 'إنشاء حساب' : 'Create Account')
              }
            </h1>
            <p className="text-muted-foreground">
              {isLogin 
                ? (language === 'ar' ? 'سجل دخولك للوصول إلى حسابك' : 'Sign in to access your account')
                : (language === 'ar' ? 'انضم إلينا واكتشف أحدث صيحات الموضة' : 'Join us and discover the latest fashion trends')
              }
            </p>
          </motion.div>

          {/* Social Login - Moved to top */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-12"
                onClick={handleGoogleSignIn}
                type="button"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button 
                variant="outline" 
                className="h-12"
                onClick={handleAppleSignIn}
                type="button"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple
              </Button>
            </div>

            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-background text-muted-foreground">
                  {language === 'ar' ? 'أو تابع بالبريد الإلكتروني' : 'Or continue with email'}
                </span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'الاسم الأول' : 'First Name'}</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'الاسم الأول' : 'First Name'}
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className={inputClasses}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{language === 'ar' ? 'الاسم الأخير' : 'Last Name'}</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={language === 'ar' ? 'الاسم الأخير' : 'Last Name'}
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className={inputClasses}
                        required={!isLogin}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'البريد الإلكتروني' : 'Email'}</Label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder={language === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>{language === 'ar' ? 'كلمة المرور' : 'Password'}</Label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={language === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={cn(inputClasses, 'pr-12')}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2"
                >
                  <Label>{language === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter your password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className={inputClasses}
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {isLogin && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-sm text-primary hover:underline"
                >
                  {language === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                </button>
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  />
                  {language === 'ar' ? 'جاري التحميل...' : 'Loading...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isLogin 
                    ? (language === 'ar' ? 'تسجيل الدخول' : 'Sign In')
                    : (language === 'ar' ? 'إنشاء الحساب' : 'Create Account')
                  }
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </form>

          {/* Toggle Auth Mode */}
          <p className="mt-8 text-center text-muted-foreground">
            {isLogin 
              ? (language === 'ar' ? 'ليس لديك حساب؟' : "Don't have an account?")
              : (language === 'ar' ? 'لديك حساب بالفعل؟' : 'Already have an account?')
            }
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-primary font-semibold hover:underline"
            >
              {isLogin 
                ? (language === 'ar' ? 'سجل الآن' : 'Sign Up')
                : (language === 'ar' ? 'سجل دخولك' : 'Sign In')
              }
            </button>
          </p>
        </div>
      </div>

      {/* Right Panel - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-teal to-navy" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center mix-blend-overlay opacity-30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-md"
          >
            <h2 className="font-heading text-4xl font-bold mb-4">
              {language === 'ar' ? 'اكتشفي أناقتك' : 'Discover Your Elegance'}
            </h2>
            <p className="text-lg text-white/80">
              {language === 'ar' 
                ? 'انضمي إلى مجتمعنا واستمتعي بتجربة تسوق فريدة مع أحدث صيحات الموضة العربية والعالمية.'
                : 'Join our community and enjoy a unique shopping experience with the latest Arab and international fashion trends.'
              }
            </p>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-12 left-12 right-12 flex items-center justify-between text-white/60 text-sm"
          >
            <span>© 2024 Razia</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">
                {language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {language === 'ar' ? 'الشروط والأحكام' : 'Terms of Service'}
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
