export const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  minLen: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
  terms: (v: boolean) => !!v || 'Você deve aceitar os termos',
  cpf: (v: string) => v.length === 14 || 'CPF incompleto',
  phone: (v: string) => v.length >= 14 || 'Telefone incompleto',

  date: (v: string) => {
    if (!v || v.length !== 10) return 'Data incompleta'

    const [day, month, year] = v.split('/').map(Number)

    const currentYear = new Date().getFullYear()
    if (year! < 1900 || year! > currentYear) return 'Ano inválido'

    if (month! < 1 || month! > 12) return 'Mês inválido'

    const dateObj = new Date(year!, month! - 1, day)

    if (dateObj.getMonth() !== month! - 1 || dateObj.getDate() !== day) {
      return 'Dia inválido para este mês'
    }

    if (dateObj > new Date()) return 'Data não pode ser futura'

    return true
  },
}
