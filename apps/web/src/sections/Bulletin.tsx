import { Band, Stamp, formatDate } from '@bunkerx/design-system'
import { BULLETIN } from '../content/site'

/**
 * The bulletin is set as a case file: a state on the right, a line of the
 * record struck out. The redaction is real markup and the bar is hidden from
 * assistive tech — text that has been struck out should not be readable by any
 * route, including a screen reader.
 */
export function Bulletin() {
  return (
    <Band
      id="boletim"
      title="Boletim"
      lead="O que apuramos entre um episódio e outro."
      sticker="note-closed"
      stickerRotate={5}
    >
      <div className="files">
        {BULLETIN.map((entry) => (
          <article className="file" key={entry.id}>
            <div>
              <h3 className="file__title">{entry.title}</h3>
              <p className="file__excerpt">{entry.excerpt}</p>
              <span className="file__redacted">
                {entry.redacted.split(/(█+)/).map((part, index) =>
                  part.startsWith('█') ? (
                    <mark key={index} aria-hidden="true">
                      {part}
                    </mark>
                  ) : (
                    <span key={index}>{part}</span>
                  ),
                )}
              </span>
            </div>
            <div className="file__state">
              <Stamp tone={entry.stamp === 'Em apuração' ? 'open' : 'closed'}>{entry.stamp}</Stamp>
              <time dateTime={entry.date}>{formatDate(entry.date)}</time>
            </div>
          </article>
        ))}
      </div>
    </Band>
  )
}
