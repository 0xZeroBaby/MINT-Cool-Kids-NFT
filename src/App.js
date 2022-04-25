import React, { useEffect, useState, useRef } from "react";
import Rotate from 'react-reveal/Rotate';
import RubberBand from 'react-reveal/RubberBand';
import Jump from 'react-reveal/Jump';
import Tada from 'react-reveal/Tada';
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { Zoom } from "react-reveal";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;


export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 0px;
  border: none;
  padding: 10px;
  font-weight: bold;
  width: 250px;
  cursor: pointer;
  box-shadow: 0px 0px 0px -0px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 0px 0px -0px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 0px 0px -0px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledConnectButton = styled.button`
background: url("/config/images/metamask.png");
border: 0;
background-repeat: no-repeat;
background-position: center;
background-size: contain;
width: 300px;
height: 376px;
cursor: pointer;
`;


export const StyledMintButton = styled.button`
  background: url("/config/images/mint.png");
  border: 0;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 300px;
  height: 376px;
  cursor: pointer;
`;

export const StyledRoundButton = styled.button`

  border-radius: 30%;
  border: none;
  background-color: black;
  font-weight: bold;
  font-size: 40px;
  color: yellowgreen;
  width: 50px;
  height: 50px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  width: 100px;
  @media (min-width: 900px) {
    width: 100px;
  }
  @media (min-width: 1000px) {
    width: 250px;
  }
  transition: width 0.5s;
`;

export const StyledImgOpensea = styled.img`
background: url("/config/images/opensea.png");
background-repeat: no-repeat;
background-position: center;
width: 200px;
height: 176px;
cursor: pointer;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Choose amount and click mint to get your Cool Kids!`);
  const [mintAmount, setMintAmount] = useState(1);
  const [isChecked, setIsChecked] = React.useState(false);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0,
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false
    });


  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Price: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(blockchain.account, mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei,
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong :(");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
          setFeedback(
          `WOW, you minted a ${CONFIG.NFT_NAME}! Go to Opensea TESTNET see it!`
          );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 50) {
      newMintAmount = 50;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  return (
    <s.Screen>
      <s.Container
        flex={2}
        ai={"center"}
        style={{ backgroundColor: "black", backgroundSize: "cover", backgroundRepeat: "no-repeat"}}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/background.gif" : null}
      >
        <s.SpacerMedium />
        <s.SpacerLarge />
        <RubberBand>
        <StyledImg
                onClick={(e) => {
                  window.open("https://coolkidsnft.netlify.app", "_blank");
                }}
                style={{ border: "none", background: "none", transform: "scale(2)"}} alt={"logo"} src={"/config/images/logo-gif.gif"}/>
        </RubberBand>
              <s.SpacerLarge />
        <ResponsiveWrapper flex={0} style={{ padding: 10 }} test>
          <s.mintContainer
            flex={1}
            ai={"center"}
            jc={"flex-start"}
            style={{ padding: 10, backgroundImage: 'url("")'}}
          >
{/* THIS IS AUDIO PLAYER [Currently: Disabled]
                <audio controls autoplay>
  <source src="./config/song.ogg" allow= "autoplay" type="audio/ogg"/>
  <source src="./config/song.mp3" allow= "autoplay" type="audio/mpeg"/>
Your browser does not support the audio element.
</audio>
END OF AUDIO PLAYER */}

            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 100,
                fontWeight: "bold",
                color: "#66ff33",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
                color: "#66ff33"
              }}
            >
            </span>
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "purple" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{ textAlign: "center", color: "purple" }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "#66ff33", fontSize: 39 }}
                >
                  1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerXSmall />
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 35,
                      }}
                    >
                      This is  TESTNET project. Connect to {CONFIG.NETWORK.NAME} Testnet network
                    </s.TextDescription>
                    <Jump>
                      <s.SpacerLarge />
                      <s.SpacerLarge />
                    <StyledConnectButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                    </StyledConnectButton>
                    </Jump>
                    <s.SpacerLarge />
                    <s.SpacerMedium />
                    <s.SpacerLarge />
                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "white",
                            fontSize: 30
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "white",
                        fontSize: 30,
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 1.0, color: "yellowgreen"}}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.SpacerXSmall />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "yellowgreen",
                          fontSize: 120,
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <s.SpacerXSmall />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                         +
                      </StyledRoundButton>
                    </s.Container>
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <Tada>
                      <StyledMintButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "" : ""}
                      </StyledMintButton>
                      </Tada>
                    </s.Container>
                  </>
                )}
              </>
            )}
            </s.mintContainer>
            
        </ResponsiveWrapper>
        <s.SpacerMedium />
{/*// FOOTER PLACE */}
      </s.Container>
    </s.Screen>
  );
}

export default App;
