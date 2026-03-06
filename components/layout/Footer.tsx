import styled from "styled-components";
import { FaGithub } from "react-icons/fa";
import Link from "next/link";
import { year } from "@/hooks/useTime";

const PageWrapper = styled.div`
    padding-top: 1rem;
    padding-bottom: 16px;
    padding-left: 16px;
    padding-right: 16px;
    border-top: 1px solid var(--border);
    @media (max-width: 1000px) {
        padding: 0 0.5rem;
    }
`;

const FooterBaseContainer = styled.footer<{ $isSub: boolean }>`
    color: hsl(var(--foreground));
    padding: ${({ $isSub }) => ($isSub ? "0" : "0.5rem 0")};
    display: flex;
    justify-content: space-between;
    border-top: ${({ $isSub }) => ($isSub ? "1px solid var(--border)" : "none")};
    flex-direction: column;

    @media (max-width: 1000px) {
        padding: ${({ $isSub }) => ($isSub ? "0 0 1rem 0" : "0.5rem 0")};
    }

    @media (min-width: 601px) {
        flex-direction: row;
    }

    @media (max-width: 600px) {
        padding: ${({ $isSub }) => ($isSub ? "0" : "0.5rem 0")};
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
    color: var(--muted-foreground);
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
        color: var(--muted-foreground);
    }
`;

const ExternalLink = styled(Link)`
    align-items: center;
    padding: 0.5rem 0;
    color: hsl(var(--muted-foreground));
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
        color: hsl(var(--foreground));
    }
`;

const SocialIconsWrapper = styled.div`
    padding-top: 1rem;
    display: flex;
    gap: 1rem;
`;

const FooterLogoImage = styled.img`
    height: 2.5rem;
`;

const Text = styled.div<{ $isSub: boolean }>`
    color: var(--muted-foreground);
    font-size: ${({ $isSub }) => ($isSub ? "0.75rem" : "0.65rem")};
    margin: ${({ $isSub }) => ($isSub ? "1rem 0 0 0" : "1rem 0")};
    max-width: 25rem;


    strong {
        color: var(--muted-foreground);
        &:hover {
            color: var(--muted-foreground/20);
        }
    }
    
    a {
        color: var(--muted-foreground);
        text-decoration: none;
        transition: color 0.1s ease-in-out;
        
        &:hover {
            color: var(--muted-foreground/20);
        }
    }
`;

const ShareButton = styled.a`
    display: inline-block;
    color: var(--muted-foreground);
    transition: 0.2s ease-in-out;

    svg {
        font-size: 1.2rem;
    }

    &:hover,
    &:active,
    &:focus {
        transform: scale(1.15);
        color: var(--muted-foreground/20);
        text-decoration: none;
    }

    @media (max-width: 600px) {
        margin-bottom: 1rem;
    }
`;

export function Footer() {
    return (
        <PageWrapper>
            <footer>
                <FooterBaseContainer aria-label="Main Footer" $isSub={false}>
                    <Text as="p" $isSub={false}>
                        <FooterLogoImage src="/loader.png" alt="Footer Logo" />{" "}
                        <br />
                        This website does not retain any files on its server.
                        Rather, it solely provides links to media content hosted
                        by third-party services.
                    </Text>
                    <StyledLinkList aria-label="Footer Links">
                        <FooterLink href="/about">About</FooterLink>
                        <FooterLink href="/dmca-policy">DMCA Policy</FooterLink>
                        <FooterLink href="/privacy-policy">
                            Privacy Policy
                        </FooterLink>
                    </StyledLinkList>
                </FooterBaseContainer>
                <FooterBaseContainer aria-label="Sub Footer" $isSub={true}>
                    <Text as="p" $isSub={true}>
                        &copy; {year}{" "}
                        <a
                            href="https://github.com/devxoshakya/anveshna"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Anveshna.
                        </a>{" "}
                        | Website Made by{" "}
                        <strong>
                            <a
                                href="https://github.com/devxoshakya"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Dev
                            </a>
                            {" and "}
                            <a
                                href="https://github.com/akshitasrivastava20"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Akshita
                            </a>
                        </strong>
                    </Text>
                    <nav aria-label="Repository Link">
                        <SocialIconsWrapper>
                            <ShareButton
                                href="https://github.com/devxoshakya/anveshna"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub Repository"
                            >
                                <FaGithub aria-hidden="true" />
                            </ShareButton>
                        </SocialIconsWrapper>
                    </nav>
                </FooterBaseContainer>
            </footer>
        </PageWrapper>
    );
}
