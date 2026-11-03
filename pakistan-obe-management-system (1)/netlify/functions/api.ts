import serverless from 'serverless-http';
import { app, ensureInitialHydrated } from '../../server';

const serverlessHandler = serverless(app);

export const handler = async (event: any, context: any) => {
  // Ensure database state is hydrated from Supabase on cold start
  try {
    await ensureInitialHydrated();
  } catch (err) {
    console.warn('[Netlify Function] Hydration warning:', err);
  }

  // Normalize path if Netlify functions prefix is present
  if (event.path) {
    if (event.path.startsWith('/.netlify/functions/api')) {
      event.path = event.path.replace('/.netlify/functions/api', '/api') || '/api';
    }
  }

  return serverlessHandler(event, context);
};
