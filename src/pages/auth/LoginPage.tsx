import React, { useState } from 'react';
import { Heart, LoaderCircle, Shield } from 'lucide-react';
import { authService } from '../../services/auth.service';
import { inputClassName } from '../../components/shared/ui';

export const LoginPage = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [twoFactorRequired, setTwoFactorRequired] = useState(false);
  const [twoFactorMessage, setTwoFactorMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const resetTwoFactor = () => {
    setTwoFactorRequired(false);
    setTwoFactorCode('');
    setTwoFactorMessage('');
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authService.login(
        email,
        password,
        twoFactorRequired ? twoFactorCode : undefined,
      );
      if ('twoFactorRequired' in data) {
        setTwoFactorRequired(true);
        setTwoFactorMessage(
          data.devCode
            ? `${data.message}. Codigo temporal local: ${data.devCode}`
            : data.message,
        );
        return;
      }
      onLogin(data.user);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No se pudo iniciar sesion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-lg bg-teal-600">
            <Heart className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">MenteAmiga-AI</h1>
          <p className="mt-1 text-sm text-slate-500">Panel de super administracion</p>
        </div>
        {error ? <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}
        {twoFactorMessage ? <div className="mb-4 rounded-lg bg-sky-50 p-3 text-sm text-sky-700">{twoFactorMessage}</div> : null}
        <form onSubmit={submit} className="space-y-4">
          <input value={email} onChange={(event) => { setEmail(event.target.value); resetTwoFactor(); }} placeholder="Email" className={inputClassName} />
          <input type="password" value={password} onChange={(event) => { setPassword(event.target.value); resetTwoFactor(); }} placeholder="Contrasena" className={inputClassName} />
          {twoFactorRequired ? (
            <input
              value={twoFactorCode}
              onChange={(event) => setTwoFactorCode(event.target.value)}
              placeholder="Codigo de doble verificacion"
              className={inputClassName}
            />
          ) : null}
          <button disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-teal-600 px-4 py-3 font-medium text-white hover:bg-teal-700 disabled:opacity-60">
            {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
            {twoFactorRequired ? 'Verificar codigo' : 'Iniciar sesion'}
          </button>
        </form>
      </div>
    </div>
  );
};
