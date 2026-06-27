export type Categoria = "Partes de Cima" | "Partes de Baixo" | "Calçado" | "Acessórios";
export type Genero = "Mulher" | "Homem";

export type ItemSource = "catalog" | "wardrobe";

export interface ClothingItem {
  id: string;
  nome: string;
  loja: string;
  brand?: string;
  categoria: Categoria;
  genero?: Genero;
  piso?: string;
  imageSource?: "url" | "upload" | "camera" | "bot";
  imagem: string;
  preco: number;
  link: string;
  source: ItemSource;
}

export interface FashionSearchItem {
  title: string;
  image: string;
  url: string;
  price: number | null;
  store: string;
  brand?: string;
  piso?: string;
  genero?: Genero;
  categoria?: Categoria;
}

export interface FashionSearchResponse {
  items: FashionSearchItem[];
  error?: {
    code: "BAD_REQUEST" | "UNAUTHORIZED" | "NOT_FOUND" | "TIMEOUT" | "UPSTREAM_ERROR";
    message: string;
  };
}

export interface OutfitItemRef {
  id: string;
  source: ItemSource;
}

export interface Outfit {
  id: string;
  nome: string;
  items: Partial<Record<Categoria, OutfitItemRef>>;
  createdAt: number;
  coverImage?: string;
}

export const CATEGORIAS: Categoria[] = [
  "Acessórios",
  "Partes de Cima",
  "Partes de Baixo",
  "Calçado",
];

export const formatPrice = (n: number) => `${n.toFixed(2).replace(".", ",")} €`;

export const CATALOG_ITEMS: ClothingItem[] = [];

// kept for legacy compat — empty
const _LEGACY_CATALOG: ClothingItem[] = [
  // ── MULHER – Partes de Cima ────────────────────────────────────────────────
  {
    id: "s-w-top-1",
    brand: "SHEIN",
    nome: "T-Shirt Básica com Decote em V",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&q=80",
    preco: 5.99,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },
  {
    id: "s-w-top-2",
    brand: "SHEIN",
    nome: "Blusa Floral com Laço",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80",
    preco: 9.49,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },
  {
    id: "s-w-top-3",
    brand: "SHEIN",
    nome: "Camisola Cropped Oversize",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1555069519-127aadedf1ee?w=600&q=80",
    preco: 11.99,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },
  {
    id: "s-w-top-4",
    brand: "SHEIN",
    nome: "Blazer Elegant Feminino",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    preco: 19.99,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },
  {
    id: "s-w-top-5",
    brand: "SHEIN",
    nome: "Vestido Midi Floral Verão",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    preco: 14.99,
    link: "https://pt.shein.com/Women-Dresses-c-1727.html",
    source: "catalog",
  },
  {
    id: "s-w-top-6",
    brand: "SHEIN",
    nome: "Camisola de Malha Oversized",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    preco: 13.49,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },
  {
    id: "s-w-top-7",
    brand: "SHEIN",
    nome: "Top Frente Única Ombro a Descoberto",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80",
    preco: 7.99,
    link: "https://pt.shein.com/Women-Tops-c-2030.html",
    source: "catalog",
  },

  // ── MULHER – Partes de Baixo ───────────────────────────────────────────────
  {
    id: "s-w-bot-1",
    brand: "SHEIN",
    nome: "Calças Wide Leg Bege",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1594938374182-a55a9d6e2f29?w=600&q=80",
    preco: 12.99,
    link: "https://pt.shein.com/Women-Pants-c-2153.html",
    source: "catalog",
  },
  {
    id: "s-w-bot-2",
    brand: "SHEIN",
    nome: "Saia Midi Plissada Rosa",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    preco: 10.99,
    link: "https://pt.shein.com/Women-Skirts-c-1732.html",
    source: "catalog",
  },
  {
    id: "s-w-bot-3",
    brand: "SHEIN",
    nome: "Jeans Skinny de Cintura Alta",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80",
    preco: 15.99,
    link: "https://pt.shein.com/Women-Jeans-c-1740.html",
    source: "catalog",
  },
  {
    id: "s-w-bot-4",
    brand: "SHEIN",
    nome: "Saia Mini Xadrez",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1577900232427-18219b9166a0?w=600&q=80",
    preco: 8.99,
    link: "https://pt.shein.com/Women-Skirts-c-1732.html",
    source: "catalog",
  },
  {
    id: "s-w-bot-5",
    brand: "SHEIN",
    nome: "Calças de Ganga Largas Y2K",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    preco: 17.49,
    link: "https://pt.shein.com/Women-Jeans-c-1740.html",
    source: "catalog",
  },

  // ── MULHER – Calçado ───────────────────────────────────────────────────────
  {
    id: "s-w-shoe-1",
    brand: "SHEIN",
    nome: "Sandálias de Tiras Douradas",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80",
    preco: 14.99,
    link: "https://pt.shein.com/Women-Shoes-c-1748.html",
    source: "catalog",
  },
  {
    id: "s-w-shoe-2",
    brand: "SHEIN",
    nome: "Sapatilhas Chunky Plataforma",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&q=80",
    preco: 22.99,
    link: "https://pt.shein.com/Women-Shoes-c-1748.html",
    source: "catalog",
  },
  {
    id: "s-w-shoe-3",
    brand: "SHEIN",
    nome: "Botins Ankle Pretos",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=600&q=80",
    preco: 27.99,
    link: "https://pt.shein.com/Women-Shoes-c-1748.html",
    source: "catalog",
  },
  {
    id: "s-w-shoe-4",
    brand: "SHEIN",
    nome: "Mules com Tacão Bloco",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?w=600&q=80",
    preco: 18.99,
    link: "https://pt.shein.com/Women-Shoes-c-1748.html",
    source: "catalog",
  },

  // ── MULHER – Acessórios ────────────────────────────────────────────────────
  {
    id: "s-w-acc-1",
    brand: "SHEIN",
    nome: "Mala Crossbody Mini Bege",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    preco: 12.99,
    link: "https://pt.shein.com/Women-Bags-c-1756.html",
    source: "catalog",
  },
  {
    id: "s-w-acc-2",
    brand: "SHEIN",
    nome: "Óculos de Sol Cat Eye",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=600&q=80",
    preco: 5.99,
    link: "https://pt.shein.com/Women-Accessories-c-1764.html",
    source: "catalog",
  },
  {
    id: "s-w-acc-3",
    brand: "SHEIN",
    nome: "Chapéu Bucket de Algodão",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    preco: 7.49,
    link: "https://pt.shein.com/Women-Accessories-c-1764.html",
    source: "catalog",
  },
  {
    id: "s-w-acc-4",
    brand: "SHEIN",
    nome: "Conjunto de Pulseiras Douradas",
    loja: "SHEIN",
    genero: "Mulher",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&q=80",
    preco: 4.99,
    link: "https://pt.shein.com/Women-Jewelry-c-1768.html",
    source: "catalog",
  },

  // ── HOMEM – Partes de Cima ─────────────────────────────────────────────────
  {
    id: "s-m-top-1",
    brand: "SHEIN",
    nome: "T-Shirt Oversized Gráfica",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    preco: 7.99,
    link: "https://pt.shein.com/Men-Tops-c-2199.html",
    source: "catalog",
  },
  {
    id: "s-m-top-2",
    brand: "SHEIN",
    nome: "Camisa de Linho Bege",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&q=80",
    preco: 13.99,
    link: "https://pt.shein.com/Men-Tops-c-2199.html",
    source: "catalog",
  },
  {
    id: "s-m-top-3",
    brand: "SHEIN",
    nome: "Hoodie Zip Streetwear",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=600&q=80",
    preco: 19.99,
    link: "https://pt.shein.com/Men-Hoodies-Sweatshirts-c-2206.html",
    source: "catalog",
  },
  {
    id: "s-m-top-4",
    brand: "SHEIN",
    nome: "Camisa Flanela Xadrez",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1589992896404-6cb50e1d9d85?w=600&q=80",
    preco: 14.99,
    link: "https://pt.shein.com/Men-Tops-c-2199.html",
    source: "catalog",
  },
  {
    id: "s-m-top-5",
    brand: "SHEIN",
    nome: "Polo de Manga Curta",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=600&q=80",
    preco: 9.99,
    link: "https://pt.shein.com/Men-Tops-c-2199.html",
    source: "catalog",
  },
  {
    id: "s-m-top-6",
    brand: "SHEIN",
    nome: "Sweatshirt Básica Cinzento",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=600&q=80",
    preco: 15.99,
    link: "https://pt.shein.com/Men-Hoodies-Sweatshirts-c-2206.html",
    source: "catalog",
  },
  {
    id: "s-m-top-7",
    brand: "SHEIN",
    nome: "Casaco Bomber Preto",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Cima",
    imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    preco: 29.99,
    link: "https://pt.shein.com/Men-Jackets-c-2209.html",
    source: "catalog",
  },

  // ── HOMEM – Partes de Baixo ────────────────────────────────────────────────
  {
    id: "s-m-bot-1",
    brand: "SHEIN",
    nome: "Jeans Slim Azul",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    preco: 18.99,
    link: "https://pt.shein.com/Men-Jeans-c-2208.html",
    source: "catalog",
  },
  {
    id: "s-m-bot-2",
    brand: "SHEIN",
    nome: "Calças Cargo Multi-Bolsos",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c?w=600&q=80",
    preco: 22.99,
    link: "https://pt.shein.com/Men-Pants-c-2207.html",
    source: "catalog",
  },
  {
    id: "s-m-bot-3",
    brand: "SHEIN",
    nome: "Chinos Slim Caqui",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    preco: 16.99,
    link: "https://pt.shein.com/Men-Pants-c-2207.html",
    source: "catalog",
  },
  {
    id: "s-m-bot-4",
    brand: "SHEIN",
    nome: "Calções Desportivos Pretos",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Partes de Baixo",
    imagem: "https://images.unsplash.com/photo-1519058082700-08a0b56da9b4?w=600&q=80",
    preco: 9.99,
    link: "https://pt.shein.com/Men-Pants-c-2207.html",
    source: "catalog",
  },

  // ── HOMEM – Calçado ────────────────────────────────────────────────────────
  {
    id: "s-m-shoe-1",
    brand: "SHEIN",
    nome: "Sapatilhas Low-Top Brancas",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    preco: 24.99,
    link: "https://pt.shein.com/Men-Shoes-c-2212.html",
    source: "catalog",
  },
  {
    id: "s-m-shoe-2",
    brand: "SHEIN",
    nome: "Ténis Running Coloridos",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=600&q=80",
    preco: 29.99,
    link: "https://pt.shein.com/Men-Shoes-c-2212.html",
    source: "catalog",
  },
  {
    id: "s-m-shoe-3",
    brand: "SHEIN",
    nome: "Mocassins Clássicos Castanhos",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600&q=80",
    preco: 32.99,
    link: "https://pt.shein.com/Men-Shoes-c-2212.html",
    source: "catalog",
  },
  {
    id: "s-m-shoe-4",
    brand: "SHEIN",
    nome: "Sandálias de Praia",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Calçado",
    imagem: "https://images.unsplash.com/photo-1531310197839-ccf54634509e?w=600&q=80",
    preco: 8.99,
    link: "https://pt.shein.com/Men-Shoes-c-2212.html",
    source: "catalog",
  },

  // ── HOMEM – Acessórios ─────────────────────────────────────────────────────
  {
    id: "s-m-acc-1",
    brand: "SHEIN",
    nome: "Mochila Casual Preta",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    preco: 19.99,
    link: "https://pt.shein.com/Men-Bags-c-2215.html",
    source: "catalog",
  },
  {
    id: "s-m-acc-2",
    brand: "SHEIN",
    nome: "Boné Snapback Preto",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    preco: 6.99,
    link: "https://pt.shein.com/Men-Accessories-c-2218.html",
    source: "catalog",
  },
  {
    id: "s-m-acc-3",
    brand: "SHEIN",
    nome: "Cinto de Tecido com Fivela",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&q=80",
    preco: 5.99,
    link: "https://pt.shein.com/Men-Accessories-c-2218.html",
    source: "catalog",
  },
  {
    id: "s-m-acc-4",
    brand: "SHEIN",
    nome: "Óculos de Sol Aviador",
    loja: "SHEIN",
    genero: "Homem",
    categoria: "Acessórios",
    imagem: "https://images.unsplash.com/photo-1508296695146-257a814070b4?w=600&q=80",
    preco: 7.49,
    link: "https://pt.shein.com/Men-Accessories-c-2218.html",
    source: "catalog",
  },
];

export const DUMMY_ITEMS = CATALOG_ITEMS;
