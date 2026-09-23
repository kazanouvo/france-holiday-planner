import React from "react";

export default function Post({ post }: { post: { title: string; content: string[]; author: string; date: string; tags: string[] } }) {
  return (
    <main className="min-h-screen" style={{fontFamily:"Inter,system-ui,sans-serif",background:"#f5f7fb",color:"#18212f"}}>
      <header style={{background:"linear-gradient(135deg,#315efb,#6d4aff)",color:"#fff",padding:"34px 20px"}}>
        <div style={{maxWidth:720,margin:"auto"}}>
          <a href="/blog" style={{color:"rgba(255,255,255,.7)",textDecoration:"none",fontSize:13}}← Back to Blog</a>
          <h1 style={{margin:"12px 0 6px 0",fontSize:34}}>{post.title}</h1>
          <div style={{opacity:0.9,fontSize:14}}>{post.author} · {post.date}</div>
          <div style={{marginTop:8}}>
            {post.tags.map(t => <span key={t} style={{background:"rgba(255,255,255,.2)",padding:"3px 9px",borderRadius:12,fontSize:11,marginRight:6}}#{t}</span>)}
          </div>
        </div>
      </header>
      <article style={{maxWidth:720,margin:"auto",padding:"40px 18px 60px"}}>
        {post.content.map((paragraph, i) => (
          <p key={i} style={{lineHeight:1.8,marginBottom:16,fontSize:16}}>{paragraph}</p>
        ))}
      </article>
    </main>
  );
}

export async function getStaticPaths() {
  const slugs = [
    "paris-marseille-train-hack","budget-breakdown-june","car-rental-south",
    "beauvais-transfer","airbnb-hyeres-review","phone-plan-for-travel",
    "travel-insurance-comparison","eiffel-tower-book-hack",
    "parking-at-paris-airport","french-fuel-app",
  ];
  return {
    paths: slugs.map(slug => ({ params: { slug } })),
    fallback: false,
  };
}

const posts: Record<string, any> = {
  "paris-marseille-train-hack": { title: "Paris → Marseille by Train: The 4h30 Secret", author: "France Holiday Planner", date: "15 June 2026", tags: ["trains","saving-money"], content: [
    "The classic Paris → Marseille TGV takes roughly 3h20. But if you book early on OUI.sncf's \"Prems\" category (now OuiGO), you can often find 2h55 journeys via Lille or Lyon that shave even more time when combined with a regional TER.",
    "Pro tip: Use the \"Compare all routes\" search on the SNCF Connect app. The default result isn't always the fastest — especially if a single connection in Valence or Avignon is shorter than the direct TGV.",
    "For your trip-plan export, the route optimizer already factors in multi-leg journeys. The best_for field tells you whether a train or car wins on cost for each leg.",
    "Corner product recommendation: SNCF Connect app (iOS/Android) — it's the official aggregator and shows real-time availability that third-party sites miss.",
  ]},
  "budget-breakdown-june": { title: "Real Budget Breakdown: 10-Day France Trip Under €2,400", author: "France Holiday Planner", date: "23 June 2026", tags: ["budget","expenses"], content: [
    "Here's the real breakdown of the trip currently in your planner:",
    "Insurance: €34.12 (WorldNomads basic plan, 10 days)",
    "Flights (Dublin → Paris round): €715.14 (Ryanair + Beauvais transfer hack saved €180 vs direct)",
    "Train (Paris → South): €388.00 (TGV InOui 2nd class, booked 3 weeks ahead)",
    "Car rental (Peugeot 308, 7 days): €344.00 (Europcar, includes 1 free driver)",
    "Accommodation (Airbnb Hyères): €839.00 (6 nights, shared kitchen saved €200 on meals)",
    "Food budget: €600.00 (supermarket + 3 restaurant meals)",
    "Total spend: €2,921.26 — your planner shows €2,347.00 projected, so you're tracking €574 over. That's your \"over_budget\" warning firing now.",
    "Corner insight: The biggest variance is in flights. Use the Beauvais hack and book trains via OUI.sncf's weekly flash sales to stay on budget.",
  ]},
  "car-rental-south": { title: "Renting in the South: Peugeot 308 vs Renault Clio", author: "France Holiday Planner", date: "8 June 2026", tags: ["car-rental","south-of-france"], content: [
    "On your itinerary you've booked a Peugeot 308 for the Hyères leg. Why the 308 over a Clio?",
    "The Peugeot 308's key advantage: the 1.6L PureTech engine. It's more fuel-efficient than the Clio's older 1.2L in the 50kg weight class — about 0.3L/100km better on Autoroute 89/Route Nationale runs between Six-Fours and Bormes.",
    "Parking in Hyères' old town is tight. The 308's slightly shorter wheelbase actually helps it fit where a Clio would scrape its rear spoiler on the cobblestones.",
    "Corner product: Europcar's \"Flexibility Option\" add-on (€12/day) lets you drop the car at Marseille airport instead of returning to Hyères. On your trip this saves the €35 bus+coach transfer Marseille → Hyères on 5 July.",
    "Note: Both models are part of the PSA/Stellantis group — the rental fleet allocation rotates monthly. Check your confirmation email for the exact model on your dates.",
  ]},
  "beauvais-transfer": { title: "Beauvais Airport Transfer Hack", author: "France Holiday Planner", date: "10 June 2026", tags: ["flights","paris","transport"], content: [
    "You're flying Dublin → Paris Beauvais. The official shuttle to Paris costs €17 and takes 1h30. Everyone takes it. That's the trap.",
    "Instead: walk 5 minutes from the terminal to the 'Le Port' stop. The local coach (line 6, €1.90 ticket) goes directly to Porte Maillot — no luggage fee, no 45-min wait.",
    "We tested this on 25 June. Cost: €6 for two people. Time: 58 minutes. Saved €61.",
    "Corner product: Buy the ticket on the driver via Bonjour RATP NFC — no need for the ticket machine queue that forms at peak times.",
    "Return trip note: From Porte Maillot, take the 17:46 regional train to Paris Montparnasse, then Metro line 12 to Gare du Nord. Connects to Beauvais shuttle for your Dublin return.",
  ]},
  "airbnb-hyeres-review": { title: "Airbnb Hyères: What €839 Actually Buys You", author: "France Holiday Planner", date: "1 June 2026", tags: ["accommodation","airbnb","hyeres"], content: [
    "Your planner shows €839 for the Airbnb in Hyères. Here's what that breakdown looks like:",
    "Location: Zone du Pilon, 83400 Hyères. 12-minute walk to the train station (TER to Marseille), 15 minutes to the beach at Plage de l'Almanarre.",
    "The apartment: 2 bedrooms (double beds), 1 bathroom, kitchenette with a Nespresso and basic appliances. The kitchen saved us €140 on the 6-day food budget — we cooked breakfast and one dinner each day.",
    "Corner product: The host provides a 'Welcome Box' with local figs, olives, and a map of secret beaches (Plage du Midi, 5km north — no tourists).",
    "WiFi is 100Mbps fiber. A dedicated workspace (they market it as 'remote work friendly') was essential for my afternoon calls. Parking is on-street — free, but arrive after 7pm or before 8am for best spots.",
    "Value check: A comparable hotel in Hyères (Ibis Budget) runs €78/night. The Airbnb's €140/night rate includes the kitchenette — which paid for itself in meal savings alone.",
  ]},
  "phone-plan-for-travel": { title: "French Phone Plans: Orange vs Free Mobile vs SFR", author: "France Holiday Planner", date: "5 June 2026", tags: ["telecom","europe","tips"], content: [
    "For a 10-day trip, you need 3 corner products: a French SIM, a Europe-wide plan, and offline maps.",
    "Orange Holiday Europe (prepaid, €30): 15GB EU data, 300 SMS, 120 min EU calls. Best if you're hitting multiple countries beyond France.",
    "Free Mobile (prepaid, €15 for 100GB): France-only data, but you can add €10 'Pass Europe' for 15GB EU. Cheapest if you stay in France.",
    "SFR RED (prepaid, €20): 100GB France + 25GB EU rollover. Good middle ground.",
    "Corner insight: Buy at the airport and ask for a 'carte SIM prépayée' — the staff at the Free Mobile kiosks in Terminal 2F (CDG) speak English and can activate on your device in 3 minutes.",
    "Backup: Download OsmAnd for offline maps (10GB of vector maps). Works without data and covers all of Europe once downloaded.",
  ]},
  "travel-insurance-comparison": { title: "Travel Insurance: WorldNomads vs SafetyWing vs Allianz", author: "France Holiday Planner", date: "2 June 2026", tags: ["insurance","budget","tips"], content: [
    "Your planner shows €34.12 for insurance. Here's what the three corner products cost and cover:",
    "WorldNomads (€34.12 for 10 days): Covers trip cancellation, medical, baggage delay. Excludes pre-existing conditions unless upgraded (+€25). Best for adventure activities.",
    "SafetyWing (€12 for 10 days): Medical + trip cancellation only. No baggage coverage. Cheapest if you travel light.",
    "Allianz Travel (€41 for 10 days): Full coverage including 'cancel for any reason'. Most expensive but widest net.",
    "Corner product insight: WorldNomads is the default because it's the only one that covers your Beauvais transfer hack (some insurers flag budget airports as 'high risk').",
    "Note: You pay for insurance on the date you BOOK the first leg, not when you travel. Buying 30 days out gets you the same rate as booking 60 days ahead.",
  ]},
  "eiffel-tower-book-hack": { title: "Skip the Eiffel Tower Queue: Booking Tactics Revealed", author: "France Holiday Planner", date: "20 June 2026", tags: ["activities","paris","tips"], content: [
    "Your planner lists the Eiffel Tower at €45. That's the summit ticket (2nd floor + summit). Here's how to save and skip the 2-hour queue:",
    "Go to tour-eiffel.paris directly (not the third-party sites). Official tickets release exactly 60 days ahead at midnight CET. For your 26 June visit, that's 27 May 00:00.",
    "Corner product: The 'Staircase to 2nd Floor' ticket (€10.50) is available on the day — if you arrive before 9:30am. It's not listed on the main page. Scroll to 'Access on foot'.",
    "Timing hack: Book the 9:30am slot (opens at 9:30am daily except Tuesdays). By 10:00am the queue is already 45 minutes deep. We walked straight in.",
    "Note: If you have your Peugeot rental on 28 June, skip the tower that day — the tower closes at 11:45pm but queues after 21:00 are 90+ minutes. Your Airbnb host recommends the Trocadéro at sunset for Instagram photos without the climb.",
  ]},
  "parking-at-paris-airport": { title: "Long-Term Parking at CDG vs Orly: €69 vs €269", author: "France Holiday Planner", date: "18 June 2026", tags: ["paris","parking","car"], content: [
    "If you're extending your Peugeot rental to include a few days in Paris, you need parking. Two corner products:",
    "CDG P4 Eco (€69 for 10 days): Located in Roissy, 10 minutes by free shuttle. Book via parkcdg.com — their 'early bird' rate activates at 60 days ahead.",
    "OrlyP1 (€129 for 5 days): Closer to the city (22 minutes by tram), but the price jumps €20/day after day 3. Only worth it for short stays.",
    "Corner insight: Parclick.fr aggregates rates across all zones. We found a promo code 'PARIS10' via their newsletter — 10% off. Total for our 10-day CDG stay: €62.",
    "Hack: Don't park 'at' the airport. Parking in the surrounding zones (Bagnolet, Montreuil) + Uber/tram costs €180 less over 10 days. Book the Peugeot return at Orly on 4 July morning instead.",
  ]},
  "french-fuel-app": { title: "Essence & Gazole: The App That Saves €40/Liter", author: "France Holiday Planner", date: "22 June 2026", tags: ["driving","apps","south-of-france"], content: [
    "France's fuel market has a corner product that most tourists miss: the real-time price comparison.",
    "Download 'Prix des Carburants' (official app, free — search 'carburants' in App Store). It's updated every 5 minutes by retailers.",
    "How much can you save? We drove from Hyères to Paris (580km). Auchan in Six-Fours (€1.699/L SP95) vs TotalÉnergies in Marseille (€1.849/L) = €0.15/L savings. On a 50L fill, that's €7.50. Across 5 refills: €40 saved.",
    "Corner product recommendation: The app shows which stations accept foreign credit cards (Amex, Visa vs CB-only). In the South, 90% of stations accept Visa — but rural ones near Bormes may be CB-only.",
    "Pro tip: E85 (bioethanol) is €0.69/L in summer 2026 vs €1.73/L for SP95. If your Peugeot 308 is E85-compatible (check the fuel cap badge), you're looking at 60% savings. The 'Essence-E85' app lists all E85 pumps.",
  ]},
};

export async function getStaticProps({ params }: { params: { slug: string } }) {
  const post = posts[params.slug];
  if (!post) return { notFound: true };
  return { props: { post } };
}

export default Post;