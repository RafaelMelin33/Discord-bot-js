import OpenAI from "openai";
import "dotenv/config";
import readline from "readline";
import fs from "fs";
import {
  Client,
  GatewayIntentBits
} from "discord.js";

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discord.once("ready", () => {
  console.log(`Bot conectado como ${discord.user.tag}`);
});

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

const instructions = `
Você é um assistente pessoal especializado exclusivamente no mundo geek.

Você pode conversar somente sobre assuntos relacionados a:
- jogos
- videogames
- PC Gaming
- animes
- mangás
- filmes
- séries
- quadrinhos
- Marvel
- DC
- Pokémon
- Nintendo
- PlayStation
- Xbox
- cultura pop
- personagens fictícios
- universos fictícios
- atores, diretores e criadores quando relacionados a filmes, séries, jogos ou cultura geek
- hardware e tecnologia relacionada a jogos

REGRAS IMPORTANTES:

1. Nunca responda perguntas que não tenham relação com o mundo geek.

2. Se a pergunta não estiver relacionada ao mundo geek, responda EXATAMENTE:
"Desculpe, só posso responder perguntas relacionadas ao mundo geek."

3. Se o usuário mandar uma saudação responda somente a saudação e "desculpe, só posso responder perguntas relacionadas ao mundo geek.", exemplo:
"Olá (emoji feliz), desculpe, só posso responder perguntas relacionadas ao mundo geek.

4. Não tente responder parcialmente perguntas fora do mundo geek.

5. Considere o histórico da conversa.

Por exemplo:

Usuário:
Quem é Naruto?

Depois:
Quem é o pai dele?

A segunda pergunta continua sendo considerada geek por causa do contexto.

5. Responda sempre em português do Brasil.

6. Seja natural, amigável e objetivo.

7. Não invente informações.
`;

const modelos = [
  "inclusionai/ling-3.0-flash-vl:free",
  "nex-agi/nex-n2.5-pro:free",
  "qwen/qwen3.8-27b:free",
  "nvidia/nemotron-3.5-lightning:free",
];

const ARQUIVO_MEMORIA = "./memoria.json";

let memorias = carregarMemorias();


// ==========================================
// MEMÓRIA
// ==========================================

function carregarMemorias() {
  try {
    if (!fs.existsSync(ARQUIVO_MEMORIA)) {
      return {};
    }

    const dados = fs.readFileSync(
      ARQUIVO_MEMORIA,
      "utf-8"
    );

    return JSON.parse(dados);

  } catch (erro) {
    console.log("Erro ao carregar memória.");

    return {};
  }
}


function salvarMemorias() {
  try {
    fs.writeFileSync(
      ARQUIVO_MEMORIA,
      JSON.stringify(memorias, null, 2)
    );

  } catch (erro) {
    console.log("Erro ao salvar memória.");
  }
}


// Retorna apenas o histórico daquele usuário
function obterHistorico(userId) {

  if (!memorias[userId]) {
    memorias[userId] = [];
  }

  return memorias[userId];
}


// Adiciona uma mensagem na memória de um usuário
function adicionarNaMemoria(
  userId,
  role,
  content
) {

  const historico = obterHistorico(userId);

  historico.push({
    role,
    content,
  });

  limitarMemoria(userId);

  salvarMemorias();
}


// Mantém somente as últimas mensagens
function limitarMemoria(userId) {

  const LIMITE = 20;

  const historico = obterHistorico(userId);

  if (historico.length > LIMITE) {
    memorias[userId] =
      historico.slice(-LIMITE);
  }
}


// Limpa apenas a memória de determinado usuário
function limparMemoria(userId) {

  memorias[userId] = [];

  salvarMemorias();
}


// ==========================================
// CLASSIFICA SE É GEEK
// ==========================================

async function perguntaEhGeek(
  userId,
  userInput
) {

  const historico = obterHistorico(userId);

  const historicoRecente = historico
    .slice(-6)
    .map(
      mensagem =>
        `${mensagem.role}: ${mensagem.content}`
    )
    .join("\n");


  const classificacaoInstructions = `
Você é um classificador de perguntas.

Sua única função é determinar se a pergunta do usuário
é relacionada ao mundo geek.

Considere como mundo geek:

- jogos
- videogames
- PC Gaming
- animes
- mangás
- filmes
- séries
- quadrinhos
- Marvel
- DC
- Pokémon
- Nintendo
- PlayStation
- Xbox
- cultura pop
- personagens fictícios
- universos fictícios
- atores relacionados a filmes e séries
- tecnologia relacionada a videogames

Considere também o histórico da conversa.

Exemplo:

Histórico:
Usuário: Quem é Naruto?
Assistente: Naruto é...

Pergunta:
Quem é o pai dele?

Resultado:
GEEK


Outro exemplo:

Pergunta:
Quanto é 50 + 30?

Resultado:
NAO_GEEK


Outro exemplo:

Pergunta:
Qual a capital do Brasil?

Resultado:
NAO_GEEK


Outro exemplo:

Pergunta:
Quem venceria Goku ou Superman?

Resultado:
GEEK


Você deve responder SOMENTE:

GEEK

ou

NAO_GEEK

Não explique sua resposta.
`;


  for (const modelo of modelos) {

    try {

      const response =
        await client.responses.create({

          model: modelo,

          input: [
            {
              role: "developer",
              content:
                classificacaoInstructions,
            },
            {
              role: "user",
              content: `
Histórico da conversa:

${historicoRecente || "Nenhum histórico."}

Pergunta atual:

${userInput}
`,
            },
          ],
        });


      const resultado =
        response.output_text
          .trim()
          .toUpperCase();


      return resultado === "GEEK";


    } catch (erro) {

      console.log(
        `Erro ao classificar usando ${modelo}`
      );
    }
  }


  return false;
}

function detectarSaudacao(texto) {
  const textoNormalizado = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const saudacoes = [
    {
      regex: /^(oi|ola|opa|e ai|eai|salve|fala|hey|hello)\b/i,
      resposta: "Olá! 😊",
    },
    {
      regex: /^bom dia\b/i,
      resposta: "Bom dia! 😊",
    },
    {
      regex: /^boa tarde\b/i,
      resposta: "Boa tarde! 😊",
    },
    {
      regex: /^boa noite\b/i,
      resposta: "Boa noite! 😊",
    },
  ];

  for (const saudacao of saudacoes) {
    if (saudacao.regex.test(textoNormalizado)) {
      return {
        temSaudacao: true,
        resposta: saudacao.resposta,
      };
    }
  }

  return {
    temSaudacao: false,
    resposta: "",
  };
}


function removerSaudacao(texto) {
  let resultado = texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  const saudacoes = [
    /^(oi|ola|opa|e ai|eai|salve|fala|hey|hello)\b[,.!?;:\s-]*/i,
    /^bom dia\b[,.!?;:\s-]*/i,
    /^boa tarde\b[,.!?;:\s-]*/i,
    /^boa noite\b[,.!?;:\s-]*/i,
  ];

  for (const regex of saudacoes) {
    if (regex.test(resultado)) {
      resultado = resultado.replace(regex, "");
      break;
    }
  }

  return resultado.trim();
}

// ==========================================
// IA PRINCIPAL
// ==========================================

async function perguntarIA(
  userId,
  userInput
) {

  const saudacao = detectarSaudacao(userInput);

  let perguntaParaIA = userInput;

  // Se começou com uma saudação, remove ela para analisar
  // somente o restante da mensagem.
  if (saudacao.temSaudacao) {
    perguntaParaIA = removerSaudacao(userInput);
  }


  // ==========================================
  // USUÁRIO MANDOU SOMENTE UMA SAUDAÇÃO
  // ==========================================

  if (
    saudacao.temSaudacao &&
    !perguntaParaIA.trim()
  ) {

    console.log(
      `\nGeekBot:\n${saudacao.resposta}\n`
    );

    return saudacao.resposta;
  }


  // ==========================================
  // VERIFICA SE A PERGUNTA É GEEK
  // ==========================================

  const geek = await perguntaEhGeek(
    userId,
    perguntaParaIA
  );


  // ==========================================
  // NÃO É GEEK
  // ==========================================

  if (!geek) {

    let mensagem =
      "Desculpe, só posso responder perguntas relacionadas ao mundo geek.";


    // Se também teve saudação
    if (saudacao.temSaudacao) {

      mensagem =
        `${saudacao.resposta} ${mensagem}`;
    }


    console.log(
      `\nGeekBot:\n${mensagem}\n`
    );


    return mensagem;
  }


  // ==========================================
  // É GEEK
  // ==========================================

  const historico =
    obterHistorico(userId);


  for (const modelo of modelos) {

    try {

      console.log(
        `\nTentando modelo: ${modelo}`
      );


      const input = [
        {
          role: "developer",
          content: instructions,
        },

        ...historico,

        {
          role: "user",
          content: perguntaParaIA,
        },
      ];


      const stream =
        await client.responses.create({

          model: modelo,

          stream: true,

          input,
        });


      console.log(
        `Modelo usado: ${modelo}`
      );


      console.log("\nGeekBot:\n");


      let respostaCompleta = "";


      // Se o usuário começou com saudação,
      // responde primeiro a saudação.
      if (saudacao.temSaudacao) {

        process.stdout.write(
          saudacao.resposta + "\n\n"
        );

        respostaCompleta +=
          saudacao.resposta + "\n\n";
      }


      for await (const event of stream) {

        if (
          event.type ===
          "response.output_text.delta"
        ) {

          const texto = event.delta;

          respostaCompleta += texto;

          process.stdout.write(texto);
        }
      }


      console.log("\n");


      adicionarNaMemoria(
        userId,
        "user",
        userInput
      );


      adicionarNaMemoria(
        userId,
        "assistant",
        respostaCompleta
      );


      return respostaCompleta;


    } catch (erro) {

      console.log(
        `\nErro no modelo ${modelo}`
      );


      console.log(
        erro?.error?.message ||
        erro?.message ||
        "Erro desconhecido"
      );


      console.log(
        "Tentando próximo modelo..."
      );
    }
  }


  const mensagem =
    "Os modelos de IA estão indisponíveis no momento. Tente novamente depois.";


  console.log(
    `\nGeekBot: ${mensagem}`
  );


  return mensagem;
}


// ==========================================
// TERMINAL PARA TESTE
// ==========================================

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});


// Por enquanto simulamos um usuário.
// No Discord isso será message.author.id
const USUARIO_TESTE = "usuario_terminal";


function perguntarNoTerminal() {

  rl.question(
    "Você: ",
    async (pergunta) => {

      const texto =
        pergunta.trim();


      if (
        texto.toLowerCase() === "sair"
      ) {

        console.log(
          "\nGeekBot: Até mais!"
        );

        rl.close();

        return;
      }


      if (
        texto.toLowerCase() ===
        "limpar memoria"
      ) {

        limparMemoria(
          USUARIO_TESTE
        );

        console.log(
          "\nGeekBot: Sua memória foi apagada.\n"
        );

        perguntarNoTerminal();

        return;
      }


      if (!texto) {

        perguntarNoTerminal();

        return;
      }


      await perguntarIA(
        USUARIO_TESTE,
        texto
      );


      perguntarNoTerminal();
    }
  );
}


console.log("GeekBot iniciado!");

console.log(
  'Digite "sair" para encerrar.'
);

console.log(
  'Digite "limpar memoria" para apagar sua memória.\n'
);


// perguntarNoTerminal();

discord.login(process.env.DISCORD_TOKEN);