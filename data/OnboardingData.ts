export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  image: any;
}

export const onboardingSlides: OnboardingSlide[] = [
  {
    id: "1",
    title: "Track Student Progress",
    description: "Monitor grades, attendance, and performance easily.",
    image: require("@/assets/images/onboarding/onboarding1.png"),
  },
  {
    id: "2",
    title: "Manage School Activities",
    description: "Organize events, schedules, and resources efficiently.",
    image: require("@/assets/images/onboarding/onboarding2.png"),
  },
  {
    id: "3",
    title: "Simplify Communication",
    description: "Connect with students, parents, and teachers easily.",
    image: require("@/assets/images/onboarding/onboarding3.png"),
  },
];
