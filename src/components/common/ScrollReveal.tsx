import React from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useScrollReveal } from '../../hooks/useScrollReveal';

type AnimationType = 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'fadeIn' | 'scaleUp' | 'slideUp';

interface ScrollRevealProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

const fadeUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeRight = keyframes`
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const scaleUp = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

const slideUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const animations = {
  fadeUp,
  fadeDown,
  fadeLeft,
  fadeRight,
  fadeIn,
  scaleUp,
  slideUp,
};

const RevealWrapper = styled.div<{
  $isVisible: boolean;
  $animation: AnimationType;
  $delay: number;
  $duration: number;
}>`
  opacity: 0;
  
  ${({ $isVisible, $animation, $delay, $duration }) =>
    $isVisible &&
    css`
      animation: ${animations[$animation]} ${$duration}s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      animation-delay: ${$delay}s;
    `}
`;

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'fadeUp',
  delay = 0,
  duration = 0.7,
  threshold = 0.1,
  className,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <RevealWrapper
      ref={ref}
      $isVisible={isVisible}
      $animation={animation}
      $delay={delay}
      $duration={duration}
      className={className}
    >
      {children}
    </RevealWrapper>
  );
};

// Stagger children animation wrapper
interface StaggerRevealProps {
  children: React.ReactNode;
  staggerDelay?: number;
  animation?: AnimationType;
  duration?: number;
  threshold?: number;
  className?: string;
}

const StaggerWrapper = styled.div``;

export const StaggerReveal: React.FC<StaggerRevealProps> = ({
  children,
  staggerDelay = 0.1,
  animation = 'fadeUp',
  duration = 0.6,
  threshold = 0.1,
  className,
}) => {
  const { ref, isVisible } = useScrollReveal({ threshold });

  return (
    <StaggerWrapper ref={ref} className={className}>
      {React.Children.map(children, (child, index) => (
        <RevealWrapper
          $isVisible={isVisible}
          $animation={animation}
          $delay={index * staggerDelay}
          $duration={duration}
        >
          {child}
        </RevealWrapper>
      ))}
    </StaggerWrapper>
  );
};

export default ScrollReveal;
