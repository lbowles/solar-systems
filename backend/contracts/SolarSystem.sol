// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "erc721a/contracts/ERC721A.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Utilities.sol";
import "./Renderer.sol";
import "svgnft/contracts/SVG721.sol";

contract SolarSystems is ERC721A, Ownable {
  // The price of each NFT in wei
  uint256 public price;

  uint256 public maxSupply;

  constructor(uint256 _price, uint256 _maxSupply) ERC721A("SolarSystems", "SOLSYS") {
    // Set the price of each NFT
    price = _price;
    maxSupply = _maxSupply;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory name = string(abi.encodePacked("SolarSystems #", utils.uint2str(tokenId)));
    string memory description = "Fully on-chain procedurally generated solar systems.";
    string memory svg = Renderer.getSVG(tokenId);

    return SVG721.metadata(name, description, svg);
  }

  function getPrice(uint256 _quantity) public view returns (uint256) {
    return price * _quantity;
  }

  function mint(uint256 _quantity) external payable {
    require(msg.value >= getPrice(_quantity), "Insufficient fee");
    require(totalSupply() + _quantity <= maxSupply, "Exceeds max supply");
    _mint(msg.sender, _quantity);
  }

  function withdraw() external onlyOwner {
    require(payable(msg.sender).send(address(this).balance));
  }
}
