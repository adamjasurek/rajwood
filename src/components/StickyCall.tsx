import { CallButton } from './CallButton'
import { site } from '../content/site'

export function StickyCall() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
      <CallButton variant="bar">Zavolat {site.phone.display}</CallButton>
    </div>
  )
}
