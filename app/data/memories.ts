export interface Memory {
  id: number;
  date: string;
  title: string;
  description: string;
  image: string;
}

const memories: Memory[] = [
  {
    id: 1,
    date: "March 15, 2024",
    title: "First Date",
    description:
      "The café was warm, the coffee was terrible, but your smile made everything feel like spring. I knew right then — this was the beginning of something beautiful.",
    image: "/genesis/ezgif-frame-001.jpg",
  },
  {
    id: 2,
    date: "June 22, 2024",
    title: "First Trip Together",
    description:
      "We drove for hours with the windows down, singing off-key to songs we barely knew. The destination didn't matter — every mile with you felt like home.",
    image: "/genesis/ezgif-frame-050.jpg",
  },
  {
    id: 3,
    date: "September 8, 2024",
    title: "The Sunset We'll Never Forget",
    description:
      "We sat on that hill and watched the sky melt into gold and pink. You leaned on my shoulder, and the whole world went quiet. Just us and the fading light.",
    image: "/genesis/ezgif-frame-100.jpg",
  },
  {
    id: 4,
    date: "December 25, 2024",
    title: "Our First Christmas",
    description:
      "Fairy lights, your terrible wrapping skills, and that look on your face when you opened your gift. I'd relive that morning a thousand times over.",
    image: "/genesis/ezgif-frame-150.jpg",
  },
  {
    id: 5,
    date: "February 14, 2025",
    title: "One Year Anniversary",
    description:
      "365 days and every single one made me fall a little deeper. Here's to a lifetime of more — more laughter, more adventures, more of us.",
    image: "/genesis/ezgif-frame-200.jpg",
  },
];

export default memories;
