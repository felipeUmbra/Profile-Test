require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { Question } = require('./models');

// 1. Define the URI specifically
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/personality_tests';

async function seedDatabase() {
  try {
    // 2. Connect explicitly and wait for it
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // 3. Read File
    console.log('📂 Reading JSON file...');
    const rawData = fs.readFileSync('./fallback-questions.json');
    const data = JSON.parse(rawData);

    // 4. Clear old data
    console.log('🧹 Clearing existing questions...');
    await Question.deleteMany({});

    let questionsToInsert = [];

    // DISC Mapping
    if (data.disc) {
        data.disc.forEach(q => {
            questionsToInsert.push({
                testType: 'disc',
                order: q.id,
                text: { 
                    en: q.text?.en || q.question_text, 
                    pt: q.text?.pt || "Tradução pendente",
                    es: q.text?.es || "Traducción pendiente" // Added Spanish
                },
                factor: q.factor
            });
        });
    }

    // Big5 Mapping
    if (data.big5) {
        data.big5.forEach(q => {
            questionsToInsert.push({
                testType: 'big5',
                order: q.id,
                text: { 
                    en: q.text?.en, 
                    pt: q.text?.pt,
                    es: q.text?.es // Added Spanish
                },
                factor: q.factor,
                reverse: q.reverse || false
            });
        });
    }

    // MBTI Mapping
    if (data.mbti) {
        data.mbti.forEach(q => {
            questionsToInsert.push({
                testType: 'mbti',
                order: q.id,
                options: {
                    optionA: { 
                        en: q.optionA?.en, 
                        pt: q.optionA?.pt,
                        es: q.optionA?.es // Added Spanish
                    },
                    optionB: { 
                        en: q.optionB?.en, 
                        pt: q.optionB?.pt,
                        es: q.optionB?.es // Added Spanish
                    }
                },
                dimension: q.dimension,
                values: { a: q.aValue, b: q.bValue }
            });
        });
    }

    // 5. Insert
    console.log(`📥 Inserting ${questionsToInsert.length} questions...`);
    await Question.insertMany(questionsToInsert);
    console.log(`🎉 Database seeded successfully!`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    // 6. Close connection
    await mongoose.connection.close();
    process.exit();
  }
}

seedDatabase();