#!/usr/bin/env node

/**
 * Script para inicializar Supabase automáticamente
 * Uso: node scripts/init-supabase.js <SUPABASE_URL> <SERVICE_ROLE_KEY>
 */

const https = require('https');

const SUPABASE_URL = process.argv[2];
const SERVICE_ROLE_KEY = process.argv[3];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Uso: node scripts/init-supabase.js <SUPABASE_URL> <SERVICE_ROLE_KEY>');
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

// Leer schema.sql
const schemaPath = path.join(__dirname, '../schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Split queries (simple parser)
const queries = schema
  .split(';')
  .map(q => q.trim())
  .filter(q => q.length > 0 && !q.startsWith('--'));

console.log(`📦 Inicializando Supabase en ${SUPABASE_URL}`);
console.log(`📝 ${queries.length} queries para ejecutar\n`);

/**
 * Ejecutar query en Supabase
 */
async function executeQuery(query) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL);
    const options = {
      hostname: url.hostname,
      path: '/rest/v1/rpc/execute_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'apikey': SERVICE_ROLE_KEY,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          resolve({ success: true });
        } else {
          resolve({ success: false, error: data });
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify({ query }));
    req.end();
  });
}

/**
 * Ejecutar todas las queries
 */
async function initDatabase() {
  let success = 0;
  let failed = 0;

  for (let i = 0; i < queries.length; i++) {
    const query = queries[i];
    try {
      const result = await executeQuery(query);
      if (result.success) {
        console.log(`✅ Query ${i + 1}/${queries.length}`);
        success++;
      } else {
        console.log(`❌ Query ${i + 1}/${queries.length}: ${result.error}`);
        failed++;
      }
    } catch (error) {
      console.log(`❌ Query ${i + 1}/${queries.length}: ${error.message}`);
      failed++;
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n✨ Inicialización completada:`);
  console.log(`   ✅ ${success} queries ejecutadas`);
  console.log(`   ❌ ${failed} queries fallaron`);

  if (failed === 0) {
    console.log(`\n🎉 Base de datos lista! Puedes empezar a usar la app.`);
    process.exit(0);
  } else {
    process.exit(1);
  }
}

initDatabase().catch(err => {
  console.error('❌ Error fatal:', err);
  process.exit(1);
});
