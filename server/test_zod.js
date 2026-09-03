const { z } = require('zod');

const createTravelSchema = z.object({
  travelPurpose: z.string().min(1),
  destination: z.string().min(1),
  startDate: z.string(),
  endDate: z.string(),
  travelMode: z.enum(['AIR', 'TRAIN', 'ROAD', 'OWN_VEHICLE']),
  advanceRequested: z.number().optional(),
  billUpload: z.string().optional()
});

const payload = {
  travelPurpose: 'Meeting',
  destination: 'NYC',
  startDate: new Date().toISOString(),
  endDate: new Date().toISOString(),
  travelMode: 'AIR',
  advanceRequested: 0,
  billUpload: ''
};

try {
  createTravelSchema.parse(payload);
  console.log("Success");
} catch (e) {
  console.log(e.errors);
}
