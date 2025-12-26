import { listMatches } from './src/handlers/listMatches';

async function testResolver() {
  console.log('Testing listMatches resolver with season 2025...');
  
  try {
    const result = await listMatches(2025);
    console.log(`\nResult type: ${typeof result}`);
    console.log(`Result is array: ${Array.isArray(result)}`);
    console.log(`Result count: ${result?.length || 'N/A'}`);
    console.log(`First match:`, JSON.stringify(result?.[0], null, 2));
  } catch (error) {
    console.error('Error:', error);
  }
}

testResolver();
