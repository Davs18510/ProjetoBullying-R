import type { TopicId } from '../state/useStory'

export interface TopicContent {
  id: TopicId
  number: string
  title: string
  presenter: string
  hasGraphs: boolean
  paragraphs: string[]
  cvvNote?: boolean
}

export const TOPICS: TopicContent[] = [
  {
    id: 'intro',
    number: '01',
    title: 'Introdução',
    presenter: 'Braga',
    hasGraphs: false,
    paragraphs: [
      'O bullying é sem sombra de dúvidas um dos maiores problemas que enfrentamos no ambiente acadêmico, onde muitas vezes a maior dificuldade que encontramos é em como intervir e preveni-la. Portanto, o nosso grupo iniciou uma pesquisa estatística sobre essa pauta, onde precisamos entender alguns fatores como: o perfil da vítima e onde o bullying se concentra; o perfil do agressor e quais são os atos violentos mais praticados; a quem a vítima recorre e quais são os métodos mais eficientes tomados pelas escolas; o impacto fisiológico causado pelo bullying.',
      'Esta pesquisa foi fundamentada nos dados do PeNSE 2024 (Pesquisa Nacional de Saúde do Escolar), com análises estatísticas desenvolvidas em linguagem R. Ao longo dos próximos tópicos, apresentaremos os resultados e as evidências que embasam nossas propostas de solução.',
    ],
  },
  {
    id: 'mapeamento',
    number: '02',
    title: 'Mapeamento do bullying nas escolas',
    presenter: 'Cho',
    hasGraphs: true,
    paragraphs: [
      'Primeiramente, devemos identificar o perfil majoritário das vítimas do bullying e onde geralmente é mais comum encontramos a ocorrência delas. Isso é essencial para que as soluções de apoio às vítimas sejam aplicadas com maior urgência sobre cenários com maior probabilidade em que o bullying ocorra, sem contar que antes de elaborarmos a solução deve-se entender o panorama por trás do bullying.',
      'Percebemos no primeiro gráfico que a faixa de idade em que grande parte das vítimas se encaixam está entre 13 e 15 anos, onde no segundo gráficos compreendemos que a distribuição do bullying entre homens e mulheres é semelhante, porém, o bullying presencial é mais notável no perfil feminino. Com essas duas informações podemos já ter uma melhor visão sobre qual perfil representa a maior parte das vítimas do bullying.',
      'Agora, olhando para a localidade do bullying, é perceptível que o bullying se distribui de uma maneira homogênea, tendo algumas diferenças quanto a prática do bullying em ambiente virtual e presencial. Com isso, podemos perceber que o bullying não se concentra somente em escolas públicas ou fora da capital como muitos pensam, porém, é um crime que se alastra por todos os tipos de escolas no país.',
      'Portanto, podemos entender melhor quem geralmente é a vítima do bullying e entender que todas as escolas precisam tomar uma ação, visto que não há em si uma concentração do bullying em algum tipo específico de localidade ou escola.',
    ],
  },
  {
    id: 'pratica',
    number: '03',
    title: 'A prática do bullying',
    presenter: 'Leo',
    hasGraphs: true,
    paragraphs: [
      'Além disso, precisamos realizar algo que poucas escolas fazem: analisar o lado de quem pratica o bullying. Para isso, devemos entender quais são as ações violentas tomadas pelos agressores e quem são eles.',
      'Primeiramente, ao analisarmos o gráfico que diz sobre o perfil do agressor, podemos notar uma semelhança com o perfil da vítima, com uma leve diferença na concentração de agressores relatados nas escolas públicas. Isso, por sua vez, é essencial para entendermos a quem deve-se focar em prover mentoria, para que o agressor possa ser compreendido antes que o crime ocorra de fato.',
      'Em adição, quando analisamos o gráfico dos tipos de agressão praticados podemos identificar o comportamento do agressor, onde vemos que grande parte do bullying se expressa por meio de agressões físicas e verbais, além do cyberbullying. Essas ações podem expressar muitas vezes o que o agressor pode estar sofrendo em casa ou em seu contexto de amizade, onde essas informações em específico são essenciais para entender como deve-se realizar a mentoria desses indivíduos.',
      'Com isso, entendemos que o bullying não é solucionado somente pelo apoio da vítima, mas entender o lado do agressor e impedir que o ato seja concebido por meio de um diálogo e tutoria com o autor do crime.',
    ],
  },
  {
    id: 'denuncias',
    number: '04',
    title: 'Padrões das denúncias e métodos de intervenção',
    presenter: 'Gomes',
    hasGraphs: true,
    paragraphs: [
      'Chegamos na parte prática, onde após entendermos melhor o cenário e panorama geral do bullying pela parte da vítima e do agressor podemos encaminhar para como prover o apoio necessário para a vítima e de métodos de prevenção ao bullying nas escolas. Para isso, devemos entender a relação entre os canais de denúncia e os métodos de prevenção.',
      'Quando observamos o gráfico que esboça os principais canais pelo qual a vítima recorre no ato do bullying, percebemos que grande parte deste canal é composto por familiares ou pessoas próximas a vítima, com uma pequena quantidade delas recorrendo aos professores. Com isso, percebemos que a vítima recorre a indivíduos que passam segurança e confiança a ela, o que pode esclarecer sobre como as escolas e profissionais devem se portar mediante a intervenção do bullying.',
      'Porém, há ainda uma parte das vítimas que recorrem a escola, onde caímos justamente nos métodos de intervenção adotados pelas instituições pedagógicas. Com isso, ao analisarmos o gráfico dos métodos de intervenção aplicados pelas escolas notamos que grande parte das que são as mais eficientes sempre se trata de apoio pessoal a vítima, o que evidencia que o método mais efetiva de fato é o apoio direto.',
      'Com isso, podemos entender melhor sobre como devemos tomar as ações preventivas, promovendo um ambiente seguro e indivíduos que possam ouvir diretamente aos alunos que sofrem com o bullying, replicando no ambiente escolar o que muitas vezes a vítima pode carecer na família ou no ciclo social.',
    ],
  },
  {
    id: 'saude',
    number: '05',
    title: 'Relação do bullying com doenças mentais',
    presenter: 'Araujo',
    hasGraphs: true,
    cvvNote: true,
    paragraphs: [
      'Por fim, devemos compreender os impactos e consequências do bullying, para que possamos ter uma base sólida e objetiva de como este crime não impacta somente no contexto social da vítima, porém, pode causar danos duradouros na sua psique.',
      'O gráfico nos mostra claramente sobre como a ocorrência do bullying aumenta os casos de sintomas de certos tipos de doenças mentais. Nisso, podemos entender que o bullying de fato é um problema que pode aumentar cada vez mais casos de depressão ou ansiedade, o que podem acarretar consequências mais sérias como a automutilação ou até o suicídio.',
      'Assim, somos norteados com o fato de que o bullying pode gerar danos irreversíveis a vítima, demandando que este problema seja resolvido com extrema prioridade  e urgência.',
    ],
  },
  {
    id: 'solucoes',
    number: '06',
    title: 'Soluções',
    presenter: 'Braga',
    hasGraphs: false,
    paragraphs: [
      'Com tudo o que foi apontado e encontrado por meio de bases sólidas de pesquisas estatísticas e fundamentadas em dados verídicos, devemos organizá-las em soluções práticas para impedir que o bullying perdure nas escolas.',
      'A primeira coisa a ser feita é o norteamento público dos efeitos que o bullying pode causar nas vítimas, evidenciando a gravidade do problema ao qual devemos lutar contra.',
      'Em seguida, deve-se dar o total apoio às vítimas, principalmente àquelas que se enquadram no perfil encontrado, tornando a escola em uma espécie de segunda família, no qual as vítimas possam se sentir seguras a procurar ajuda profissional dos professores, coordenadores etc.',
      'Por fim, para impedir que o bullying se propague ou perdure é necessário que os agressores (novamente, focando naqueles que se enquadram no perfil citado anteriormente) possam ter profissionais dispostos a ouvi-los e a caminhar com eles como mentores.',
      'Assim, apresentamos hoje não somente informações ao qual achamos serem corretos, porém, soluções e propostas que possuem bases estatísticas sólidas sobre dados reais e verídicos.',
    ],
  },
]

export function getTopicById(id: TopicId): TopicContent | undefined {
  return TOPICS.find((t) => t.id === id)
}
