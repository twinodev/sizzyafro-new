/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { db } from "../src/lib/firebase";
import { doc, getDoc, setDoc, getDocs, collection } from "firebase/firestore";
import {
  TeamMember,
  EventItem,
  BlogPost,
  MerchandiseItem,
  VideoItem,
  PartnerLogo,
  TestimonialItem,
  MessageItem,
  PartnerApplication,
  DonateLog,
  AppSettings
} from "../src/types";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
      emailVerified: null,
      isAnonymous: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const DB_PATH = path.join(process.cwd(), "data", "db.json");

// Define type for our overall database state
export interface DBState {
  team: TeamMember[];
  events: EventItem[];
  blog: BlogPost[];
  merchandise: MerchandiseItem[];
  videos: VideoItem[];
  partners: PartnerLogo[];
  testimonials: TestimonialItem[];
  messages: MessageItem[];
  partnerships: PartnerApplication[];
  donations: DonateLog[];
  settings?: AppSettings;
}

// Check if Supabase is properly configured (i.e. not placeholders)
const isSupabaseConfigured = (): boolean => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  if (url.includes("your-project") || key.includes("your-service-role")) return false;
  return true;
};

let supabaseClient: SupabaseClient | null = null;
if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    console.log("Supabase client initialized successfully.");
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error);
  }
} else {
  console.log("Supabase not configured or using placeholders. Falling back to secure local file persistence.");
}

// Initial Seeding Mock Data
export const INITIAL_STATE: DBState = {
  team: [
    {
      id: "1",
      name: "Twinomujuni Emmanuel (Sizzy Afro)",
      role: "Founder, Director & Lead Choreographer",
      bio: "Twinomujuni Emmanuel, widely known as Sizzy Afro, is an acclaimed Ugandan urban dancer, performance choreographer, and youth mentor based in Mbarara. In 2025, he established Dance With Sizzy Afro out of a profound passion to build professional pathways for youth through the discipline of modern street dance, Afrobeat, and Breaking. His high-energy training emphasizes personal growth, cultural representation, and rhythmic excellence.",
      achievements: [
        "Founder of Dance With Sizzy Afro (2025)",
        "Winner of Western Uganda Elite Dance Battle (2024)",
        "Lead choreographer for the regional Culture Exchange Showcases",
        "Trained over 500+ young individuals in Mbarara, Uganda"
      ],
      profile_picture: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=600&auto=format&fit=crop&q=80",
      socials: {
        instagram: "https://instagram.com/sizzy_afro",
        facebook: "https://facebook.com/sizzy_afro_dance",
        youtube: "https://youtube.com/@dancewithsizzyafro"
      }
    },
    {
      id: "2",
      name: "Akankwasa Raymond (B-Boy Ray)",
      role: "Head Coach of Breaking & Hip-Hop Styles",
      bio: "Ray is a master in Breaking and Floorwork gymnastics. Dedicating his life to street dance, he provides intensive technical breakdowns of power-moves, freezes, and flow. Ray leads our elite battle team and nurtures individual styling.",
      achievements: [
        "Regional Breakdance Representative in Uganda National Games",
        "Coached the Under-18 Battle Champions of 2025",
        "10+ years experience in Street Styles"
      ],
      profile_picture: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=600&auto=format&fit=crop&q=80",
      socials: {
        instagram: "https://instagram.com/bboy_ray",
        facebook: "https://facebook.com"
      }
    },
    {
      id: "3",
      name: "Kemigisha Sandra",
      role: "Afrobeat & Traditional Fusion Coach",
      bio: "Sandra blends traditional Ugandan cultural dances with high-octane modern West African Afrobeat. She is dedicated to preserving heritage while driving modern urban dance innovation.",
      achievements: [
        "Masterclass Instructor at the Kampala Arts Festival",
        "Lead coordinator for School Outreach and community events",
        "Certified Dance Specialist in Creative Movement"
      ],
      profile_picture: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&auto=format&fit=crop&q=80",
      socials: {
        instagram: "https://instagram.com/sandra_fusion",
        youtube: "https://youtube.com"
      }
    }
  ],
  events: [
    {
      id: "ev-1",
      title: "Mbarara Dance Battle Championship 2026",
      description: "Get ready for the ultimate showdown of the year! Dancers from all over Western Uganda converge in Mbarara for a day of high-octane Breaking, Popping, and Afro-Fusion 1v1 and Crew battles. Witness elite dance talent, live DJs, and special guest showcases.",
      date: "2026-06-25",
      time: "2:00 PM – 8:00 PM",
      location: "Mbarara City Hall Grounds, Uganda",
      flyer_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&fit=crop&q=80",
      cta_label: "Register as Battle Dancer",
      cta_link: "https://whatsapp.com",
      category: "battles",
      seo_title: "Mbarara Dance Battle Championship 2026 | Register Now",
      seo_description: "Join the biggest regional dance battle in Western Uganda. Interactive Battles in Breaking, Popping, and Afro-Fusion. Cash prizes, live dj sets, and dynamic showcases.",
      seo_keywords: "dance battles, mbarara, uganda, breakdance, hip-hop, sizzy afro, community events"
    },
    {
      id: "ev-2",
      title: "Elite Afro-House & Street Dance Workshop",
      description: "An intensive 3-day rhythm masterclass lead by Twinomujuni Emmanuel (Sizzy Afro). Master groove, complex timing, weight switches, and emotional performance expression. This is open to both beginner and intermediate dancers aiming to professionalize.",
      date: "2026-07-10",
      time: "9:00 AM – 1:00 PM daily",
      location: "Dance Studio, Youth Center, Lugazi, Mbarara",
      flyer_url: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=1200&auto=format&fit=crop&q=80",
      cta_label: "Secure Workshop Pass",
      cta_link: "https://whatsapp.com",
      category: "workshops",
      seo_title: "Afro-House Dance Workshop by Sizzy Afro | Mbarara",
      seo_description: "Sign up for our intensive 3-day dance training in Afrobeat and street styles. Elevate your performance, rhythm, and body isolation controls.",
      seo_keywords: "afrobeat dance class, dance workshop, mbarara dance, hiphop training, uganda dance training"
    }
  ],
  blog: [
    {
      id: "post-1",
      slug: "how-dance-transforms-vulnerable-youth",
      title: "How Street Dance Constructs Leaders Among Vulnerable Youth",
      excerpt: "Analyzing the psychological and social breakthroughs experienced by young dancers when they master rhythm, choreography and freestyle performance.",
      category: "Youth Empowerment",
      author: "Twinomujuni Emmanuel",
      date: "2026-05-15",
      image_url: "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&auto=format&fit=crop&q=80",
      blocks: [
        { type: "paragraph", value: "At Dance With Sizzy Afro, dance is not simply about learning routines. It is about restructuring how vulnerable young minds perceive their capabilities. When a young boy or girl successfully locks down a complex break or masters a intricate syncopated rhythm, their self-confidence transforms." },
        { type: "heading", value: "Building Core Discipline", level: 2 },
        { type: "paragraph", value: "Traditional class settings often fall short for high-energy youth. Rhythmic learning offers an alternative medium where active movement is channeled productively. It requires high physical and mental synchronization, forcing individual focus, time commitment, and consistent repetition." },
        { type: "image", value: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80", alt: "Youth rehearsing under lights" },
        { type: "paragraph", value: "We continue to scale our school outreaches in Western Uganda, delivering structured after-school programs that combine physical education with dance styling." },
        { type: "button", value: "Sponsor a Youth Outreach Session", url: "/partner" }
      ],
      likes: 24,
      likedBy: [],
      comments: [
        {
          id: "c-1",
          author: "Mbabazi Patrick",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
          text: "This program has been incredibly helpful for my younger brother. He is much more focused in school now and respects our family schedule! Thank you Sizzy Afro!",
          date: "2026-05-18",
          replies: [
            {
              id: "r-1",
              author: "Twinomujuni Emmanuel",
              avatar: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=100&auto=format&fit=crop&q=80",
              text: "Thank you Patrick! We are excited about his progress too. He's got amazing rhythm in Popping!",
              date: "2026-05-19"
            }
          ]
        }
      ],
      seo_title: "How Street Dance Empowers Ugandan Youth | Sizzy Afro",
      seo_description: "Discover how urban dance builds leaders, constructs discipline, and transforms young lives in Mbarara, Uganda."
    }
  ],
  merchandise: [
    {
      id: "m-1",
      name: "Official 'Sizzy Afro' Comfort Dance Hoodie",
      price: 95000, // in UGX
      description: "Our signature heavyweight streetwear hoodie. Designed for dancers with premium breathable cotton blend fabric, custom relaxed drop-shoulder cut, and high-quality printed 'Sizzy Afro' dynamic seal on front and back. Keeps you warm during sessions and cool down transitions.",
      image_url: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80",
      sizes: ["S", "M", "L", "XL"],
      stock: 35,
      link: "https://wa.me/256700000000?text=I%20want%20to%20order%20the%20Sizzy%20Afro%20Comfort%20Hoodie",
      seo_title: "Official Sizzy Afro Heavyweight Hoodie | Streetwear Uganda",
      seo_description: "Purchase official Dance With Sizzy Afro apparel. Comfortable, thick cotton-blend hoodies built specifically for intensive choreography and premium everyday streetwear styling."
    },
    {
      id: "m-2",
      name: "Sizzy Afro 'Rhythm First' Classic Tee",
      price: 45000,
      description: "Lightweight and fully flexible training t-shirt. Breathable weave fabric with sweat moisture-wicking technology to keep your dance moves completely unconstrained. Front features 'Rhythm First' minimal lettering.",
      image_url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      stock: 60,
      link: "https://wa.me/256700000000?text=I%20want%20to%20order%20the%20Rhythm%20First%20Tee",
      seo_title: "Rhythm First Dance Tee | Official Sizzy Afro Apparel",
      seo_description: "Shop lightweight dance and choreography t-shirts in Uganda. High quality material with sweat-wicking technology."
    }
  ],
  videos: [
    {
      id: "vid-1",
      title: "Sizzy Afro Performance Showcase - Mbarara Street Battle 2025",
      description: "Watch our lead choreographer Twinomujuni Emmanuel (Sizzy Afro) burn the street floor with high-energy modern afrobeat fusion in front of a live crowd in Mbarara.",
      youtube_id: "eS9_V3R3_Cg", // Actual youtube ID or easily playable
      date: "2025-11-20"
    },
    {
      id: "vid-2",
      title: "Youth Dancing For Social Change - Outreach Highlight Video",
      description: "A summary of our free community workshops in neighboring sub-counties, showing how cultural dance unites families and builds safe spaces for kids.",
      youtube_id: "zOJpOCmDcoo",
      date: "2026-02-14"
    }
  ],
  partners: [
    {
      id: "p-1",
      name: "Mbarara City Cultural Union",
      logo_url: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=100&auto=format&fit=crop&q=80", // placeholder
    },
    {
      id: "p-2",
      name: "Pepsi Uganda",
      logo_url: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=100&auto=format&fit=crop&q=80",
    },
    {
      id: "p-3",
      name: "AfroBeat International Council",
      logo_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=100&auto=format&fit=crop&q=80",
    }
  ],
  testimonials: [
    {
      id: "t-1",
      author: "Florence Aturine",
      role: "Parent of 12-year old dancer",
      content: "My son used to be quite silent and struggled heavily to express himself. Ever since joining Sizzy Afro's training battles, his posture, communication, and overall house discipline have leveled up. He feels he belongs to an inspiring community.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      approved: true,
      date: "2025-10-02"
    },
    {
      id: "t-2",
      author: "Arthur Ssenyange",
      role: "Professional Street Artist",
      content: "As a dancer traveling across East Africa, I haven't seen a choreographic system as tight, supportive and culturally pure as what Twinomujuni Emmanuel has built in Mbarara. Genuine training, true respect, and elite skills.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      approved: true,
      date: "2026-01-20"
    }
  ],
  messages: [],
  partnerships: [],
  donations: [],
  settings: {
    adminPassword: "change-me-to-secure-password",
    logoUrl: "",
    heroBgUrl: ""
  }
};

// Database utility methods (Local storage as backup/cache)
export const getLocalDB = (): DBState => {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const dir = path.dirname(DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_PATH, JSON.stringify(INITIAL_STATE, null, 2), "utf8");
      return INITIAL_STATE;
    }
    const data = fs.readFileSync(DB_PATH, "utf8");
    const parsed = JSON.parse(data) as DBState;
    if (!parsed.settings) {
      parsed.settings = {
        adminPassword: "change-me-to-secure-password",
        logoUrl: "",
        heroBgUrl: ""
      };
      try {
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf8");
      } catch (e) {
        console.error("Failed to write defaulted settings to db.json", e);
      }
    } else if (parsed.settings.heroBgUrl === undefined) {
      parsed.settings.heroBgUrl = "";
      try {
        fs.writeFileSync(DB_PATH, JSON.stringify(parsed, null, 2), "utf8");
      } catch (e) {}
    }
    return parsed;
  } catch (err) {
    console.error("Error reading database file, returning default seeding data.", err);
    return INITIAL_STATE;
  }
};

export const saveLocalDB = (state: DBState): void => {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving database to file system.", err);
  }
};

// Main Active Database Interfaces (Firestore as Primary with Local Failover)
export const getDB = async (): Promise<DBState> => {
  try {
    const snapshot = await getDocs(collection(db, "danceAppState"));
    if (snapshot.empty) {
      console.log("Firestore is empty. Bootstrapping/Seeding INITIAL_STATE to Cloud Cloud Firestore...");
      await saveDB(INITIAL_STATE);
      return INITIAL_STATE;
    }

    const fetched: any = {};
    snapshot.forEach((docSnap) => {
      fetched[docSnap.id] = docSnap.data();
    });

    const state: DBState = {
      team: fetched.team?.list ?? INITIAL_STATE.team,
      events: fetched.events?.list ?? INITIAL_STATE.events,
      blog: fetched.blog?.list ?? INITIAL_STATE.blog,
      merchandise: fetched.merchandise?.list ?? INITIAL_STATE.merchandise,
      videos: fetched.videos?.list ?? INITIAL_STATE.videos,
      partners: fetched.partners?.list ?? INITIAL_STATE.partners,
      testimonials: fetched.testimonials?.list ?? INITIAL_STATE.testimonials,
      messages: fetched.messages?.list ?? [],
      partnerships: fetched.partnerships?.list ?? [],
      donations: fetched.donations?.list ?? [],
      settings: fetched.settings ?? INITIAL_STATE.settings,
    };

    // Keep client-local file backup in sync
    saveLocalDB(state);

    return state;
  } catch (error) {
    console.warn("Firestore connection not available. Serving from high-reliability local JSON cache.", error);
    return getLocalDB();
  }
};

export const saveDB = async (state: DBState): Promise<void> => {
  try {
    const segments = [
      { id: "team", data: { list: state.team } },
      { id: "events", data: { list: state.events } },
      { id: "blog", data: { list: state.blog } },
      { id: "merchandise", data: { list: state.merchandise } },
      { id: "videos", data: { list: state.videos } },
      { id: "partners", data: { list: state.partners } },
      { id: "testimonials", data: { list: state.testimonials } },
      { id: "messages", data: { list: state.messages || [] } },
      { id: "partnerships", data: { list: state.partnerships || [] } },
      { id: "donations", data: { list: state.donations || [] } },
      { id: "settings", data: state.settings || { adminPassword: "change-me-to-secure-password", logoUrl: "", heroBgUrl: "" } },
    ];

    await Promise.all(
      segments.map((s) => setDoc(doc(db, "danceAppState", s.id), s.data))
    );

    // Keep client-local file backup in sync
    saveLocalDB(state);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "danceAppState");
  }
};

