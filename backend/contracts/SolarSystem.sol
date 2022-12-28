// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utilities.sol";
import "./Renderer.sol";
import "svgnft/contracts/Base64.sol";

contract SolarSystems is ERC721A, Ownable {
  // The price of each NFT in wei
  uint256 public price;

  uint256 public maxSupply;

  constructor(
    string memory _name,
    string memory _symbol,
    uint256 _price,
    uint256 _maxSupply
  ) ERC721A(_name, _symbol) {
    // Set the price of each NFT
    price = _price;
    maxSupply = _maxSupply;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory name = string(abi.encodePacked("SolarSystems #", utils.uint2str(tokenId)));
    string memory description = "Fully on-chain, procedurally generated, animated solar systems.";
    string memory svg = Renderer.getSVG(tokenId);

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

  function getPrice(uint256 _quantity) public view returns (uint256) {
    return price * _quantity;
  }

  function mint(uint256 _quantity) external payable {
    require(msg.value >= getPrice(_quantity), "Insufficient fee");
    require(totalSupply() + _quantity <= maxSupply, "Exceeds max supply");
    _mint(msg.sender, _quantity);
  }

  function airdrop(address[] memory _recipients, uint256 _quantity) external onlyOwner {
    require(totalSupply() + _quantity * _recipients.length <= maxSupply, "Exceeds max supply");
    for (uint256 i = 0; i < _recipients.length; i++) {
      _mint(_recipients[i], _quantity);
    }
  }

  function withdraw() external onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
