import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
const API = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [name,setName] = useState('notes.txt');
  const [document,setDocument] = useState('');
  const [question,setQuestion] = useState('');
  const [result,setResult] = useState(null);
  const [status,setStatus] = useState('');
  async function call(path,body) {
    const res = await fetch(`${API}${path}`, {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});
    const data = await res.json();
    if(!res.ok) throw new Error(data.detail || data.error || 'HTTP error');
    return data;
  }
  async function ingest(e) { e.preventDefault(); setStatus('Indexando...'); try { const r=await call('/api/ingest',{name,text:document});setStatus(`OK: ${r.chunks} chunks`); }catch(e){setStatus(e.message);} }
  async function ask(e) { e.preventDefault(); setStatus('Consultando...'); try {setResult(await call('/api/query',{question}));setStatus('');}catch(e){setStatus(e.message);} }
  return <main><h1>RAG from Zero to Scale</h1><p>Ejemplo educativo · Educational demo</p><section><h2>1. Ingest / Ingesta</h2><form onSubmit={ingest}><input value={name} onChange={e=>setName(e.target.value)} aria-label="File name"/><textarea placeholder="Paste text / Pegá el contenido" value={document} onChange={e=>setDocument(e.target.value)}/><button>Indexar / Index</button></form></section><section><h2>2. Query / Consulta</h2><form onSubmit={ask}><input placeholder="Ask about the document" value={question} onChange={e=>setQuestion(e.target.value)}/><button>Preguntar / Ask</button></form>{result && <><p className="answer">{result.answer}</p><h3>Sources / Fuentes</h3><ol>{result.sources.map((s,i)=><li key={i}>{s.name} · {s.score}: {s.text}</li>)}</ol></>}</section><p role="status">{status}</p></main>;
}
createRoot(document.getElementById('root')).render(<App/>);
