import express from 'express';
import { execFile } from 'node:child_process';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 4000;
const TEMPLATE_DIR = process.env.TEMPLATE_DIR || '/var/www/portfolio/src/resume';

app.get('/health', (_req, res) => res.json({ ok: true }));

app.post('/api/build-resume', async (req, res) => {
  const typ = req.body?.typ;
  if (typeof typ !== 'string' || typ.length === 0 || typ.length > 200_000) {
    return res.status(400).json({ error: 'invalid typ payload' });
  }

  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const typPath = join(TEMPLATE_DIR, `.build-${id}.typ`);
  const pdfPath = join(TEMPLATE_DIR, `.build-${id}.pdf`);

  try {
    await writeFile(typPath, typ);

    await new Promise((resolve, reject) => {
      execFile(
        'typst',
        ['compile', '--root', TEMPLATE_DIR, typPath, pdfPath],
        { timeout: 30_000, maxBuffer: 4 * 1024 * 1024 },
        (err, stdout, stderr) => {
          if (err) {
            reject(new Error(stderr?.toString() || stdout?.toString() || err.message));
          } else {
            resolve();
          }
        },
      );
    });

    res.setHeader('content-type', 'application/pdf');
    res.setHeader('content-disposition', 'inline; filename="resume.pdf"');
    const { readFile } = await import('node:fs/promises');
    const pdf = await readFile(pdfPath);
    res.send(pdf);
  } catch (e) {
    res.status(500).type('text/plain').send(`Typst compile failed:\n${e.message}`);
  } finally {
    Promise.all([
      rm(typPath, { force: true }),
      rm(pdfPath, { force: true }),
    ]).catch(() => {});
  }
});

app.listen(PORT, () => {
  console.log(`resume-builder listening on :${PORT}`);
});