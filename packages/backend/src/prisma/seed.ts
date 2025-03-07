import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { storage } from '../services/storage';
import bcrypt from 'bcryptjs';
import { FileUpload } from 'graphql-upload-ts';
import { Readable } from 'stream';

const prisma = new PrismaClient();

const ADMIN_ID = '34a132b6-0921-4a66-bcff-5d2e72a03c11';
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

const monkeys = [
  {
    name: 'Astro Ape',
    description:
      'A fearless space explorer searching for cosmic bananas in the vast universe.',
    imagePath: 'monkey_astronaut.jpg',
  },
  {
    name: 'Hoops Ape',
    description:
      'A basketball legend who can dunk from the free-throw line with insane agility.',
    imagePath: 'monkey_basketball.jpg',
  },
  {
    name: 'Gentlemonk',
    description:
      'A sophisticated ape who enjoys fine dining, classical music, and expensive cigars.',
    imagePath: 'monkey_classy.jpg',
  },
  {
    name: 'Cyber Kong',
    description:
      'A battle-hardened cybernetic ape from a dystopian future, trained in high-tech combat.',
    imagePath: 'monkey_fighter.jpg',
  },
  {
    name: 'Funky Chimpo',
    description:
      'A groovy disco-loving ape who dances to funky beats all night long.',
    imagePath: 'monkey_funk.jpg',
  },
  {
    name: 'Hippie Chimp',
    description:
      'A peace-loving, flower-wearing monkey who preaches love and harmony.',
    imagePath: 'monkey_hippie.jpg',
  },
  {
    name: 'Urban Primate',
    description:
      'A street-smart monkey who thrives in the urban jungle, always up to some mischief.',
    imagePath: 'monkey_street.jpg',
  },
  {
    name: 'Ancient Kong',
    description:
      'A wise old ape who has mastered the ancient secrets of the jungle.',
    imagePath: 'monkey_swag.jpg',
  },
  {
    name: 'Wall Street Ape',
    description:
      'A finance genius who trades stocks and crypto faster than any human.',
    imagePath: 'monkey_wall_street.jpg',
  },
  {
    name: 'Dracula Chimp',
    description:
      'A mysterious vampire monkey who lurks in the shadows, seeking eternal bananas.',
    imagePath: 'monkey_dracula.jpg',
  },
];

async function cleanupPinata() {
  try {
    // Récupérer tous les items
    const items = await prisma.item.findMany({
      select: { image_url: true }
    });

    // Extraire les CIDs des URLs
    const cids = items.map(item => {
      const url = new URL(item.image_url);
      return url.pathname.split('/').pop();
    });

    // Unpin chaque image de Pinata
    for (const cid of cids) {
      if (cid) {
        await storage.unpinFile(cid);
        console.log(`Unpinned file with CID: ${cid}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up Pinata:', error);
  }
}

async function createAdmin() {
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  
  try {
    const admin = await prisma.user.upsert({
      where: { id: ADMIN_ID },
      update: {},
      create: {
        id: ADMIN_ID,
        email: ADMIN_EMAIL,
        username: 'admin',
        password: hashedPassword,
        is_superadmin: true
      }
    });
    
    console.log('Admin account created:', admin.username);
    return admin;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
}

async function seed() {
  try {
    // Cleanup existant
    console.log('Cleaning up existing data...');
    await cleanupPinata();
    await prisma.item.deleteMany();
    
    // Créer l'admin
    console.log('Creating admin account...');
    await createAdmin();

    // Seed des singes
    console.log('Seeding database with monkeys...');
    for (const monkey of monkeys) {
      try {
        const imagePath = path.join(
          __dirname,
          '../../public/images/',
          monkey.imagePath
        );
        if (!fs.existsSync(imagePath)) {
          console.error(`Image not found: ${imagePath}`);
          continue;
        }

        // Créer un File à partir de l'image
        const imageBuffer = fs.readFileSync(imagePath);
        const file = {
          createReadStream: () => {
            const stream = fs.createReadStream(imagePath) as fs.ReadStream & {
              _pos?: number;
              _writeStream?: fs.WriteStream;
            };
            return stream;
          },
          filename: monkey.imagePath,
          mimetype: 'image/jpeg',
          encoding: '7bit',
          fieldName: 'file',
          capacitor: {
            fileName: monkey.imagePath,
            encoding: '7bit',
            mimeType: 'image/jpeg'
          }
        } as unknown as FileUpload;

        // Upload sur Pinata avec le nom du singe
        const imageUrl = await storage.saveFile(file, monkey.name);

        // Créer l'item
        await prisma.item.create({
          data: {
            name: monkey.name,
            description: monkey.description,
            image_url: imageUrl,
            owner: { connect: { id: ADMIN_ID } },
          },
        });

        console.log(`Added ${monkey.name} to database`);
      } catch (error) {
        console.error(`Error adding ${monkey.name}:`, error);
      }
    }

    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Gérer le nettoyage lors de l'arrêt
process.on('SIGINT', async () => {
  console.log('Cleaning up before exit...');
  await cleanupPinata();
  process.exit(0);
});

seed().catch((e) => {
  console.error('Error seeding database:', e);
  prisma.$disconnect();
  process.exit(1);
});
