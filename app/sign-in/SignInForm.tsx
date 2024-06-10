'use client'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { useTranslations } from 'next-intl'
import { z } from 'zod'
import { Button } from '@stanfordbdhg/design-system/components/Button'
import { Input } from '@stanfordbdhg/design-system/components/Input'
import {
  Separator,
  SeparatorText,
} from '@stanfordbdhg/design-system/components/Separator'
import { Field } from '@stanfordbdhg/design-system/forms/Field'
import { useForm } from '@stanfordbdhg/design-system/forms/useForm'
import { auth, authProvider } from '../../modules/firebase/clientApp'

const formSchema = z.object({
  email: z.string().min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
})

export const SignInForm = () => {
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
    <div className="mx-auto grid w-[350px] gap-4">
      <h1 className="mb-4 text-center text-2xl font-bold">{t('signIn')}</h1>
      <Button
        variant="outlineBg"
        onClick={() => signInWithPopup(auth, authProvider.apple)}
      >
        {t('signIn_apple')}
      </Button>
      <Button
        variant="outlineBg"
        onClick={() => signInWithPopup(auth, authProvider.stanford)}
      >
        {t('signIn_stanford')}
      </Button>
      <Separator className="my-5">
        <SeparatorText>{t('signIn_separator')}</SeparatorText>
      </Separator>
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
    </div>
  )
}
