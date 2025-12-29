export type EventStatus = "upcoming" | "live" | "completed";
export type EventCategory = "Flagship" | "Technical" | "Cultural" | "Managerial" | "Gaming" | "Social";

export interface Event {
  id: string;
  title: string;
  date: string;
  year: string;
  description: string;
  fullDescription: string; // For the modal
  category: EventCategory;
  status: EventStatus;
  image: string;
  location: string;
  sponsor?: string;
  registrationLink?: string;
}

export const eventsData: Event[] = [
  // --- 2026 EVENTS ---
  {
    id: "Circuitry-Nexus-1",
    title: "Smart Craft",
    date: "16th January",
    year: "2026",
    description: "Ready to turn your ideas into innovation? \n Circuitry Nexus presents Smart-Craft",
    fullDescription: "Smart-Craft—a thrilling blend of creativity, strategy, and tech-driven design! This event challenges participants to step into a high-stakes auction arena armed with limited digital currency to bid for essential kit components and build their own smart home prototype.",
    category: "Technical",
    status: "upcoming",
    image: "/smart.jpeg",
    location: "New Gallery , Nit Silchar",
    registrationLink:"https://tecnoesis.co.in/teamRegistration/69064045d368c3765e9f3682 "
    
    
  },
    {
    id: "Circuitry-Nexus-2",
    title: "Auto-Plant Insight",
    date: "16th January",
    year: "2026",
    description: "Intrigued about the complexities and challenges of the Industrial world? Look no further!\n\nCircuitry Nexus presents Autoplant Insight",
    fullDescription: " Autoplant Insight—a premier case study competition that challenges you to deep dive into the complexities of the world of Oil and Gas, Manufacturing, and Automation sectors! \n \n Envision yourself as a CEO or a core member of a company that runs the very grid of this world. Identify critical industrial issues, integrate your innovative ideas with new technologies to design the future of Industrial solutions!",
    category: "Technical",
    status: "upcoming",
    image: "/auto.jpeg",
    location: "New Gallery , Nit Silchar",
    registrationLink:"https://tecnoesis.co.in/teamRegistration/69064110d368c3765e9f3685"
    
  },
    {
    id: "Circuitry-Nexus-3",
    title: "Logic Wizard",
    date: "16th January",
    year: "2026",
    description: " Logic Wizard – Presented by Circuitry Nexus Are you ready to master the magic of logic?",
    fullDescription: "Step into the world of Logic Wizard, where your knowledge of logic gates and truth tables will be put to the ultimate test! Decode binary secrets, design digital circuits, and prove your analytical power.",
    category: "Technical",
    status: "upcoming",
    image: "/logic.jpeg",
    location: "New Gallery , Nit Silchar",
    registrationLink:"https://tecnoesis.co.in/teamRegistration/690640add368c3765e9f3683"
    
  },

  // --- 2025 EVENTS ---
      {
    id: "Freshers",
    title: "ABHYUDAYA   ",
    date: "18th October",
    year: "2025",
    description: "When the moon bleeds and shadows whisper… 🌑 Masks fade, but the night remains, as the Mystic Eclipse claims the day. Dare to enter. Dare to feel. The darkness begins — surreal. ",
    fullDescription: "Step into the realm of eternal allure and haunting charm! A place where shadows dance and mysteries whisper,And the line between reality and fantasy slowly fades. Lose yourself in the night of thrilling blend of gothic elegance, supernatural spark, and timeless intrigue. Meet the legends. Become one. ABHYUDAYA 2025",
    category: "Cultural",
    status: "completed",
    image: "/fresher.png",
    location: "New Gallery , Nit Silchar",
    
  },
  
];

export const categories: EventCategory[] = ["Flagship", "Technical", "Cultural"];
export const years = ["2026", "2025", "Archives"];