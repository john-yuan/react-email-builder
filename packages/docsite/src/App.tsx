import { Navigate, Route, Routes } from 'react-router-dom'
import type { SsgContext } from '@firedocs/core'
import Docs from './docs'

export default function App({ ssgContext }: { ssgContext?: SsgContext }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/docs/get-started" />} />
      <Route path="/docs/*" element={<Docs ssgContext={ssgContext} />} />
    </Routes>
  )
}
