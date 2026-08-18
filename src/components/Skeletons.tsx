import React from 'react';

export const CarouselSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-8">
      <div className="h-8 w-64 bg-slate-800 rounded-lg  mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[400px] flex flex-col items-center ">
            <div className="w-24 h-24 bg-slate-800 rounded-2xl mb-4" />
            <div className="w-3/4 h-6 bg-slate-800 rounded-md mb-2" />
            <div className="w-1/2 h-4 bg-slate-800 rounded-md mb-6" />
            <div className="w-full h-32 bg-slate-800 rounded-xl mb-4" />
            <div className="w-full h-12 bg-slate-800 rounded-xl mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const GridSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 mt-16 mb-24">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="h-8 w-48 bg-slate-800 rounded-lg " />
        <div className="h-10 w-full md:w-64 bg-slate-800 rounded-xl " />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-[300px] flex flex-col ">
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <div className="w-16 h-16 bg-slate-800 rounded-xl" />
                <div className="flex flex-col gap-2 pt-1">
                  <div className="w-32 h-5 bg-slate-800 rounded-md" />
                  <div className="w-20 h-4 bg-slate-800 rounded-md" />
                </div>
              </div>
              <div className="w-12 h-6 bg-slate-800 rounded-full" />
            </div>
            <div className="flex gap-2 mb-6 mt-2">
              <div className="w-20 h-6 bg-slate-800 rounded-full" />
              <div className="w-24 h-6 bg-slate-800 rounded-full" />
            </div>
            <div className="w-full h-12 bg-slate-800 rounded-xl mt-auto" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const AppSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar Skeleton */}
      <div className="h-20 bg-slate-900 border-b border-slate-800 w-full  flex items-center justify-between px-6">
        <div className="w-40 h-8 bg-slate-800 rounded-lg" />
        <div className="w-24 h-8 bg-slate-800 rounded-lg hidden md:block" />
      </div>
      {/* Hero Skeleton */}
      <div className="w-full h-64 bg-slate-900/50 flex flex-col items-center justify-center p-6 ">
        <div className="w-64 h-10 bg-slate-800 rounded-xl mb-4" />
        <div className="w-96 h-6 bg-slate-800 rounded-md max-w-full" />
      </div>
      <CarouselSkeleton />
      <GridSkeleton />
    </div>
  );
};
