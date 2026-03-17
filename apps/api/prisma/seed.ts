// ─────────────────────────────────────────────────────────────────────────────
// Seed: Makes, Models, Cities, Admin User
// Run: npm run db:seed  (from apps/api/)
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

// ─── Data ────────────────────────────────────────────────────────────────────

const MAKES_WITH_MODELS: Array<{ name: string; order: number; models: string[] }> = [
  {
    name: 'Toyota',
    order: 1,
    models: ['Corolla', 'Camry', 'Land Cruiser', 'Hilux', 'Yaris', 'Prado', 'Fortuner', 'Vitz'],
  },
  {
    name: 'Honda',
    order: 2,
    models: ['Civic', 'City', 'HR-V', 'BR-V', 'Accord', 'Fit', 'CR-V', 'Vezel'],
  },
  {
    name: 'Suzuki',
    order: 3,
    models: ['Alto', 'Cultus', 'Swift', 'Wagon R', 'Bolan', 'Jimny', 'Ravi', 'Every'],
  },
  {
    name: 'KIA',
    order: 4,
    models: ['Sportage', 'Picanto', 'Stonic', 'Carnival', 'Sorento', 'Cerato'],
  },
  {
    name: 'Hyundai',
    order: 5,
    models: ['Tucson', 'Elantra', 'Santa Fe', 'Sonata', 'Creta', 'i10'],
  },
  {
    name: 'Nissan',
    order: 6,
    models: ['Dayz', 'Patrol', 'X-Trail', 'Navara', 'Sunny', 'Juke'],
  },
  {
    name: 'Mitsubishi',
    order: 7,
    models: ['Outlander', 'Pajero', 'Eclipse Cross', 'L200', 'Mirage', 'Lancer'],
  },
  {
    name: 'Daihatsu',
    order: 8,
    models: ['Mira', 'Move', 'Cuore', 'Terios', 'Coure', 'Hijet'],
  },
  {
    name: 'Mercedes-Benz',
    order: 9,
    models: ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'A-Class'],
  },
  {
    name: 'BMW',
    order: 10,
    models: ['3 Series', '5 Series', '7 Series', 'X3', 'X5', 'X7'],
  },
  {
    name: 'Audi',
    order: 11,
    models: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7'],
  },
  {
    name: 'Changan',
    order: 12,
    models: ['Alsvin', 'Uni-T', 'Uni-S', 'Oshan X7', 'M9', 'CS35 Plus'],
  },
  {
    name: 'Proton',
    order: 13,
    models: ['Saga', 'X70', 'X50', 'Ertiga'],
  },
  {
    name: 'MG',
    order: 14,
    models: ['HS', 'ZS', 'ZS EV', 'RX5', '5', '3'],
  },
  {
    name: 'Haval',
    order: 15,
    models: ['H6', 'H9', 'Jolion', 'M6'],
  },
  {
    name: 'DFSK',
    order: 16,
    models: ['Glory 580', 'Glory 500', 'Prince Pearl', 'Seres 3'],
  },
  {
    name: 'FAW',
    order: 17,
    models: ['V2', 'Carrier', 'Sirius', 'XPV'],
  },
  {
    name: 'United',
    order: 18,
    models: ['Bravo', 'Alpha', 'US 350', 'US 500'],
  },
]

const CITIES: Array<{ name: string; province: string; lat?: number; lng?: number }> = [
  { name: 'Karachi', province: 'Sindh', lat: 24.8607, lng: 67.0011 },
  { name: 'Lahore', province: 'Punjab', lat: 31.5204, lng: 74.3587 },
  { name: 'Islamabad', province: 'ICT', lat: 33.6844, lng: 73.0479 },
  { name: 'Rawalpindi', province: 'Punjab', lat: 33.5651, lng: 73.0169 },
  { name: 'Faisalabad', province: 'Punjab', lat: 31.4504, lng: 73.135 },
  { name: 'Multan', province: 'Punjab', lat: 30.1575, lng: 71.5249 },
  { name: 'Peshawar', province: 'KPK', lat: 34.0151, lng: 71.5249 },
  { name: 'Quetta', province: 'Balochistan', lat: 30.1798, lng: 66.975 },
  { name: 'Sialkot', province: 'Punjab', lat: 32.4945, lng: 74.5229 },
  { name: 'Gujranwala', province: 'Punjab', lat: 32.1877, lng: 74.1945 },
  { name: 'Hyderabad', province: 'Sindh', lat: 25.3792, lng: 68.3683 },
  { name: 'Bahawalpur', province: 'Punjab', lat: 29.3956, lng: 71.6836 },
  { name: 'Sargodha', province: 'Punjab', lat: 32.0836, lng: 72.6711 },
  { name: 'Sukkur', province: 'Sindh', lat: 27.7052, lng: 68.8574 },
  { name: 'Larkana', province: 'Sindh', lat: 27.5578, lng: 68.2122 },
  { name: 'Sheikhupura', province: 'Punjab', lat: 31.7167, lng: 73.9851 },
  { name: 'Rahim Yar Khan', province: 'Punjab', lat: 28.4202, lng: 70.2952 },
  { name: 'Jhang', province: 'Punjab', lat: 31.2681, lng: 72.3181 },
  { name: 'Dera Ghazi Khan', province: 'Punjab', lat: 30.0588, lng: 70.6342 },
  { name: 'Gujrat', province: 'Punjab', lat: 32.5736, lng: 74.0789 },
  { name: 'Mirpur AJK', province: 'AJK', lat: 33.1442, lng: 73.7525 },
  { name: 'Abbottabad', province: 'KPK', lat: 34.1558, lng: 73.2194 },
  { name: 'Mardan', province: 'KPK', lat: 34.1986, lng: 72.0404 },
  { name: 'Nawabshah', province: 'Sindh', lat: 26.2442, lng: 68.4101 },
  { name: 'Mingora', province: 'KPK', lat: 34.7717, lng: 72.3600 },
  { name: 'Chiniot', province: 'Punjab', lat: 31.7167, lng: 72.9833 },
  { name: 'Kotri', province: 'Sindh', lat: 25.3676, lng: 68.3124 },
  { name: 'Kamoke', province: 'Punjab', lat: 31.9739, lng: 74.2189 },
  { name: 'Hafizabad', province: 'Punjab', lat: 32.0709, lng: 73.6884 },
  { name: 'Sahiwal', province: 'Punjab', lat: 30.6706, lng: 73.1064 },
]

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedMakesAndModels() {
  console.log('Seeding makes and models...')

  for (const makeData of MAKES_WITH_MODELS) {
    const make = await prisma.make.upsert({
      where: { slug: slug(makeData.name) },
      update: { order: makeData.order },
      create: {
        name: makeData.name,
        slug: slug(makeData.name),
        order: makeData.order,
        isActive: true,
      },
    })

    for (const modelName of makeData.models) {
      const modelSlug = slug(modelName)
      await prisma.vehicleModel.upsert({
        where: { makeId_slug: { makeId: make.id, slug: modelSlug } },
        update: {},
        create: {
          makeId: make.id,
          name: modelName,
          slug: modelSlug,
          isActive: true,
        },
      })
    }
  }

  const makeCount = await prisma.make.count()
  const modelCount = await prisma.vehicleModel.count()
  console.log(`  ✓ ${makeCount} makes, ${modelCount} models`)
}

async function seedCities() {
  console.log('Seeding cities...')

  for (const cityData of CITIES) {
    await prisma.city.upsert({
      where: { slug: slug(cityData.name) },
      update: {},
      create: {
        name: cityData.name,
        slug: slug(cityData.name),
        province: cityData.province,
        latitude: cityData.lat,
        longitude: cityData.lng,
        isActive: true,
      },
    })
  }

  const count = await prisma.city.count()
  console.log(`  ✓ ${count} cities`)
}

async function seedAdminUser() {
  console.log('Seeding admin user...')

  const email = 'admin@pw-clone.com'
  const existing = await prisma.user.findUnique({ where: { email } })

  if (!existing) {
    const passwordHash = await bcrypt.hash('Admin@123456', 12)
    await prisma.user.create({
      data: {
        name: 'Admin',
        email,
        passwordHash,
        role: 'ADMIN',
        isVerified: true,
        isActive: true,
      },
    })
    console.log(`  ✓ Admin created — email: ${email}  password: Admin@123456`)
  } else {
    console.log(`  ✓ Admin already exists (${email})`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n── PakWheels Clone Seed ──────────────────────────────────')
  await seedMakesAndModels()
  await seedCities()
  await seedAdminUser()
  console.log('── Done ──────────────────────────────────────────────────\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
