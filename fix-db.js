import { client } from './lib/db/drizzle.js';

async function fixDB() {
    try {
        await client`DROP TABLE IF EXISTS blogs CASCADE`;
        console.log('Dropped blogs table');
    } catch (error) {
        console.error('Error dropping table:', error);
    } finally {
        await client.end();
    }
}

fixDB();
