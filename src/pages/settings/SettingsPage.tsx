import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, KeyRound, Mail, ShieldCheck } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { settingsService } from '../../services/settings.service';
import {
  Badge,
  ErrorBox,
  Field,
  inputClassName,
  Loading,
  PageHeader,
} from '../../components/shared/ui';
import type { AdminSettings, AuthProfile } from '../../types/admin';

const defaultSettings: AdminSettings = {
  platformName: '',
  baseUrl: '',
  timezone: '',
  language: 'es',
  dailyLimit: 0,
  monthlyLimit: 0,
};

const getErrorMessage = (error: unknown, fallback: string) => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response
  ) {
    const data = error.response.data as { message?: string };
    return data.message || fallback;
  }

  return fallback;
};

const passwordStrength = (value: string) => {
  let score = 0;
  if (value.length >= 10) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[a-z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;

  if (score >= 5) return { label: 'Fuerte', tone: 'success' as const };
  if (score >= 3) return { label: 'Aceptable', tone: 'warning' as const };
  return { label: 'Debil', tone: 'danger' as const };
};

export const SettingsPage = () => {
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [profile, setProfile] = useState<AuthProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [emailForm, setEmailForm] = useState({
    currentPassword: '',
    newEmail: '',
    code: '',
    requested: false,
  });
  const [twoFactorForm, setTwoFactorForm] = useState({
    currentPassword: '',
    method: 'email' as 'email' | 'sms',
    code: '',
    requested: false,
  });

  const strength = useMemo(
    () => passwordStrength(passwordForm.newPassword),
    [passwordForm.newPassword],
  );

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      setMessage('');
      const [nextSettings, nextProfile] = await Promise.all([
        settingsService.get(),
        authService.getProfile(),
      ]);
      setSettings((prev) => ({ ...prev, ...nextSettings }));
      setProfile(nextProfile);
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'No se pudo cargar configuracion'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const saveSettings = async () => {
    try {
      setSaving(true);
      setMessage('');
      await settingsService.update(settings);
      setMessage('Configuracion guardada correctamente');
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo guardar configuracion'));
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setMessage('La confirmacion de contrasena no coincide');
      return;
    }

    try {
      setWorking(true);
      const response = await authService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setMessage(response.message || 'Contrasena actualizada correctamente');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo cambiar la contrasena'));
    } finally {
      setWorking(false);
    }
  };

  const requestEmailChange = async () => {
    try {
      setWorking(true);
      const response = await authService.requestEmailChange({
        currentPassword: emailForm.currentPassword,
        newEmail: emailForm.newEmail,
      });
      setEmailForm((prev) => ({ ...prev, requested: true }));
      setMessage(
        response.devCode
          ? `${response.message}. Codigo temporal local: ${response.devCode}`
          : response.message,
      );
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo iniciar el cambio de correo'));
    } finally {
      setWorking(false);
    }
  };

  const confirmEmailChange = async () => {
    try {
      setWorking(true);
      const response = await authService.confirmEmailChange(emailForm.code);
      setProfile(response.user);
      setEmailForm({ currentPassword: '', newEmail: '', code: '', requested: false });
      setMessage(response.message || 'Correo actualizado correctamente');
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo confirmar el correo'));
    } finally {
      setWorking(false);
    }
  };

  const requestTwoFactor = async () => {
    try {
      setWorking(true);
      const response = await authService.requestTwoFactor({
        currentPassword: twoFactorForm.currentPassword,
        method: twoFactorForm.method,
      });
      setTwoFactorForm((prev) => ({ ...prev, requested: true }));
      setMessage(
        response.devCode
          ? `${response.message}. Codigo temporal local: ${response.devCode}`
          : response.message,
      );
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo iniciar doble verificacion'));
    } finally {
      setWorking(false);
    }
  };

  const confirmTwoFactor = async () => {
    try {
      setWorking(true);
      const response = await authService.confirmTwoFactor(twoFactorForm.code);
      setProfile(response.user);
      setTwoFactorForm({
        currentPassword: '',
        method: 'email',
        code: '',
        requested: false,
      });
      setMessage(response.message || 'Doble verificacion activada');
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo activar doble verificacion'));
    } finally {
      setWorking(false);
    }
  };

  const disableTwoFactor = async () => {
    try {
      setWorking(true);
      const response = await authService.disableTwoFactor(
        twoFactorForm.currentPassword,
      );
      setProfile(response.user);
      setMessage(response.message || 'Doble verificacion desactivada');
    } catch (err: unknown) {
      setMessage(getErrorMessage(err, 'No se pudo desactivar doble verificacion'));
    } finally {
      setWorking(false);
    }
  };

  if (loading) return <Loading label="Cargando configuracion..." />;
  if (error) return <ErrorBox message={error} onRetry={load} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Configuracion y seguridad"
        description="Parametros de plataforma, cuenta administrativa y controles de acceso."
      />

      {message ? (
        <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700">
          {message}
        </div>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Cuenta admin</p>
          <p className="mt-2 font-semibold text-slate-950">{profile?.email || 'No disponible'}</p>
          <p className="mt-1 text-xs text-slate-500">Rol: {profile?.role || 'sin confirmar'}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Correo verificado</p>
          <div className="mt-2">
            <Badge tone={profile?.isEmailVerified ? 'success' : 'warning'}>
              {profile?.isEmailVerified ? 'Verificado' : 'Pendiente'}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-slate-500">Los cambios de correo requieren codigo antes de aplicarse.</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-medium text-slate-600">Doble verificacion</p>
          <div className="mt-2">
            <Badge tone={profile?.twoFactorEnabled ? 'success' : 'danger'}>
              {profile?.twoFactorEnabled ? 'Activa' : 'Inactiva'}
            </Badge>
          </div>
          <p className="mt-2 text-xs text-slate-500">Recomendado para todas las cuentas con acceso administrativo.</p>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-teal-600" />
          <div>
            <h2 className="font-semibold text-slate-900">Datos de la plataforma</h2>
            <p className="text-sm text-slate-500">
              Configuracion global usada por paneles y limites operativos.
            </p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre de plataforma">
            <input value={settings.platformName || ''} onChange={(event) => setSettings({ ...settings, platformName: event.target.value })} className={inputClassName} />
          </Field>
          <Field label="URL base">
            <input value={settings.baseUrl || ''} onChange={(event) => setSettings({ ...settings, baseUrl: event.target.value })} className={inputClassName} />
          </Field>
          <Field label="Zona horaria">
            <input value={settings.timezone || ''} onChange={(event) => setSettings({ ...settings, timezone: event.target.value })} className={inputClassName} />
          </Field>
          <Field label="Idioma">
            <select value={settings.language || 'es'} onChange={(event) => setSettings({ ...settings, language: event.target.value })} className={inputClassName}>
              <option value="es">Espanol</option>
              <option value="en">English</option>
              <option value="pt">Portugues</option>
            </select>
          </Field>
          <Field label="Limite diario">
            <input type="number" value={settings.dailyLimit || 0} onChange={(event) => setSettings({ ...settings, dailyLimit: Number(event.target.value) })} className={inputClassName} />
          </Field>
          <Field label="Limite mensual">
            <input type="number" value={settings.monthlyLimit || 0} onChange={(event) => setSettings({ ...settings, monthlyLimit: Number(event.target.value) })} className={inputClassName} />
          </Field>
        </div>
        <button disabled={saving} onClick={() => void saveSettings()} className="mt-5 rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Cambiar contrasena</h2>
              <p className="text-sm text-slate-500">
                Usa una contrasena larga y unica para esta cuenta administrativa.
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Field label="Contrasena actual">
              <input type="password" value={passwordForm.currentPassword} onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })} className={inputClassName} />
            </Field>
            <Field label="Nueva contrasena">
              <input type="password" value={passwordForm.newPassword} onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })} className={inputClassName} />
            </Field>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              Fortaleza: <Badge tone={strength.tone}>{strength.label}</Badge>
            </div>
            <Field label="Confirmar nueva contrasena">
              <input type="password" value={passwordForm.confirmPassword} onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })} className={inputClassName} />
            </Field>
            <button disabled={working} onClick={() => void changePassword()} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">
              Actualizar contrasena
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <Mail className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Cambiar correo</h2>
              <p className="text-sm text-slate-500">
                Correo actual: {profile?.email || 'No disponible'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <Field label="Contrasena actual">
              <input type="password" value={emailForm.currentPassword} onChange={(event) => setEmailForm({ ...emailForm, currentPassword: event.target.value })} className={inputClassName} />
            </Field>
            <Field label="Nuevo correo">
              <input type="email" value={emailForm.newEmail} onChange={(event) => setEmailForm({ ...emailForm, newEmail: event.target.value })} className={inputClassName} />
            </Field>
            <button disabled={working} onClick={() => void requestEmailChange()} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">
              Enviar codigo
            </button>
            {emailForm.requested ? (
              <div className="space-y-3 rounded-lg bg-slate-50 p-4">
                <Field label="Codigo recibido">
                  <input value={emailForm.code} onChange={(event) => setEmailForm({ ...emailForm, code: event.target.value })} className={inputClassName} />
                </Field>
                <button disabled={working} onClick={() => void confirmEmailChange()} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white disabled:opacity-60">
                  Confirmar cambio
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-teal-600" />
            <div>
              <h2 className="font-semibold text-slate-900">Autenticacion en dos pasos</h2>
              <p className="text-sm text-slate-500">
                Protege el acceso admin con un codigo adicional.
              </p>
            </div>
          </div>
          <Badge tone={profile?.twoFactorEnabled ? 'success' : 'warning'}>
            {profile?.twoFactorEnabled ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Contrasena actual">
            <input type="password" value={twoFactorForm.currentPassword} onChange={(event) => setTwoFactorForm({ ...twoFactorForm, currentPassword: event.target.value })} className={inputClassName} />
          </Field>
          <Field label="Metodo">
            <select value={twoFactorForm.method} onChange={(event) => setTwoFactorForm({ ...twoFactorForm, method: event.target.value as 'email' | 'sms' })} className={inputClassName}>
              <option value="email">Correo</option>
              <option value="sms">SMS</option>
            </select>
          </Field>
          <div className="flex items-end gap-2">
            <button disabled={working} onClick={() => void requestTwoFactor()} className="rounded-lg bg-teal-600 px-4 py-2.5 text-sm text-white disabled:opacity-60">
              Enviar codigo
            </button>
            {profile?.twoFactorEnabled ? (
              <button disabled={working} onClick={() => void disableTwoFactor()} className="rounded-lg border border-red-200 px-4 py-2.5 text-sm text-red-700 disabled:opacity-60">
                Desactivar
              </button>
            ) : null}
          </div>
        </div>
        {twoFactorForm.requested ? (
          <div className="mt-4 max-w-md space-y-3 rounded-lg bg-slate-50 p-4">
            <Field label="Codigo de verificacion">
              <input value={twoFactorForm.code} onChange={(event) => setTwoFactorForm({ ...twoFactorForm, code: event.target.value })} className={inputClassName} />
            </Field>
            <button disabled={working} onClick={() => void confirmTwoFactor()} className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm text-white disabled:opacity-60">
              Activar doble verificacion
            </button>
          </div>
        ) : null}
        <p className="mt-4 text-xs text-slate-500">
          Correo/SMS quedan preparados para proveedor externo. En desarrollo el backend devuelve un codigo temporal para pruebas locales.
        </p>
      </section>
    </div>
  );
};
