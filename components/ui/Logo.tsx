import Image from 'next/image'

export default function Logo({ size = 36, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <span className="logo">
      <Image src="/assets/logo-symbol.png" alt="" width={size} height={size} priority />
      {withText && <span>MindMatch</span>}
    </span>
  )
}