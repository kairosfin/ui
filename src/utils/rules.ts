export const rules = {
  required: (v: string) => !!v || 'Campo obrigatório',
  email: (v: string) => /.+@.+\..+/.test(v) || 'E-mail inválido',
  minLen: (v: string) => v.length >= 6 || 'Mínimo 6 caracteres',
  terms: (v: boolean) => !!v || 'Você deve aceitar os termos',
  cpf: (v: string) => v.length === 14 || 'CPF incompleto',
  phone: (v: string) => v.length >= 14 || 'Telefone incompleto',
  date: (v: string) => v.length === 10 || 'Data incompleta',
}
