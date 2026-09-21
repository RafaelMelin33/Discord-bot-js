import Parser from "rss-parser";

const parser = new Parser();

const fontes = [
  {
    nome: "IGN",
    url: "https://feeds.ign.com/ign/all",
  },
  {
    nome: "Polygon",
    url: "https://www.polygon.com/rss/index.xml",
  },
  {
    nome: "Anime News Network",
    url: "https://www.animenewsnetwork.com/all/rss.xml",
  },
];

const palavrasGeek = [
  "game",
  "games",
  "gaming",
  "playstation",
  "xbox",
  "nintendo",
  "anime",
  "manga",
  "marvel",
  "dc",
  "movie",
  "film",
  "series",
  "netflix",
  "pokemon",
  "dragon ball",
  "one piece",
  "naruto",
];


function ehNoticiaGeek(noticia) {
  const texto = `
    ${noticia.title || ""}
    ${noticia.contentSnippet || ""}
    ${noticia.content || ""}
  `.toLowerCase();

  return palavrasGeek.some(
    palavra => texto.includes(palavra)
  );
}


export async function buscarNoticiasGeek(limite = 10) {
  const noticias = [];

  for (const fonte of fontes) {
    try {

      const feed = await parser.parseURL(
        fonte.url
      );

      for (const item of feed.items) {

        const noticia = {
          titulo: item.title,
          link: item.link,
          data:
            item.isoDate ||
            item.pubDate ||
            null,
          descricao:
            item.contentSnippet ||
            "",
          fonte: fonte.nome,
        };

        if (ehNoticiaGeek(noticia)) {
          noticias.push(noticia);
        }
      }

    } catch (erro) {

      console.log(
        `Erro ao buscar notícias de ${fonte.nome}:`,
        erro.message
      );
    }
  }

  noticias.sort((a, b) => {

    const dataA =
      new Date(a.data || 0);

    const dataB =
      new Date(b.data || 0);

    return dataB - dataA;
  });

  return noticias.slice(0, limite);
}