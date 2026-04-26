/**
 * Seed script — inserta los intereses base en la colección interests.
 * Ejecutar con: npx ts-node -r tsconfig-paths/register src/seed-interests.ts
 */
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const INTERESTS = [
  { name: 'Grupos de estudio', category: 'OTHER' },
  { name: 'Cafecito',          category: 'OTHER' },
  { name: 'Conciertos',        category: 'MUSIC' },
  { name: 'Gaming',            category: 'VIDEOGAMES' },
  { name: 'Fiestas',           category: 'OTHER' },
  { name: 'Senderismo',        category: 'SPORTS' },
  { name: 'Arte',              category: 'OTHER' },
  { name: 'Deportes',          category: 'SPORTS' },
  { name: 'Fotografía',        category: 'OTHER' },
  { name: 'Teatro',            category: 'OTHER' },
  { name: 'Programación',      category: 'TECHNOLOGY' },
  { name: 'Gastronomía',       category: 'OTHER' },
  { name: 'Películas',         category: 'MOVIES' },
];

const InterestSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  category: { type: String, required: true },
});

async function seed() {
  const uri = process.env.DB_URI;
  if (!uri) { console.error('DB_URI not set in .env'); process.exit(1); }

  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const InterestModel = mongoose.model('Interest', InterestSchema);

  // Evitar duplicados — solo insertar los que no existan
  for (const interest of INTERESTS) {
    const exists = await InterestModel.findOne({ name: interest.name });
    if (!exists) {
      await InterestModel.create(interest);
      console.log(`✅ Created: ${interest.name}`);
    } else {
      console.log(`⏭️  Already exists: ${interest.name}`);
    }
  }

  await mongoose.disconnect();
  console.log('Done!');
}

seed().catch(err => { console.error(err); process.exit(1); });
