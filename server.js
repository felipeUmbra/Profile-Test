import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import dns from 'dns';

// ===== DNS FIX: Configure resolver to use specific DNS servers =====
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
console.log('✅ DNS configured with custom servers:', dns.getServers());
// ===== END DNS FIX =====

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB configuration
const mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
    console.error('❌ MONGODB_URI is not defined in your .env file. Please add it.');
    process.exit(1);
}

// Alternative connection strings to try
function getConnectionStrings() {
    const base = mongoUri;
    
    // Extract cluster name from URI
    const clusterMatch = base.match(/cluster0-shard-00-00\.([^.]+)\.mongodb\.net/);
    const clusterId = clusterMatch ? clusterMatch[1] : 'rbrxfzz';
    
    return [
        // Strategy 1: SRV connection (simplest, recommended)
        `mongodb+srv://blackfenrirnobody_db_user:Shopee123@cluster0.${clusterId}.mongodb.net/profile_test?retryWrites=true&w=majority&appName=Cluster0`,
        
        // Strategy 2: Original connection string
        base,
        
        // Strategy 3: Single node connection (fallback)
        `mongodb://blackfenrirnobody_db_user:Shopee123@cluster0-shard-00-00.${clusterId}.mongodb.net:27017,cluster0-shard-00-01.${clusterId}.mongodb.net:27017,cluster0-shard-00-02.${clusterId}.mongodb.net:27017/profile_test?ssl=true&replicaSet=atlas-14l8lu-shard-0&authSource=admin&retryWrites=true&w=majority`
    ];
}

// Connection options
const clientOptions = {
    serverSelectionTimeoutMS: 15000,
    connectTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    maxPoolSize: 10,
    minPoolSize: 1,
    retryWrites: true,
    retryReads: true,
};

let client;
let db;

// Database connection function with multiple strategies
async function connectToDatabase() {
    const connectionStrings = getConnectionStrings();
    
    for (let strategyIndex = 0; strategyIndex < connectionStrings.length; strategyIndex++) {
        const uri = connectionStrings[strategyIndex];
        const strategyName = [
            'SRV Connection (Recommended)',
            'Standard Connection',
            'Replica Set Connection (Fallback)'
        ][strategyIndex];
        
        console.log(`\n📡 Trying ${strategyName}...`);
        
        try {
            // Close existing client if any
            if (client) {
                await client.close();
            }
            
            client = new MongoClient(uri, clientOptions);
            await client.connect();
            
            db = client.db('profile_test');
            
            // Test the connection
            await db.command({ ping: 1 });
            
            console.log(`✅ Connected to MongoDB successfully using ${strategyName}!`);
            console.log(`📊 Database: ${db.databaseName}`);
            
            return true;
            
        } catch (error) {
            console.log(`❌ ${strategyName} failed:`, error.message);
            // Continue to next strategy
        }
    }
    
    // If all strategies failed
    console.error('\n❌ All connection strategies failed');
    
    // Helpful error message
    console.log('\n🔧 DNS Resolution Error. Current DNS servers:', dns.getServers());
    console.log('   This usually means:');
    console.log('   1. Your network is blocking DNS queries to port 53');
    console.log('   2. The MongoDB Atlas cluster might be temporarily unavailable');
    console.log('   3. There might be a firewall blocking outbound connections');
    
    return false;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({
                status: 'ERROR',
                message: 'Database not connected'
            });
        }
        
        await db.command({ ping: 1 });
        
        res.json({
            status: 'OK',
            database: 'connected',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(503).json({
            status: 'ERROR',
            message: error.message
        });
    }
});

// DNS info endpoint (useful for debugging)
app.get('/api/health/dns', (req, res) => {
    res.json({
        dnsServers: dns.getServers(),
        platform: process.platform,
        nodeVersion: process.version
    });
});

// Start server
const PORT = process.env.PORT || 27017;

connectToDatabase().then(connected => {
    if (connected) {
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
            console.log(`🔧 DNS info: http://localhost:${PORT}/api/health/dns\n`);
        });
    } else {
        console.log('\n💥 Server startup failed.');
        console.log('\n🛠️  Quick fixes:');
        console.log('1. ✅ Verify MONGODB_URI in .env file');
        console.log('2. 🌐 Check if you can ping google.com (to test internet connection)');
        console.log('3. 🔐 In MongoDB Atlas: Network Access → Add IP 0.0.0.0/0');
        console.log('4. 📝 Get fresh connection string from Atlas dashboard');
        console.log('5. 🔄 Try restarting your router (sometimes DNS gets cached)');
        console.log('6. 💻 Temporarily disable Windows Defender Firewall for testing\n');
        process.exit(1);
    }
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔻 Shutting down server...');
    if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
    process.exit(0);
});

process.on('SIGTERM', async () => {
    console.log('\n🔻 Shutting down server...');
    if (client) {
        await client.close();
        console.log('✅ MongoDB connection closed');
    }
    process.exit(0);
});