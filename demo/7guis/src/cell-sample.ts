export const sampleData: Record<string, string> = {
  A0: 'Data',
  A1: '20',
  A2: '15',
  A3: 'text',
  B1: '79',
  B2: '3.9',
  A5: 'Formula',
  B5: 'Output',
  B6: '=D1+D5',
  B7: '=A1-B2',
  B8: '=D1*D5',
  B9: '=A1/B2',
  B10: '=A1%B2',
  C0: 'Formula',
  D0: 'Output',
  D1: '=A1+A2',
  D2: '=D1-A1',
  D3: '=D2*A2',
  D4: '=D3/A1',
  D5: '=A1%A2',
  D7: '=A1+A3',
  D8: '=A1+A4',
  D9: '=A1+A4',
  D10: '=A1+A4',
  D11: '=A1+307',
  D12: '=159+4',
  D14: '=A1',
  D15: '=A3',
  E1: '10',
  E2: '=E1*2',
  E3: '=E2*2',
  E4: '=E3*2',
  E5: '=E4*2',
}

export const bmiData: Record<string, string> = {
  A1: 'Weight (kg)',
  B1: '70', // Example weight in kilograms
  A2: 'Height (cm)',
  B2: '175', // Example height in centimeters
  A3: 'Height (m)',
  B3: '=B2/100', // Convert height from cm to m
  A4: 'BMI',
  B4: '=B1*1/B3*1/B3', // BMI calculation formula
}