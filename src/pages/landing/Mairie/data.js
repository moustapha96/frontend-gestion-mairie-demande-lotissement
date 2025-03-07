import {
  LuBringToFront,
  LuCheck,
  LuFile,
  LuFolderDown,
  LuLayers,
  LuNavigation,
  LuShield,
  LuTable2,
} from "react-icons/lu";

import avatar1 from "@/assets/images/avatars/img-1.jpg";
import avatar2 from "@/assets/images/avatars/img-2.jpg";
import avatar3 from "@/assets/images/avatars/img-3.jpg";

const pricingPlans = [
  {
    name: "Shared",
    title: "Per editor,monthly",
    subTitle: "With Unlimited email",
    price: 8,
    features: [
      "Unlimited Email",
      "Unlimited Updates",
      "Free 5 host & domain",
      "24/7 Dedicated Support",
      "Backing",
      "Up to 10 users monthly",
    ],
  },
  {
    name: "Wordpress",
    title: "For team,monthly",
    subTitle: "team With 8 users",
    price: 12,
    features: [
      "Unlimited Email",
      "Unlimited Updates",
      "Free 5 host & domain",
      "24/7 Dedicated Support",
      "Backing",
      "Up to 30 users monthly",
    ],
  },
  {
    name: "VPS",
    title: "All users, monthly",
    subTitle: "for Unlimited users",
    price: 37,
    features: [
      "Unlimited Email",
      "Unlimited Updates",
      "Free 5 host & domain",
      "24/7 Dedicated Support",
      "Backing",
      "Up to 80 users monthly",
    ],
  },
];

const services = [
  {
    title: "Submit Support Request",
    description:
      "Initiate a Support Request for Prompt Assistance and Timely Resolution.",
    icon: LuFile,
  },
  {
    title: "Choose Site Transfer",
    description:
      "Streamline the migration process with added security measures.",
    icon: LuLayers,
  },
  {
    title: "Completion",
    description: "Your request is now fulfilled. Thank you for choosing us!",
    icon: LuCheck,
  },
  {
    title: "Domain name configuration",
    description:
      "Streamline the connection of your site to your domain name with Vault.",
    icon: LuNavigation,
  },
  {
    title: "20/8 network security",
    description:
      "Enjoy peace of mind with constant network security for your visitors.",
    icon: LuLayers,
  },
  {
    title: "User-friendly control panel",
    description:
      "Effortlessly manage app installations and backups with the industry-standard cPanel.",
    icon: LuShield,
  },
  {
    title: "Scalable resources",
    description: "Easily boost your site's CPU/RAM for increased performance.",
    icon: LuTable2,
  },
  {
    title: "Worldwide Data Centers",
    description:
      "Enhance page loading speed and improve the customer experience with Vault hosting.",
    icon: LuFolderDown,
  },
  {
    title: "click installation",
    description: "Simplify app integration effortlessly with Installatron.",
    icon: LuBringToFront,
  },
];

const testimonialSlides = [
  {
    name: "Enagol Ame",
    location: "Brazil",
    description:
      "We' ve been utilizing Vault for the past five years. Vault is exceptional. It goes without saying that we are incredibly content with the outcomes. Training was not even necessary.",
    image: avatar1,
  },
  {
    name: "Rashed ka.",
    location: "Italy",
    description:
      "Setting up was incredibly straightforward. I had no prior experience with hosting, but Vault has made everything appear easy.",
    image: avatar2,
  },
  {
    name: "Jackma Kalin",
    location: "USA",
    description:
      "Vault is the next game-changing application. I'm at a loss for words. I'll definitely inform my mom about this; she could benefit greatly from using Vault!",
    image: avatar3,
  },
];

const faqContent = [
  {
    title: "How Do We Evaluate Different Criteria In Our Process?",
    description:
      "I am item content. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.",
  },
  {
    title: "What Tools Can I Use To Create My Website?",
    description:
      "We work with businesses of various budgets and can create strategies that align with your financial resources while delivering meaningful results.",
  },
  {
    title: "Can I Transfer An Existing Website To Your Hosting?",
    description:
      "provides a comprehensive range of digital services, including website design and development, digital marketing, search engine optimization",
  },
  {
    title: "How Can I Accept Online Credit Card Payments?",
    description:
      "Absolutely! We offer content creation services, including blog posts, social media content, and multimedia assets.",
  },
  {
    title: "Are There Any Additional Requirements I Should Be Aware Of?",
    description:
      "Absolutely! We offer content creation services, including blog posts, social media content, and multimedia assets.",
  },
];
export { pricingPlans, services, testimonialSlides, faqContent };
