pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SolarNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    //SVG params
    uint256 public maxNumPlanets;
    uint256 public size;

    event CreatedSolNFT(uint256 indexed tokenCounter, string tokenURI);

    constructor(uint256 _maxNumPlanets) ERC721("Solar NFT", "solNFT") {
        tokenCounter = 0;
        maxNumPlanets = _maxNumPlanets;
        size = 500;
    }

    function create() public {
        _safeMint(msg.sender, tokenCounter);
        string memory svg = generateSVG();
        string memory imageURI = svgToImageURI(svg);
        string memory tokenURI = combineTokenURI(imageURI);
        _setTokenURI(tokenCounter, tokenURI);
        emit CreatedSolNFT(tokenCounter, tokenURI);
    }

    function generateSVG() public view returns (string memory finalSVG) {
        uint256 randomNum = getRandomNumber();
        uint256 numberOfPlanets = (randomNum % maxNumPlanets) + 1;
        //starting svg
        finalSVG = string(
            abi.encodePacked(
                "<svg xmlns='http://www.w3.org/2000/svg' height='500' width='500'>",
                "<rect width='500' height='500' fill='#0D1F2F' ></rect>",
                "<circle cx='250' cy='250' r='35' fill='#FFDA17'></circle>"
            )
        );
        //Add all the planets and their orbit paths
        for (uint256 i = 0; i < numberOfPlanets; i++) {
            string memory planetSVG = generatePlanetSVG(randomNum, i);
            finalSVG = string(abi.encodePacked(finalSVG, planetSVG));
        }
        //closing svg
        finalSVG = string(abi.encodePacked(finalSVG, "</svg>"));
    }

    //generates planet and its orbit
    function generatePlanetSVG(uint256 _randomNum, uint256 _i)
        public
        view
        returns (string memory planetGroupSVG)
    {
        //planet rad
        uint256 planetRad = uint256(keccak256(abi.encode(_randomNum, _i)));
        //orbit radius
        uint256 orbitRad = (randomNum % (250 - planetRad)) + 35 + planetRad;
        string memory orbitRadStr = uint2str(orbitRad);
        string memory planetOrbit = string(
            abi.encodePacked(
                '<path d="',
                '"M 250 250 m -',
                orbitRadStr,
                " 0 a ",
                orbitRadStr,
                ",",
                orbitRadStr,
                " 0 1,0 ",
                uint2str(orbitRad * 2),
                ",0 a ",
                orbitRadStr,
                ",",
                orbitRadStr,
                " 0 1,0 -",
                uint2str(orbitRad * 2),
                '0" stroke="#8957CC" stroke-width="1" fill="none"></path>'
            )
        );
    }

    function svgToImageURI(string memory _svg)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:image/svg+xml;base64,";
        string memory svgBase64Encoded = Base64.encode(
            bytes(string(abi.encodePacked(_svg)))
        );
        string memory imageURI = string(
            abi.encodePacked(baseURL, svgBase64Encoded)
        );
        return imageURI;
    }

    function combineTokenURI(string memory _imageURI)
        public
        pure
        returns (string memory)
    {
        string memory baseURL = "data:application/json;base64,";
        return
            string(
                abi.encodePacked(
                    baseURL,
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"SolarNFT", ',
                                '"description":"Random on-chain solar system NFT",',
                                '"attributes":"",',
                                '"image": "',
                                _imageURI,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

    //Maybe use chainlink for random number? This is deterministic
    function getRandomNumber() private view returns (uint256) {
        uint256 randomHash = uint256(keccak256(block.difficulty, now));
        return randomHash % 1000;
    }

    // From: https://stackoverflow.com/a/65707309/11969592
    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len;
        while (_i != 0) {
            k = k - 1;
            uint8 temp = (48 + uint8(_i - (_i / 10) * 10));
            bytes1 b1 = bytes1(temp);
            bstr[k] = b1;
            _i /= 10;
        }
        return string(bstr);
    }
}
