import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { verifyEmail } from '../../services/authService';

import './VerifyEmail.css';

function getVerifyEmailErrorMessage(error) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Tente novamente mais tarde.';
  }

  return 'Não foi possível confirmar seu email. Solicite um novo link.';
}

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const hasVerified = useRef(false);
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Confirmando seu email...');

  useEffect(() => {
    if (hasVerified.current) {
        return;
    }

    hasVerified.current = true;

    const token = searchParams.get('token');

    if (!token) {
        setStatus('error');
        setMessage('Token de verificação não informado.');
        return;
    }

    async function confirmEmail() {
        try {
        const response = await verifyEmail(token);

        setStatus('success');
        setMessage(
            typeof response === 'string'
            ? response
            : 'Email confirmado com sucesso.'
        );
        } catch (error) {
        setStatus('error');
        setMessage(getVerifyEmailErrorMessage(error));
        }
    }

    confirmEmail();
    }, [searchParams]);

  return (
    <main className="verify-email-page">
      <section className="verify-email-card">
        <Link to="/" className="verify-email-card__logo">
          <span className="verify-email-card__logo-icon">⌬</span>
          <span>
            DevBug <strong>Tracker</strong>
          </span>
        </Link>

        <span className={`verify-email-card__status verify-email-card__status--${status}`}>
          {status === 'loading' && 'Verificando'}
          {status === 'success' && 'Email confirmado'}
          {status === 'error' && 'Falha na confirmação'}
        </span>

        <h1>
          {status === 'success'
            ? 'Sua conta foi ativada.'
            : status === 'error'
              ? 'Não foi possível confirmar.'
              : 'Aguarde um instante.'}
        </h1>

        <p>{message}</p>

        <Link className="button button--primary verify-email-card__button" to="/login">
          Ir para o login
        </Link>
      </section>
    </main>
  );
}

export default VerifyEmail;