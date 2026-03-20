// ─────────────────────────────────────────────────────────────────────────────
// Seed: Brands, Models, Cities, Test Users, Dummy Listings
// Run: npm run db:seed  (from apps/api/)
// ─────────────────────────────────────────────────────────────────────────────

import { PrismaClient, FuelType, TransmissionType, BodyType, VehicleCondition } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// ─── Data ────────────────────────────────────────────────────────────────────

const MAKES_WITH_MODELS: Array<{ name: string; order: number; models: string[] }> = [
  {
    name: 'Haas',
    order: 1,
    models: ['VF-2', 'VF-3', 'VF-4', 'ST-10', 'ST-20', 'ST-30', 'TM-1', 'Mini Mill', 'UMC-750'],
  },
  {
    name: 'Mazak',
    order: 2,
    models: ['Quick Turn 200', 'Quick Turn 350', 'VCN-530C', 'Integrex i-200', 'VTC-800', 'Nexus 510C'],
  },
  {
    name: 'DMG Mori',
    order: 3,
    models: ['DMU 50', 'DMU 80', 'NLX 2500', 'CLX 450', 'CMX 600V', 'CTX beta 800'],
  },
  {
    name: 'Trumpf',
    order: 4,
    models: ['TruLaser 3030', 'TruLaser 5030', 'TruPunch 3000', 'TruBend 5130', 'TruLaser Tube 7000'],
  },
  {
    name: 'Fanuc',
    order: 5,
    models: ['Robodrill α-D21MiB5', 'Robocut α-C600iB', 'Robonano α-0iB', 'Roboshot α-S150iA'],
  },
  {
    name: 'Okuma',
    order: 6,
    models: ['LB3000 EX II', 'Genos M560-V', 'MB-46VAE', 'Multus B300II', 'LU3000 EX'],
  },
  {
    name: 'Doosan',
    order: 7,
    models: ['Puma 2600SY', 'DNM 500', 'DVF 5000', 'NHP 5000', 'Lynx 2100'],
  },
  {
    name: 'Amada',
    order: 8,
    models: ['LCG 3015 AJ', 'HRB 1003', 'EM 2510NT', 'ENSIS 3015 AJ', 'HG 1003'],
  },
  {
    name: 'Bystronic',
    order: 9,
    models: ['ByStar Fiber 3015', 'Xpress 80', 'ByJet Smart', 'BySprint Fiber'],
  },
  {
    name: 'Mitsubishi',
    order: 10,
    models: ['MV2400S', 'eX Series', 'M80', 'FA20S Advance', 'GX-F Series'],
  },
  {
    name: 'Brother',
    order: 11,
    models: ['Speedio S500X2', 'Speedio M140X2', 'Speedio S300X2', 'TC-32BN QT'],
  },
  {
    name: 'Makino',
    order: 12,
    models: ['a51nx', 'PS95', 'F5', 'D500', 'iQ500', 'a61nx'],
  },
  {
    name: 'Hurco',
    order: 13,
    models: ['VM20i', 'VMX42i', 'TM8i', 'VMX30Ui', 'BX40i'],
  },
  {
    name: 'OMAX',
    order: 14,
    models: ['GlobalMAX 1530', 'MAXIEM 1515', 'ProtoMAX', 'OMAX 60120'],
  },
  {
    name: 'Flow',
    order: 15,
    models: ['Mach 500', 'Mach 700', 'IFB 612', 'NanoJet'],
  },
  {
    name: 'Hypertherm',
    order: 16,
    models: ['Powermax 45', 'Powermax 85', 'Powermax 105', 'MAXPRO200', 'XPR300'],
  },
  {
    name: 'Creality',
    order: 17,
    models: ['Ender 3 V3', 'CR-10 Smart Pro', 'K1 Max', 'Halot-Mage Pro', 'Sermoon D3'],
  },
  {
    name: 'Stratasys',
    order: 18,
    models: ['F370CR', 'J55 Prime', 'Origin One', 'F900', 'H350'],
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
  { name: 'Mingora', province: 'KPK', lat: 34.7717, lng: 72.36 },
  { name: 'Chiniot', province: 'Punjab', lat: 31.7167, lng: 72.9833 },
  { name: 'Kotri', province: 'Sindh', lat: 25.3676, lng: 68.3124 },
  { name: 'Kamoke', province: 'Punjab', lat: 31.9739, lng: 74.2189 },
  { name: 'Hafizabad', province: 'Punjab', lat: 32.0709, lng: 73.6884 },
  { name: 'Sahiwal', province: 'Punjab', lat: 30.6706, lng: 73.1064 },
]

// ─── Dummy listing data ──────────────────────────────────────────────────────

interface DummyListing {
  brandIndex: number
  modelIndex: number
  title: string
  description: string
  price: number
  year: number
  mileage: number
  fuelType: FuelType
  transmission: TransmissionType
  bodyType: BodyType
  condition: VehicleCondition
  color: string
  cityIndex: number
  isFeatured: boolean
}

const DUMMY_LISTINGS: DummyListing[] = [
  {
    brandIndex: 0, modelIndex: 0,
    title: 'Haas VF-2 CNC Vertical Mill — Excellent Condition',
    description: 'Well-maintained Haas VF-2 vertical machining center with 30x16x20 travel. 8,100 RPM spindle, 20-pocket tool changer, 4th axis ready. Includes Renishaw probing system. Perfect for precision parts production. Recently serviced with new spindle bearings.',
    price: 8500000, year: 2019, mileage: 4200,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Gray', cityIndex: 0, isFeatured: true,
  },
  {
    brandIndex: 1, modelIndex: 0,
    title: 'Mazak Quick Turn 200 CNC Lathe — Low Hours',
    description: 'Mazak Quick Turn 200 with Mazatrol SmoothG CNC control. 8" chuck, 12-station turret, tailstock, chip conveyor. Only 3,100 running hours. Ideal for turning operations up to 350mm diameter. Machine is in production and can be seen running.',
    price: 12000000, year: 2020, mileage: 3100,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_LATHE,
    condition: VehicleCondition.USED, color: 'White', cityIndex: 1, isFeatured: true,
  },
  {
    brandIndex: 3, modelIndex: 0,
    title: 'Trumpf TruLaser 3030 Fiber Laser Cutting Machine',
    description: '6kW fiber laser, 3000x1500mm cutting area. Cuts up to 25mm mild steel, 20mm stainless. Automatic nozzle changer, LiftMaster for loading/unloading. Low running cost compared to CO2 lasers. Full maintenance records available.',
    price: 35000000, year: 2021, mileage: 2800,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.LASER_CUTTER,
    condition: VehicleCondition.USED, color: 'Yellow', cityIndex: 2, isFeatured: true,
  },
  {
    brandIndex: 2, modelIndex: 2,
    title: 'DMG Mori NLX 2500 CNC Turning Center',
    description: 'High-performance CNC lathe with CELOS control interface. BMT turret, 80mm bar capacity, integrated coolant system. Machine upgraded with live tooling and C-axis for complete machining. Extended warranty available.',
    price: 18000000, year: 2022, mileage: 1800,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_LATHE,
    condition: VehicleCondition.USED, color: 'Green', cityIndex: 1, isFeatured: true,
  },
  {
    brandIndex: 5, modelIndex: 1,
    title: 'Okuma Genos M560-V Vertical Machining Center',
    description: 'Okuma Genos M560-V with OSP-P300MA control. 1,050x560x460mm travel, 15,000 RPM spindle, 32-tool ATC. Thermo-Friendly Concept for high accuracy. Great for mold/die work and precision components.',
    price: 15000000, year: 2020, mileage: 3500,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Green', cityIndex: 4, isFeatured: true,
  },
  {
    brandIndex: 7, modelIndex: 0,
    title: 'Amada LCG 3015 AJ Fiber Laser — 2023 Model',
    description: 'Near-new Amada fiber laser with 4kW source. 3000x1500mm table, AMNC 3i control. Automatic nozzle changer, air-assist cutting capability. Only 800 hours. Being sold due to factory upgrade to higher wattage model.',
    price: 42000000, year: 2023, mileage: 800,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.LASER_CUTTER,
    condition: VehicleCondition.USED, color: 'Orange', cityIndex: 0, isFeatured: true,
  },
  {
    brandIndex: 6, modelIndex: 1,
    title: 'Doosan DNM 500 Vertical Machining Center',
    description: 'Reliable Doosan DNM 500 with Fanuc 0iMF control. 1,020x540x510mm travel, 12,000 RPM, 30-tool ATC. Great for job shop work. Recently had a full preventive maintenance overhaul. Comes with tooling package.',
    price: 7500000, year: 2018, mileage: 6200,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Blue', cityIndex: 3, isFeatured: false,
  },
  {
    brandIndex: 8, modelIndex: 0,
    title: 'Bystronic ByStar Fiber 3015 — High Speed Cutting',
    description: '10kW fiber laser for high-speed cutting. ByVision Cutting 3.0 interface, automatic gas mixing, detection eye for monitoring. Excellent edge quality on stainless and aluminum. Full service history.',
    price: 55000000, year: 2022, mileage: 1500,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.LASER_CUTTER,
    condition: VehicleCondition.USED, color: 'Red', cityIndex: 1, isFeatured: false,
  },
  {
    brandIndex: 13, modelIndex: 0,
    title: 'OMAX GlobalMAX 1530 Waterjet Cutting System',
    description: 'Versatile abrasive waterjet cutter with 1500x3000mm cutting area. Cuts virtually any material up to 150mm thick: steel, stone, glass, composites. IntelliMAX software, low maintenance. Great for shops needing diverse material capability.',
    price: 9500000, year: 2021, mileage: 2200,
    fuelType: FuelType.HYDRAULIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.WATERJET,
    condition: VehicleCondition.USED, color: 'Blue', cityIndex: 2, isFeatured: false,
  },
  {
    brandIndex: 15, modelIndex: 2,
    title: 'Hypertherm Powermax 105 Plasma Cutting System',
    description: 'Industrial plasma cutter capable of cutting up to 38mm. Includes machine torch, hand torch, and full consumable kit. CNC-ready with interface for automated tables. High-quality cuts with minimal dross.',
    price: 850000, year: 2023, mileage: 500,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.MANUAL, bodyType: BodyType.PLASMA_CUTTER,
    condition: VehicleCondition.USED, color: 'Red', cityIndex: 5, isFeatured: false,
  },
  {
    brandIndex: 3, modelIndex: 3,
    title: 'Trumpf TruBend 5130 CNC Press Brake — 130 Ton',
    description: '130-ton press brake with 3-meter bending length. 6-axis back gauge, automatic tool changer, ACB angle measurement system. Touchpoint TruBend control for easy programming. Ideal for precision sheet metal fabrication.',
    price: 22000000, year: 2021, mileage: 2500,
    fuelType: FuelType.HYDRAULIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.PRESS_BRAKE,
    condition: VehicleCondition.USED, color: 'Yellow', cityIndex: 4, isFeatured: false,
  },
  {
    brandIndex: 0, modelIndex: 4,
    title: 'Haas ST-20 CNC Lathe — Production Ready',
    description: 'Haas ST-20 turning center with 8" chuck, 12-station BOT turret, parts catcher, and chip conveyor. 4,000 RPM spindle, 2" bar capacity. Machine has been well maintained and is in excellent running condition.',
    price: 6800000, year: 2017, mileage: 7500,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_LATHE,
    condition: VehicleCondition.USED, color: 'Gray', cityIndex: 0, isFeatured: false,
  },
  {
    brandIndex: 16, modelIndex: 2,
    title: 'Creality K1 Max Large Format 3D Printer — New',
    description: 'Brand new Creality K1 Max with 300x300x300mm build volume. CoreXY design, 600mm/s max speed, auto-leveling, AI camera monitoring. Perfect for rapid prototyping, jigs, and fixtures. Factory sealed with full warranty.',
    price: 185000, year: 2024, mileage: 0,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.PRINTER_3D,
    condition: VehicleCondition.NEW, color: 'Black', cityIndex: 2, isFeatured: false,
  },
  {
    brandIndex: 17, modelIndex: 0,
    title: 'Stratasys F370CR Composite-Ready 3D Printer',
    description: 'Industrial FDM 3D printer capable of printing carbon-fiber reinforced nylon. Build volume 355x254x355mm. Soluble support for complex geometries. Includes GrabCAD Print software. Ideal for functional prototypes and production parts.',
    price: 4500000, year: 2023, mileage: 600,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.PRINTER_3D,
    condition: VehicleCondition.USED, color: 'White', cityIndex: 1, isFeatured: false,
  },
  {
    brandIndex: 4, modelIndex: 0,
    title: 'Fanuc Robodrill α-D21MiB5 High Speed Mill',
    description: 'Fanuc Robodrill with 24,000 RPM spindle and 21-tool ATC. Ultra-fast tool changes at 0.7 seconds. 700x400x330mm travel. Perfect for high-volume production of small precision parts. Recently retrofitted with new ballscrews.',
    price: 11000000, year: 2019, mileage: 5500,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Yellow', cityIndex: 0, isFeatured: false,
  },
  {
    brandIndex: 14, modelIndex: 0,
    title: 'Flow Mach 500 Waterjet — 60,000 PSI',
    description: 'Flow Mach 500 with 60,000 PSI intensifier pump. 1500x3000mm cutting table, Dynamic Waterjet XD for taper-free cutting. FlowMaster software. Cuts metal, stone, glass, composites. Recently rebuilt pump with new seals.',
    price: 14000000, year: 2020, mileage: 3200,
    fuelType: FuelType.HYDRAULIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.WATERJET,
    condition: VehicleCondition.USED, color: 'Blue', cityIndex: 3, isFeatured: false,
  },
  {
    brandIndex: 12, modelIndex: 0,
    title: 'Hurco VM20i CNC Mill — Job Shop Favorite',
    description: 'Hurco VM20i with WinMax control — conversational and NC programming. 1,016x508x508mm travel, 12,000 RPM, 24-tool ATC. Dual-screen control for easy setup. Perfect entry-level CNC for workshops upgrading from manual machines.',
    price: 5200000, year: 2018, mileage: 4800,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Gray', cityIndex: 6, isFeatured: false,
  },
  {
    brandIndex: 7, modelIndex: 4,
    title: 'Amada HG 1003 CNC Press Brake — 100 Ton',
    description: 'Amada HG 1003 hybrid press brake, 100 ton capacity, 3-meter bed. AMNC 3i touch control, automatic angle measurement. Energy-efficient hybrid drive reduces power consumption by 50%. Includes upper and lower tooling sets.',
    price: 16500000, year: 2022, mileage: 1200,
    fuelType: FuelType.HYDRAULIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.PRESS_BRAKE,
    condition: VehicleCondition.USED, color: 'Orange', cityIndex: 4, isFeatured: false,
  },
  {
    brandIndex: 11, modelIndex: 0,
    title: 'Makino a51nx Horizontal Machining Center',
    description: 'High-performance HMC with 500mm pallet, 14,000 RPM spindle, 60-tool ATC. Professional 6 control with SGI.5 for superior surface finish. Through-spindle coolant. Excellent for high-volume production and mold/die work.',
    price: 28000000, year: 2021, mileage: 2800,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'Green', cityIndex: 0, isFeatured: false,
  },
  {
    brandIndex: 9, modelIndex: 3,
    title: 'Mitsubishi FA20S Advance Wire EDM',
    description: 'High-precision wire EDM with 0.001mm positioning accuracy. 400x300x310mm travel, auto wire threading, 500kg max workpiece. Optical drive system for ultra-fine surface finish. Perfect for tool & die shops.',
    price: 9800000, year: 2020, mileage: 4100,
    fuelType: FuelType.ELECTRIC, transmission: TransmissionType.AUTOMATIC, bodyType: BodyType.CNC_MILL,
    condition: VehicleCondition.USED, color: 'White', cityIndex: 1, isFeatured: false,
  },
]

// ─── Seed Functions ───────────────────────────────────────────────────────────

async function seedMakesAndModels() {
  console.log('Seeding brands and models...')

  // Clear dependent records first, then makes/models
  await prisma.listingImage.deleteMany({})
  await prisma.listing.deleteMany({})
  await prisma.vehicleModel.deleteMany({})
  await prisma.make.deleteMany({})

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
  console.log(`  ✓ ${makeCount} brands, ${modelCount} models`)
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

async function seedTestUsers() {
  console.log('Seeding test users...')

  const TEST_USERS = [
    { name: 'Admin',        email: 'admin@cncmachinebazaar.com',   password: 'Admin@123456',  role: 'ADMIN'  },
    { name: 'Editor Sara',  email: 'editor@cncmachinebazaar.com',  password: 'Editor@123456', role: 'EDITOR' },
    { name: 'Ali Supplier', email: 'dealer@cncmachinebazaar.com',  password: 'Dealer@123456', role: 'DEALER' },
    { name: 'Ahmed User',   email: 'user@cncmachinebazaar.com',    password: 'User@1234567',  role: 'USER'   },
    { name: 'Fatima Buyer', email: 'buyer@cncmachinebazaar.com',   password: 'Buyer@123456',  role: 'USER'   },
  ] as const

  for (const u of TEST_USERS) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (!existing) {
      const passwordHash = await bcrypt.hash(u.password, 12)
      await prisma.user.create({
        data: {
          name: u.name,
          email: u.email,
          passwordHash,
          role: u.role,
          isVerified: true,
          isActive: true,
        },
      })
      console.log(`  ✓ ${u.role.padEnd(6)}  ${u.email}  /  ${u.password}`)
    } else {
      console.log(`  · ${u.role.padEnd(6)}  ${u.email} (already exists)`)
    }
  }
}

async function seedDummyListings() {
  console.log('Seeding dummy listings...')

  // Get all makes/models/cities
  const makes = await prisma.make.findMany({
    include: { models: true },
    orderBy: { order: 'asc' },
  })
  const cities = await prisma.city.findMany({ orderBy: { name: 'asc' } })

  // Get the seller users (use dealer and user accounts)
  const sellers = await prisma.user.findMany({
    where: {
      email: {
        in: ['dealer@cncmachinebazaar.com', 'user@cncmachinebazaar.com', 'admin@cncmachinebazaar.com'],
      },
    },
  })
  if (sellers.length === 0) {
    console.log('  ⚠ No seller users found, skipping listings')
    return
  }

  // Listings were cleared above during brand seeding, so always re-create

  let created = 0
  for (const listing of DUMMY_LISTINGS) {
    const make = makes[listing.brandIndex]
    if (!make) continue
    const model = make.models[listing.modelIndex]
    if (!model) continue
    const city = cities[listing.cityIndex] ?? cities[0]
    const seller = rand(sellers)

    await prisma.listing.create({
      data: {
        userId: seller.id,
        title: listing.title,
        description: listing.description,
        price: listing.price,
        currency: 'PKR',
        makeId: make.id,
        modelId: model.id,
        year: listing.year,
        mileage: listing.mileage,
        fuelType: listing.fuelType,
        transmission: listing.transmission,
        bodyType: listing.bodyType,
        color: listing.color,
        condition: listing.condition,
        cityId: city.id,
        status: 'ACTIVE',
        isFeatured: listing.isFeatured,
        viewsCount: randInt(50, 2000),
      },
    })
    created++
  }

  console.log(`  ✓ ${created} listings created`)
}

async function seedDealerProfile() {
  console.log('Seeding supplier profile...')

  const dealer = await prisma.user.findUnique({ where: { email: 'dealer@cncmachinebazaar.com' } })
  if (!dealer) {
    console.log('  ⚠ Dealer user not found, skipping')
    return
  }

  const existingDealer = await prisma.dealer.findUnique({ where: { userId: dealer.id } })
  if (existingDealer) {
    console.log('  · Supplier profile already exists, skipping')
    return
  }

  const lahore = await prisma.city.findFirst({ where: { name: 'Lahore' } })
  if (!lahore) return

  await prisma.dealer.create({
    data: {
      userId: dealer.id,
      name: 'Pakistan CNC Solutions',
      slug: 'pakistan-cnc-solutions',
      address: '45-B Industrial Area, Multan Road',
      cityId: lahore.id,
      phone: '+92-300-1234567',
      whatsapp: '+923001234567',
      description: 'Leading supplier of CNC machines, laser cutters, and industrial equipment in Pakistan. Authorized dealer for Haas, Mazak, and DMG Mori. We offer sales, service, and spare parts for all major brands.',
      isVerified: true,
    },
  })

  console.log('  ✓ Supplier profile created (Pakistan CNC Solutions)')
}

async function seedBlogPosts() {
  console.log('Seeding blog posts...')

  const existingCount = await prisma.blogPost.count()
  if (existingCount > 0) {
    console.log(`  · ${existingCount} blog posts already exist, skipping`)
    return
  }

  const admin = await prisma.user.findUnique({ where: { email: 'admin@cncmachinebazaar.com' } })
  if (!admin) {
    console.log('  ⚠ Admin user not found, skipping blog posts')
    return
  }

  const posts = [
    {
      title: 'Top 5 CNC Machines for Small Workshops in 2024',
      slug: 'top-5-cnc-machines-small-workshops-2024',
      excerpt: 'Starting a CNC workshop? Here are the best machines that balance performance, reliability, and cost for small-scale operations in Pakistan.',
      body: `## Introduction\n\nStarting a CNC workshop in Pakistan can be both exciting and overwhelming. With so many options available, choosing the right machine is crucial for your success.\n\n## 1. Haas Mini Mill\n\nThe Haas Mini Mill is the perfect entry point. Compact footprint, reliable performance, and Haas's excellent support network make it ideal for beginners.\n\n**Price Range:** PKR 3.5M - 5M (used)\n\n## 2. Doosan DNM 500\n\nGreat value for money. The Fanuc control is industry-standard and operators can learn quickly.\n\n## 3. Brother Speedio S300X2\n\nUltra-fast tool changes make this machine incredibly productive for small parts.\n\n## 4. Hurco VM20i\n\nThe conversational programming on Hurco machines means you don't need a full-time programmer.\n\n## 5. Fanuc Robodrill\n\nFor high-volume small parts, nothing beats the Robodrill's speed and precision.\n\n## Conclusion\n\nAll five machines are excellent choices. Your decision should depend on the type of work you plan to do, your budget, and the availability of service support in your area.`,
      category: 'Buying Guide',
      tags: ['CNC', 'Workshop', 'Buying Guide', 'Small Business'],
    },
    {
      title: 'Fiber Laser vs CO2 Laser: Which One Should You Buy?',
      slug: 'fiber-laser-vs-co2-laser-comparison',
      excerpt: 'A detailed comparison of fiber and CO2 laser cutting technologies to help you make the right investment decision for your metal fabrication shop.',
      body: `## The Laser Cutting Revolution\n\nLaser cutting has transformed metal fabrication. But choosing between fiber and CO2 technology can be confusing.\n\n## Fiber Laser Advantages\n\n- **3x faster** on thin metals (under 6mm)\n- **50% lower** operating costs\n- **Minimal maintenance** — no mirrors, no gas\n- Better at cutting reflective metals (brass, copper, aluminum)\n\n## CO2 Laser Advantages\n\n- Better edge quality on **thick materials** (20mm+)\n- Can cut **non-metals** (wood, acrylic, fabric)\n- Lower initial cost for basic systems\n\n## Our Recommendation\n\nFor most Pakistani metal fabrication shops, a **fiber laser** is the better investment in 2024. The lower running costs and higher productivity will pay for themselves quickly.`,
      category: 'Technology',
      tags: ['Laser', 'Fiber Laser', 'CO2', 'Metal Fabrication'],
    },
    {
      title: 'How to Import CNC Machines from China: Complete Guide',
      slug: 'import-cnc-machines-china-guide',
      excerpt: 'Everything you need to know about importing CNC machines from China to Pakistan — from sourcing and inspection to shipping and customs clearance.',
      body: `## Why Import from China?\n\nChina offers competitive pricing on CNC machines, often 30-50% cheaper than US/European equivalents.\n\n## Step 1: Sourcing\n\nUse Alibaba, Made-in-China, or attend Canton Fair. Always verify suppliers.\n\n## Step 2: Factory Inspection\n\nNever skip this step. Hire a local inspection agent or visit personally.\n\n## Step 3: Shipping\n\nCNC machines typically ship via sea freight. Budget 4-6 weeks for delivery to Karachi port.\n\n## Step 4: Customs\n\nCNC machines fall under HS code 8456-8465. Current duty rates are 5-10% depending on the specific machine type.\n\n## Step 5: Installation\n\nHire a qualified technician for installation and commissioning. Many Chinese manufacturers offer remote support via video call.\n\n## Key Tips\n\n- Always get a machine demo video before ordering\n- Negotiate warranty and spare parts supply\n- Factor in 15-20% above machine cost for total landed cost`,
      category: 'Import Guide',
      tags: ['Import', 'China', 'Guide', 'Customs'],
    },
  ]

  for (const post of posts) {
    await prisma.blogPost.create({
      data: {
        authorId: admin.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        body: post.body,
        category: post.category,
        tags: post.tags,
        status: 'PUBLISHED',
        publishedAt: new Date(),
        viewsCount: randInt(100, 5000),
      },
    })
  }

  console.log(`  ✓ ${posts.length} blog posts created`)
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n── CNC Machine Bazaar Seed ──────────────────────────────')
  await seedMakesAndModels()
  await seedCities()
  await seedTestUsers()
  await seedDummyListings()
  await seedDealerProfile()
  await seedBlogPosts()
  console.log('── Done ──────────────────────────────────────────────────\n')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
