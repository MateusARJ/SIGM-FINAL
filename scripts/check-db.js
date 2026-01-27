const { ChromaClient } = require('chromadb');

async function check() {
    const client = new ChromaClient({ path: 'http://localhost:8000' });
    try {
        const collections = await client.listCollections();
        console.log("📂 Coleções encontradas no Docker:", collections);
    } catch (e) {
        console.log("❌ Erro ao conectar no Docker:", e.message);
    }
}
check();