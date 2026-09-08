import { lazy, Suspense, useEffect, useState } from 'react';
import IframeExact from './clone/IframeExact.jsx';
const ResumeEditor = lazy(() => import('./resume-editor/ResumeEditor.jsx'));

function App() {
  const [route, setRoute] = useState(
    typeof window !== 'undefined' && window.location.hash.startsWith('#/resume-editor')
      ? 'editor'
      : 'home'
  );
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash;
      if (h.startsWith('#/resume-editor')) setRoute('editor');
      else setRoute('home');
    };
    window.addEventListener('hashchange', onHash);
    onHash();
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  if (route === 'editor') {
    return (
      <Suspense fallback={<div style={{ padding: 40, color: '#888' }}>Loading editor…</div>}>
        <ResumeEditor />
      </Suspense>
    );
  }
  return <IframeExact />;
}
export default App;
