import { Category, Sermon, Illustration } from '../types';

export const INITIAL_CATEGORIES: Omit<Category, 'id'>[] = [
  {
    name: 'Fé',
    slug: 'fe',
    description: 'Sermões sobre confiança em Deus, promessas bíblicas e a vitória da fé inabalável.',
    icon: 'Shield',
    color: 'amber',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Oração',
    slug: 'oracao',
    description: 'Mensagens sobre comunhão com Deus, intercessão, jejum e o poder da súplica.',
    icon: 'HeartHandshake',
    color: 'blue',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Família',
    slug: 'familia',
    description: 'Edificação do lar cristão, casamento, criação de filhos segundo os preceitos de Deus.',
    icon: 'Home',
    color: 'emerald',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Evangelismo',
    slug: 'evangelismo',
    description: 'O chamado da Grande Comissão, missões, discipulado e amor pelas almas perdidas.',
    icon: 'Megaphone',
    color: 'indigo',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Salvação',
    slug: 'salvacao',
    description: 'A graça redentora da cruz, regeneração, perdão de pecados e vida eterna.',
    icon: 'Cross',
    color: 'red',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Jesus',
    slug: 'jesus',
    description: 'A pessoa, milagres, divindade, sacrifício e ressurreição de Cristo Jesus.',
    icon: 'Crown',
    color: 'yellow',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Espírito Santo',
    slug: 'espirito-santo',
    description: 'O Consolador, batismo, dons espirituais, unção e a caminhada no Espírito.',
    icon: 'Flame',
    color: 'orange',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Escatologia',
    slug: 'escatologia',
    description: 'Profecias bíblicas, o arrebatamento da Igreja, o retorno triunfal de Cristo e o novo céu.',
    icon: 'Clock',
    color: 'purple',
    createdAt: new Date().toISOString(),
  },
  {
    name: 'Vida Cristã',
    slug: 'vida-crista',
    description: 'Santidade diária, obediência, integridade no mundo e perseverança espiritual.',
    icon: 'Sparkles',
    color: 'teal',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_SERMONS: Omit<Sermon, 'id'>[] = [
  {
    title: 'A Fé que Move Montanhas e Rompe o Impossível',
    slug: 'a-fe-que-move-montanhas',
    subtitle: 'Como desenvolver uma confiança inabalável nas promessas do Deus Todo-Poderoso',
    description: 'Um estudo aprofundado em Hebreus 11 sobre a natureza da verdadeira fé viva, que não depende de circunstâncias visíveis, mas descansa na fidelidade do Criador.',
    biblicalReferences: 'Hebreus 11:1-6; Marcos 11:22-24; Mateus 17:20',
    category: 'Fé',
    categorySlug: 'fe',
    author: 'Pr. Hernandes Dias Lopes',
    imageUrl: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=1200&q=80',
    keywords: ['fé', 'confiança', 'milagres', 'oração', 'vitória'],
    status: 'published',
    featured: true,
    readingTimeMinutes: 7,
    publishedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    content: `## INTRODUÇÃO
A fé é a chave mestra que abre os celeiros do Céu. Em Hebreus 11:1, a Escritura nos dá a mais bela definição: *"Ora, a fé é a certeza de coisas que se esperam, a convicção de fatos que se não veem"*. Não se trata de pensamento positivo ou mero otimismo psicológico, mas de uma certeza sólida radicada no próprio caráter imutável de Deus.

> *"Sem fé é impossível agradar a Deus, porquanto é necessário que aquele que se aproxima de Deus creia que ele existe e que se torna galardoador dos que o buscam."* (Hebreus 11:6)

---

## I. A NATUREZA DA FÉ VERDADEIRA
Muitos confundem fé com presunção. A verdadeira fé bíblica apresenta três características indispensáveis:
1. **Conhecimento Bíblico:** A fé vem pelo ouvir a Palavra de Cristo (Romanos 10:17). Não inventamos em que crer; cremos no que Deus revelou.
2. **Assentimento Intelectual:** Concordamos de todo coração que as promessas de Deus são verdadeiras e infalíveis.
3. **Entrega Prática:** Damos o passo no escuro, sabendo que Deus colocará o chão sob os nossos pés.

---

## II. A FÉ EM MEIO ÀS TEMPESTADES
Lembramo-nos dos discípulos no Mar da Galileia quando a tempestade rugia e Jesus dormia na popa (Marcos 4:38). Eles gritaram apavorados: *"Mestre, não te importa que pereçamos?"*.
- Quando Jesus acalmou o vento e o mar, Ele fez uma pergunta que ecoa aos nossos corações: *"Por que sois tímidos? Como não tendes fé?"*.
- O barco com Jesus pode balançar, mas jamais afundará! A presença de Cristo na embarcação da sua vida garante que você chegará ao outro lado.

---

## III. O PODER DE REMOVER MONTANHAS
Jesus afirmou que se tivermos fé como um grão de mostarda, diremos a este monte: *"Passa daqui para acolá, e ele passará"* (Mateus 17:20).
- Qual é a montanha diante de você hoje? A montanha do medo, da enfermidade, da dívida, ou da crise conjugal?
- A força da fé não está no tamanho do homem que crê, mas no tamanho do Deus em quem se crê!

---

## CONCLUSÃO E APELO
Deus está convocando uma igreja que não viva pelo que vê, mas pelo que Ele disse. Lance fora a dúvida e o desespero. Olhe para Jesus, o Autor e Consumador da nossa fé! Entregue o seu fardo agora ao Senhor e declare: *"Eu creio na fidelidade do meu Salvador!"*.`
  },
  {
    title: 'O Poder da Oração que Prevalece nos Céus',
    slug: 'o-poder-da-oracao-que-prevalece',
    subtitle: 'Descobrindo o segredo dos grandes intercessores e a intimidade com o Pai',
    description: 'Como uma vida disciplinada de clamor e intercessão move a mão de Deus e transforma famílias, cidades e gerações inteiras.',
    biblicalReferences: 'Tiago 5:16-18; Lucas 11:1-13; Jeremias 33:3',
    category: 'Oração',
    categorySlug: 'oracao',
    author: 'C.H. Spurgeon',
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    keywords: ['oração', 'clamor', 'intimidade', 'intercessão', 'poder'],
    status: 'published',
    featured: true,
    readingTimeMinutes: 6,
    publishedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    content: `## INTRODUÇÃO
A oração é a respiração da alma renascida. Martinho Lutero dizia: *"Tenho tanto o que fazer hoje que passarei as três primeiras horas em oração"*. Sem oração somos impotentes diante dos ataques do inimigo; com oração, o mais fraco santo de joelhos faz tremer as hostes do inferno.

> *"Confessai, pois, os vossos pecados uns aos outros e orai uns pelos outros, para serdes curados. Muito pode, por sua eficácia, a súplica do justo."* (Tiago 5:16)

---

## I. ORAR SEGUNDO A VONTADE DE DEUS
A oração não é uma tentativa de dobrar a vontade soberana de Deus aos nossos caprichos egoístas, mas o alinhamento do nosso coração ao propósito eterno do Pai.
- Quando oramos *"Venha o Teu Reino, seja feita a Tua vontade"*, estamos declarando que o governo do Céu é melhor do que qualquer projeto humano.
- A oração eficaz é saturada pelas Escrituras Sagradas. Oramos a Palavra de volta para Deus!

---

## II. A PERSEVERANÇA QUE VENCE O SILÊNCIO
Muitos desistem da oração porque esperam respostas instantâneas como no micro-ondas. Jesus ensinou a parábola do amigo inoportuno (Lucas 11:5-8) para demonstrar que devemos:
1. **Pedir** - com humildade e consciência da nossa carência.
2. **Buscar** - com empenho e diligência espiritual.
3. **Bater** - com firmeza até que a porta dos céus se abra em bênçãos!

---

## III. O EXEMPLO DE ELIAS
Elias era homem sujeito às mesmas paixões que nós (Tiago 5:17). Ele não tinha superpoderes biológicos; ele tinha um relacionamento real com o Deus vivo! Ele orou e o fogo desceu; orou e a chuva regou a terra árida.

---

## CONCLUSÃO
O mesmo Deus de Elias é o seu Deus hoje. Não enfrente suas batalhas na força da carne. Dobre os seus joelhos no quarto secreto e assista Deus pelejar por você!`
  },
  {
    title: 'Construindo um Lar sobre a Rocha Eterna',
    slug: 'construindo-um-lar-sobre-a-rocha',
    subtitle: 'Princípios bíblicos para blindar o casamento e abençoar as próximas gerações',
    description: 'Um guia prático e pastoral para casais e famílias enfrentarem as pressões da sociedade moderna fundamentados na Palavra de Cristo.',
    biblicalReferences: 'Mateus 7:24-27; Salmos 127:1-5; Efésios 5:22-33',
    category: 'Família',
    categorySlug: 'familia',
    author: 'Pr. Josué Gonçalves',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=1200&q=80',
    keywords: ['família', 'casamento', 'filhos', 'lar', 'aliança'],
    status: 'published',
    featured: true,
    readingTimeMinutes: 8,
    publishedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    content: `## INTRODUÇÃO
A família não é uma invenção social mutável; é o primeiro projeto divino instituído no Jardim do Éden. O diabo sabe que ao desestruturar a família, ele atinge a sociedade e enfraquece a igreja. Por isso, precisamos urgentemente resgatar os alicerces bíblicos.

> *"Se o Senhor não edificar a casa, em vão trabalham os que a edificam; se o Senhor não guardar a cidade, em vão vigia a sentinela."* (Salmos 127:1)

---

## I. A ROCHA CONTRA AS TEMPESTADES
Em Mateus 7:24-27, Jesus descreveu duas casas que enfrentaram as MESMAS intempéries: a chuva desceu, os rios transbordaram e os ventos sopraram.
- A diferença entre a ruína e a permanência não estava nas tempestades exteriores, mas no **alicerce oculto**.
- Construir sobre a rocha significa ouvir os ensinamentos de Jesus e **praticá-los** no dia a dia do lar.

---

## II. O AMOR QUE SACRIFICA E PERDOA
O apóstolo Paulo orienta maridos a amarem suas esposas *"como Cristo amou a igreja e a si mesmo se entregou por ela"* (Efésios 5:25).
- É um amor sacrificial, protetor e generoso.
- Um casamento cristão duradouro é a união de dois grandes perdoadores. Onde o perdão é abundante, a amargura não encontra solo para criar raízes.

---

## III. O LEGADO PARA OS FILHOS
Os filhos não aprendem o evangelho primariamente pelo que falamos no domingo, mas pelo que demonstramos na segunda-feira na mesa de jantar. Ensine a criança no caminho em que deve andar, sendo você o próprio exemplo do caminho.

---

## CONCLUSÃO
Renove hoje a aliança conjugal diante do altar de Deus. Consagre seus filhos e sua moradia ao Senhor, dizendo como Josué: *"Eu e a minha casa serviremos ao Senhor!"* (Josué 24:15).`
  },
  {
    title: 'A Graça Incomparável que Salva e Justifica',
    slug: 'a-graca-incomparavel-que-salva',
    subtitle: 'Por que a salvação é inteiramente dom gratuito e mérito exclusivo de Cristo',
    description: 'Explorando Efésios 2:8-10 e a doutrina bíblica da justificação pela fé, desmontando qualquer mérito humano diante da santidade divina.',
    biblicalReferences: 'Efésios 2:8-10; Romanos 5:1-8; Tito 3:4-7',
    category: 'Salvação',
    categorySlug: 'salvacao',
    author: 'Paul Washer',
    imageUrl: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1200&q=80',
    keywords: ['graça', 'salvação', 'cruz', 'perdão', 'redenção'],
    status: 'published',
    featured: false,
    readingTimeMinutes: 5,
    publishedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    content: `## INTRODUÇÃO
Se você perguntar às pessoas nas ruas por que Deus deveria deixá-las entrar no céu, a maioria responderá com uma lista de suas próprias boas obras: *"Eu sou uma boa pessoa, não mato, não roubo e ajudo os necessitados"*. Contudo, as Escrituras nos confrontam com a verdade solene: perante a perfeita justiça de Deus, todas as nossas justiças são como trapos da imundícia (Isaías 64:6).

> *"Porque pela graça sois salvos, mediante a fé; e isto não vem de vós; é dom de Deus; não de obras, para que ninguém se glorie."* (Efésios 2:8-9)

---

## I. O QUE É A GRAÇA?
A graça é favor imerecido concedido a quem merecia a justa condenação. 
- A justiça nos daria o inferno;
- A misericórdia não nos dá o castigo merecido;
- A **graça** nos dá o Céu e a filiação divina que jamais poderíamos comprar!

---

## II. A CRUZ: ONDE O AMOR E A JUSTIÇA SE BEIJARAM
Na cruz do Calvário, Jesus não foi apenas uma vítima de homens cruéis; Ele tomou sobre Si a condenação que pertencia a nós (Isaías 53:5). O cálice da ira divina foi esvaziado pelo Cordeiro até a última gota para que nós pudéssemos beber do cálice da salvação.

---

## III. SALVOS PARA BOAS OBRAS
A graça liberta, mas não para vivermos na licenciosidade do pecado. O versículo 10 ensina: *"Pois somos feitura dele, criados em Cristo Jesus para boas obras"*. As boas obras não são a CAUSA da salvação, mas o FRUTO inevitável de um coração regenerado pelo Espírito Santo!

---

## CONCLUSÃO
Não confie no seu dinheiro, na sua religiosidade ou no seu histórico familiar. Corra para a cruz e lance-se nos braços do Salvador Jesus Cristo!`
  },
  {
    title: 'Jesus Cristo: O Caminho, a Verdade e a Vida Eterna',
    slug: 'jesus-cristo-o-caminho-a-verdade-e-a-vida',
    subtitle: 'A exclusividade salvífica do Filho de Deus em um mundo relativista',
    description: 'Uma reflexão contundente sobre a proclamação mais revolucionária da história humana registrada em João 14:6.',
    biblicalReferences: 'João 14:1-6; Atos 4:12; 1 Timóteo 2:5',
    category: 'Jesus',
    categorySlug: 'jesus',
    author: 'Billy Graham',
    imageUrl: 'https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80',
    keywords: ['jesus', 'caminho', 'verdade', 'vida', 'evangelho'],
    status: 'published',
    featured: false,
    readingTimeMinutes: 6,
    publishedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 9).toISOString(),
    content: `## INTRODUÇÃO
Em uma época onde a cultura afirma que todas as religiões são caminhos equivalentes que levam ao mesmo cume da montanha, a declaração de Jesus Cristo soa como um trovão cortando a névoa do relativismo.

> *"Respondeu-lhe Jesus: Eu sou o caminho, e a verdade, e a vida; ninguém vem ao Pai senão por mim."* (João 14:6)

---

## I. ELE É O CAMINHO
Jesus não veio nos dar um mapa de ruas morais; Ele veio ser o próprio Caminho que vence o abismo infinito aberto pelo pecado entre o Deus Santo e a humanidade caída.

---

## II. ELE É A VERDADE
Os filósofos buscam a verdade; os cientistas pesquisam as leis da verdade; mas Jesus disse: *"Eu SOU a Verdade"*. Nele habita corporalmente toda a plenitude da divindade.

---

## III. ELE É A VIDA
Fora de Cristo há apenas sobrevivência e morte espiritual. Nele temos vida abundante aqui e vida eterna na glória vindoura!

---

## CONCLUSÃO
Você já fez de Jesus o Senhor e Salvador definitivo do seu coração? Abra as portas da sua vida hoje mesmo.`
  },
  {
    title: 'Cheios do Espírito Santo: Poder para Testemunhar',
    slug: 'cheios-do-espirito-santo-poder-para-testemunhar',
    subtitle: 'A promessa do Pentecostes para capacitar a Igreja na missão contemporânea',
    description: 'Como a habitação e o batismo com o Espírito Santo transformam crentes tímidos em labaredas de fogo para a glória de Deus.',
    biblicalReferences: 'Atos 1:8; Atos 2:1-4; Efésios 5:18',
    category: 'Espírito Santo',
    categorySlug: 'espirito-santo',
    author: 'Pr. Antônio Gilberto',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&w=1200&q=80',
    keywords: ['espírito santo', 'pentecostes', 'unção', 'poder', 'testemunho'],
    status: 'published',
    featured: false,
    readingTimeMinutes: 7,
    publishedAt: new Date(Date.now() - 86400000 * 11).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 11).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 11).toISOString(),
    content: `## INTRODUÇÃO
A Igreja Primitiva não possuía templos luxuosos, recursos tecnológicos ou influência política, mas possuía algo infinitamente superior: o fogo do Espírito Santo descendo sobre o cenáculo!

> *"Mas recebereis poder, ao descer sobre vós o Espírito Santo, e sereis minhas testemunhas tanto em Jerusalém como em toda a Judeia e Samaria e até aos confins da terra."* (Atos 1:8)

---

## I. O ESPÍRITO SANTO É UMA PESSOA DIVINA
O Consolador não é uma força mística impessoal ou energia cósmica. Ele é Deus, a terceira Pessoa da Trindade Santa. Ele tem mente, sentimentos e vontade; Ele nos guia, nos consola, intercede por nós e glorifica a Jesus Cristo.

---

## II. PODER PARA O TESTEMUNHO
A palavra grega para poder em Atos 1:8 é *dunamis*, da qual deriva "dinamite". Trata-se de força explosiva sobrenatural!
- Pedro, que antes negara a Jesus diante de uma simples serva, agora levanta-se destemido diante de milhares no Pentecostes anunciando a ressurreição.
- O propósito do poder não é ostentação espiritual, mas **testemunho ousado** da salvação em Jesus!

---

## III. O MANDAMENTO DE SER CHEIO
Em Efésios 5:18 lemos: *"E não vos embriagueis com vinho, no qual há dissolução, mas enchei-vos do Espírito"*. No original grego, o verbo está no tempo contínuo: continuem sendo cheios dia após dia!

---

## CONCLUSÃO
Busque uma renovação diária do Espírito. Peça a Deus hoje: *"Senhor, sopra o Teu vento sobre mim e enche a minha vasilha com o Teu azeite santo!"*.`
  },
  {
    title: 'O Retorno Triunfal de Cristo e o Toque da Trombeta',
    slug: 'o-retorno-triunfal-de-cristo-e-a-trombeta',
    subtitle: 'Vigiai e orai: a bendita esperança da Igreja nos últimos dias',
    description: 'Um estudo bíblico escatológico sobre a volta de Jesus, o arrebatamento e como manter as lâmpadas acesas aguardando o Noivo celestial.',
    biblicalReferences: '1 Tessalonicenses 4:13-18; Mateus 24:36-44; Tito 2:13',
    category: 'Escatologia',
    categorySlug: 'escatologia',
    author: 'Pr. Silas Malafaia',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
    keywords: ['volta de jesus', 'arrebatamento', 'escatologia', 'trombeta', 'esperança'],
    status: 'published',
    featured: false,
    readingTimeMinutes: 7,
    publishedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 13).toISOString(),
    content: `## INTRODUÇÃO
A história não caminha para um caos sem sentido nem para uma aniquilação nuclear acidental; a história marcha a passos largos para a consumação dos séculos e a gloriosa manifestação do Rei dos reis!

> *"Porquanto o Senhor mesmo, dada a sua palavra de ordem, ouvida a voz do arcanjo, e ressoada a trombeta de Deus, descerá dos céus, e os mortos em Cristo ressuscitarão primeiro; depois, nós, os vivos, os que ficarmos, seremos arrebatados juntamente com eles, entre nuvens, para o encontro do Senhor nos ares, e, assim, estaremos para sempre com o Senhor."* (1 Tessalonicenses 4:16-17)

---

## I. OS SINAIS DOS TEMPOS
Jesus profetizou em Mateus 24 sobre os sinais que precederiam a Sua volta: guerras, fomes, terremotos, falsos profetas e o esfriamento do amor de muitos. Estamos vendo estes cenários se desdobrarem diante dos nossos olhos nos noticiários globais.

---

## II. A PARÁBOLA DAS DEZ VIRGENS
Cinco eram prudentes e levaram azeite extra nas suas vasilhas; cinco eram néscias e deixaram suas lâmpadas se apagarem. À meia-noite ouviu-se o brado: *"Aí vem o noivo! Saí-lhe ao encontro!"*.
- Você tem azeite suficiente?
- Sua vida espiritual está em dia com Deus?

---

## CONCLUSÃO
A volta de Jesus não deve produzir pavor no crente fiel, mas santa expectativa e consagração! O Espírito e a Noiva dizem: *"Vem, Senhor Jesus!"*.`
  },
  {
    title: 'O Fruto do Espírito: Santidade na Prática Diária',
    slug: 'o-fruto-do-espirito-santidade-na-pratica',
    subtitle: 'Como o amor, a paciência e a mansidão moldam o caráter do discípulo autêntico',
    description: 'Gálatas 5 revela a marca registrada dos verdadeiros seguidores de Cristo: um caráter forjado pelo Espírito Santo que vence a carne e irradia a glória de Deus.',
    biblicalReferences: 'Gálatas 5:22-26; Colossenses 3:12-17; João 15:1-8',
    category: 'Vida Cristã',
    categorySlug: 'vida-crista',
    author: 'Jonathan Edwards',
    imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=1200&q=80',
    keywords: ['fruto do espírito', 'santidade', 'caráter', 'amor', 'mansidão'],
    status: 'published',
    featured: false,
    readingTimeMinutes: 6,
    publishedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 15).toISOString(),
    content: `## INTRODUÇÃO
Muitos crentes buscam ansiosamente pelos dons espirituais, mas negligenciam o **fruto do Espírito**. Os dons revelam a capacitação do Espírito para o serviço, mas o fruto revela a nossa semelhança íntima com o Senhor Jesus Cristo.

> *"Mas o fruto do Espírito é: amor, alegria, paz, longanimidade, benignidade, bondade, fidelidade, mansidão, domínio próprio. Contra estas coisas não há lei."* (Gálatas 5:22-23)

---

## I. O FRUTO É SINGULAR
Note que Paulo não escreveu "os frutos", no plural, mas "o fruto", no singular. É um único cacho divino composto por nove virtudes harmoniosas que brotam da videira verdadeira.

---

## II. VENCENDO AS OBRAS DA CARNE
A vida cristã é um campo de batalha diário entre a natureza adâmica decaída e a nova natureza regenerada. Não podemos vencer o ódio com mais força de vontade humana; vencemos andando e respirando no Espírito Santo.

---

## CONCLUSÃO
Deixe o Divino Agricultor podar os galhos secos da sua vida para que você produza muito mais fruto para a glória do Pai celestial!`
  }
];

export const INITIAL_ILLUSTRATIONS: Omit<Illustration, 'id'>[] = [
  {
    title: 'O Farol Imutável e o Navio de Guerra',
    story: 'Em uma noite densa de neblina no oceano, o capitão de um imponente couraçado militar avistou uma luz brilhante à distância diretamente na rota da embarcação. Imediatamente enviou uma mensagem de rádio: "Aqui é o Comandante Jones. Mude seu curso 10 graus para o norte para evitar colisão imediata!". A resposta veio calma pelo rádio: "Aqui é o operador Smith. Mude você o seu curso 10 graus para o sul". Irritado com a audácia, o capitão retrucou: "Aqui é um navio de guerra de 60 mil toneladas da marinha imperial! Mude o seu curso imediatamente!". Pelo rádio soou a serena resposta: "Aqui é o farol. A decisão é sua".',
    application: 'Muitos homens tentam desafiar as leis eternas de Deus e as Escrituras, exigindo que o Criador se adapte aos seus sentimentos. Mas Deus e a Sua Palavra são como o farol: imóveis e inabaláveis. Quem não muda de curso naufraga contra a Rocha Eterna!',
    biblicalReference: 'Mateus 7:24-25; Isaías 40:8',
    category: 'Vida Cristã',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    author: 'Ilustração Tradicional Gospel',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'O Resgate no Abismo e a Corda Segura',
    story: 'Um alpinista experiente escorregou em um penhasco alpino em meio a uma nevasca violenta. Enquanto caía no vazio absoluto, sua corda de segurança prendeu-se com um puxão brusco em uma rocha. Pendurado no ar no breu da noite gélida, sem ver nada abaixo de si, ele começou a congelar. No desespero, gritou: "Deus, se Tu existes, salva-me!". Uma voz suave e poderosa sussurrou em sua consciência: "Você confia em Mim?". O homem respondeu: "Sim, Senhor, confio!". Deus então disse: "Corte a corda que te segura". O homem vacilou, segurou a corda com mais força e não teve coragem de cortar. Na manhã seguinte, a equipe de resgate encontrou o alpinista congelado, morto a apenas 1 metro do chão seguro coberto de neve macia.',
    application: 'Quantas vezes nos apegamos desesperadamente às nossas cordas humanas de autojustiça, controle e medo, recusando soltá-las quando Jesus nos pede para descansar exclusivamente em Suas mãos! O salto da fé nunca nos lança no vazio, mas no amparo dos braços do Pai.',
    biblicalReference: 'Provérbios 3:5-6; Hebreus 11:1',
    category: 'Fé',
    imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=80',
    author: 'Pr. Mark Finlay',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'A Ponte Levadiça e o Sacrifício do Filho Único',
    story: 'Numa ferrovia montanhosa, um zelador operava uma ponte levadiça manual sobre um desfiladeiro fluvial. Certo dia, ao escutar o apito distante do trem expresso lotado com centenas de passageiros que se aproximava em alta velocidade, correu para acionar a alavanca que baixava a ponte. Ao olhar para baixo, viu com horror seu filho pequeno que havia escorregado na engrenagem principal da ponte. Se deixasse a ponte levantada, o trem despencaria no abismo matando centenas de famílias; se puxasse a alavanca para salvar o trem, o peso da engrenagem esmagaria seu próprio filhinho. Com lágrimas rasgando a face, o pai puxou a alavanca. O trem passou voando em segurança, e os passageiros riam e tomavam café sem terem a menor ideia do preço imensurável que havia acabado de ser pago pela vida deles.',
    application: 'Esta comovente ilustração espelha o amor inconcebível de Deus Pai no Calvário. Deus entregou o Seu Filho amado para salvar uma humanidade desatenta e pecadora. "Deus prova o seu próprio amor para conosco pelo fato de ter Cristo morrido por nós, sendo nós ainda pecadores" (Romanos 5:8).',
    biblicalReference: 'João 3:16; Romanos 5:8',
    category: 'Salvação',
    imageUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1000&q=80',
    author: 'Clássico das Ilustrações Evangélicas',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    title: 'O Quadro Manchado que Virou Obra de Arte',
    story: 'Um pintor em Veneza comprou um tecido de linho finíssimo para pintar uma paisagem sagrada. Enquanto preparava suas tintas, um visitante descuidado derrubou um frasco de tinta preta indelével bem no centro do tecido, criando uma mancha escura e horrível. O jovem aprendiz chorou: "Está arruinado, jogue no lixo!". Mas o Mestre pintor sorriu, pegou seus pincéis e começou a trabalhar ao redor da mancha. Usou o negro profundo para pintar a fenda de uma caverna sombria da qual emergia um guerreiro resplandecente ao nascer do sol. A obra final tornou-se a pintura mais valiosa e aclamada da sua carreira.',
    application: 'O pecado e as dores da vida mancharam a nossa história. O mundo nos diz para desistir e nos jogar fora. Mas Jesus é o Mestre Supremo que pega as piores cicatrizes e manchas do nosso passado e as transforma na mais bela obra de redenção para o Seu louvor.',
    biblicalReference: '2 Coríntios 5:17; Romanos 8:28',
    category: 'Jesus',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1000&q=80',
    author: 'Tradição Pastoral',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];
