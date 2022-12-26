export function truncateAddress(address: string): string {
  const prefix = address.slice(2, 6)
  const suffix = address.slice(address.length-5, address.length)
  return `0x${prefix}...${suffix}`
}