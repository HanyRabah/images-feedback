// scripts/generate-hash.ts
import bcrypt from 'bcryptjs'

async function generateHash() {
  const password = 'admin1234'
  const hash = await bcrypt.hash(password, 10)
  console.log('Password:', password)
  console.log('Hash:', hash)
}

generateHash()