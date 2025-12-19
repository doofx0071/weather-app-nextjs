'use client';

import React from 'react';
import styled from 'styled-components';

const Pattern = () => {
  return (
    <StyledWrapper>
      <div className="container" />
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .container::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: 1;
    background-image: radial-gradient(
      circle at 50% 50%,
      #0000 0,
      #0000 2px,
      hsl(0 0 4%) 2px
    );
    background-size: 8px 8px;
    --f: blur(1em) brightness(6);
    animation: hii 10s linear infinite;
  }

  @keyframes hii {
    0% {
      backdrop-filter: var(--f) hue-rotate(0deg);
    }
    to {
      backdrop-filter: var(--f) hue-rotate(360deg);
    }
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    --c: #09f;
    background-color: #000;
    background-image: radial-gradient(4px 100px at 0px 235px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 235px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 117.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 252px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 252px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 126px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 150px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 150px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 75px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 253px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 253px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 126.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 204px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 204px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 102px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 134px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 134px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 67px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 179px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 179px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 89.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 299px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 299px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 149.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 215px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 215px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 107.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 281px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 281px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 140.5px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 158px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 158px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 79px, var(--c) 100%, #0000 150%),
      radial-gradient(4px 100px at 0px 210px, var(--c), #0000),
      radial-gradient(4px 100px at 300px 210px, var(--c), #0000),
      radial-gradient(1.5px 1.5px at 150px 105px, var(--c) 100%, #0000 150%);
    background-size:
      300px 235px,
      300px 235px,
      300px 235px,
      300px 252px,
      300px 252px,
      300px 252px,
      300px 150px,
      300px 150px,
      300px 150px,
      300px 253px,
      300px 253px,
      300px 253px,
      300px 204px,
      300px 204px,
      300px 204px,
      300px 134px,
      300px 134px,
      300px 134px,
      300px 179px,
      300px 179px,
      300px 179px,
      300px 299px,
      300px 299px,
      300px 299px,
      300px 215px,
      300px 215px,
      300px 215px,
      300px 281px,
      300px 281px,
      300px 281px,
      300px 158px,
      300px 158px,
      300px 158px,
      300px 210px,
      300px 210px,
      300px 210px;
    background-position:
      0px 0px,
      0px 0px,
      0px 0px,
      0px -10px,
      0px -10px,
      0px -10px,
      0px 20px,
      0px 20px,
      0px 20px,
      0px -20px,
      0px -20px,
      0px -20px,
      0px 10px,
      0px 10px,
      0px 10px,
      0px 30px,
      0px 30px,
      0px 30px,
      0px 5px,
      0px 5px,
      0px 5px,
      0px -30px,
      0px -30px,
      0px -30px,
      0px -5px,
      0px -5px,
      0px -5px,
      0px 15px,
      0px 15px,
      0px 15px,
      0px 0px,
      0px 0px,
      0px 0px,
      0px -15px,
      0px -15px,
      0px -15px;
  }
`;

export default Pattern;
