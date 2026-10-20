import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { indexText, retrieve, chat } from './core.js';

const app = express();
app.use(cors({ origin:process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit:'1mb' }));
app.get('/health', (_req,res) => res.json({ status:'ok' }));
app.post('/api/ingest', async (req,res,next) => {
  try {
    const { name, text } = req.body || {};
    if (typeof name !== 'string' || name.length > 180 || typeof text !== 'string' || !text.trim() || text.length > 100000) return res.status(400).json({ error:'name and text (max 100000 chars) required' });
    res.status(201).json(await indexText(name,text));
  } catch(error) { next(error); }
});
app.post('/api/query', async (req,res,next) => {
  try {
    const { question } = req.body || {};
    if (typeof question !== 'string' || !question.trim() || question.length > 2000) return res.status(400).json({ error:'question required (max 2000 chars)' });
    const sources = await retrieve(question);
    const answer = sources.length ? await chat(question,sources) : 'No documents indexed yet / Todavía no hay documentos.';
    res.json({ answer, sources });
  } catch(error) { next(error); }
});
app.use((error,_req,res,_next) => { console.error(error); res.status(502).json({ error:'upstream service failed', detail:process.env.NODE_ENV === 'production' ? undefined : error.message }); });

const port = Number(process.env.PORT || 3001);
app.listen(port,'0.0.0.0', () => console.log(`RAG API listening on ${port}`));
