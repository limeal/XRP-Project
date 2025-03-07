import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { storage } from '../services/storage';

const prisma = new PrismaClient();

const adminId = '34a132b6-0921-4a66-bcff-5d2e72a03c11'; // Admin ID

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

async function seed() {
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

      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = `data:image/png;base64,${imageBuffer.toString(
        'base64'
      )}`;

      const imageUrl = await storage.saveFile(base64Image, monkey.imagePath);

      await prisma.item.create({
        data: {
          name: monkey.name,
          description: monkey.description,
          image_url: imageUrl,
          owner: { connect: { id: adminId } },
        },
      });

      console.log(`Added ${monkey.name} to database`);
    } catch (error) {
      console.error(`Error adding ${monkey.name}:`, error);
    }
  }

  console.log('Monkeys seeded successfully!');
  await prisma.$disconnect();
}

seed().catch((e) => {
  console.error('Error seeding database:', e);
  prisma.$disconnect();
  process.exit(1);
});
