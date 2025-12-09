import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("📅 Updating all theft case dates to 2025...")

  // Get all theft cases
  const cases = await prisma.theftCase.findMany({
    orderBy: { theftDate: 'asc' },
  })

  console.log(`Found ${cases.length} theft cases to update`)

  // Update dates to 2025 (spread across different months)
  const updates = [
    { month: 0, day: 15 },  // January 2025
    { month: 1, day: 20 },  // February 2025
    { month: 2, day: 10 },  // March 2025
    { month: 3, day: 5 },   // April 2025
    { month: 4, day: 12 },  // May 2025
    { month: 5, day: 18 },  // June 2025
    { month: 6, day: 22 },  // July 2025
    { month: 7, day: 30 },  // August 2025
    { month: 8, day: 14 },  // September 2025
    { month: 9, day: 8 },   // October 2025
    { month: 10, day: 25 }, // November 2025
    { month: 11, day: 5 },  // December 2025
  ]

  for (let i = 0; i < cases.length; i++) {
    const caseItem = cases[i]
    const update = updates[i % updates.length]
    
    const newDate = new Date(2025, update.month, update.day)
    
    await prisma.theftCase.update({
      where: { id: caseItem.id },
      data: {
        theftDate: newDate,
        // Update recoveredDate if it exists
        ...(caseItem.recoveredDate && {
          recoveredDate: new Date(2025, update.month, update.day + 10)
        })
      },
    })
    
    console.log(`✅ Updated case ${i + 1}: ${caseItem.location} → ${newDate.toLocaleDateString('fr-FR')}`)
  }

  // Show distribution by month
  console.log('\n📊 Distribution by month:')
  const casesByMonth = await prisma.$queryRaw`
    SELECT 
      EXTRACT(MONTH FROM "theftDate") as month,
      COUNT(*) as count
    FROM "theft_cases"
    WHERE EXTRACT(YEAR FROM "theftDate") = 2025
    GROUP BY EXTRACT(MONTH FROM "theftDate")
    ORDER BY month
  `
  
  console.log(casesByMonth)

  // Show distribution by brand
  console.log('\n📊 Distribution by brand:')
  const casesByBrand = await prisma.$queryRaw`
    SELECT 
      v.brand,
      COUNT(*) as count
    FROM "theft_cases" tc
    JOIN "vehicles" v ON tc."vehicleId" = v.id
    WHERE EXTRACT(YEAR FROM tc."theftDate") = 2025
    GROUP BY v.brand
    ORDER BY count DESC
  `
  
  console.log(casesByBrand)

  console.log('\n✅ All dates updated to 2025!')
}

main()
  .catch((e) => {
    console.error("❌ Error:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
