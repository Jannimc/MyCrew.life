import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Calendar, CreditCard, LifeBuoy, Clock, MapPin, Star } from 'lucide-react';
import { MainLayout } from '../components/layout/MainLayout';
import { useAuth } from '../hooks/useAuth';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { QuickLinks } from '../components/dashboard/QuickLinks';
import { RecentActivity } from '../components/dashboard/RecentActivity';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null; // Handle unauthorized access
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your cleaning services</p>
              </div>
              <button
                onClick={() => navigate('/quote')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity duration-200"
              >
                Book New Cleaning
              </button>
            </div>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <DashboardStats />
              <RecentActivity />
            </div>

            {/* Quick Links Sidebar */}
            <div className="space-y-6">
              <QuickLinks />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}