import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { signInWithGoogle, isAuthenticated, getCurrentUser, signOut } from "../../utils/googleAuth";

const Nav = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid #e5e7eb;
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1rem;

  @media (min-width: 640px) {
    padding: 0 1.5rem;
  }

  @media (min-width: 1024px) {
    padding: 0 2rem;
  }
`;

const NavContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 4rem;
`;

const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  cursor: pointer;
  text-decoration: none;
`;

const LogoImage = styled.img`
  width: 2.75rem;
  height: 2.75rem;
  object-fit: contain;
`;

const LogoText = styled.span`
  font-size: 1.25rem;
  font-weight: bold;
  background: linear-gradient(to right, #4f46e5, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const NavLinks = styled.div`
  display: none;
  align-items: center;
  gap: 1.5rem;

  @media (min-width: 768px) {
    display: flex;
  }
`;

const NavLink = styled.a<{ active?: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  color: ${(props) => (props.active ? "#4f46e5" : "#4b5563")};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const NavLinkRouter = styled(Link)<{ active?: boolean }>`
  font-size: 0.875rem;
  font-weight: ${(props) => (props.active ? "600" : "500")};
  color: ${(props) => (props.active ? "#4f46e5" : "#4b5563")};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

const GetStartedButton = styled.button`
  background: #4f46e5;
  color: white;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #4338ca;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  &:active:not(:disabled) {
    transform: scale(0.95);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 0.5rem;
  padding-left: 0.75rem;
  border-left: 1px solid #e5e7eb;
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(to bottom right, #4f46e5, #7c3aed);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.75rem;
`;

const LogoutButton = styled.button`
  padding: 0.5rem 1rem;
  background: #f3f4f6;
  color: #6b7280;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #e5e7eb;
    color: #111827;
  }
`;

const LanguageSwitch = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const LangButton = styled.button<{ $active?: boolean }>`
  font-size: 0.75rem;
  font-weight: ${(props) => (props.$active ? "bold" : "500")};
  color: ${(props) => (props.$active ? "#4f46e5" : "#9ca3af")};
  background: ${(props) => (props.$active ? "#eef2ff" : "transparent")};
  border: 1px solid ${(props) => (props.$active ? "#c7d2fe" : "transparent")};
  padding: 0.25rem 0.5rem;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: #4f46e5;
    background: #eef2ff;
  }
`;


const Navbar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    // 로그인 상태 확인
    const checkAuth = () => {
      const authenticated = isAuthenticated();
      setIsLoggedIn(authenticated);
      if (authenticated) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
    };

    checkAuth();
    // 주기적으로 확인 (다른 탭에서 로그아웃한 경우 대비)
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, []);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleGetStarted = async () => {
    // 이미 로그인되어 있으면 바로 이동
    if (isAuthenticated()) {
      navigate("/generate");
      return;
    }

    setIsLoading(true);
    try {
      await signInWithGoogle();
      setIsLoggedIn(true);
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      navigate("/generate");
    } catch (error) {
      console.error("Google 로그인 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    signOut();
    setIsLoggedIn(false);
    setUser(null);
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Nav>
      <NavContainer>
        <NavContent>
          <LogoContainer to="/">
            <LogoImage src="/logo.png" alt="DailyNewsPodcast" />
            <LogoText>DailyNewsPodcast</LogoText>
          </LogoContainer>
          <NavLinks>
            <NavLink href="#features">{t("navbar.features")}</NavLink>
            <NavLinkRouter to="/pricing">{t("navbar.pricing")}</NavLinkRouter>
            <NavLinkRouter to="/my-podcasts">
              {t("navbar.myPodcasts")}
            </NavLinkRouter>
            <NavLinkRouter to="/scheduler">
              {t("common.scheduler")}
            </NavLinkRouter>
            <UserMenu>
              <LanguageSwitch>
                <LangButton
                  $active={i18n.language === "ko"}
                  onClick={() => changeLanguage("ko")}
                >
                  {t("languageSwitch.ko")}
                </LangButton>
                <LangButton
                  $active={i18n.language === "en" || i18n.language.startsWith("en")}
                  onClick={() => changeLanguage("en")}
                >
                  {t("languageSwitch.en")}
                </LangButton>
              </LanguageSwitch>
              {isLoggedIn && user ? (
                <>
                  <UserAvatar>
                    {user.picture ? (
                      <img
                        src={user.picture}
                        alt={user.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </UserAvatar>
                  <LogoutButton onClick={handleLogout}>
                    {t("navbar.logout")}
                  </LogoutButton>
                </>
              ) : (
                <GetStartedButton
                  onClick={handleGetStarted}
                  disabled={isLoading}
                >
                  {isLoading ? t("hero.loggingIn") : t("navbar.getStarted")}
                </GetStartedButton>
              )}
            </UserMenu>
          </NavLinks>
        </NavContent>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
