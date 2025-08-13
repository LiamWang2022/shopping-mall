import React from 'react'

export const SkeletonCard: React.FC = () => (
  <div className="rounded-2xl border overflow-hidden bg-white animate-pulse">
    <div className="aspect-[4/3] bg-gray-100" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-100 rounded" />
      <div className="h-4 bg-gray-100 rounded w-2/3" />
      <div className="h-6 bg-gray-100 rounded w-1/3 mt-2" />
    </div>
  </div>
)