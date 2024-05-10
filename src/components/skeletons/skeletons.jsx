// Skeleton.jsx
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

// Define keyframe animations
const pulseAnimation = keyframes`
  0%, 100% { background-color: var(--global-primary-skeleton); }
  50% { background-color: var(--global-secondary-skeleton); }
`;
const popInAnimation = keyframes`
  0%, 100% { opacity: 0; transform: scale(0.95); }
  50% { opacity: 1; transform: scale(1); }
  75% { opacity: 0.5; transform: scale(1); }
`;
const playerPopInAnimation = keyframes`
  0% { opacity: 0; transform: scale(0.9); }
  100% { opacity: 1; transform: scale(1); }
`;
const SkeletonPulse = keyframes`
  0%, 100% { background-color: var(--global-primary-skeleton); }
  25%, 75% { background-color: var(--global-secondary-skeleton); }
  50% { background-color: var(--global-primary-skeleton); }
`;

// Define animation mixin
const animationMixin = css`
  animation:
    ${pulseAnimation} 1s infinite,
    ${popInAnimation} 1s infinite;
`;

// Base styled component for skeleton elements
const BaseSkeleton = styled.div`
  background: var(--global-primary-skeleton);
  border-radius: var(--global-border-radius);
  color: white; /* Add white color */
`;

// Styled components for skeleton cards
const SkeletonCards = styled(BaseSkeleton)`
  width: 100%;
  height: 0;
  padding-top: calc(100% * 184 / 133);
  margin-bottom: 5.1rem;
  ${animationMixin};
`;

const SkeletonTitle = styled(BaseSkeleton)`
  height: 1.4rem;
  margin: 0.5rem 0 0.3rem;
  ${animationMixin};
`;

const SkeletonDetails = styled(SkeletonTitle)`
  height: 1.3rem;
  width: 80%;
`;

const SkeletonSlides = styled(BaseSkeleton)`
  width: 100%;
  height: 24rem;
  ${({ loading }) => !loading && animationMixin}
  @media (max-width: 1000px) {
    height: 20rem;
  }
  @media (max-width: 500px) {
    height: 18rem;
  }
`;

const PlayerSkeleton = styled(BaseSkeleton)`
  position: relative;
  padding-top: 56.25%;
  width: 100%;
  height: 0;
  animation:
    ${SkeletonPulse} 2.5s ease-in-out infinite,
    ${playerPopInAnimation} 0.5s ease-out;
`;

const PlayerButtons = styled(BaseSkeleton)`
  position: relative;
  height: 23px;
  width: 100%;
  animation:
    ${SkeletonPulse} 2.5s ease-in-out infinite,
    ${playerPopInAnimation} 0.5s ease-out;
`;

const SkeletonImage = styled(BaseSkeleton)`
  width: 100%;
  height: 100%;
`;

// Skeleton card component
export const SkeletonCard = React.memo(() => (
  <SkeletonCards>
    <SkeletonTitle />
    <SkeletonDetails />
    <SkeletonDetails />
  </SkeletonCards>
));

// Skeleton slide component
export const SkeletonSlide = React.memo(({ loading }) => (
  <SkeletonSlides loading={loading}>
    <SkeletonImage />
  </SkeletonSlides>
));

// Skeleton player component
export const SkeletonPlayer = React.memo(() => (
  <div>
    <PlayerSkeleton />
    <PlayerButtons />
  </div>
));

// Main skeleton component
const Skeleton = () => {
  return (
    <div className='z-40 text-yellow-200 mt-64'>
      <h1>Your App Content</h1>
      <SkeletonCard loading={"true"} key={"hello"}/>
      hghfgjjjjyjgfgjytjttuuy5utejtujyu65 
      <SkeletonSlide loading={"true"} />
      <SkeletonPlayer loading={"true"} />
    </div>
  );
};

export default Skeleton;
