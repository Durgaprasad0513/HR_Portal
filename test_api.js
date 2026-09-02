const axios = require('axios');
async function test() {
  try {
    // We need to login to get a token. Or just call the service directly!
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    const user = await prisma.user.findFirst();
    
    // Call the service
    const { recruitmentService } = require('./server/src/modules/recruitment/recruitment.service.js');
    // wait, it's TS! We can't require TS from JS easily without ts-node.
    console.log("TS");
  } catch (e) {
    console.error(e);
  }
}
test();
