import { useState } from 'react';
import { Link } from 'react-router';

import { registerUser } from '../../services/authService';

import './Register.css';

const initialFormData = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
};

function getRegisterErrorMessage(error) {
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

  return 'Não foi possível criar a conta. Verifique os dados informados.';
}

function Register() {

  const [formData, setFormData] = useState(initialFormData);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErrorMessage('');
    setSuccessMessage('');

    if (formData.name.trim().length < 3) {
      setErrorMessage('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
    });

    setSuccessMessage(
      response.message ||
        'Cadastro realizado com sucesso. Verifique seu email para ativar sua conta.'
    );

    setFormData(initialFormData);
    } catch (error) {
      setErrorMessage(getRegisterErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="register-page">
      <section className="register-card">
        <div className="register-card__brand">
          <Link to="/" className="register-card__logo">
            <span className="register-card__logo-icon">⌬</span>
            <span>
              DevBug <strong>Tracker</strong>
            </span>
          </Link>

          <Link to="/" className="register-card__back">
            Voltar para início
          </Link>
        </div>

        <div className="register-card__header">
          <span className="register-card__tag">Crie sua conta</span>

          <h1>Comece a organizar seus bugs.</h1>

          <p>
            Cadastre-se para criar projetos, registrar bugs, documentar soluções
            e acompanhar sua evolução em um dashboard próprio.
          </p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {errorMessage && (
            <div className="register-form__error" role="alert">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="register-form__success" role="status">
              {successMessage}
            </div>
          )}

          <div className="register-form__group">
            <label htmlFor="name">Nome</label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Seu nome"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form__group">
            <label htmlFor="email">Email</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="seuemail@exemplo.com"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="register-form__row">
            <div className="register-form__group">
              <label htmlFor="password">Senha</label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder="Digite sua senha"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="register-form__group">
              <label htmlFor="confirmPassword">Confirmar senha</label>

              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repita sua senha"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="button button--primary register-form__button"
            disabled={isLoading}
          >
            {isLoading ? 'Criando conta...' : 'Criar conta grátis'}
          </button>
        </form>

        <p className="register-card__footer">
          Já tem uma conta? <Link to="/login">Entrar agora</Link>
        </p>
      </section>

      <aside className="register-preview" aria-label="Benefícios do DevBug Tracker">
        <div className="register-preview__glow"></div>

        <div className="register-preview__content">
          <span className="register-preview__tag">Seu ambiente técnico</span>

          <h2>Registre problemas hoje. Encontre soluções amanhã.</h2>

          <p>
            Centralize projetos, bugs, mensagens de erro, causas prováveis e
            soluções para criar um histórico técnico de aprendizado.
          </p>

          <div className="register-preview__items">
            <article>
              <span>▣</span>
              <div>
                <strong>Projetos organizados</strong>
                <small>Separe bugs por sistema ou aplicação.</small>
              </div>
            </article>

            <article>
              <span>⌬</span>
              <div>
                <strong>Bugs documentados</strong>
                <small>Registre erro, causa, código e solução.</small>
              </div>
            </article>

            <article>
              <span>✓</span>
              <div>
                <strong>Evolução visível</strong>
                <small>Acompanhe status e resolução pelo dashboard.</small>
              </div>
            </article>
          </div>
        </div>
      </aside>
    </main>
  );
}

export default Register;