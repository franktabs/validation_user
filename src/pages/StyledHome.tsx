import styled from "@emotion/styled";

const size = {
    mobileS: '320px',
    mobileM: '375px',
    mobileL: '425px',
    tablet: '768px',
    laptop: '1024px',
    laptopL: '1440px',
    desktop: '2560px'
}

const StyledHome = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;

    & > div:last-child{
        overflow-x: auto;
    }

    @media screen and (min-width:768px){
        & > div:first-child{
            max-width: 425px;
        }
        & > div:last-child{
            width: calc(100% - 425px);
        }
    }
`

export default StyledHome