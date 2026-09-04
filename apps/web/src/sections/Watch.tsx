import { Band, Grid, MediaCard, type StickerHalo, type StickerMotion, type StickerName, Button, formatDate, truncate } from '@bunkerx/design-system'
import type { Video } from '../lib/types'

type WatchProps = {
  id: string
  title: string
  lead: string
  videos: Video[]
  channelUrl: string
  channelLabel: string
  /** Clips are short, so more fit per row without becoming unreadable. */
  tight?: boolean
  count?: number
  tone?: 'plain' | 'nebula' | 'deep'
  sticker?: StickerName
  stickerSide?: 'left' | 'right'
  stickerMotion?: StickerMotion
  stickerHalo?: StickerHalo
}

/**
 * A video block. Two per row on the main channel, more for the cuts.
 *
 * The two YouTube channels get separate blocks rather than tabs behind one
 * heading: they are different things — the full programme and the clips — and
 * a tab hides half of what the site has to offer behind a click.
 */
export function Watch({
  id,
  title,
  lead,
  videos,
  channelUrl,
  channelLabel,
  tight = false,
  count = 4,
  tone = 'plain',
  sticker,
  stickerSide,
  stickerMotion,
  stickerHalo,
}: WatchProps) {
  return (
    <Band
      id={id}
      title={title}
      lead={lead}
      tone={tone}
      sticker={sticker}
      stickerSide={stickerSide}
      stickerMotion={stickerMotion}
      stickerHalo={stickerHalo}
      more={
        <Button variant="outline" href={channelUrl} external>
          {channelLabel}
        </Button>
      }
    >
      <Grid min={tight ? '17rem' : '25rem'} gap={tight ? 'tight' : 'loose'}>
        {videos.slice(0, count).map((video) => (
          <MediaCard
            key={video.id}
            href={video.url}
            title={video.title}
            summary={!tight && video.summary ? truncate(video.summary, 160) : undefined}
            note={<time dateTime={video.publishedAt}>{formatDate(video.publishedAt)}</time>}
            src={video.thumbnail}
            scan
            glow
          />
        ))}
      </Grid>
    </Band>
  )
}
