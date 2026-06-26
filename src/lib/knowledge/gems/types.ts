export interface GemKnowledge {
  name: string
  group: string
  properties: {
    ri: string
    birefringence: string
    sg: string
    mohs: number | string
    crystal: string
    optical: string
  }
  chromophore: string
  ccf: string
  uv: {
    lwuv: string
    swuv: string
    synthetic?: string
  }
  spectroscope: string
  inclusions: string[]
  treatments: string[]
  origins: string[]
  syntheticDetection: string
  simulants: string
  care: string
  description: string
}
