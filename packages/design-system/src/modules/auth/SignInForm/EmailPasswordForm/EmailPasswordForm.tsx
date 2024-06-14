import { type Auth, signInWithEmailAndPassword } from 'firebase/auth'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { Button } from '../../../../components/Button'
import { Input } from '../../../../components/Input'
import { Field } from '../../../../forms/Field'
import { useForm } from '../../../../forms/useForm'

const formSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

interface EmailPasswordFormProps {
  auth: Auth
}

export const EmailPasswordForm = ({ auth }: EmailPasswordFormProps) => {
  const t = useTranslations()
  const form = useForm({
    formSchema,
    defaultValues: { email: '', password: '' },
  })

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error) {
      if (
        error instanceof Error &&
        'code' in error &&
        error.code === 'auth/invalid-credential'
      ) {
        form.setFormError(t('signIn_formError_invalidCredentials'))
      } else {
        form.setFormError(t('signIn_formError_unknown'))
      }
    }
  })

  return (
    <form className="grid" onSubmit={handleSubmit}>
      <Field
        control={form.control}
        name="email"
        label={t('signIn_field_email')}
        render={({ field }) => (
          <Input type="email" placeholder="mail@example.com" {...field} />
        )}
      />
      <Field
        control={form.control}
        name="password"
        label={t('signIn_field_password')}
        render={({ field }) => <Input type="password" {...field} />}
        error={form.formError}
      />
      <Button type="submit">{t('signIn_submit')}</Button>
    </form>
  )
}
