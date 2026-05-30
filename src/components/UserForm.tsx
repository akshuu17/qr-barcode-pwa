import React, { useState } from 'react';
import type { UserRegistrationPayload } from '../types/record';
import { User, Phone, Mail, MapPin, Loader2, CheckCircle2 } from 'lucide-react';


interface UserFormProps {
  onSubmit: (data: UserRegistrationPayload) => Promise<void>;
  isLoading: boolean;
}

export const UserForm: React.FC<UserFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<UserRegistrationPayload>({
    name: '',
    mobile: '',
    email: '',
    address: '',
  });

  const [errors, setErrors] = useState<Partial<UserRegistrationPayload>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'name':
        return value.trim() ? '' : 'Name is required';
      case 'mobile':
        if (!value.trim()) return 'Mobile number is required';
        return /^\+?[\d\s-]{10,15}$/.test(value)
          ? ''
          : 'Please enter a valid mobile number (min 10 digits)';
      case 'email':
        if (!value.trim()) return 'Email is required';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ''
          : 'Please enter a valid email address';
      case 'address':
        return value.trim() ? '' : 'Address is required';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields on submit
    const newErrors: Partial<UserRegistrationPayload> = {};
    Object.keys(formData).forEach((key) => {
      const field = key as keyof UserRegistrationPayload;
      const err = validateField(field, formData[field]);
      if (err) {
        newErrors[field] = err;
      }
    });

    setErrors(newErrors);
    setTouched({
      name: true,
      mobile: true,
      email: true,
      address: true,
    });

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const getInputClass = (name: keyof UserRegistrationPayload) => {
    const base = "w-full pl-10 pr-4 py-3 bg-white/[0.03] border rounded-xl text-white placeholder-slate-550 focus:outline-none focus:ring-2 transition-all duration-300 backdrop-blur-md";
    if (touched[name] && errors[name]) {
      return `${base} border-red-500/30 focus:border-red-500 focus:ring-red-500/10`;
    }
    if (touched[name] && !errors[name] && formData[name]) {
      return `${base} border-emerald-500/30 focus:border-emerald-500 focus:ring-emerald-500/10`;
    }
    return `${base} border-white/[0.08] focus:border-indigo-500 focus:ring-indigo-500/10`;
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <div className="relative group">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Full Name
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <User size={18} />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="John Doe"
            className={getInputClass('name')}
          />
          {touched.name && !errors.name && formData.name && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
        {touched.name && errors.name && (
          <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1 animate-fadeIn">
            <span>●</span> {errors.name}
          </p>
        )}
      </div>

      {/* Mobile Field */}
      <div className="relative group">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Mobile Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <Phone size={18} />
          </div>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="+1 234 567 8900"
            className={getInputClass('mobile')}
          />
          {touched.mobile && !errors.mobile && formData.mobile && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
        {touched.mobile && errors.mobile && (
          <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1 animate-fadeIn">
            <span>●</span> {errors.mobile}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="relative group">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <Mail size={18} />
          </div>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="john@example.com"
            className={getInputClass('email')}
          />
          {touched.email && !errors.email && formData.email && (
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
        {touched.email && errors.email && (
          <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1 animate-fadeIn">
            <span>●</span> {errors.email}
          </p>
        )}
      </div>

      {/* Address Field */}
      <div className="relative group">
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Residential Address
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3.5 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
            <MapPin size={18} />
          </div>
          <textarea
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={isLoading}
            placeholder="123 Luxury Avenue, Beverly Hills, CA"
            className={`${getInputClass('address')} pl-10 resize-none`}
          />
          {touched.address && !errors.address && formData.address && (
            <div className="absolute top-3.5 right-3.5 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          )}
        </div>
        {touched.address && errors.address && (
          <p className="mt-1.5 text-xs text-red-400 font-medium flex items-center gap-1 animate-fadeIn">
            <span>●</span> {errors.address}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full relative overflow-hidden group flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 disabled:opacity-50 transition-all duration-300 active:scale-[0.98] cursor-pointer"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            <span>Creating Record...</span>
          </>
        ) : (
          <>
            <span>Submit Registration</span>
          </>
        )}
      </button>
    </form>
  );
};
