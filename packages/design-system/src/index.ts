import './styles/fonts.css'
import './styles/tokens.css'
import './styles/base.css'

/* House style: how the brand writes dates, durations and money. */
export {
  formatDate,
  formatDateShort,
  formatDuration,
  formatPrice,
  formatStampDate,
  truncate,
} from './lib/format'

/* Layout */
export { Shell, type ShellProps } from './components/layout/Shell/Shell'
export { Seam, type SeamProps } from './components/layout/Seam/Seam'
export { Band, type BandProps, type BandTone } from './components/layout/Band/Band'
export { Grid, type GridProps } from './components/layout/Grid/Grid'

/* Primitives */
export { Heading, type HeadingProps } from './components/primitives/Heading/Heading'
export { Text, type TextProps } from './components/primitives/Text/Text'
export { Link, type LinkProps } from './components/primitives/Link/Link'
export { Icon, type IconProps, type IconName } from './components/primitives/Icon/Icon'
export {
  PlatformIcon,
  type PlatformIconProps,
  type PlatformName,
} from './components/primitives/PlatformIcon/PlatformIcon'
export { Stack, type StackProps } from './components/primitives/Stack/Stack'
export { Divider, type DividerProps } from './components/primitives/Divider/Divider'

/* Controls */
export { Button, type ButtonProps } from './components/controls/Button/Button'
export { Field, type FieldProps } from './components/controls/Field/Field'
export { Textarea, type TextareaProps } from './components/controls/Textarea/Textarea'
export { Select, type SelectProps, type SelectOption } from './components/controls/Select/Select'
export { Checkbox, type CheckboxProps } from './components/controls/Checkbox/Checkbox'

/* Surfaces */
export { Panel, type PanelProps } from './components/surfaces/Panel/Panel'
export { Plate, type PlateProps } from './components/surfaces/Plate/Plate'
export { Frame, type FrameProps } from './components/surfaces/Frame/Frame'
export { Chip, type ChipProps } from './components/surfaces/Chip/Chip'
export { Tile, type TileProps } from './components/surfaces/Tile/Tile'
export { Stamp, type StampProps } from './components/surfaces/Stamp/Stamp'
export { Avatar, type AvatarProps } from './components/surfaces/Avatar/Avatar'
export { MediaCard, type MediaCardProps } from './components/surfaces/MediaCard/MediaCard'
export {
  Log,
  LogEntry,
  type LogProps,
  type LogEntryProps,
} from './components/surfaces/LogEntry/LogEntry'
export {
  Sticker,
  type StickerProps,
  type StickerName,
  type StickerMotion,
  type StickerHalo,
} from './components/surfaces/Sticker/Sticker'
export { Scene, type SceneProps, type SceneName, type SceneBeam } from './components/surfaces/Scene/Scene'
export { ABDUCTIONS } from './components/surfaces/Scene/scenes'
export {
  EpisodeCard,
  type EpisodeCardProps,
  type EpisodePlatform,
} from './components/surfaces/EpisodeCard/EpisodeCard'

/* Signal */
export { CrtScreen, type CrtScreenProps } from './components/signal/CrtScreen/CrtScreen'
export { Background, type BackgroundProps } from './components/signal/Background/Background'
export { Static, type StaticProps } from './components/signal/Static/Static'
export { NoSignal, type NoSignalProps } from './components/signal/NoSignal/NoSignal'
export { Glitch, type GlitchProps } from './components/signal/Glitch/Glitch'
export { Lamp, type LampProps } from './components/signal/Lamp/Lamp'
