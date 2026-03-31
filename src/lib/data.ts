import { Property } from './types';
import { initProperty } from './scoring';

// Curated properties (high-quality manually verified)
const curated: Property[] = [
  {d:"Grupo Masa",p:"Vision Townhouses",l:"Gran Alacant, Santa Pola",r:"cb-south",t:"Townhouse",pf:191000,pt:240000,mm2:2800,bm:121,pl:60,bd:2,ba:2,bk:2,c:"2026-Q2",s:"under-construction",dy:50,f:"Monte y Mar residential area. Energy efficient, contemporary design. 50+ year developer with excellent track record.",u:"https://masa.eu/en/obra-nueva/vision/"},
  {d:"Grupo Masa",p:"Linda Semi-Detached",l:"Gran Alacant, Santa Pola",r:"cb-south",t:"Townhouse",pf:395000,pt:526000,mm2:2800,bm:170,pl:215,bd:3,ba:2,bk:2,c:"2026-Q3",s:"under-construction",dy:50,f:"Semi-detached homes with optional pool. 108m² built on 215m² plots.",u:"https://masa.eu/en/obra-nueva/linda-2/"},
  {d:"Urmosa",p:"Sea Essence",l:"Santa Pola",r:"cb-south",t:"Apartment",pf:230000,pt:395000,mm2:2900,bm:90,pl:null,bd:2,ba:2,bk:1.5,c:"2026-Q2",s:"under-construction",dy:38,f:"Modern apartments close to Santa Pola beach. 1-3 bedroom options.",u:"https://urmosa.com/en/promotions/224/sea-essence-santa-pola/"},
  {d:"Amay Properties",p:"Amay Deluxe",l:"Dehesa de Campoamor, Orihuela Costa",r:"cb-south",t:"Villa",pf:975000,pt:1000000,mm2:3100,bm:250,pl:500,bd:4,ba:3,bk:0.25,c:"2026-Q2",s:"ready",dy:30,f:"Premium villas just 250m from beach! Large 500m² plots, private pool.",u:"https://amayproperties.com/en/property/330/luxury-villa-in-amay-deluxe-exclusive-design/"},
  {d:"Taylor Wimpey España",p:"Sora",l:"La Pedrera, Dénia",r:"cb-north",t:"Apartment",pf:315000,pt:470000,mm2:3200,bm:105,pl:null,bd:2,ba:2,bk:2,c:"2027-09",s:"off-plan",dy:65,f:"86 homes in 6 buildings. A-class energy with solar panels. Taylor Wimpey is one of the world's largest developers.",u:"https://taylorwimpeyspain.com/property/sora-denia-alicante/"},
  {d:"Allonbay",p:"Allonbay Urban",l:"Villajoyosa / Benidorm",r:"cb-north",t:"Apartment",pf:249000,pt:254000,mm2:3800,bm:62,pl:null,bd:1,ba:1,bk:0.1,c:"2026-Q2",s:"under-construction",dy:12,f:"Just 100m from the sea! Landscaped gardens, communal pools.",u:"https://allonbay.com/en/"},
  {d:"Trivee",p:"Villa Saria",l:"La Finca Golf Resort, Algorfa",r:"cb-south",t:"Villa",pf:419000,pt:618000,mm2:3200,bm:135,pl:450,bd:3,ba:2,bk:14,c:"2026-Q2",s:"under-construction",dy:40,f:"13 detached single-floor villas at La Finca Golf. Private pool, garden.",u:"https://trivee.com/en/promotions/villa-saria/"},
  {d:"Duly Investment",p:"Amanecer X",l:"Orihuela Costa",r:"cb-south",t:"Apartment",pf:299000,pt:360000,mm2:2900,bm:78,pl:null,bd:2,ba:2,bk:2.5,c:"2026-Q2",s:"under-construction",dy:20,f:"108 apartments. Large terraces, fully furnished. Only ~3 units remaining!",u:"https://dulyinvestment.com/residencial/amanecer-x/"},
];

export async function loadProperties(): Promise<Property[]> {
  const all = [...curated];

  try {
    const res = await fetch('/data.json');
    const scraped: Property[] = await res.json();
    const curatedRefs = new Set(all.filter(d => d.ref).map(d => d.ref));
    const newProps = scraped.filter(s => !curatedRefs.has(s.ref));
    all.push(...newProps);
  } catch {
    // No scraped data available, use curated only
  }

  return all.map(initProperty);
}
