
import React, { useState } from 'react';
import { Star, CheckCircle, XCircle, Search } from 'lucide-react';

const ReviewsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reviews Moderation</h1>
      
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
               <img src={`https://picsum.photos/seed/${i}/80/80`} className="w-20 h-20 rounded-lg object-cover" alt="Product" />
               <p className="text-xs text-center font-bold text-gray-400 mt-2">PRD-00{i}</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={14} className={j < 4 ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-medium">Oct 24, 2023</span>
              </div>
              <p className="text-sm font-bold text-gray-900">Great quality but took a bit long to ship.</p>
              <p className="text-sm text-gray-500">"The material is premium, fit is as expected. However, delivery was delayed by 2 days. Overall happy with the purchase."</p>
              <div className="flex items-center space-x-2 pt-2">
                <img src="https://picsum.photos/seed/user1/24/24" className="rounded-full" alt="user" />
                <span className="text-xs font-bold text-gray-700">Alex Thompson</span>
              </div>
            </div>
            <div className="flex sm:flex-col justify-end gap-2">
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-green-50 text-green-600 rounded-lg text-sm font-bold hover:bg-green-100 transition-colors">
                <CheckCircle size={16} className="mr-2" /> Approve
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors">
                <XCircle size={16} className="mr-2" /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewsPage;
