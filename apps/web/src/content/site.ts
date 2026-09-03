/**
 * Everything on the site that is not fed by an external source.
 *
 * Kept as data rather than embedded in components so a non-developer can edit
 * a bio or add a link without reading JSX, and so the same values can feed
 * both the page and the metadata.
 */

export const SITE = {
  /* The mark is always uppercase. Written this way once, here, so no screen
     has to remember to transform it. */
  name: 'BUNKER X',
  tagline: 'Sua dose semanal de verdade',
  description:
    'OVNIs, aparições ectoplásmicas e criaturas sobrenaturais, investigados por dois agentes que levam o assunto a sério o suficiente para rir dele.',
  schedule: 'Toda segunda, 20h',
  email: 'bunkerx.contato@gmail.com',
  url: 'https://www.bunkerx.com.br',
}

export const NAV = [
  { label: 'Episódios', href: '#episodios' },
  { label: 'Vídeos', href: '#videos' },
  { label: 'Cortes', href: '#cortes' },
  { label: 'Quem investiga', href: '#agentes' },
  { label: 'Boletim', href: '#boletim' },
  { label: 'Loja', href: '#loja' },
]

export const MEMBERSHIP = {
  youtube: 'https://www.youtube.com/channel/UCp45QZZjzscyReCPrzcP3gQ/join',
  // The hosts call this one "nossa preferência" in every episode description.
  orelo: 'https://orelo.cc/bunkerx',
}

export const HOSTS = [
  {
    name: 'Affonso Solano',
    role: 'Agente de campo',
    portrait: '/hosts/affonso-solano.png',
    bio: 'Escritor e roteirista, veterano do Matando Robôs Gigantes. É quem puxa o fio da história até ela virar mitologia — e quem insiste que a parte mais absurda do relato costuma ser a parte documentada.',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/affonsosolano' },
      { label: 'TikTok', href: 'https://tiktok.com/@affonsosolano' },
    ],
  },
  {
    name: 'Afonso 3D',
    role: 'Agente de campo',
    portrait: '/hosts/afonso-3d.png',
    bio: 'Ilustrador e host do Nerdcast. Chega com a papelada: relatório desclassificado, data, número de protocolo. Se existe um documento por trás da lenda, ele leu antes de gravar.',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/afonso3d' },
      { label: 'TikTok', href: 'https://tiktok.com/@afonso3d' },
    ],
  },
]

/**
 * Podcast aggregators. The feed is the source of truth and every one of these
 * consumes it, so the list is stable and does not need to come from an API.
 *
 * Every URL here was taken from the show's own pages and verified. Deezer and
 * Google Podcasts are absent on purpose: no Bunker X Deezer page was found,
 * and Google Podcasts was shut down in 2024.
 */
export const PLATFORMS = [
  { label: 'Spotify', href: 'https://open.spotify.com/show/1YOCI7QdvUloo4VopSr7qm' },
  { label: 'YouTube', href: 'https://www.youtube.com/@bunkerx' },
  { label: 'Apple Podcasts', href: 'https://podcasts.apple.com/us/podcast/bunker-x/id1683012389' },
  {
    label: 'Amazon Music',
    href: 'https://music.amazon.com.br/podcasts/67ee32af-357f-47cd-a3cd-2b1a214be669/bunker-x',
  },
  { label: 'Orelo', href: 'https://orelo.cc/bunkerx' },
  { label: 'RSS', href: 'https://anchor.fm/s/d02d9508/podcast/rss' },
]

export const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/bunkerxpodcast' },
  { label: 'TikTok', href: 'https://tiktok.com/@bunkerxpodcast' },
  { label: 'X', href: 'https://twitter.com/bunkerxpodcast' },
  { label: 'YouTube', href: 'https://www.youtube.com/@bunkerx' },
  { label: 'Cortes', href: 'https://www.youtube.com/@CortesBunkerX' },
]

/**
 * Placeholder bulletin entries.
 *
 * There is no newsroom behind this yet — nothing in the feeds carries editorial
 * posts. These exist so the section has a real shape to be judged, and they
 * must be replaced before launch.
 */
export const BULLETIN = [
  {
    id: 'protocolo-174',
    stamp: 'Desclassificado',
    title: 'O arquivo que a Base 211 não devolveu',
    date: '2026-08-28',
    redacted: 'operação ██████████ / anexo ███',
    excerpt:
      'Três documentos citados no episódio 174 sumiram do acervo público entre 2019 e 2021. Um deles reapareceu com quatro páginas a menos.',
  },
  {
    id: 'protocolo-173',
    stamp: 'Em apuração',
    title: 'Quem assinou o memorando de Roswell',
    date: '2026-08-21',
    redacted: 'testemunha ███████, ██ anos',
    excerpt:
      'A assinatura confere. A data não. Fomos atrás do carimbo e encontramos duas versões do mesmo papel circulando.',
  },
  {
    id: 'protocolo-172',
    stamp: 'Arquivo',
    title: 'O que sobrou do sinal de 1977',
    date: '2026-08-14',
    redacted: 'frequência ████,█ MHz',
    excerpt:
      'Setenta e dois segundos de gravação, uma anotação à mão na margem e meio século de gente tentando repetir a captação.',
  },
]
