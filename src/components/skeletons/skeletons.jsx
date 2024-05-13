import React from 'react';

const SkeletonLoader = () => {
  return (
    <div className="animate-pulse bg-[#222222] rounded-lg w-full h-full">
      {/* Adding a shimmer effect */}
      <div className="bg-[#3333336f] h-full w-1/4 absolute animate-pulse"></div>
    </div>
  );
};

export default SkeletonLoader;
