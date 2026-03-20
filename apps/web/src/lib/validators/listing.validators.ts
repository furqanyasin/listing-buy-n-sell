import { z } from 'zod'

const CURRENT_YEAR = new Date().getFullYear()

export const listingStep1Schema = z.object({
  makeId: z.string().min(1, 'Brand is required'),
  modelId: z.string().min(1, 'Model is required'),
  year: z
    .number({ invalid_type_error: 'Year is required' })
    .int()
    .min(1970, 'Year must be 1970 or later')
    .max(CURRENT_YEAR + 1, 'Year cannot be in the future'),
  condition: z.enum(['NEW', 'USED'], { required_error: 'Condition is required' }),
  bodyType: z.enum(
    ['CNC_MILL', 'CNC_LATHE', 'LASER_CUTTER', 'CNC_ROUTER', 'PRESS_BRAKE', 'WATERJET', 'PLASMA_CUTTER', 'PRINTER_3D'],
    { required_error: 'Machine type is required' },
  ),
  fuelType: z.enum(['ELECTRIC', 'HYDRAULIC', 'PNEUMATIC', 'DIESEL', 'MANUAL'], {
    required_error: 'Power type is required',
  }),
  transmission: z.enum(['AUTOMATIC', 'MANUAL'], { required_error: 'Control type is required' }),
  mileage: z
    .number({ invalid_type_error: 'Running hours is required' })
    .int()
    .min(0, 'Running hours cannot be negative'),
  color: z.string().min(1, 'Color is required').max(50),
})

export const listingStep2Schema = z.object({
  title: z
    .string()
    .min(10, 'Title must be at least 10 characters')
    .max(200, 'Title is too long'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(5000, 'Description is too long'),
  price: z
    .number({ invalid_type_error: 'Price is required' })
    .positive('Price must be positive'),
  cityId: z.string().min(1, 'City is required'),
  locationText: z.string().max(200).optional(),
})

export const listingFullSchema = listingStep1Schema.merge(listingStep2Schema)

export type ListingStep1Data = z.infer<typeof listingStep1Schema>
export type ListingStep2Data = z.infer<typeof listingStep2Schema>
export type ListingFormData = z.infer<typeof listingFullSchema>
