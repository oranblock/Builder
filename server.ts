import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { computeDesignFormula } from './src/data/designFormulaEngine.ts';
import { realFactoryProjects } from './src/data/factoryProjectsData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // ── API Routes ─────────────────────────────────────────────────────────────

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      engine: 'Autonomous Ephemeral Software Factory',
      version: '2.4.0',
      timestamp: new Date().toISOString()
    });
  });

  // Explicit Anti-Duplication & Design Diversity Formula API
  // Example: GET /api/design-formula?project_id=1289281&niche=barber-booking&preset=services
  app.get('/api/design-formula', (req, res) => {
    const projectId = (req.query.project_id as string) || 'sample';
    const nicheSlug = (req.query.niche as string) || (req.query.niche_slug as string) || 'general';
    const preset = (req.query.preset as string) || 'standard';

    const formula = computeDesignFormula(projectId, nicheSlug, preset);
    res.json(formula);
  });

  // Novelty & Anti-Collision Audit API
  // Verifies that an agent's proposed spec does not collide with existing vault templates
  app.post('/api/audit-novelty', (req, res) => {
    const proposed = req.body;
    const projectId = proposed?.project_id || proposed?.projectId;
    if (!proposed || !projectId) {
      return res.status(400).json({ error: 'Missing project_id in proposal' });
    }
    proposed.project_id = projectId;

    // Check against existing projects
    const collisions = realFactoryProjects.filter(
      (p) => p.project_id !== proposed.project_id && (
        p.app_name === proposed.app_name ||
        (p.theme?.primary_color === proposed.theme?.primary_color && p.preset === proposed.preset)
      )
    );

    const isDuplicate = collisions.length > 0;
    const uniquenessScore = isDuplicate ? 0.35 : 0.98;

    res.json({
      project_id: proposed.project_id,
      approved: !isDuplicate,
      uniquenessScore,
      collisionWarning: isDuplicate ? `Detected visual layout collision with #${collisions[0].project_id}` : null,
      directive: isDuplicate
        ? 'REMEDIATION_REQUIRED: Mutate layoutArchetype and primary_color using /api/design-formula'
        : 'CERTIFIED_NOVELTY: Design is mathematically distinct. Proceed to build.'
    });
  });

  // List all project specs in vault
  app.get('/api/projects', (req, res) => {
    res.json(realFactoryProjects);
  });

  // Get specific project spec
  app.get('/api/projects/:id', (req, res) => {
    const proj = realFactoryProjects.find((p) => p.project_id === req.params.id);
    if (!proj) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(proj);
  });

  // ── Vite SPA Setup ─────────────────────────────────────────────────────────
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Factory Engine] Server listening on port ${PORT}`);
  });
}

startServer();
