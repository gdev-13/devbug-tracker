import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { resetPassword } from '../../services/authService';

import './ResetPassword.css';

const initialFormData = {
  newPassword: '',
  confirmPassword: '',
};

function getResetPasswordErrorMessage(error) {
  const fields = error.response?.data?.fields;

  if (fields) {
    return Object.values(fields)[0];
  }

  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
  }

  return 'Não foi possível redefinir sua senha.';
}

function ResetPassword() {
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState(initialFormData);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');

    if (!token) {
      setErrorMessage('Token de recuperação não informado.');
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrorMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await resetPassword({
        token,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccessMessage(response.message || 'Senha redefinida com sucesso.');
      setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(getResetPasswordErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="reset-password-page">
      <section className="reset-password-card">
        <Link to="/" className="reset-password-card__logo">
          <span className="reset-password-card__logo-icon">⌬</span>
          <span>
            DevBug <strong>Tracker</strong>
          </span>
        </Link>

        <span className="reset-password-card__tag">Nova senha</span>

        <h1>Redefina sua senha.</h1>

        <p>
          Crie uma nova senha para recuperar o acesso à sua conta no DevBug
          Tracker.
        </p>

        <form className="reset-password-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="reset-password-form__error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="reset-password-form__success" role="status">
              {successMessage}
            </div>
          )}

          <div className="reset-password-form__group">
            <label htmlFor="newPassword">Nova senha</label>

            <input
              id="newPassword"
              name="newPassword"
              type="password"
              placeholder="Digite a nova senha"
              autoComplete="new-password"
              value={formData.newPassword}
              onChange={handleChange}
              disabled={!token || Boolean(successMessage)}
              required
            />
          </div>

          <div className="reset-password-form__group">
            <label htmlFor="confirmPassword">Confirmar senha</label>

            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Repita a nova senha"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={!token || Boolean(successMessage)}
              required
            />
          </div>

          <button
            type="submit"
            className="button button--primary reset-password-form__button"
            disabled={isLoading || !token || Boolean(successMessage)}
          >
            {isLoading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </form>

        <p className="reset-password-card__footer">
          {successMessage ? (
            <Link to="/login">Entrar com a nova senha</Link>
          ) : (
            <>
              Lembrou sua senha? <Link to="/login">Voltar para o login</Link>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

export default ResetPassword;