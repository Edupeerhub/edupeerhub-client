/**
 * ASSETS CONFIGURATION
 *
 * This file centralizes all images, icons, and media assets used in the landing page.
 * To replace placeholder assets with your actual assets:
 *
 * 1. Add your images to a public/images folder
 * 2. Update the URLs below to point to your actual image paths
 * 3. All components will automatically use your new assets!
 *
 * Format: Replace the Pexels URLs with your actual image paths like '/images/hero-bg.jpg'
 */

export const ASSETS = {
  // Hero Section
  hero: {
    backgroundImage: "/images/hero.png",
    alt: "Nigerian students studying together",
  },

  // About Section
  about: {
    studentImage: "/images/student.png",
    alt: "Student learning with laptop",
  },

  // Testimonials - User Profile Images
  testimonials: {
    ahmadJibril: {
      image:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      alt: "Ahmad Jibril profile photo",
    },
    monikoroHyelnayi: {
      image:
        "https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=150",
      alt: "Monikoro Hyelnayi profile photo",
    },
    taiwoGodson: {
      image:
        "https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150",
      alt: "Taiwo Godson profile photo",
    },
  },

  // Call-to-Action Section
  cta: {
    backgroundImage: "/images/cta.png",
    alt: "Students collaborating on learning",
  },

  // Logo (you can replace this with your actual logo path)
  logo: {
    image: "/images/logo.png", // Set to '/images/logo.png' when you have your logo, or leave null to use icon
    alt: "EduPeerHub Logo",
  },
};

/**
 * TESTIMONIALS DATA
 * Update the testimonial content here to match your actual user testimonials
 */
export const TESTIMONIALS = [
  {
    id: 1,
    name: "Olumide Balogun",
    role: "Secondary tutor",
    rating: 5,
    text: "Great education hub but should improve on their timing on classes.",
    image: ASSETS.testimonials.ahmadJibril.image,
    alt: ASSETS.testimonials.ahmadJibril.alt,
  },
  {
    id: 2,
    name: "Chinelo Okafor",
    role: "Student",
    rating: 5,
    text: "I'm so glad Edupeerhub exists. I have been able to grow in my field with the help of my tutor.",
    image: ASSETS.testimonials.monikoroHyelnayi.image,
    alt: ASSETS.testimonials.monikoroHyelnayi.alt,
  },
  {
    id: 3,
    name: "Abubakar Bello",
    role: "Student",
    rating: 5,
    text: "I was able to understand everything I was taught at the beginning but I got confused with virtue learning. Thanks to what happened to him and no one told me anything, they just changed him.",
    image: ASSETS.testimonials.taiwoGodson.image,
    alt: ASSETS.testimonials.taiwoGodson.alt,
  },
];

/**
 * FAQ DATA
 * Update these questions and answers to match your actual FAQ content
 */
export const FAQ_ITEMS = [
  {
    id: 1,
    question: "What subjects are covered?",
    answer:
      "EduPeerHub covers all major subjects required for WAEC, NECO, and JAMB examinations including Mathematics, English Language, Physics, Chemistry, Biology, Economics, Government, Literature, and more. Our tutors are qualified to teach across the Nigerian secondary school curriculum.",
  },
  {
    id: 2,
    question: "Who are the Tutors?",
    answer:
      "Our tutors are carefully vetted university undergraduates and recent graduates who have excelled in their fields. Each tutor goes through a rigorous verification process including credential checks, subject matter assessments, and teaching demonstrations to ensure they meet our high standards for quality education.",
  },
  {
    id: 3,
    question: "How do I become a Tutor?",
    answer:
      "To become a tutor on EduPeerHub, you need to be a current university undergraduate or recent graduate. Apply through our platform by submitting your credentials, academic transcripts, and completing our tutor assessment. Once verified and approved, you can start creating your availability and connecting with students.",
  },
  {
    id: 4,
    question: "Is EduPeerHub free to use?",
    answer:
      "EduPeerHub offers both free and premium features. Students can access our resource library and ask questions in the community forum for free. Live one-on-one tutoring sessions are available through affordable subscription plans designed to be accessible to Nigerian students. We also offer scholarship programs for students in need.",
  },
];

/**
 * HOW IT WORKS STEPS
 * These define the 6-step process displayed on the landing page
 */
export const HOW_IT_WORKS_STEPS = [
  {
    id: 1,
    title: "Join EduPeerHub",
    description:
      "Sign up and get guided towards the support of a tutor ready to teach.",
    icon: "UserPlus",
  },
  {
    id: 2,
    title: "Access Your Dashboard",
    description:
      "Instantly view your upcoming sessions, streaks, past completions and more.",
    icon: "Monitor",
  },
  {
    id: 3,
    title: "Join Live Sessions",
    description:
      "Learn with others in real-time online sessions tailored to your academic needs.",
    icon: "Video",
  },
  {
    id: 4,
    title: "Explore the Library",
    description:
      "Access learning resources, notes and past WAEC/NECO/JAMB questions materials tailored to your studied classes.",
    icon: "BookOpen",
  },
  {
    id: 5,
    title: "Ask a Question Anytime",
    description:
      "Post academic questions to get help from verified tutors 24 x 7 or tutor assistance.",
    icon: "MessageCircle",
  },
  {
    id: 6,
    title: "Stay Motivated",
    description:
      "Earn badges, maintain learning streaks, and celebrate milestones as you go along.",
    icon: "Trophy",
  },
];
