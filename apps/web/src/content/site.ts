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

/**
 * The page's own anchors.
 *
 * Named rather than written as `"#episodios"` wherever one is needed: they are
 * referenced from the nav, from the fold, from the archive and from the
 * header's own "don't hide the bar for this one" rule, and a renamed section
 * that only got updated in three of those four places fails silently.
 */
export const SECTION = {
  top: 'topo',
  episodes: 'episodios',
  cuts: 'cortes',
  hosts: 'agentes',
  listen: 'ouvir',
  store: 'loja',
  membership: 'membro',
} as const

/**
 * A section id as a link target.
 *
 * The ids are stored bare because that is what an `id` attribute takes, and
 * one helper knows the fragment syntax rather than every caller slicing a
 * leading character off.
 */
export const hash = (section: string) => `#${section}`

/**
 * Where the show lives, off the site.
 *
 * All of it here, including the two catalogue links the archive uses: those
 * were written out again inside the section, which meant the Spotify show URL
 * and the YouTube channel URL each existed twice with nothing keeping them in
 * step.
 */
export const CHANNELS = {
  youtube: 'https://www.youtube.com/@bunkerx',
  cuts: 'https://www.youtube.com/@CortesBunkerX',
  spotifyShow: 'https://open.spotify.com/show/1YOCI7QdvUloo4VopSr7qm',
  store: 'https://montink.com/bunker-x/',
} as const

export const NAV = [
  /* The way back up. The wordmark links here too, but a person scanning a nav
     bar for "how do I get out of this section" reads the list, not the logo. */
  { label: 'Início', href: hash(SECTION.top) },
  { label: 'Episódios', href: hash(SECTION.episodes) },
  { label: 'Cortes', href: hash(SECTION.cuts) },
  { label: 'Quem investiga', href: hash(SECTION.hosts) },
  /* In the order the page puts them, not in the order they were thought of.
     The shop comes before the listen row on screen, and a nav that disagrees
     with the scroll makes a reader who followed one link doubt the next. */
  { label: 'Loja', href: hash(SECTION.store) },
  { label: 'Onde ouvir', href: hash(SECTION.listen) },
] as const

export const MEMBERSHIP = {
  youtube: 'https://www.youtube.com/channel/UCp45QZZjzscyReCPrzcP3gQ/join',
  // The hosts call this one "nossa preferência" in every episode description.
  orelo: 'https://orelo.cc/bunkerx',
}

/**
 * The two agents.
 *
 * `icon` names a mark in the design system's `PlatformIcon`, the same way
 * `PLATFORMS` and `SOCIALS` do — the hosts section draws the mark next to the
 * label, so a reader recognises where a link goes before reading it.
 *
 * Frozen with `as const` so those icon names arrive as literals rather than as
 * `string`, which is what lets the section pass them straight to the component
 * without a cast.
 */
export const HOSTS = [
  {
    name: 'Affonso Solano',
    portrait: '/hosts/affonso-solano.png',
    bio: 'Escritor e roteirista, veterano do Matando Robôs Gigantes. É quem puxa o fio da história até ela virar mitologia — e quem insiste que a parte mais absurda do relato costuma ser a parte documentada.',
    links: [
      { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/affonsosolano' },
      { label: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@affonsosolano' },
    ],
  },
  {
    name: 'Afonso 3D',
    portrait: '/hosts/afonso-3d.png',
    bio: 'Ilustrador e host do Nerdcast. Chega com a papelada: relatório desclassificado, data, número de protocolo. Se existe um documento por trás da lenda, ele leu antes de gravar.',
    links: [
      { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/afonso3d' },
      { label: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@afonso3d' },
    ],
  },
] as const

/**
 * Podcast aggregators. The feed is the source of truth and every one of these
 * consumes it, so the list is stable and does not need to come from an API.
 *
 * Every URL here was taken from the show's own pages and verified. Deezer and
 * Google Podcasts are absent on purpose: no Bunker X Deezer page was found,
 * and Google Podcasts was shut down in 2024.
 */
/**
 * Where the feed is distributed.
 *
 * `icon` names a mark in the design system's `PlatformIcon`. Amazon Music and
 * Orelo have no official mark available — Amazon withdrew its brand from the
 * icon set and Orelo is too small to be in it — so both fall through to the
 * system's waveform, and their labels do the identifying. See PlatformIcon.tsx.
 *
 * Ordered by where people actually arrive from, not alphabetically.
 *
 * Orelo is not here on purpose: it is where the hosts ask people to *support*
 * the show, not a fourth way to press play, and the membership panel — which
 * the masthead's "Apoiar" and the fold's both point at — already carries it.
 * RSS is out for the same kind of reason — a podcast app finds the feed from the
 * `<link rel="alternate">` in the document head without being told, and the
 * people who hand-paste feed URLs are not the ones this row is for.
 */
export const PLATFORMS = [
  {
    label: 'Spotify',
    icon: 'spotify',
    href: CHANNELS.spotifyShow,
  },
  { label: 'YouTube', icon: 'youtube', href: CHANNELS.youtube },
  {
    label: 'Apple Podcasts',
    icon: 'apple-podcasts',
    href: 'https://podcasts.apple.com/us/podcast/bunker-x/id1683012389',
  },
  {
    label: 'Amazon Music',
    icon: 'amazon-music',
    href: 'https://music.amazon.com.br/podcasts/67ee32af-357f-47cd-a3cd-2b1a214be669/bunker-x',
  },
] as const

export const SOCIALS = [
  { label: 'Instagram', icon: 'instagram', href: 'https://instagram.com/bunkerxpodcast' },
  { label: 'TikTok', icon: 'tiktok', href: 'https://tiktok.com/@bunkerxpodcast' },
  { label: 'X', icon: 'x', href: 'https://twitter.com/bunkerxpodcast' },
  { label: 'YouTube', icon: 'youtube', href: CHANNELS.youtube },
  { label: 'Cortes', icon: 'youtube', href: CHANNELS.cuts },
] as const
