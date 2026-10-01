/** Fictional Lab rules. These never query live availability or create transactions. */
export const demoSlots: Record<string, readonly string[]> = {
  "Thursday / sample date": ["10:00 AM", "2:00 PM"],
  "Saturday / sample date": ["11:00 AM", "1:00 PM"],
  "Sunday / sample date": [],
};
export function stayTotal(rate: number, nights: number, guests: number, dinner: boolean, tour: boolean) {
  if (!Number.isInteger(nights) || nights < 1 || nights > 7 || !Number.isInteger(guests) || guests < 1 || guests > 4) throw new Error("Invalid demo stay");
  return rate * nights + (dinner ? guests * 45 : 0) + (tour ? 60 : 0);
}
export function tableMinimum(section: "Lounge" | "Dance floor" | "Balcony", guests: number) {
  const options = { Lounge: {capacity:4,minimum:400}, "Dance floor": {capacity:8,minimum:800}, Balcony: {capacity:12,minimum:1200} };
  const table = options[section];
  return {...table, fits: Number.isInteger(guests) && guests >= 2 && guests <= table.capacity, deposit:table.minimum * .25};
}
export function routeService(service: string, area: string, urgency: string) {
  if (area === "Outside the demo area") return {kind:"area",next:"Ask about service coverage",bookable:false};
  if (urgency === "Urgent") return {kind:"urgent",next:"Contact the service team directly",bookable:false};
  return {kind:"scheduled",next:service === "New installation"?"Plan an estimate visit":"Schedule a service consultation",bookable:true};
}
