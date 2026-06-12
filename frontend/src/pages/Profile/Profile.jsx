import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import AppSidebar from '../../components/AppSidebar/AppSidebar';
import { clearAuthData, saveAuthUser } from '../../services/authStorage';
import {
  deleteAccount,
  getProfile,
  removeProfileImage,
  updatePassword,
  updateProfile,
  uploadProfileImage,
} from '../../services/profileService';

import './Profile.css';

const initialProfileForm = {
  name: '',
};

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function getImageUrl(profileImageUrl) {
  if (!profileImageUrl) {
    return null;
  }

  if (profileImageUrl.startsWith('http')) {
    return profileImageUrl;
  }

  return `${import.meta.env.VITE_API_URL}${profileImageUrl}`;
}

function getInitials(name) {
  if (!name) {
    return 'DB';
  }

  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function getProfileErrorMessage(error, fallbackMessage) {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }

  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }

  return fallbackMessage;
}

function getPasswordErrorMessage(error) {
  if (!error.response) {
    return 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.';
  }

  const backendMessage = error.response?.data?.message;

  if (backendMessage && backendMessage !== 'Erro de validação') {
    return backendMessage;
  }

  return 'Não foi possível alterar a senha. Verifique se a senha atual está correta.';
}

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profileForm, setProfileForm] = useState(initialProfileForm);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [imageMessage, setImageMessage] = useState('');
  const [dangerMessage, setDangerMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const profile = await getProfile();

      setUser(profile);
      setProfileForm({
        name: profile.name || '',
      });

      saveAuthUser(profile);
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setErrorMessage(
        getProfileErrorMessage(
          error,
          'Não foi possível carregar o perfil. Verifique se o backend está rodando.',
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function handleProfileChange(event) {
    const { name, value } = event.target;

    setProfileForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  function handlePasswordChange(event) {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();

    setProfileMessage('');
    setErrorMessage('');

    if (profileForm.name.trim().length < 3) {
      setProfileMessage('O nome deve ter pelo menos 3 caracteres.');
      return;
    }

    setIsSavingProfile(true);

    try {
      const updatedUser = await updateProfile({
        name: profileForm.name.trim(),
      });

      setUser(updatedUser);
      saveAuthUser(updatedUser);
      setProfileMessage('Perfil atualizado com sucesso.');
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setProfileMessage(
        getProfileErrorMessage(
          error,
          'Não foi possível atualizar o perfil. Verifique os dados informados.',
        ),
      );
    } finally {
      setIsSavingProfile(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    setPasswordMessage('');
    setErrorMessage('');

    if (passwordForm.newPassword.length < 6) {
      setPasswordMessage('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordMessage('A confirmação da senha não coincide.');
      return;
    }

    setIsSavingPassword(true);

    try {
      await updatePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword,
      });

      setPasswordForm(initialPasswordForm);
      setPasswordMessage('Senha alterada com sucesso.');
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setPasswordMessage(getPasswordErrorMessage(error));
    } finally {
      setIsSavingPassword(false);
    }
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageMessage('');
    setErrorMessage('');
    setIsUploadingImage(true);

    try {
      const updatedUser = await uploadProfileImage(file);

      setUser(updatedUser);
      saveAuthUser(updatedUser);
      setImageMessage('Foto de perfil atualizada com sucesso.');
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setImageMessage(
        getProfileErrorMessage(
          error,
          'Não foi possível enviar a foto de perfil.',
        ),
      );
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  }

  async function handleRemoveImage() {
    const confirmed = window.confirm(
      'Tem certeza que deseja remover sua foto de perfil?',
    );

    if (!confirmed) {
      return;
    }

    setImageMessage('');
    setErrorMessage('');
    setIsRemovingImage(true);

    try {
      const updatedUser = await removeProfileImage();

      setUser(updatedUser);
      saveAuthUser(updatedUser);
      setImageMessage('Foto de perfil removida com sucesso.');
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setImageMessage(
        getProfileErrorMessage(
          error,
          'Não foi possível remover a foto de perfil.',
        ),
      );
    } finally {
      setIsRemovingImage(false);
    }
  }

  function handleLogout() {
    clearAuthData();
    navigate('/login');
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      'Tem certeza que deseja excluir sua conta? Todos os seus projetos e bugs serão removidos. Essa ação não pode ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    setDangerMessage('');
    setErrorMessage('');
    setIsDeletingAccount(true);

    try {
      await deleteAccount();

      clearAuthData();
      navigate('/');
    } catch (error) {
      if (error.response?.status === 401) {
        clearAuthData();
        navigate('/login');
        return;
      }

      setDangerMessage(
        getProfileErrorMessage(
          error,
          'Não foi possível excluir a conta. Tente novamente.',
        ),
      );
    } finally {
      setIsDeletingAccount(false);
    }
  }

  const profileImageUrl = getImageUrl(user?.profileImageUrl);

  return (
    <main className="profile-page">
      <AppSidebar userOverride={user}/>

      <section className="profile-content">
        <header className="profile-header">
          <div>
            <span className="profile-header__tag">Perfil</span>

            <h1>Minha conta.</h1>

            <p>
              Gerencie seus dados, senha, foto de perfil e ações da conta.
            </p>
          </div>

          <button
            type="button"
            className="button button--ghost"
            onClick={handleLogout}
          >
            Sair da conta
          </button>
        </header>

        {isLoading && (
          <div className="profile-feedback">
            Carregando perfil...
          </div>
        )}

        {errorMessage && (
          <div className="profile-feedback profile-feedback--error" role="alert">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && user && (
          <div className="profile-grid">
            <section className="profile-card profile-card--summary">
              <div className="profile-avatar">
                {profileImageUrl ? (
                  <img src={profileImageUrl} alt={`Foto de ${user.name}`} />
                ) : (
                  <span>{getInitials(user.name)}</span>
                )}
              </div>

              <div>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>

              <div className="profile-image-actions">
                <label className="button button--primary">
                  {isUploadingImage ? 'Enviando...' : 'Enviar foto'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploadingImage}
                  />
                </label>

                <button
                  type="button"
                  className="button button--ghost"
                  onClick={handleRemoveImage}
                  disabled={isRemovingImage || !user.profileImageUrl}
                >
                  {isRemovingImage ? 'Removendo...' : 'Remover foto'}
                </button>
              </div>

              {imageMessage && (
                <p className="profile-message">{imageMessage}</p>
              )}
            </section>

            <section className="profile-card">
              <div className="profile-card__header">
                <h2>Dados pessoais</h2>
                <p>Atualize as informações básicas do seu perfil.</p>
              </div>

              <form className="profile-form" onSubmit={handleProfileSubmit}>
                {profileMessage && (
                  <div className="profile-form__message">
                    {profileMessage}
                  </div>
                )}

                <div className="profile-form__group">
                  <label htmlFor="name">Nome</label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={profileForm.name}
                    onChange={handleProfileChange}
                    required
                  />
                </div>

                <div className="profile-form__group">
                  <label htmlFor="email">Email</label>

                  <input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                  />

                  <small>O email não pode ser alterado.</small>
                </div>

                <button
                  type="submit"
                  className="button button--primary"
                  disabled={isSavingProfile}
                >
                  {isSavingProfile ? 'Salvando...' : 'Salvar perfil'}
                </button>
              </form>
            </section>

            <section className="profile-card">
              <div className="profile-card__header">
                <h2>Alterar senha</h2>
                <p>Use uma senha com pelo menos 6 caracteres.</p>
              </div>

              <form className="profile-form" onSubmit={handlePasswordSubmit}>
                {passwordMessage && (
                  <div className="profile-form__message">
                    {passwordMessage}
                  </div>
                )}

                <div className="profile-form__group">
                  <label htmlFor="currentPassword">Senha atual</label>

                  <input
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    value={passwordForm.currentPassword}
                    onChange={handlePasswordChange}
                    autoComplete="current-password"
                    required
                  />
                </div>

                <div className="profile-form__group">
                  <label htmlFor="newPassword">Nova senha</label>

                  <input
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />
                </div>

                <div className="profile-form__group">
                  <label htmlFor="confirmPassword">Confirmar nova senha</label>

                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={handlePasswordChange}
                    autoComplete="new-password"
                    minLength="6"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="button button--primary"
                  disabled={isSavingPassword}
                >
                  {isSavingPassword ? 'Alterando...' : 'Alterar senha'}
                </button>
              </form>
            </section>

            <section className="profile-card profile-card--danger">
              <div className="profile-card__header">
                <h2>Zona perigosa</h2>
                <p>
                  A exclusão da conta remove seus dados, projetos e bugs
                  vinculados.
                </p>
              </div>

              {dangerMessage && (
                <div className="profile-form__message">
                  {dangerMessage}
                </div>
              )}

              <button
                type="button"
                className="button button--danger"
                onClick={handleDeleteAccount}
                disabled={isDeletingAccount}
              >
                {isDeletingAccount ? 'Excluindo...' : 'Excluir minha conta'}
              </button>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}

export default Profile;