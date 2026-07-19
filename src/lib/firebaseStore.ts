import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "./firebase";

// Operation types matching the Firebase skill specification
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

// Global robust error handler per the Firebase integration skill
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error("Firestore Error logged via skill handler:", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Interfaces representing Sizzy Afro's dynamic data structures
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  achievements: string; // Comma or newline separated Achievements
  facebook?: string;
  instagram?: string;
  youtube?: string;
  profile_picture: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  flyer_url: string;
  cta_text: string;
  cta_link: string;
  category?: string; // e.g. "Battle", "Workshop", "Class", "Outreach"
  price?: string; // e.g. "Free", "5,000 UGX", "10,000 UGX"
  capacity?: number; // e.g. 150
}

export interface EventRSVP {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  role: string; // "Competitor / Dancer", "Spectator / Audience", "Crew Representative"
  date: string;
}

export interface Comment {
  id: string;
  authorName: string;
  content: string;
  date: string;
  replies?: Array<{
    id: string;
    authorName: string;
    content: string;
    date: string;
  }>;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or rich HTML layout
  category: string;
  author: string;
  date: string;
  image_url: string;
  likes: number;
  comments: Comment[];
}

export interface MerchandiseItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  stock: number;
  sizes: string[]; // ['S', 'M', 'L', 'XL']
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  youtube_id: string;
  date: string;
}

export interface PartnerLogo {
  id: string;
  name: string;
  logo_url: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  content: string;
  rating: number;
  approved: boolean;
  date: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  content: string;
  date: string;
  status: "unread" | "read";
}

export interface PartnershipApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  partnerType: string;
  message: string;
  date: string;
}

export interface DonationRecord {
  id: string;
  donorName: string;
  amount: number;
  currency: string;
  date: string;
  projectSupported: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  date: string;
}

// Dynamic State interface for our master single-document-segments strategy
export interface AppData {
  team: TeamMember[];
  events: EventItem[];
  posts: BlogPost[];
  merchandise: MerchandiseItem[];
  videos: VideoItem[];
  testimonials: Testimonial[];
  partnerLogos: PartnerLogo[];
  messages: ContactMessage[];
  partnershipApplications: PartnershipApplication[];
  donations: DonationRecord[];
  newsletter: NewsletterSubscription[];
  rsvps: EventRSVP[];
  meta: {
    adminPasswordHash?: string;
    whatsappNumber?: string;
    googleMapsReviewLink?: string;
    isConfigured?: boolean;
  };
}

// Standard, high-quality, pre-populated defaults that are verified to look premium out of the box
export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "sizzy-afro",
    name: "Twinomujuni Emmanuel (Sizzy Afro)",
    role: "Founder & Executive Creative Director",
    bio: "Sizzy Afro is a visionary Ugandan street choreographer and dance activist. He founded Dance With Sizzy Afro to build confidence, instill deep discipline, and open opportunities for marginalized street children. Emmanuel holds numerous local trophies and guides high-octane breaking and fusion workshops.",
    achievements: "Winner of East African Breakdance Championship 2023, 10+ Community Development Medals, Promoted Uganda on Global Hip Hop Stages",
    instagram: "https://instagram.com/sizzyafro",
    youtube: "https://youtube.com/c/DanceWithSizzyAfro",
    profile_picture: "https://picsum.photos/seed/sizzyemmanuel/500/500"
  },
  {
    id: "coach-lubega",
    name: "Akram Lubega",
    role: "Senior Breaking & Power Moves Coach",
    bio: "Akram is Uganda’s premier b-boy specialist in power-moves, head spins, and acrobatics. He focuses on core-strength, battle-mindsets, and endurance, bringing strict sports discipline into the street elements.",
    achievements: "Red Bull BC One Uganda Runner-up, Lead Instructor of Ghetto Youth Battle Conditioning",
    instagram: "https://instagram.com/bboyakram",
    profile_picture: "https://picsum.photos/seed/lubegahead/500/500"
  },
  {
    id: "sarah-instructor",
    name: "Sarah Namara",
    role: "Amapiano & Traditional Afro Choreographer",
    bio: "Sarah is a dance powerhouse merging traditional Ugandan tribal dances with modern Amapiano, Afrobeat, and street-style grooves. She leads secondary school outreach programs and kid development classes.",
    achievements: "Creator of Kampala Afrobeats Groovefest, 8+ Years of Youth Mentorship Education",
    instagram: "https://instagram.com/sarahnamara",
    profile_picture: "https://picsum.photos/seed/sarahdance/500/500"
  }
];

export const DEFAULT_EVENTS: EventItem[] = [
  {
    id: "saturday-fusion",
    title: "Afro-Fusion & Amapiano Power Workshop",
    description: "Our signature energetic dance training. Explore traditional Ugandan drums combined with Amapiano choreography, street footwork, and urban breaking transitions. Open for youth, children, and beginners.",
    date: "Every Saturday",
    time: "4:00 PM - 5:30 PM",
    location: "Youth Center Lugazi Mbarara",
    flyer_url: "https://picsum.photos/seed/afrodanceworkshop/800/600",
    cta_text: "CLAIM FREE SATURDAY TICKET",
    cta_link: "#rsvp",
    category: "Workshop",
    price: "Free Entry",
    capacity: 120
  },
  {
    id: "mbarara-breaking-battle",
    title: "Mbarara Street Clash: B-Boy & B-Girl Battle",
    description: "The ultimate platform for regional talent to showcase raw power moves, popping, locking, and team routines. Winners walk away with scholarships, cash prizes, and national qualifications.",
    date: "October 18, 2026",
    time: "2:00 PM - 9:00 PM",
    location: "Underground Dance Arena, Mbarara City Center",
    flyer_url: "https://picsum.photos/seed/breakingclash/800/600",
    cta_text: "REGISTER TO BATTLE VS SIZZY",
    cta_link: "#rsvp",
    category: "Battle",
    price: "5,000 UGX",
    capacity: 250
  }
];

export const DEFAULT_POSTS: BlogPost[] = [
  {
    id: "story-ghetto-youth",
    slug: "transforming-ghetto-youth-mbarara",
    title: "How We Are Transforming Mbarara Ghetto Youth Through Free Dance Education",
    excerpt: "Behind the high energy beats lies a major youth development initiative. We share our story of transforming homeless and vulnerable street kids into world-class performers.",
    content: "### Transforming Communities, One Move at a Time\n\nAt **Dance With Sizzy Afro**, we believe that the street shouldn't define a young person's trajectory in life.\n\nSince our creation in **2025**, we have taken street youths, orphans, and kids from vulnerable environments in Mbarara and surrounding locations into our dynamic academy. Through intensive training and strict mentorship we instil fundamental values: \n\n1. **Discipline** — Through punctual attendance and body respect.\n2. **Excellence** — Pushing artistic boundaries to compete globally.\n3. **Teamwork** — Caring for fellow dancers as a crew.\n\nWe provide free meals during workshops, support youth back into education, and share opportunities that open international exchange fields. Support us in changing lives through dance!\n\nCheck out our [Donation Hub](#donation) to make a real-world difference today! Let us transform creativity into excellence.",
    category: "Community",
    author: "Twinomujuni Emmanuel (Sizzy Afro)",
    date: "2026-06-01",
    image_url: "https://picsum.photos/seed/streetdancetransform/1000/600",
    likes: 42,
    comments: [
      {
        id: "c1",
        authorName: "John Kampala B-Boy",
        content: "Incredible project! Emmanuel's leadership is paving a direct future for Ugandan dancers. Highly support this work.",
        date: "2026-06-02",
        replies: [
          {
            id: "r1",
            authorName: "Sarah Namara (Coach)",
            content: "Thank you so much John! It takes a community to raise a star.",
            date: "2026-06-03"
          }
        ]
      }
    ]
  },
  {
    id: "amapiano-tutorial",
    slug: "breaking-down-modern-amapiano-choreo",
    title: "The Ultimate Guide to Amapiano Grooves: Syncopation, Vibe, and Spirit",
    excerpt: "Amapiano has taken the globe by storm. In this visual post, we breakdown the major leg grooves, head movements, and the cultural spiritual connection.",
    content: "### Feel the Log Drum: The Essence of Amapiano\n\nAmapiano is not just a beat; it is a full spirit which originated from South Africa and is now taking over Kampala, Kigali, and Mbarara.\n\nOur head coach **Sizzy Afro** breaks down the essential parts to practice at home:\n\n* **The Bounce (Low Center of Gravity)**: Flex your knees, stay loose, and move your weight in sync with the heavy bassline.\n* **The Footwork**: Subtle heel-toe locks that follow the syncopation of the snare clicks.\n* **The Expression**: Dancing Amapiano is conversational. Let your smile and shoulders talk to the beat.\n\nJoin our weekly classes at Youth Center Lugazi Mbarara to master this craft live!\n\n[View Class Schedule](#events)",
    category: "Tutorial",
    author: "Sarah Namara",
    date: "2026-06-12",
    image_url: "https://picsum.photos/seed/amapianorhythm/1000/600",
    likes: 29,
    comments: []
  }
];

export const DEFAULT_MERCHANDISE: MerchandiseItem[] = [
  {
    id: "sizzy-hoodie",
    name: "Dance With Sizzy Afro 'Ultimate Rhythm' Hoodie",
    price: 38.00,
    description: "Premium heavy-weight 400GSM cotton construction, fleece-lined for cold training sessions. Emblazoned with the golden 'Dance With Sizzy Afro' dynamic seal of excellence and street-art elements. 100% of profits are directly allocated to sponsorship programs for ghetto youths in Mbarara.",
    image_url: "https://picsum.photos/seed/streetdancehoodie/600/600",
    stock: 25,
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "afro-tshirt",
    name: "Ghetto Youth Foundation 'Limitless' Tee",
    price: 22.00,
    description: "Lightweight, ultra-wicking street dance T-shirt. Ideal for intensive battle sessions, high-kick training, and hot afternoon Afro-fusion workouts. Features direct signature of Twinomujuni Emmanuel (Sizzy Afro).",
    image_url: "https://picsum.photos/seed/afrodancetshirt/600/600",
    stock: 50,
    sizes: ["M", "L", "XL"]
  }
];

export const DEFAULT_VIDEOS: VideoItem[] = [
  {
    id: "video-1",
    title: "Dance With Sizzy Afro Uganda Community Showcase - 2025",
    description: "Highlights of our street training sessions, community dance outreach in slums, and our professional stage achievements.",
    youtube_id: "z6-eLzOfx5E",
    date: "2025-11-20"
  },
  {
    id: "video-2",
    title: "Afro-Fusion & Amapiano Masterclass Highlight - Mbarara",
    description: "Quick look at our signature fusion routines taught by Emmanuel of Sizzy Afro at Youth Center Lugazi Mbarara.",
    youtube_id: "SMRgN_yU8Zg",
    date: "2026-02-15"
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    author: "Mrs. Brenda Atwine",
    role: "Local Parent & High School Educator",
    content: "Dance with Sizzy Afro provided a true sanctuary of discipline for my teenage children. They changed their academic focus, learned the value of respect, and improved their self-esteem. I couldn't be more grateful for Twinomujuni's selfless work.",
    rating: 5,
    approved: true,
    date: "2026-04-10"
  },
  {
    id: "t2",
    author: "B-Boy Kizza 'Viper'",
    role: "National Dance Competitor",
    content: "The elite power moves classes taught by coach Akram Lubega completely reconstructed my training. Their professional mentorship raised my standards which helped me win local battles and get national sponsors.",
    rating: 5,
    approved: true,
    date: "2026-05-18"
  },
  {
    id: "t3",
    author: "Pastor Robert Mugisha",
    role: "President of Mbarara Ghetto Youth Aid",
    content: "An incredible partnership. Sizzy Afro uses dance, music, and performance to rescue vulnerable kids from addictions and depression. Emmanuel is a natural community leader whose work needs global backing.",
    rating: 5,
    approved: true,
    date: "2026-06-01"
  }
];

export const DEFAULT_PARTNER_LOGOS: PartnerLogo[] = [
  { id: "p1", name: "Uganda DanceSport", logo_url: "https://picsum.photos/seed/partnerlogo1/150/60" },
  { id: "p2", name: "Mbarara City Youth Aid", logo_url: "https://picsum.photos/seed/partnerlogo2/150/60" },
  { id: "p3", name: "Ministry of Culture & Youth", logo_url: "https://picsum.photos/seed/partnerlogo3/150/60" },
  { id: "p4", name: "Lugazi Community Youth Center", logo_url: "https://picsum.photos/seed/partnerlogo4/150/60" }
];

export const DEFAULT_SETTINGS = {
  adminPasswordHash: "12345", // Simple default pass plain (admin screen has safe input)
  whatsappNumber: "256758359591", // Standard international Ugandan number format
  googleMapsReviewLink: "https://g.page/r/sizzyafro-mbarara/review",
  isConfigured: true
};

// centralized local cache/fallback state to avoid multiple DB reads and load instantaneously
let localCache: AppData | null = null;

// Segment Loader
export async function loadSegment<K extends keyof AppData>(segment: K): Promise<AppData[K]> {
  const path = `danceAppState/${segment}`;
  try {
    const docRef = doc(db, "danceAppState", segment);
    const snap = await Promise.race([
      getDoc(docRef),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 3000))
    ]);
    if (snap && snap.exists()) {
      const data = snap.data();
      const val = data.list || data.value || data;
      
      // Ensure structural type matching
      if (segment !== "meta") {
        if (Array.isArray(val)) {
          return val as AppData[K];
        } else {
          console.warn(`Firestore read for segment '${segment}' returned non-array. Falling back to default.`);
        }
      } else {
        if (val && typeof val === "object" && !Array.isArray(val)) {
          return { ...DEFAULT_SETTINGS, ...val } as AppData[K];
        } else {
          console.warn(`Firestore read for segment 'meta' returned non-object. Falling back to default.`);
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("permission")) {
      handleFirestoreError(error, OperationType.GET, path);
    }
    console.warn(`Firestore read timed out or failed for segment '${segment}'. Using premium defaults.`, error);
  }

  // Segment fallbacks
  switch (segment) {
    case "team": return DEFAULT_TEAM as unknown as AppData[K];
    case "events": return DEFAULT_EVENTS as unknown as AppData[K];
    case "posts": return DEFAULT_POSTS as unknown as AppData[K];
    case "merchandise": return DEFAULT_MERCHANDISE as unknown as AppData[K];
    case "videos": return DEFAULT_VIDEOS as unknown as AppData[K];
    case "testimonials": return DEFAULT_TESTIMONIALS as unknown as AppData[K];
    case "partnerLogos": return DEFAULT_PARTNER_LOGOS as unknown as AppData[K];
    case "messages": return [] as unknown as AppData[K];
    case "partnershipApplications": return [] as unknown as AppData[K];
    case "donations": return [] as unknown as AppData[K];
    case "newsletter": return [] as unknown as AppData[K];
    case "rsvps": return [] as unknown as AppData[K];
    case "meta": return DEFAULT_SETTINGS as unknown as AppData[K];
    default: return [] as unknown as AppData[K];
  }
}

// Segment Saver
export async function saveSegment<K extends keyof AppData>(segment: K, value: AppData[K]): Promise<boolean> {
  const path = `danceAppState/${segment}`;
  try {
    const docRef = doc(db, "danceAppState", segment);
    const payload = Array.isArray(value) ? { list: value } : value;
    await setDoc(docRef, payload);
    if (localCache) {
      localCache[segment] = value;
    }
    return true;
  } catch (error) {
    console.error(`Firestore write failed for segment '${segment}'`, error);
    handleFirestoreError(error, OperationType.WRITE, path);
    return false;
  }
}

// Central dynamic loader for full-state synchronization
export async function fetchAllAppData(): Promise<AppData> {
  if (localCache) return localCache;

  const [
    team,
    events,
    posts,
    merchandise,
    videos,
    testimonials,
    partnerLogos,
    messages,
    partnershipApplications,
    donations,
    newsletter,
    rsvps,
    meta
  ] = await Promise.all([
    loadSegment("team"),
    loadSegment("events"),
    loadSegment("posts"),
    loadSegment("merchandise"),
    loadSegment("videos"),
    loadSegment("testimonials"),
    loadSegment("partnerLogos"),
    loadSegment("messages"),
    loadSegment("partnershipApplications"),
    loadSegment("donations"),
    loadSegment("newsletter"),
    loadSegment("rsvps"),
    loadSegment("meta")
  ]);

  localCache = {
    team,
    events,
    posts,
    merchandise,
    videos,
    testimonials,
    partnerLogos,
    messages,
    partnershipApplications,
    donations,
    newsletter,
    rsvps,
    meta
  };

  return localCache;
}

// Invalidation Helper
export function clearCache() {
  localCache = null;
}

// Full default app state fallback provider
export function getDefaultAppData(): AppData {
  return {
    team: DEFAULT_TEAM,
    events: DEFAULT_EVENTS,
    posts: DEFAULT_POSTS,
    merchandise: DEFAULT_MERCHANDISE,
    videos: DEFAULT_VIDEOS,
    testimonials: DEFAULT_TESTIMONIALS,
    partnerLogos: DEFAULT_PARTNER_LOGOS,
    messages: [],
    partnershipApplications: [],
    donations: [],
    newsletter: [],
    rsvps: [],
    meta: DEFAULT_SETTINGS
  };
}
