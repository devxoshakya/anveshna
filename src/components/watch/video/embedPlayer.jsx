import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #141414;
`;

const Iframe = styled.iframe`
  border-radius: 0.3rem;
  border: none;
  min-height: 16.24rem;
  background-color: #1e1e1e;
`;

const EmbedPlayer = ({ src }) => {
  return (
    <Container>
      <Iframe src={src} allowFullScreen />
    </Container>
  );
};

export default EmbedPlayer;
