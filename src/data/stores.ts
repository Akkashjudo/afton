/**
 * Afton Fitness store network — supplied by the client verbatim.
 * Names and phone numbers are reproduced exactly as given; only the state and
 * type fields are derived (state = the city's actual state; type = read from
 * the entry's own name).
 */

export type StoreType = "Experience Centre" | "Service Centre" | "Store";

export type Store = {
  id: string;
  name: string;
  city: string;
  state: string;
  type: StoreType;
  /** Display strings, exactly as supplied. */
  phones: string[];
};

export const STORES: Store[] = [
  { id: "chennai-experience-centre", name: "Afton Chennai Experience Centre", city: "Chennai", state: "Tamil Nadu", type: "Experience Centre", phones: ["9445163701"] },
  { id: "chennai-service-centre", name: "Afton Chennai Service Centre", city: "Chennai", state: "Tamil Nadu", type: "Service Centre", phones: ["044 42148320", "9962524187"] },
  { id: "ahmedabad", name: "Ahmedabad", city: "Ahmedabad", state: "Gujarat", type: "Store", phones: ["9979895787"] },
  { id: "bangalore", name: "Bangalore", city: "Bangalore", state: "Karnataka", type: "Store", phones: ["9880212366"] },
  { id: "bangalore-service-centre", name: "Bangalore Service Centre", city: "Bangalore", state: "Karnataka", type: "Service Centre", phones: ["9844012366"] },
  { id: "bhopal", name: "Bhopal", city: "Bhopal", state: "Madhya Pradesh", type: "Store", phones: ["9977159159"] },
  { id: "bhubaneswar", name: "Bhubaneswar", city: "Bhubaneswar", state: "Odisha", type: "Store", phones: ["9337702425"] },
  { id: "chandigarh", name: "Chandigarh", city: "Chandigarh", state: "Chandigarh", type: "Store", phones: ["9810208996"] },
  { id: "chennai-anna-nagar", name: "Chennai Anna Nagar", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["8668097954"] },
  { id: "chennai-adyar", name: "Chennai Adyar", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["9841072763"] },
  { id: "chennai-ambattur", name: "Chennai Ambattur", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["9585266622"] },
  { id: "chennai-egmore", name: "Chennai Egmore", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["9445163701"] },
  { id: "chennai-medavakkam", name: "Chennai Medavakkam", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["9500129057"] },
  { id: "chennai-mylapore", name: "Chennai Mylapore", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["9840081501"] },
  { id: "chennai-spencer-plaza", name: "Chennai Spencer Plaza", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["8668099554"] },
  { id: "chennai-velachery", name: "Chennai Velachery", city: "Chennai", state: "Tamil Nadu", type: "Store", phones: ["7904117062"] },
  { id: "coimbatore-1", name: "Coimbatore", city: "Coimbatore", state: "Tamil Nadu", type: "Store", phones: ["7639999736"] },
  { id: "coimbatore-2", name: "Coimbatore", city: "Coimbatore", state: "Tamil Nadu", type: "Store", phones: ["9894057536"] },
  { id: "dehradun", name: "Dehradun", city: "Dehradun", state: "Uttarakhand", type: "Store", phones: ["8384861696"] },
  { id: "delhi-ghitorni", name: "Delhi Ghitorni", city: "Delhi", state: "Delhi", type: "Store", phones: ["9999008480"] },
  { id: "delhi-service-centre", name: "Delhi Service Centre", city: "Delhi", state: "Delhi", type: "Service Centre", phones: ["9899355564"] },
  { id: "erode", name: "Erode", city: "Erode", state: "Tamil Nadu", type: "Store", phones: ["9443370053"] },
  { id: "goa", name: "Goa", city: "Goa", state: "Goa", type: "Store", phones: ["7666350580"] },
  { id: "guntur", name: "Guntur", city: "Guntur", state: "Andhra Pradesh", type: "Store", phones: ["7075703899"] },
  { id: "guwahati-1", name: "Guwahati", city: "Guwahati", state: "Assam", type: "Store", phones: ["9435016079"] },
  { id: "guwahati-2", name: "Guwahati", city: "Guwahati", state: "Assam", type: "Store", phones: ["9706192351"] },
  { id: "hyderabad-gachibowli", name: "Hyderabad Gachibowli", city: "Hyderabad", state: "Telangana", type: "Store", phones: ["9344743151"] },
  { id: "hyderabad-somajiguda", name: "Hyderabad Somajiguda", city: "Hyderabad", state: "Telangana", type: "Store", phones: ["9395544337"] },
  { id: "kochi", name: "Kochi", city: "Kochi", state: "Kerala", type: "Store", phones: ["9846066777"] },
  { id: "kolkata", name: "Kolkata", city: "Kolkata", state: "West Bengal", type: "Store", phones: ["9831560177"] },
  { id: "kozhikode", name: "Kozhikode", city: "Kozhikode", state: "Kerala", type: "Store", phones: ["9846066777"] },
  { id: "kurnool", name: "Kurnool", city: "Kurnool", state: "Andhra Pradesh", type: "Store", phones: ["9703769325"] },
  { id: "madurai", name: "Madurai", city: "Madurai", state: "Tamil Nadu", type: "Store", phones: ["9626151511"] },
  { id: "mumbai-malad", name: "Mumbai Malad", city: "Mumbai", state: "Maharashtra", type: "Store", phones: ["9892467008"] },
  { id: "mumbai-mulund", name: "Mumbai Mulund", city: "Mumbai", state: "Maharashtra", type: "Store", phones: ["9892467008"] },
  { id: "mumbai-service-centre", name: "Mumbai Service Centre", city: "Mumbai", state: "Maharashtra", type: "Service Centre", phones: ["9819082046"] },
  { id: "mumbai-thane", name: "Mumbai Thane", city: "Mumbai", state: "Maharashtra", type: "Store", phones: ["9892467008"] },
  { id: "mumbai-vashi", name: "Mumbai Vashi", city: "Mumbai", state: "Maharashtra", type: "Store", phones: ["9892467008"] },
  { id: "nagercoil", name: "Nagercoil", city: "Nagercoil", state: "Tamil Nadu", type: "Store", phones: ["9894624580"] },
  { id: "nellore", name: "Nellore", city: "Nellore", state: "Andhra Pradesh", type: "Store", phones: ["9989033307"] },
  { id: "patna", name: "Patna", city: "Patna", state: "Bihar", type: "Store", phones: ["9430292967"] },
  { id: "puducherry", name: "Puducherry", city: "Puducherry", state: "Puducherry", type: "Store", phones: ["9994577755"] },
  { id: "pune", name: "Pune", city: "Pune", state: "Maharashtra", type: "Store", phones: ["9004257474"] },
  { id: "rajkot", name: "Rajkot", city: "Rajkot", state: "Gujarat", type: "Store", phones: ["9825826888"] },
  { id: "salem", name: "Salem", city: "Salem", state: "Tamil Nadu", type: "Store", phones: ["9443072452"] },
  { id: "siliguri", name: "Siliguri", city: "Siliguri", state: "West Bengal", type: "Store", phones: ["9832042557"] },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", city: "Thiruvananthapuram", state: "Kerala", type: "Store", phones: ["9488882233"] },
  { id: "thrissur", name: "Thrissur", city: "Thrissur", state: "Kerala", type: "Store", phones: ["9447408149"] },
  { id: "tiruchirappalli", name: "Tiruchirappalli", city: "Tiruchirappalli", state: "Tamil Nadu", type: "Store", phones: ["9444214143"] },
  { id: "tirunelveli", name: "Tirunelveli", city: "Tirunelveli", state: "Tamil Nadu", type: "Store", phones: ["9840874580"] },
  { id: "tirupati", name: "Tirupati", city: "Tirupati", state: "Andhra Pradesh", type: "Store", phones: ["8772222043"] },
  { id: "vellore", name: "Vellore", city: "Vellore", state: "Tamil Nadu", type: "Store", phones: ["9841072763"] },
  { id: "vijayawada", name: "Vijayawada", city: "Vijayawada", state: "Andhra Pradesh", type: "Store", phones: ["9963099199"] },
];

/** The flagship location — full verified address details. */
export const FLAGSHIP_STORE_ID = "chennai-experience-centre";

export const STATES = [...new Set(STORES.map((s) => s.state))].sort();
export const STORE_TYPES: StoreType[] = ["Experience Centre", "Store", "Service Centre"];

/** Strip formatting so a display number becomes a dialable/wa.me number. */
export function telHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return digits.startsWith("91") && digits.length > 10 ? `+${digits}` : `+91${digits}`;
}

export function storeMapsUrl(store: Store): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `Afton Fitness ${store.name} ${store.city} ${store.state}`,
  )}`;
}
