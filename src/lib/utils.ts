import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
  // This is a common function people do to combine conditional classes with Tailwind classes
  return twMerge(clsx(inputs))
}

export const getTerrainType = (terrain: string) => {
  // This function is created to check if the 'terrain' string passed as argument includes any of the given words in the array
  const checkTerrainString = (words: string[]) => words.some(str => terrain.includes(str))

  // I check with the previously created function each keyword there could be in the 'terrain' field to separate in types
  if (checkTerrainString(['gas', 'air'])) return 'air'
  if (checkTerrainString(['city', 'urban', 'cities'])) return 'city'
  if (checkTerrainString(['forest', 'jungle', 'swamp', 'grass', 'plain', 'hill', 'bog', 'acid', 'vine', 'verdant']))
    return 'greens'
  if (
    checkTerrainString([
      'mountain',
      'cave',
      'volcano',
      'rock',
      'canyon',
      'scrubland',
      'sinkhole',
      'mesa',
      'valley',
      'plateau',
      'cliff',
    ])
  )
    return 'land'
  if (checkTerrainString(['desert', 'field', 'barren', 'ash', 'savanna', 'island'])) return 'arid'
  if (checkTerrainString(['tundra', 'ice', 'glacier'])) return 'ice'
  if (checkTerrainString(['ocean', 'lake', 'river', 'sea', 'reef'])) return 'water'
  return ''
}
