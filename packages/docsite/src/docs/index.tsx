import '@firedocs/ui/styles.css'
import '@firedocs/ui/prism/prism.css'
import '@firedocs/ui/prism/prism.js'
import 'react-email-builder/styles.css'

import type { Settings, SsgContext } from '@firedocs/core'
import type { UISettings } from '@firedocs/ui'

import { Firedocs } from '@firedocs/core'
import { Renderer } from '@firedocs/ui'
import { useLocation, useNavigate } from 'react-router-dom'
import Provider from './.generated'

const settings: Settings<UISettings> = {
  debug: true,
  contextPath: '/docs',
  colorScheme: 'light'
}

export default function Docs({ ssgContext }: { ssgContext?: SsgContext }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <Firedocs
      provider={Provider}
      renderer={Renderer}
      url={pathname}
      onUrlChange={navigate}
      ssgContext={ssgContext}
      settings={settings}
    />
  )
}
