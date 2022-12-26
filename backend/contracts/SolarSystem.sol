// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Utilities.sol";
import "./Renderer.sol";
import "svgnft/contracts/SVG721.sol";

contract SolarSystems is ERC721 {
  using Strings for uint256;

  constructor() ERC721("SolarSystems", "SOLSYS") {}

  function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
    string memory name = string(abi.encodePacked("SolarSystems #", tokenId.toString()));
    string memory description = "Fully on-chain procedurally generated solar systems.";
    string memory svg = Renderer.getSVG(tokenId);

    return SVG721.metadata(name, description, svg);
  }

  // required overrides

  function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
