// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utilities.sol";
import "./Renderer.sol";
import "svgnft/contracts/Base64.sol";

contract SolarSystems is ERC721A, Ownable {
  uint256 public price;
  uint256 public maxSupply;

  /**
   * @dev Constructs a new instance of the contract.
   * @param _name Name of the ERC721 token.
   * @param _symbol Symbol of the ERC721 token.
   * @param _price Price of each solar system in wei.
   * @param _maxSupply Maximum supply of solar systems.
   */
  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _price,
    uint256 _maxSupply
  ) ERC721A(_name, _symbol) {
    price = _price;
    maxSupply = _maxSupply;
  }

  /**
   * @notice Returns the token URI for a given token ID.
   * @param tokenId ID of the token to get the URI for.
   * @return Token URI.
   */
  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory name = string(abi.encodePacked("Solar System #", utils.uint2str(tokenId)));
    string memory description = "Fully on-chain, procedurally generated, animated solar systems.";
    Renderer.SolarSystem memory solarSystem = Renderer.solarSystemForTokenId(tokenId);
    string memory svg = Renderer.getSVG(solarSystem);

    string memory json = string(
      abi.encodePacked(
        '{"name":"',
        name,
        '","description":"',
        description,
        '","attributes":[{"trait_type":"Planets","value":"',
        utils.uint2str(Renderer.numPlanetsForTokenId(tokenId)),
        '"}, {"trait_type":"Ringed Planets", "value": "',
        utils.uint2str(Renderer.numRingedPlanetsForTokenId(tokenId)),
        '"}, {"trait_type":"Star Type", "value": "',
        Renderer.hasRareStarForTokenId(tokenId) ? "Blue" : "Normal",
        '"}], "image": "data:image/svg+xml;base64,',
        Base64.encode(bytes(svg)),
        '"}'
      )
    );
    return string(abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(json))));
  }

  /**
   * @notice Mints new solar systems for the caller.
   * @param _quantity Quantity of solar systems to mint.
   */
  function mint(uint256 _quantity) external payable {
    require(msg.value >= price * _quantity, "Insufficient fee");
    require(totalSupply() + _quantity <= maxSupply, "Exceeds max supply");
    _mint(msg.sender, _quantity);
  }

  /**
   * @notice  Airdrops solar systems to a list of recipients. Only callable by the contract owner.
   * @param _recipients List of recipients to receive the airdrop.
   * @param _quantity Quantity of solar systems to airdrop to each recipient.
   */
  function airdrop(address[] memory _recipients, uint256 _quantity) external payable onlyOwner {
    require(totalSupply() + _quantity * _recipients.length <= maxSupply, "Exceeds max supply");
    for (uint256 i = 0; i < _recipients.length; i++) {
      _mint(_recipients[i], _quantity);
    }
  }

  /**
   * @notice Withdraws the contract's balance. Only callable by the contract owner.
   */
  function withdraw() external onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
