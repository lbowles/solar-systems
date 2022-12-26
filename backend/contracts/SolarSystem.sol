// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Utilities.sol";
import "./Renderer.sol";
import "svgnft/contracts/SVG721.sol";

// TODO: Use contract which tracks total supply and has safeMint function
contract SolarSystems is ERC721 {
  using Strings for uint256;

  // The price of each NFT in wei
  uint256 public price;

  // The contract owner
  address public owner;

  constructor(uint256 _price) ERC721("SolarSystems", "SOLSYS") {
    // Set the price of each NFT
    price = _price;
    // Set the contract owner to the caller
    owner = msg.sender;
  }

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory name = string(abi.encodePacked("SolarSystems #", tokenId.toString()));
    string memory description = "Fully on-chain procedurally generated solar systems.";
    string memory svg = Renderer.getSVG(tokenId);

    return SVG721.metadata(name, description, svg);
  }

  // Mint a new NFT and sell it to a buyer
  //   function mint(string memory _name, string memory _description) public payable {
  //     // Ensure that the buyer has sent enough Ether to cover the price of the NFT
  //     require(msg.value >= price, "Insufficient payment");

  //     // Mint a new NFT and assign it to the buyer
  //     uint256 tokenId = _safeMint(msg.sender);

  //     // Send the remaining Ether (if any) back to the buyer
  //     msg.sender.transfer(msg.value.sub(price));
  //   }
}
