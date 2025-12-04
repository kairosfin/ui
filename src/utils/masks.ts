export const masks = {
  // Formata: 000.000.000-00
  cpf(value: string): string {
    value = value.replace(/\D/g, '') // Remove tudo que não é dígito
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    return value
  },

  // Formata: (00) 00000-0000
  phone(value: string): string {
    value = value.replace(/\D/g, '')
    value = value.replace(/^(\d{2})(\d)/g, '($1) $2')
    value = value.replace(/(\d)(\d{4})$/, '$1-$2')
    return value
  },

  // Formata: dd/mm/aaaa
  date(value: string): string {
    value = value.replace(/\D/g, '')
    if (value.length > 2) value = value.substring(0, 2) + '/' + value.substring(2)
    if (value.length > 5) value = value.substring(0, 5) + '/' + value.substring(5, 9)
    return value
  },
}

// Helper para usar direto no @input
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMask(maskFunction: (v: string) => string, event: Event, modelRef: any) {
  const input = event.target as HTMLInputElement
  const newValue = maskFunction(input.value)

  // Atualiza o valor visualmente e no modelo
  input.value = newValue
  modelRef.value = newValue
}
