export type Layout = "Seated dinner" | "Ceremony" | "Cocktail reception";
export const spaces = [
  {name:"The Conservatory",x:81,y:44,capacity:160,description:"Glazed architecture, garden views and a flexible event floor."},
  {name:"The Manor",x:49,y:32,capacity:80,description:"An intimate gathering space opening onto the courtyard."},
  {name:"Ceremony Garden",x:29,y:52,capacity:160,description:"An open-air setting connected to the estate paths."},
  {name:"Guest Inn",x:15,y:20,capacity:40,description:"A smaller setting for welcome gatherings and private dinners."},
] as const;
export function capacityFor(space:number,layout:Layout) { return Math.round(spaces[space].capacity * (layout === "Seated dinner" ? .75 : layout === "Ceremony" ? 1 : 1.25)); }
export function furnitureFor(layout:Layout,guests:number) {
  const count=Math.max(0,Math.min(200,Math.round(guests)));
  return {seats:layout === "Cocktail reception" ? 0 : count,tables:layout === "Seated dinner" ? Math.ceil(count/8) : layout === "Cocktail reception" ? Math.ceil(count/12) : 0};
}
export const sections = [
  {name:"The Velvet Bench",seats:4,minimum:500,x:82,y:33,category:"VIP",description:"A close view of the music, with an intimate straight bench."},
  {name:"The Corner Lounge",seats:8,minimum:1200,x:85,y:48,category:"VIP",description:"A generous corner setting for a larger group."},
  {name:"The Lounge Suite",seats:6,minimum:900,x:84,y:64,category:"VIP",description:"Facing sofas and a shared table near the dance floor."},
  {name:"The Private Room",seats:12,minimum:1800,x:86,y:78,category:"VIP",description:"A separate section for a more private gathering."},
  {name:"Dining Room",seats:8,minimum:320,x:27,y:43,category:"Dinner",description:"Begin with dinner before moving into the lounge."},
  {name:"Bar + Lounge",seats:6,minimum:180,x:55,y:62,category:"Drinks",description:"A relaxed lounge setting beside the main bar."},
  {name:"Dance Floor",seats:12,minimum:0,x:61,y:26,category:"Dancing",description:"A general-admission experience centered on the music."},
  {name:"The Terrace",seats:8,minimum:240,x:82,y:89,category:"After Hours",description:"A quieter terrace finish to the evening."},
] as const;
export function suitableSections(mood:string,party:number){ return sections.map((s,i)=>({...s,id:i})).filter(s=>s.category===mood&&s.seats>=party); }
export function nightEstimate(section:number,arrival:string,bottle:boolean,host:boolean){const base=sections[section].minimum; const late=arrival>="23:00"&&sections[section].category==="VIP"?150:0;return {minimum:base+late,extras:(bottle?180:0)+(host?75:0),total:base+late+(bottle?180:0)+(host?75:0)};}
export function itinerary(mood:string,arrival:string){const [h,m]=arrival.split(":").map(Number);const at=(offset:number)=>{const mins=(h*60+m+offset)%1440;return `${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`;};return [{time:at(0),title:"Arrival + host check-in"},{time:at(15),title:mood==="Dinner"?"Dinner seating":mood==="VIP"?"Table service":mood==="Dancing"?"Enter the dance floor":mood==="After Hours"?"Terrace gathering":"Drinks in the lounge"},{time:at(60),title:mood==="After Hours"?"A relaxed finish":"Music + dancing"}];}
export type JobState={booked:boolean;day:string;time:string;technician:string;status:number;estimate:"none"|"pending"|"approved"|"declined";log:string[]};
export const initialJob:JobState={booked:false,day:"2026-10-06",time:"10:00",technician:"",status:0,estimate:"none",log:[]};
export function canAssign(technician:string,time:string){const hour=Number(time.slice(0,2));const busy:Record<string,number>={Jordan:9,Morgan:10,Taylor:11};return technician in busy && !(hour<busy[technician]+1&&hour+2>busy[technician]);}
export type JobAction={type:"book";day:string;time:string}|{type:"assign";technician:string}|{type:"advance"}|{type:"estimate"}|{type:"approve"}|{type:"decline"}|{type:"update"}|{type:"reset"};
export const jobStatuses=["Requested","Booked","Assigned","On the way","At your home","Completed"];
export function jobReducer(state:JobState,action:JobAction):JobState{
  const add=(message:string)=>[...state.log,message];
  switch(action.type){
    case "book":return {...initialJob,booked:true,day:action.day,time:action.time,status:1,log:["Service request received",`Appointment confirmed: ${action.day} at ${action.time}`]};
    case "assign":return state.booked&&state.status<3&&canAssign(action.technician,state.time)?{...state,technician:action.technician,status:2,log:add(`Assigned to ${action.technician}`)}:state;
    case "advance":return !state.technician||state.status>=5||(state.status===4&&state.estimate!=="approved")?state:{...state,status:state.status+1,log:add(jobStatuses[state.status+1])};
    case "estimate":return state.status===4?{...state,estimate:"pending",log:add("Demo estimate shared for review")}:state;
    case "approve":return state.estimate==="pending"?{...state,estimate:"approved",log:add("Homeowner approved the demo estimate")}:state;
    case "decline":return state.estimate==="pending"?{...state,estimate:"declined",log:add("Homeowner requested an estimate revision")}:state;
    case "update":return state.booked?{...state,log:add(`Customer update: ${jobStatuses[state.status]}`)}:state;
    case "reset":return {...initialJob,log:[]};
  }
}
export const serviceEducation=[
 {name:"Botox / neuromodulators",text:"Botulinum toxin injections temporarily reduce muscle activity associated with certain facial lines. They are different from fillers. Ask a licensed clinician about product labeling, suitability and risks.",source:"https://www.fda.gov/consumers/consumer-updates/dermal-filler-dos-and-donts-wrinkles-lips-and-more"},
 {name:"Dermal fillers",text:"Injectable fillers may add fullness in approved areas. Uses vary by product. This is a medical procedure with risks, including rare serious complications from injection into a blood vessel.",source:"https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/dermal-fillers-soft-tissue-fillers"},
 {name:"Lip filler",text:"Some dermal fillers are approved for lip augmentation. A consultation covers anatomy, expectations, product choice and risks. This demo does not assess whether lip filler is suitable for you.",source:"https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/dermal-fillers-soft-tissue-fillers"},
 {name:"Microneedling",text:"Certain devices are authorized for specific uses involving wrinkles or scars. Device choice, infection risk, skin considerations and recovery belong in a clinician-led discussion.",source:"https://www.fda.gov/medical-devices/aesthetic-cosmetic-devices/microneedling-devices"},
 {name:"Skin resurfacing",text:"Ask a clinician to explain the differences between laser procedures, chemical peels and other resurfacing approaches, including benefits, risks and recovery for your skin.",source:"https://www.fda.gov/consumers/consumer-updates/microneedling-devices-getting-point-benefits-risks-and-safety"},
] as const;
export const retailProducts=[{name:"Everyday mug",price:38},{name:"Sculptural vase",price:72},{name:"Plum bowl",price:48}];
export const journeyRules={
 Discovering:{heading:"Objects with a story.",reason:"Introduce the brand and the experience before asking for commitment.",order:["Story + atmosphere","Collection","Materials + care"],cta:"Explore the collection"},
 Comparing:{heading:"Find the piece that fits your everyday.",reason:"Move useful differences closer to the choice: material, scale and care.",order:["Materials + care","Collection","Story + atmosphere"],cta:"Compare the collection"},
 "Ready to buy":{heading:"Your next everyday favorite.",reason:"Bring selection and price forward, with a clear path to the demo bag.",order:["Collection","Materials + care","Story + atmosphere"],cta:"Review your demo bag"},
} as const;
