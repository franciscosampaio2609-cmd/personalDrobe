import { buildStoreScraper } from "./template.js";

export const storeDefs = [
  { name: "ACIUM", url: "https://www.acium.com/" },
  { name: "BERSHKA", url: "https://www.bershka.com/" },
  { name: "BIJOU BRIGITTE", url: "https://www.bijou-brigitte.com/" },
  { name: "C&A", url: "https://www.c-and-a.com/" },
  { name: "CLAIRE'S", url: "https://www.claires.com/" },
  { name: "DECENIO", url: "https://www.decenio.com/" },
  { name: "FORTE Store", url: "https://www.forte-store.com/" },
  { name: "GIOVANNI GALLI", url: "https://www.giovannigalli.com/" },
  { name: "INTIMISSIMI", url: "https://www.intimissimi.com/" },
  { name: "JD SPORTS", url: "https://www.jdsports.pt/" },
  { name: "LION OF PORCHES", url: "https://www.lionofporches.com/" },
  { name: "MANGO", url: "https://shop.mango.com/" },
  { name: "MR. BLUE", url: "https://www.mrblue.pt/" },
  { name: "PARFOIS", url: "https://www.parfois.com/" },
  { name: "PULL & BEAR", url: "https://www.pullandbear.com/" },
  { name: "SALSA", url: "https://www.salsajeans.com/" },
  { name: "SEASIDE", url: "https://www.seaside.pt/" },
  { name: "SPRINGFIELD", url: "https://myspringfield.com/" },
  { name: "STRADIVARIUS", url: "https://www.stradivarius.com/" },
  { name: "SUITS INC", url: "https://www.suitsinc.com/" },
  { name: "TIFFOSI", url: "https://www.tiffosi.com/" },
  { name: "TOUS", url: "https://www.tous.com/" },
  { name: "VILANOVA", url: "https://www.vilanova.com/" },
  { name: "WOMEN'SECRET", url: "https://www.womensecret.com/" },
  { name: "ZARA", url: "https://www.zara.com/" },
];

export const stores = storeDefs.map((store) =>
  buildStoreScraper({
    ...store,
    fallbackImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
  }),
);
