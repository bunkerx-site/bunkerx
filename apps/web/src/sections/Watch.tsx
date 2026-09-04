import { Block } from './Block'
import type { StickerHalo, StickerMotion, StickerName } from '@bunkerx/design-system'
import { formatDate, truncate } from '../lib/format'
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
    <Block
      id={id}
      title={title}
      lead={lead}
      tone={tone}
      sticker={sticker}
      stickerSide={stickerSide}
      stickerMotion={stickerMotion}
      stickerHalo={stickerHalo}
      more={
        <a
          className="action action--ghost"
          href={channelUrl}
          target="_blank"
          rel="noreferrer noopener"
        >
          {channelLabel}
        </a>
      }
    >
      <div className={`reel${tight ? ' reel--tight' : ''}`}>
        {videos.slice(0, count).map((video) => (
          <a
            className="clip"
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noreferrer noopener"
          >
            <div className="clip__frame">
              <img src={video.thumbnail} alt="" loading="lazy" />
              <span className="clip__scan" aria-hidden="true" />
            </div>
            <h3 className="clip__title">{video.title}</h3>
            {!tight && video.summary ? (
              <p className="clip__summary">{truncate(video.summary, 160)}</p>
            ) : null}
            <time className="clip__date" dateTime={video.publishedAt}>
              {formatDate(video.publishedAt)}
            </time>
          </a>
        ))}
      </div>
    </Block>
  )
}
