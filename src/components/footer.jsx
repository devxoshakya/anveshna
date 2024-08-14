import styled from 'styled-components';
import { FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { FaGithub } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";



const PageWrapper = styled.div`
  margin-top: 2rem;
  @media (max-width: 1000px) {
    padding: 0 0.5rem;
  }
`;

const FooterBaseContainer = styled.footer`
  color: var(--global-text);
  padding: ${({ $isSub }) => ($isSub ? '0' : '0.5rem 0')};
  display: flex;
  justify-content: space-between;
  border-top: ${({ $isSub }) => ($isSub ? '0.125rem solid' : 'none')}
    var(--global-secondary-bg);
  flex-direction: column;

  @media (max-width: 1000px) {
    padding: ${({ $isSub }) => ($isSub ? '0 0 1rem 0' : '0.5rem 0')};
  }

  @media (min-width: 601px) {
    flex-direction: row;
  }

  @media (max-width: 600px) {
    padding: ${({ $isSub }) => ($isSub ? '0' : '0.5rem 0')};
  }
`;

const StyledLinkList = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.5rem 0;
  margin-top: auto;
`;

const FooterLink = styled(Link)`
  align-items: center;
  padding: 0.5rem 0;
  color: grey;
  font-size: 0.9rem;
  text-decoration: none;
  transition: color 0.1s ease-in-out;
  bottom: 0;
  align-self: auto;

  @media (min-width: 601px) {
    align-self: end;
  }

  &:hover,
  &:active,
  &:focus {
    color: var(--global-button-text);
  }
`;

const SocialIconsWrapper = styled.div`
  padding-top: 1rem;
  display: flex;
  gap: 1rem;
`;

const FooterLogoImage = styled.img`
  content: url('../images/icon.png');
  max-width: 8rem;
  height: auto;
`;

const Text = styled.div`
  color: grey;
  font-size: ${({ $isSub }) => ($isSub ? '0.75rem' : '0.65rem')};
  margin: ${({ $isSub }) => ($isSub ? '1rem 0 0 0' : '1rem 0')};
  max-width: 25rem;

  strong {
    color: var(--global-text);
  }
`;

const ShareButton = styled.a`
  display: inline-block;
  color: grey;
  transition: 0.2s ease-in-out;

  svg {
    font-size: 1.2rem;
  }

  &:hover,
  &:active,
  &:focus {
    transform: scale(1.15);
    color: var(--global-button-text);
    text-decoration: underline;
  }

  @media (max-width: 600px) {
    margin-bottom: 1rem;
  }
`;

function getYear() {
  return new Date().getFullYear();
}

function NewFooter() {
  return (
    <PageWrapper>
      <footer className='mx-4 mb-4'>
        <FooterBaseContainer aria-label="Main Footer" $isSub={false}>
          <Text as="p" $isSub={false}>
            <FooterLogoImage alt="Footer Logo" /> <br />
            This website does not retain any files on its server. Rather, it
            solely provides links to media content hosted by third-party
            services.
          </Text>
          <StyledLinkList aria-label="Footer Links">
            <FooterLink to="/about" title="About Us">
              About
            </FooterLink>
            <FooterLink
              to="/contact"
              target="_blank"
              title="Contact Us"
            >
              Contact
            </FooterLink>
            <FooterLink to="/privacy" title="Privacy Policy and Terms of Service">
              Privacy & ToS
            </FooterLink>
          </StyledLinkList>
        </FooterBaseContainer>
        <FooterBaseContainer aria-label="Sub Footer" $isSub={true}>
          <Text as="p" $isSub={true}>
            &copy; {getYear()}{' '}
            <a
              href="https://www.anveshna.xyz"
              rel="noopener noreferrer"
              style={{ color: 'grey' }}
            >
              Anveshna.
            </a>{' '}
            | Website Made by <strong><a href='https://devxoshakya.xyz' rel='noopener noreferrer'>Dev Shakya</a></strong>
          </Text>
          <nav aria-label="Social Links">
            <SocialIconsWrapper>
              {[
                {
                  href: 'https://instagram.com/devxoshakya',
                  Icon: FaInstagram,
                  label: 'Instagram',
                },
                {
                  href: 'https://x.com/devxoshakya',
                  Icon: FaTwitter,
                  label: 'Twitter',
                },
                {
                  href: 'https://github.com/devxoshakya',
                  Icon: FaGithub,
                  label: 'Github',
                },
              ].map(({ href, Icon, label }) => (
                <ShareButton
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label}`}
                >
                  <Icon aria-hidden="true" />
                </ShareButton>
              ))}
            </SocialIconsWrapper>
          </nav>
        </FooterBaseContainer>
      </footer>
    </PageWrapper>
  );
}

export default NewFooter;