import { useState } from 'react';
import { Link } from 'react-router';

import { forgotPassword } from '../../services/authService';

import './ForgotPassword.css';

function getForgotPasswordErrorMessage(error) {
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

  return 'Não foi possível solicitar a recuperação de senha.';
}

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccessMessage('');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const response = await forgotPassword({
        email: email.trim(),
      });

      setSuccessMessage(
        response.message ||
          'Se o email estiver cadastrado, enviaremos instruções para redefinir sua senha.'
      );

      setEmail('');
    } catch (error) {
      setErrorMessage(getForgotPasswordErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-card">
        <Link to="/" className="forgot-password-card__logo">
          <span className="forgot-password-card__logo-icon">⌬</span>
          <span>
            DevBug <strong>Tracker</strong>
          </span>
        </Link>

        <span className="forgot-password-card__tag">Recuperação de acesso</span>

        <h1>Esqueceu sua senha?</h1>

        <p>
          Informe o email cadastrado na sua conta. Se ele estiver registrado,
          enviaremos um link para você criar uma nova senha.
        </p>

        <form className="forgot-password-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="forgot-password-form__error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="forgot-password-form__success" role="status">
              {successMessage}
            </div>
          )}

          <div className="forgot-password-form__group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="button button--primary forgot-password-form__button"
            disabled={isLoading}
          >
            {isLoading ? 'Enviando...' : 'Enviar link de recuperação'}
          </button>
        </form>

        <p className="forgot-password-card__footer">
          Lembrou sua senha? <Link to="/login">Voltar para o login</Link>
        </p>
      </section>
    </main>
  );
}

export default ForgotPassword;