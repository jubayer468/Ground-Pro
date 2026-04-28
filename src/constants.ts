/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const COLORS = {
  primary: "#3E5F33", // Forest Green
  secondary: "#2D4425", // Dark Forest
  accent: "#EEE1D5", // Earthy Brown (Pill)
  background: "#F7F9F2", // Light Cream/Green
  text: "#2D362B", // Dark text
  muted: "#8A9A87", // Sage grey
  border: "#E1E9DD",
};

export const KNOWLEDGE_HUB = [
  {
    id: "pitch-construction",
    category: "Construction",
    title: "Cricket Pitch Construction (Foundation)",
    content: "Building a professional cricket pitch starts from the ground up. The foundation is critical for drainage and long-term stability.",
    sections: [
      {
        title: "Excavation & Base",
        items: [
          "Excavate to 400mm depth.",
          "Install perforated drainage pipes in a herringbone pattern.",
          "Lay 150mm of 20-40mm clean gravel.",
          "Overlay with 50mm of blinding grit."
        ]
      },
      {
        title: "Clay Selection",
        items: [
          "Choose clay with 28-35% clay content for domestic pitches.",
          "Bulli soil (Australia) or MOT clay (Global) are industry standards.",
          "Avoid silty clays that crumble when dry."
        ]
      }
    ]
  },
  {
    id: "match-day-prep",
    category: "Preparation",
    title: "Match Day Preparation Checklist",
    content: "The final 24 hours determine the pitch's behavior. Follow this rigorous checklist for a consistent bounce.",
    sections: [
      {
        title: "D-1 Checklist",
        items: [
          "Mow pitch to 4mm.",
          "Mark 'Popping Crease' and 'Bowling Crease' with white chalk.",
          "Final water at 6:00 PM if surface is too dry.",
          "Cover surface overnight to retain uniform moisture."
        ]
      },
      {
        title: "Match Morning",
        items: [
          "Uncover at 7:00 AM.",
          "Check moisture with a meter (aim for 15-20% for first class).",
          "One light roll (1.5 ton) 2 hours before toss.",
          "Brush away debris and final visual inspection."
        ]
      }
    ]
  }
];

export const MOCK_POSTS = [
  {
    id: "1",
    author: "Ian Botham",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    role: "Senior Curator",
    content: "Just finished the hollow tining on the main square. Recovery looking good for the mid-season tournament. #CuratorLife #GrassManagement",
    image: "https://images.unsplash.com/photo-1594470117722-da434a3c8371?w=800&q=80",
    likes: 24,
    comments: 5,
    timestamp: "2h ago"
  },
  {
    id: "2",
    author: "Sara Green",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    role: "Turf Specialist",
    content: "Testing out the new wetting agent on the outfield today. Seeing a 30% reduction in water usage already. Anyone tried this brand before?",
    likes: 12,
    comments: 8,
    timestamp: "5h ago"
  }
];

export const MOCK_JOBS = [
  {
    id: "j1",
    title: "Head Groundsman",
    location: "Lord's Cricket Ground, London",
    salary: "£55k - £65k",
    club: "MCC",
    type: "Full-time",
    posted: "1 day ago"
  },
  {
    id: "j2",
    title: "Assistant Curator",
    location: "MCG, Melbourne",
    salary: "$70k - $85k AUD",
    club: "Cricket Australia",
    type: "Full-time",
    posted: "3 days ago"
  }
];

export const MOCK_EQUIPMENT = [
  {
    id: "e1",
    name: "Dennis G860 Mower",
    condition: "Near New",
    price: "£8,500",
    seller: "Old Trafford Stadium",
    location: "Manchester, UK",
    image: "https://images.unsplash.com/photo-1592910710242-494b6a245051?w=800&q=80",
    description: "Multi-functional mower with various interchangeable cassettes. Perfect for first-class squares.",
    rating: 4.8,
    reviews: 12
  },
  {
    id: "e2",
    name: "PowerRoll Master 1.5t",
    condition: "Used - 3 Seasons",
    price: "£4,200",
    seller: "Surrey County CC",
    location: "London, UK",
    image: "https://images.unsplash.com/photo-1614078652613-2d93e115fdc1?w=800&q=80",
    description: "Reliable heavy roller. Well maintained, recent service completed.",
    rating: 4.5,
    reviews: 8
  }
];

export const MOCK_REVIEWS = [
  {
    id: "r1",
    seller: "Old Trafford Stadium",
    author: "James Wilson",
    rating: 5,
    comment: "Excellent condition, exactly as described. The delivery was well-coordinated.",
    date: "2 weeks ago"
  },
  {
    id: "r2",
    seller: "Old Trafford Stadium",
    author: "Groundie Pete",
    rating: 4,
    comment: "Great deal on the mower. Minor maintenance needed but saved a lot compared to new.",
    date: "1 month ago"
  }
];

export const TRAINING_MODULES = [
  {
    id: "m1",
    title: "Session 1: Pitch Categorization",
    duration: "45 mins",
    lessons: 6,
    difficulty: "Beginner",
    description: "Understanding the difference between preparing for T20, One-Day, and Five-Day Test matches. Learn the 70/30 vs 50:50 balance between bat and ball.",
    completed: true,
    curriculum: [
      "Introduction to Pitch Objectives",
      "One-Day Pitch Characteristics",
      "Pace and Bounce Requirements",
      "Five-Day Pitch Strategy",
      "Deterioration Patterns",
      "Maintaining the 50:50 Balance"
    ]
  },
  {
    id: "m2",
    title: "Session 2: Maintenance Guidelines",
    duration: "60 mins",
    lessons: 8,
    difficulty: "Intermediate",
    description: "Professional maintenance routines for a busy season. Covers post-match renovation, repair techniques, and hydration monitoring.",
    completed: false,
    curriculum: [
      "Post-Match Cleaning & Rejuvenation",
      "Repairing Bowlers' Footmarks",
      "Overseeding & Re-grassing",
      "Watering Frequency & Revivial",
      "Shade Cloth Usage (Hessian)",
      "Fertilizer: Nitrogen & Potassium Ratios",
      "Monitoring Growth Recovery",
      "Season-long Maintenance Efficiency"
    ]
  },
  {
    id: "m3",
    title: "Session 3: Seasonal Renovation",
    duration: "80 mins",
    lessons: 10,
    difficulty: "Advanced",
    description: "End of season procedures critical for next year's success. Detailed study of the Thatch Layer, Scarification, and Aeration.",
    completed: false,
    curriculum: [
      "Understanding the Thatch Layer",
      "Impact of Organic Matter on Pace",
      "The Science of Scarification",
      "Aeration Methods: Hollow Coring vs Solid Tine",
      "Benefits of Infiltration & Air Flow",
      "Overseeding in Different Climates",
      "Top Dressing and Levelling Techniques",
      "Soil Mineral Analysis",
      "Pre-season Rolling Program",
      "Establishing a Firm Base"
    ]
  },
  {
    id: "m4",
    title: "Session 4: Moisture Management",
    duration: "50 mins",
    lessons: 7,
    difficulty: "Intermediate",
    description: "The science of watering. Learn about Evapotranspiration, Gravity, and 'Sweating' to control pitch behavior.",
    completed: false,
    curriculum: [
      "Watering Prior to Rolling",
      "Hand Watering vs Automatic Systems",
      "Determining Soil Plasticity",
      "Evaporation & Wind Velocity Factors",
      "Evapotranspiration Science",
      "Gravity & Subsoil Drainage",
      "Sweating Techniques with Covers"
    ]
  },
  {
    id: "m5",
    title: "Session 5: Construction & Technology",
    duration: "90 mins",
    lessons: 9,
    difficulty: "Advanced",
    description: "Technical guidelines for building international standard pitches and utilizing modern curator tech.",
    completed: false,
    curriculum: [
      "Foundation & Excavation Principles",
      "Drainage System Design (Option 1 & 2)",
      "Intermediate Sand & Gravel Layers",
      "Clay Particle Distribution Analysis",
      "Bangladesh & Sri Lanka Soil Comparatives",
      "Outfield Crowning & Slopes",
      "Hybrid Stitched Pitches",
      "SubAir Sport Systems",
      "Moisture Sensors & Impact Data"
    ]
  }
];
